/**
 * MetadataExtractionController
 *
 * @description :: Server-side logic for extracting technical and descriptive
 *                 metadata for IFC-SPF, E57 and (in future) HDF5 files
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var MetadataExtractorIfcSpf = require('../../bindings/pyIfcExtract/app');
var MetadataExtractorE57 = require('../../bindings/E57Extract/app');

module.exports = {
  create: function(req, res, next) {
    var file = req.params.all().file;

    console.log('\n\n[DURAARK::MetadataExtraction] incoming request');
    console.log('[DURAARK::MetadataExtraction]');

    if (!file) {
      console.log('[DURAARK::MetadataExtraction] no "file" in payload, aborting');
      res.send(500, 'Error: Please provide a "file" property in the payload!')
    }

    var path = file.path;
    if (!path) {
      console.log('[DURAARK::MetadataExtraction] no "file.path" in payload, aborting');
      res.send(500, 'Error: Please provide a "file.path" property in the payload!')
    }
    console.log('[DURAARK::MetadataExtraction]   * file: ' + file.path);

    var type = file.type;
    if (!type) {
      console.log('[DURAARK::MetadataExtraction] no "file.type" in payload, aborting');
      res.send(500, 'Error: Please provide a "file.type" property in the payload!')
    }
    console.log('[DURAARK::MetadataExtraction]   * type: ' + type);
    console.log('[DURAARK::MetadataExtraction]')

    switch (type.toLowerCase()) {
      case 'ifc-spf':
        handleIfcSpf(file, res);
        break;
      case 'e57':
        handleE57(file, res);
        break;
      default:
        console.log('[DURAARK::MetadataExtraction] error: file type "' + type + '" not supported. Aborting...');
        res.send(500, 'Error: file type "' + type + '" not supported. Feel free to provide a plugin ;-)')
    }
  }
}

function handleIfcSpf(file, res) {
  Ifc.create(file, function(err, ifc) {
    if (err) {
      console.log('[DURAARK::MetadataExtraction] ERROR creating record:\n\n' + err + '\n');
      res.send('[DURAARK::MetadataExtraction] ERROR creating record:\n\n' + err);
    }

    var schema = '/duraark-storage/schemas/rdf/buildm_v3.0.rdf'; // TODO: refactor into config object!
    var extractor = new MetadataExtractorIfcSpf(schema);

    ifc.save(function(err, ifc) {
      if (err) {
        console.log('[DURAARK::MetadataExtraction] ERROR saving record 1:\n\n' + err + '\n');
        return res.send(500, '[DURAARK::MetadataExtraction] ERROR saving record 1:\n\n' + err);
      }

      extractor.asJSONLD(ifc).then(function(metadata) {
          console.log('[DURAARK::MetadataExtraction] successfully extracted metadata as JSON-LD');

          ifc.ifcm = metadata;

          ifc.save(function(err, ifc) {
            if (err) {
              console.log('[DURAARK::MetadataExtraction] ERROR saving record 2:\n\n' + err + '\n');
              return res.send(500, '[DURAARK::MetadataExtraction] ERROR saving record 2:\n\n' + err);
            }

            // TODO: create correct URL!
            console.log('[DURAARK::MetadataExtraction] cached data at: http://localhost:5002/ifc/' + ifc.id);
            console.log('[DURAARK::MetadataExtraction] request completed!\n\n');
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

function handleE57(file, res) {
  E57.create(file, function(err, e57) {
    if (err) {
      console.log('[DURAARK::MetadataExtraction] ERROR creating record:\n\n' + err + '\n');
      return res.send(500, '[DURAARK::MetadataExtraction] ERROR creating record:\n\n' + err);
    }

    var extractor = new MetadataExtractorE57();

    e57.save(function(err, e57) {
      if (err) {
        console.log('[DURAARK::MetadataExtraction] ERROR saving record 1:\n\n' + err + '\n');
        return res.send(500, '[DURAARK::MetadataExtraction] ERROR saving record 1:\n\n' + err);
      }

      extractor.asJSON(e57).then(function(metadata) {
          console.log('[DURAARK::MetadataExtraction] successfully extracted metadata as JSON');

          e57.e57m = metadata;

          e57.save(function(err, e57) {
            if (err) {
              console.log('[DURAARK::MetadataExtraction] ERROR saving record 2:\n\n' + err + '\n');
              return res.send(500, '[DURAARK::MetadataExtraction] ERROR saving record 2:\n\n' + err);
            }

            // TODO: create correct URL!
            console.log('[DURAARK::MetadataExtraction] cached data at: http://localhost:5002/e57/' + e57.id);
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
