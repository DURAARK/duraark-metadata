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
                    type: 'ifc',
                    status: 'pending',
                };

            // The outside 'idx' is bound to the anonymous callback function in line 43
            // to have the idx available for triggering the sending of the response.
            Ifcm.create(ifcmInfo, function(idx, err, ifcm) {
                if (err) return next(err);

                // var ifcMetadata = new IfcMetadata();
                // ifcMetadata.extractFromFile(ifcm);

                ifcm.physicalAsset = {
                    schema: 'buildm',
                    file: file.path,
                    instance: {
                        longitude: 25,
                        latitude: 11
                    }
                };

                ifcm.digitalObject = {
                    schema: 'buildm',
                    file: file.path,
                    instance: {
                        creator: 'Martin Hecher',
                        streetAdress: 'Inffeldgasse 16c'
                    }
                };

                ifcm.ifcm = {
                    schema: 'ifcm',
                    file: file.path,
                    instance: {
                        filesize: 138234
                    }
                };

                ifcm.status = 'finished';

                ifcms.push(ifcm);

                if (idx === files.length - 1) {
                    res.send(ifcms);
                }
            }.bind(this, idx));
        };
    }
};