/**
 * sip-generator.js
 *
 * @description :: TODO: You might write a short summary of how this service works.
 */

var spawn = require('child_process').spawn,
    jsonld = require('jsonld'),
    N3 = require('n3'),
    _ = require('underscore');

function _enrichTemplateInstance(template, subject) {
    // console.log('json: ' + JSON.stringify(subject, null, 4));

    _.forEach(subject, function(value, key) {
        console.log('key: ' + key + ' | value: ' + JSON.stringify(value, null, 4));

        var property = key.split('/').pop();
        debugger;
        if (template.hasOwnProperty(property)) {
            if (value[0]['@value']) {
                // If there are multiple entries in the array, add the values as array 
                // to the template:
                template[property] = [];
                _.forEach(value, function(item) {
                    template[property].push(item['@value']);
                });
            }
        }
    });

    console.log('instance: ' + JSON.stringify(template, null, 4));

    return template;
}

var PyIfcExtract = module.exports = function() {
        // Microservice.call(this, opts);
    }
    // _.extend(PyIfcExtract.prototype, Microservice.prototype);

PyIfcExtract.prototype.extractFromFile = function(ifcmRecord, schemaPath) {
    console.log('[PyIfcExtract::extractFromFile]   file: ' + ifcmRecord.originatingFile);
    console.log('                                schema: ' + schemaPath);

    ifcmRecord.status = 'pending';

    ifcmRecord.save(function(err, record) {

        var executable = spawn('python2.7', ['/pyIfcExtract/buildm_extractor.py', ifcmRecord.originatingFile, schemaPath]),
            ifcmString = '';

        executable.stdout.on('data', function(data) {
            // console.log('stdout: ' + data);
            ifcmString += data;
        });

        executable.stderr.on('data', function(data) {
            console.log('stderr: ' + data);
        });

        executable.on('close', function(code) {
            console.log('child process exited with code ' + code);

            var parser = N3.Parser(),
                triples = [];

            parser.parse(ifcmString,
                function(error, triple, prefixes) {
                    if (triple) {
                        // console.log('triple: ' + JSON.stringify(triple, null, 4));
                        triples.push(triple);

                        // console.log('triples: ' + triples.length);
                    } else {
                        // console.log('Finished converting RDF triples. Prefixes:\n\n' + JSON.stringify(prefixes, null, 4));

                        var writer = N3.Writer({
                            format: 'N-Quads',
                            prefixes: prefixes
                        });

                        for (var idx = 0; idx < triples.length; idx++) {
                            var triple = triples[idx];
                            writer.addTriple(triple);
                        }

                        writer.end(function(error, result) {
                            var digitalObjectRdf = null,
                                physicalAssetRdf = null;

                            jsonld.fromRDF(result, {
                                format: 'application/nquads'
                            }, function(err, doc) {
                                // console.log('JSONLD: ' + JSON.stringify(doc, null, 4));

                                // split up rdf into subjects of same type:
                                _.forEach(doc, function(subject) {
                                    var type = subject['@type'][0].split('/').pop();

                                    if (type === 'IFCSPFFile') {
                                        digitalObjectRdf = subject;
                                    } else if (type === 'PhysicalAsset') {
                                        physicalAssetRdf = subject;
                                    }
                                });

                                var digitalObjectInstanceTemplate = {
                                    identifier: '',
                                    creator: [],
                                    name: [],
                                    dateCreated: [],
                                    isPartOf: [],
                                    hasPart: [],
                                    format: [],
                                    hasType: [],
                                    hasFormatDetails: [],
                                    description: [],
                                    provenance: [],
                                    license: [],
                                    unitCode: [],
                                    levelOfDetail: []
                                };

                                var digitalObjectInstance = {
                                    schema: 'buildm',
                                    file: ifcmRecord.originatingFile,
                                    instance: _enrichTemplateInstance(digitalObjectInstanceTemplate, physicalAssetRdf)
                                };

                                var physicalAssetInstanceTemplate = {
                                    identifier: '',
                                    latitude: '',
                                    longitude: '',
                                    owner: '',
                                    buildingArea: -1,
                                    floorCount: -1,
                                    numberOfRooms: -1,
                                    'function': '',
                                    architecturalStyle: '',
                                    description: '',
                                    location: '',
                                    streetAddress: '',
                                    postalCodeStart: '',
                                    postalCodeEnd: '',
                                    postOfficeBoxNumber: '',
                                    addressRegion: '',
                                    postalLocality: '',
                                    architect: '',
                                    contributor: '',
                                    startDate: -1,
                                    completionDate: -1,
                                    constructionTime: -1,
                                    rebuildingDate: -1,
                                    modificationDetails: '',
                                    cost: -1,
                                    rightsDetails: ''
                                }

                                var physicalAssetInstance = {
                                    schema: 'buildm',
                                    file: ifcmRecord.originatingFile,
                                    instance: _enrichTemplateInstance(physicalAssetInstanceTemplate, physicalAssetRdf)
                                };

                                // var ifcmInstanceTemplate = {
                                //     identifier: '',
                                //     creator: [],
                                //     filename: '',
                                //     hasFormatDetails: [],
                                //     dateCreated: -1,
                                //     hasType: '',
                                //     documents: []
                                // };

                                // var ifcmInstance = {
                                //     schema: 'ifcm',
                                //     file: ifcmRecord.originatingFile,
                                //     instance: _enrichTemplateInstance(ifcmInstanceTemplate, ifcmRdf)
                                // };

                                // ifcmRecord.ifcm = ifcmInstance;

                                ifcmRecord.digitalObject = digitalObjectInstance;
                                ifcmRecord.physicalAsset = physicalAssetInstance;

                                ifcmRecord.status = 'finished';

                                ifcmRecord.save(function(err, record) {
                                    console.log('[PyIfcExtract::extractFromFile] extracted metadata from file: ' + ifcmRecord.originatingFile);
                                });
                            });
                        });
                    }
                }
            );

            // ifcmRecord.status = 'finished';
            // ifcmRecord.metadata = ifcmString;

            // console.log('ASDLKFJAKSLDFJAKLSDJFAKSDFKLASJDFKAJSDFADSFASDF: ' + ifcmString);

            // ifcmRecord.save(function(err, record) {
            //     console.log('[PyIfcExtract::extractFromFile] extracted metadata from file: ' + ifcmRecord.originatingFile);
            // });
        });

        // ifcmString = '@prefix dct: <http://purl.org/dc/terms/> .\n@prefix duraark: <http://duraark.eu/voabularies/buildm#> .\n@prefix foaf: <http://xmlns.com/foaf/0.1/> .\n@prefix geo-pos: <http://www.w3.org/2003/01/geo/wgs84_pos#> .\n@prefix dbpedia-owl: <http://dbpedia.org/ontology/> .\n@prefix dbp-prop: <http://dbpedia.org/property/> .\n@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .\n@prefix dc: <http://purl.org/dc/elements/1.1/> .\n\n<project_a64c4446b93e4a8984b7a9502337a8b4> duraark:object_identifier \"2cJ4H6kJvAYOItgL0ZDwYq\"^^xsd:string .\n<project_a64c4446b93e4a8984b7a9502337a8b4> foaf:name \"Verbreding Amazonehaven kade A3\"^^xsd:string .\n<project_a64c4446b93e4a8984b7a9502337a8b4> dc:description \"\"^^xsd:string .\n<project_a64c4446b93e4a8984b7a9502337a8b4> dbp-prop:startDate \"2012-01-31 09:43:34\"^^xsd:date .\n<project_a64c4446b93e4a8984b7a9502337a8b4> dbpedia-owl:buildingStartYear \"2012-01-31 09:43:34\"^^xsd:date .\n<project_a64c4446b93e4a8984b7a9502337a8b4> duraark:length_unit \"MILLIMETRE\"^^xsd:string .\n<project_a64c4446b93e4a8984b7a9502337a8b4> duraark:authoring_tool \"Gemeentewerken Rotterdam AutoCAD Architecture 2009 5.7.68.0\"^^xsd:string .\n<project_a64c4446b93e4a8984b7a9502337a8b4> foaf:based_near \"\"^^xsd:string .\n<project_a64c4446b93e4a8984b7a9502337a8b4> duraark:floor_count \"1\"^^xsd:integer .\n<project_a64c4446b93e4a8984b7a9502337a8b4> duraark:room_count \"0\"^^xsd:integer .\n<project_a64c4446b93e4a8984b7a9502337a8b4> dbpedia-owl:address \"\"^^xsd:string .\n<project_a64c4446b93e4a8984b7a9502337a8b4> dc:creator \" \"^^xsd:string .\n';
        // ifcmRecord.status = 'finished';

        // var parser = N3.Parser(),
        //     triples = [];

        // parser.parse('@prefix duraark: <http://qudt.org/vocab/unit#> .\n' +
        //     '<ifcspffile_7b7032ccb822417b9aea642906a29bd5> a duraark:IFCSPFFile .\n' +
        //     '<ifcspffile_7b7032ccb822417b9aea642906a29bd5> duraark:actorCount "0" .',
        // // parser.parse(ifcmString,
        //     function(error, triple, prefixes) {
        //         if (triple) {
        //             console.log(JSON.stringify(triple, null, 4));
        //             triples.push(triple);

        //             // console.log('triples: ' + triples.length);
        //         } else {
        //             console.log('Finished converting RDF triples. Prefixes:\n\n' + JSON.stringify(prefixes, null, 4));

        //             var writer = N3.Writer({
        //                 format: 'N-Quads',
        //                 prefixes: prefixes
        //             });

        //             for (var idx = 0; idx < triples.length; idx++) {
        //                 var triple = triples[idx];
        //                 writer.addTriple(triple);
        //             }

        //             writer.end(function(error, result) {
        //                 console.log('RESULT\n\n' + result);
        //                 console.log('\n\n');

        //                 jsonld.fromRDF(result, {
        //                     format: 'application/nquads'
        //                 }, function(err, doc) {
        //                     console.log('JSONLD: ' + JSON.stringify(doc, null, 4));

        //                     ifcmRecord.metadata = doc;

        //                     ifcmRecord.save(function(err, record) {
        //                         console.log('[PyIfcExtract::extractFromFile] extracted metadata from file: ' + ifcmRecord.originatingFile);
        //                     });
        //                 });
        //             });
        //         }
        //     }
        // );

        // jsonld.fromRDF(ifcmString, {
        //     format: 'application/nquads'
        // }, function(err, doc) {
        //     console.log('JSONLD: ' + JSON.stringify(doc, null, 4));

        //     ifcmRecord.metadata = doc;

        //     ifcmRecord.save(function(err, record) {
        //         console.log('[PyIfcExtract::extractFromFile] extracted metadata from file: ' + ifcmRecord.originatingFile);
        //     });
        // });
    });
};