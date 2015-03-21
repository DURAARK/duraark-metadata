/**
 * IfcmController
 *
 * @description :: Server-side logic for managing ifcms
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var IfcMetadata = require('../../bindings/pyIfcExtract/app'),
    fs = require('fs'),
    path = require('path'),
    cwd = process.cwd(),
    xml2jsonParser = require('xml2json'),
    digitalObjectRdf = fs.readFileSync(path.join(cwd, './fixtures/digitalObject-example.rdf')),
    physicalAssetRdf = fs.readFileSync(path.join(cwd, './fixtures/physicalAsset-example.rdf')),
    ifcmRdf = fs.readFileSync(path.join(cwd, './fixtures/ifcm-example.rdf'));

var ifcmSchemaTemplate = {
    identifier: '',
    creator: '',
    filename: '',
    hasFormatDetails: [],
    dateCreated: -1,
    hasType: '',
    documents: []
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

// function _ifcmRdfToJSON(template, xmlRdfString, file) {
//     var jsonRaw = JSON.parse(xml2jsonParser.toJson(xmlRdfString));
//     // console.log('json: ' + JSON.stringify(jsonRaw, null, 4));

//     var attribs = jsonRaw['rdf:RDF']["rdf:Description"];

//     _.forEach(attribs, function(value, key) {
//         var property = key.split(':')[1];

//         if (property === 'hasFormatDetails') {
//             var details = value;

//             _.forEach(details, function(value, key) {
//                 template['hasFormatDetails'].push(value['$t']);
//             });
//         } else {
//             if (template.hasOwnProperty(property)) {
//                 if (value['$t']) {
//                     template[property] = value['$t'];
//                 }
//             }
//         }
//     });

//     // console.log('instance: ' + JSON.stringify(template, null, 4));

//     return {
//         schema: 'ifcm',
//         file: file.path,
//         instance: template
//     };
// }