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
        });
    });
};

//var ifcmSchemaTemplate = {
// header: {
//     creationDate: new Date(),
//     author: 'Martin Hecher',
//     organization: 'TU Graz',
//     preprocessor: 'none',
//     originatingSystem: 'none',
//     authorization: 'none',
//     fileSchema: 'IFC-SPF',
//     viewDefinition: 'none',
//     exportOptions: 'none'
// },
// ifcparameters: {
//     ifcApplication: 'Blender',
//     IfcGeometricRepresentationContext: 'none',
//     ifcSiUnit: 'none'
// },
// countObjects: {
//     floorCount: 3,
//     roomCount: 3,
//     wallCount: 3,
//     windowsCount: 3,
//     doorCount: 3,
//     pipeCount: 3,
//     columnCount: 3,
//     numberOfComponents: 3,
//     numberOfRelations: 3,
//     numberOfActors: 3
// },
// informationMetric: {
//     numberOfEntityTypesUsed: 3,
//     numberOfTotalEntitiesUsed: 3,
//     optionalAttributes: 0
// },
// dependencies: {
//     webResourceLink: 'none'
// }
// };