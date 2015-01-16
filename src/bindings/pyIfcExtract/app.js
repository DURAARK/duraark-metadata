/**
 * sip-generator.js
 *
 * @description :: TODO: You might write a short summary of how this service works.
 */

var spawn = require('child_process').spawn;

var PyIfcExtract = module.exports = function() {
        // Microservice.call(this, opts);
    }
    // _.extend(PyIfcExtract.prototype, Microservice.prototype);

PyIfcExtract.prototype.extractFromFile = function(ifcmRecord) {
    console.log('[PyIfcExtract::extractFromFile] file: ' + ifcmRecord.originatingFile);

    ifcmRecord.status = 'pending';

    ifcmRecord.save(function(err, record) {

        // TODO: implement SIP Generation logic!
        var metadata = {
                creator: 'martin',
                wgs84: [15, 35]
            },
            ifcmString = '';


        var executable = spawn('python3.3', ['/pyIfcExtract/buildm_extractor.py', ifcmRecord.originatingFile]);

        executable.stdout.on('data', function(data) {
            console.log('stdout: ' + data);
            ifcmString += data;

        });

        executable.stderr.on('data', function(data) {
            console.log('stderr: ' + data);
        });

        executable.on('close', function(code) {
            console.log('child process exited with code ' + code);

            ifcmRecord.status = 'finished';
            ifcmRecord.metadata = ifcmString;

            ifcmRecord.save(function(err, record) {
                console.log('[PyIfcExtract::extractFromFile] extracted metadata from file: ' + ifcmRecord.originatingFile);
            });
        });
    });
};