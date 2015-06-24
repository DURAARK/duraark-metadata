/**
 * sip-generator.js
 *
 * @description :: TODO: You might write a short summary of how this service works.
 */

var spawn = require('child_process').spawn,
    rdf = require('rdf-ext')(),
    jsonld = require('jsonld');

var PyIfcExtract = module.exports = function() {}

PyIfcExtract.prototype.extractFromFile = function(ifcmRecord, schemaPath, res) {
    console.log('[PyIfcExtract::extractFromFile]   file: ' + ifcmRecord.originatingFile);
    console.log('                                schema: ' + schemaPath);

    ifcmRecord.status = 'pending';

    ifcmRecord.save(function(err, record) {

        var executable = spawn('python3.3', ['/pyIfcExtract/buildm_extractor.py', ifcmRecord.originatingFile, schemaPath]),
            // var executable = spawn('python3.3', ['/home/martin/Coding/Projekte/duraark/duraark-platform-api/microservice-ifcmetadata/pyIfcExtract/buildm_extractor.py', ifcmRecord.originatingFile, schemaPath]),
            ifcmString = '';

        executable.stdout.on('data', function(data) {
            // console.log('stdout: ' + data);
            ifcmString += data;
        });

        executable.stderr.on('data', function(data) {
            console.log('stderr: ' + data);
        });

        executable.on('close', function(code) {
            // console.log('child process exited with code ' + code);

            rdf.parseTurtle(ifcmString, function(graph, err) {
                if (err) return console.log(err);

                var graph_n3 = graph.toString();

                jsonld.fromRDF(graph_n3, {
                    format: 'application/nquads'
                }, function(err, doc) {
                    if (err) return res.send(err);

                    res.send(doc);

                    // ifcmRecord.digitalObject = JSON.stringify(doc, null, 4); // FIXXME: adapt model to json-ld structure!

                    // ifcmRecord.save(function(err, record) {
                    //     console.log('\n[PyIfcExtract::extractFromFile] extracted metadata from file: ' + ifcmRecord.originatingFile);
                    // });
                });
            });
        });
    });
};
