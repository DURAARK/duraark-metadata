/**
 * sip-generator.js
 *
 * @description :: TODO: You might write a short summary of how this service works.
 */

var spawn = require('child_process').spawn,
    jsonld = require('jsonld'),
    N3 = require('n3');

var PyIfcExtract = module.exports = function() {
        // Microservice.call(this, opts);
    }
    // _.extend(PyIfcExtract.prototype, Microservice.prototype);

PyIfcExtract.prototype.extractFromFile = function(ifcmRecord) {
    console.log('[PyIfcExtract::extractFromFile] file: ' + ifcmRecord.originatingFile);

    ifcmRecord.status = 'pending';

    ifcmRecord.save(function(err, record) {

        //var metadata = {
        //        creator: 'martin',
        //        wgs84: [15, 35]
        //    },
        var ifcmString = '';

        ifcmString = '@prefix dct: <http://purl.org/dc/terms/> .\n@prefix duraark: <http://duraark.eu/voabularies/buildm#> .\n@prefix foaf: <http://xmlns.com/foaf/0.1/> .\n@prefix geo-pos: <http://www.w3.org/2003/01/geo/wgs84_pos#> .\n@prefix dbpedia-owl: <http://dbpedia.org/ontology/> .\n@prefix dbp-prop: <http://dbpedia.org/property/> .\n@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .\n@prefix dc: <http://purl.org/dc/elements/1.1/> .\n\n<project_a64c4446b93e4a8984b7a9502337a8b4> duraark:object_identifier \"2cJ4H6kJvAYOItgL0ZDwYq\"^^xsd:string .\n<project_a64c4446b93e4a8984b7a9502337a8b4> foaf:name \"Verbreding Amazonehaven kade A3\"^^xsd:string .\n<project_a64c4446b93e4a8984b7a9502337a8b4> dc:description \"\"^^xsd:string .\n<project_a64c4446b93e4a8984b7a9502337a8b4> dbp-prop:startDate \"2012-01-31 09:43:34\"^^xsd:date .\n<project_a64c4446b93e4a8984b7a9502337a8b4> dbpedia-owl:buildingStartYear \"2012-01-31 09:43:34\"^^xsd:date .\n<project_a64c4446b93e4a8984b7a9502337a8b4> duraark:length_unit \"MILLIMETRE\"^^xsd:string .\n<project_a64c4446b93e4a8984b7a9502337a8b4> duraark:authoring_tool \"Gemeentewerken Rotterdam AutoCAD Architecture 2009 5.7.68.0\"^^xsd:string .\n<project_a64c4446b93e4a8984b7a9502337a8b4> foaf:based_near \"\"^^xsd:string .\n<project_a64c4446b93e4a8984b7a9502337a8b4> duraark:floor_count \"1\"^^xsd:integer .\n<project_a64c4446b93e4a8984b7a9502337a8b4> duraark:room_count \"0\"^^xsd:integer .\n<project_a64c4446b93e4a8984b7a9502337a8b4> dbpedia-owl:address \"\"^^xsd:string .\n<project_a64c4446b93e4a8984b7a9502337a8b4> dc:creator \" \"^^xsd:string .\n';
        ifcmRecord.status = 'finished';

        var parser = N3.Parser(),
            triples = [];

        parser.parse('@prefix duraark: <http://qudt.org/vocab/unit#> .\n' +
            '<ifcspffile_7b7032ccb822417b9aea642906a29bd5> a duraark:IFCSPFFile .\n' +
            '<ifcspffile_7b7032ccb822417b9aea642906a29bd5> duraark:actorCount "0" .',
        // parser.parse(ifcmString,
            function(error, triple, prefixes) {
                if (triple) {
                    console.log(JSON.stringify(triple, null, 4));
                    triples.push(triple);

                    // console.log('triples: ' + triples.length);
                } else {
                    console.log('Finished converting RDF triples. Prefixes:\n\n' + JSON.stringify(prefixes, null, 4));

                    var writer = N3.Writer({
                        format: 'N-Quads',
                        prefixes: prefixes
                    });

                    for (var idx = 0; idx < triples.length; idx++) {
                        var triple = triples[idx];
                        writer.addTriple(triple);
                    }

                    writer.end(function(error, result) {
                        console.log('RESULT\n\n' + result);
                        console.log('\n\n');

                        jsonld.fromRDF(result, {
                            format: 'application/nquads'
                        }, function(err, doc) {
                            console.log('JSONLD: ' + JSON.stringify(doc, null, 4));

                            ifcmRecord.metadata = doc;

                            ifcmRecord.save(function(err, record) {
                                console.log('[PyIfcExtract::extractFromFile] extracted metadata from file: ' + ifcmRecord.originatingFile);
                            });
                        });
                    });
                }
            }
        );

        // jsonld.fromRDF(ifcmString, {
        //     format: 'application/nquads'
        // }, function(err, doc) {
        //     console.log('JSONLD: ' + JSON.stringify(doc, null, 4));

        //     ifcmRecord.metadata = doc;

        //     ifcmRecord.save(function(err, record) {
        //         console.log('[PyIfcExtract::extractFromFile] extracted metadata from file: ' + ifcmRecord.originatingFile);
        //     });
        // });

        // var executable = spawn('python3.3', ['/pyIfcExtract/buildm_extractor.py', ifcmRecord.originatingFile]);

        // executable.stdout.on('data', function(data) {
        //     console.log('stdout: ' + data);
        //     ifcmString += data;
        // });

        // executable.stderr.on('data', function(data) {
        //     console.log('stderr: ' + data);
        // });

        // executable.on('close', function(code) {
        //     console.log('child process exited with code ' + code);

        //     ifcmRecord.status = 'finished';
        //     ifcmRecord.metadata = ifcmString;

        //     ifcmRecord.save(function(err, record) {
        //         console.log('[PyIfcExtract::extractFromFile] extracted metadata from file: ' + ifcmRecord.originatingFile);
        //     });
        // });
    });
};