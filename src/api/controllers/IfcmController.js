/**
 * IfcmController
 *
 * @description :: Server-side logic for managing ifcms
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var IfcMetadata = require('../../bindings/pyIfcExtract/app');

module.exports = {
    extract: function(req, res, next) {
        var files = req.params.all().files,
            ifcms = [];

        // console.log('files: ' + JSON.stringify(files, null, 4));

        for (var idx = 0; idx < files.length; idx++) {
            var file = files[idx],
                ifcmInfo = {
                    originatingFile: file.path,
                    status: 'pending',
                    metadata: {}
                };

            // The outside 'idx' is bound to the anonymous callback function in line 43
            // to have the idx available for triggering the sending of the response.
            Ifcm.create(ifcmInfo, function(idx, err, ifcm) {
                if (err) return next(err);

                // var ifcMetadata = new IfcMetadata();
                // ifcMetadata.extractFromFile(ifcm);

                ifcms.push(ifcm);

                if (idx === files.length - 1) {
                    res.send([{
                        physicalAsset: {
                            longitude: 25,
                            latitude: 11
                        },
                        digitalObject: {
                            creator: 'Martin Hecher',
                            streetAdress: 'Inffeldgasse 16c'
                        },
                        status: 'finished',
                        schema: 'ifcm'
                    }]);
                }
            }.bind(this, idx));
        };
    }
};