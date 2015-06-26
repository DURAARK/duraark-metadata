/**
 * MetadataExtractionController
 *
 * @description :: Server-side logic for extracting technical and descriptive
 *                 metadata for IFC-SPF, E57 and (in future) HDF5 files
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var MetadataExtractorIfcSpf = require('../../bindings/pyIfcExtract/app');

function handleIfcSpf(file, res) {
  Ifc.create(file, function(err, ifc) {
    if (err) {
      console.log('[DURAARK::MetadataExtraction] error creating database entry: ' + JSON.stringify(err, null, 4));
      return res.send(500, err);
    }

    var schema = '/duraark-storage/schemas/rdf/buildm_v3.0.rdf'; // TODO: refactor into config object!
    var extractor = new MetadataExtractorIfcSpf(schema);

    ifc.save(function(err, ifc) {
      extractor.asJSONLD(ifc).then(function(metadata) {
          console.log('[DURAARK::MetadataExtraction] successfully extracted metadata as JSON-LD');

          ifc.ifcm = metadata;

          ifc.save(function(err, ifc) {
            if (err) return reject(err);
            console.log('[DURAARK::MetadataExtraction] stored metadata instance for ' + ifc.path);
            console.log('[DURAARK::MetadataExtraction] completed extraction request');
            res.send(metadata);
          });
        })
        .catch(function(err) {
          console.log('[DURAARK::MetadataExtraction] ERROR: ' + err);
          res.send(500, err);
        });
    });
  });
}

module.exports = {
  create: function(req, res, next) {
    var file = req.params.all().file;

    if (!file) {
      console.log('[DURAARK::MetadataExtraction] no "file" in payload, aborting');
      res.send(500, 'Error: Please provide a "file" property in the payload!')
    }

    var path = file.path;
    if (!path) {
      console.log('[DURAARK::MetadataExtraction] no "file.path" in payload, aborting');
      res.send(500, 'Error: Please provide a "file.path" property in the payload!')
    }
    console.log('[DURAARK::MetadataExtraction] processing file: ' + file.path);

    var type = file.type;
    if (!type) {
      console.log('[DURAARK::MetadataExtraction] no "file.type" in payload, aborting');
      res.send(500, 'Error: Please provide a "file.type" property in the payload!')
    }
    console.log('[DURAARK::MetadataExtraction] type: ' + type);

    switch (type.toLowerCase()) {
      case 'ifc-spf':
        handleIfcSpf(file, res);
        break;
      case 'e57':
        //Statements executed the result of expression matches value2
        break;
      default:
        console.log('[DURAARK::MetadataExtraction] error: file type "' + type + '" not supported. Aborting...');
        res.send(500, 'Error: file type "' + type + '" not supported. Feel free to provide a plugin ;-)')
    }
  }
}
