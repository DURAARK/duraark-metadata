/**
 * sip-generator.js
 *
 * @description :: TODO: You might write a short summary of how this service works.
 */


var PyIfcExtract = module.exports = function() {
        // Microservice.call(this, opts);
    }
    // _.extend(PyIfcExtract.prototype, Microservice.prototype);

PyIfcExtract.prototype.extractFromFile = function(ifcmRecord) {
    console.log('[PyIfcExtract::extractFromFile] file: ' + ifcmRecord.originatingFile);

    ifcmRecord.status = 'pending';

    ifcmRecord.save(function(err, record) {
        setTimeout(function() {

            // TODO: implement SIP Generation logic!
            var metadata = {
                creator: 'martin',
                wgs84: [15, 35]
            }

            ifcmRecord.status = 'finished';
            ifcmRecord.metadata = metadata;

            ifcmRecord.save(function(err, record) {
                console.log('[PyIfcExtract::extractFromFile] extracted metadata from file: ' + ifcmRecord.originatingFile);
            });
        }, 3000);
    });
};