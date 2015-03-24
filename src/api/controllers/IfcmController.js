/**
 * IfcmController
 *
 * @description :: Server-side logic for managing ifcms
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var IfcMetadata = require('../../bindings/pyIfcExtract/app'),
    fs = require('fs'),
    path = require('path'),
    cwd = process.cwd();
    // digitalObjectRdf = fs.readFileSync(path.join(cwd, './fixtures/digitalObject-example.rdf')),
    // physicalAssetRdf = fs.readFileSync(path.join(cwd, './fixtures/physicalAsset-example.rdf')),
    // ifcmRdf = fs.readFileSync(path.join(cwd, './fixtures/ifcm-example.rdf'));

var ifcmSchemaTemplate = {
    identifier: '',
    creator: '',
    filename: '',
    hasFormatDetails: [],
    dateCreated: -1,
    hasType: '',
    documents: []
};

module.exports = {
    extract: function(req, res, next) {
        var files = req.params.all().files,
            ifcms = [],
            schemaFile = '/pyIfcExtract/buildm_v3.0.rdf';

        console.log('files: ' + JSON.stringify(files, null, 4));

        for (var idx = 0; idx < files.length; idx++) {
            var file = files[idx],
                ifcmInfo = {
                    type: 'ifc',
                    originatingFile: file.path,
                    status: 'pending'
                };

            // The outside 'idx' is bound to the anonymous callback function in line 43
            // to have the idx available for triggering the sending of the response.
            Ifcm.create(ifcmInfo, function(idx, err, ifcm) {
                if (err) return next(err);

                var ifcMetadata = new IfcMetadata();
                ifcMetadata.extractFromFile(ifcm, schemaFile);

                ifcms.push(ifcm);

                if (idx === files.length - 1) {
                    console.log('returning ifc metadata...');
                    res.send(ifcms);
                }
            }.bind(this, idx));
        };
    }
};
