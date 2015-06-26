/**
 * MetadataExtractionController
 *
 * @description :: Server-side logic for extracting technical and descriptive
 *                 metadata for IFC-SPF, E57 and (in future) HDF5 files
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var MetadataExtractorIfcSpf = require('../../bindings/pyIfcExtract/app'),
  MetadataExtractorE57 = require('../../bindings/E57Extract/app');

module.exports = {
  create: function(req, res, next) {
    var file = req.params.all().file;

    console.log('\n[DURAARK::MetadataExtraction] incoming request');
    console.log('[DURAARK::MetadataExtraction]');

    if (validateInput(req, res)) {
      handleExtraction(file, res);
    }
  }
}

function handleExtraction(file, res) {
  console.log('[DURAARK::MetadataExtraction] searching in cache ...');

  askCache(file).then(function(cachedRecord) {
    if (cachedRecord) {
      console.log('[DURAARK::MetadataExtraction] request completed!\n\n');
      return res.send(cachedRecord);
    }

    return extractFromFile(file)
      .then(function(file) {
        return res.send(file);
      })
      .catch(function(err) {
          console.log('[DURAARK::MetadataExtraction] ERROR extracting from file:\n\n' + err + '\n');
          return res.send(500, '[DURAARK::MetadataExtraction] ERROR extracting from file:\n\n' + err);
      });
  });
}

function validateInput(req, res) {
  var file = req.params.all().file;

  if (!file) {
    console.log('[DURAARK::MetadataExtraction] no "file" in payload, aborting');
    res.send(500, 'Error: Please provide a "file" property in the payload!')
    return false;
  }

  var path = file.path;
  if (!path) {
    console.log('[DURAARK::MetadataExtraction] no "file.path" in payload, aborting');
    res.send(500, 'Error: Please provide a "file.path" property in the payload!')
    return false;
  }
  console.log('[DURAARK::MetadataExtraction]   * file: ' + file.path);

  var type = file.type;
  if (!type) {
    console.log('[DURAARK::MetadataExtraction] no "file.type" in payload, aborting');
    res.send(500, 'Error: Please provide a "file.type" property in the payload!')
    return false;
  }
  console.log('[DURAARK::MetadataExtraction]   * type: ' + type);
  console.log('[DURAARK::MetadataExtraction]')

  return true;
}

function askCache(file) {
  return File.find()
    .where({
      path: {
        'like': file.path
      },
      type: {
        'like': file.type
      }
    })
    .then(function(files) {
      return new Promise(function(resolve, reject) {
        if (files.length) {
          var file = files[0];
          console.log('[DURAARK::MetadataExtraction] found entry: http://localhost/file/' + file.id);
          return resolve(file);
        } else {
          console.log('[DURAARK::MetadataExtraction] no entry found');
          return resolve(null);
        }
      });
    });
}

function extractFromFile(file) {
  return new Promise(function(resolve, reject) {
    return File.create(file, function(err, file) {
      if (err) {
        console.log('[DURAARK::MetadataExtraction] ERROR creating record:\n\n' + err + '\n');
        return reject('[DURAARK::MetadataExtraction] ERROR creating record:\n\n' + err);
      }

      var extractor = null,
        type = file.type.toLowerCase();

      if (type === 'ifc-spf') {
        var schema = '/duraark-storage/schemas/rdf/buildm_v3.0.rdf'; // TODO: refactor into config object!
        extractor = new MetadataExtractorIfcSpf(schema);
      } else if (type === 'e57') {
        extractor = new MetadataExtractorE57();
      } else if (type === 'hdf5') {
        console.log('[DURAARK::MetadataExtraction] HDF5 plugin not yet implemented. "ifc-spf" and "e57" are supported. Aborting ...');
        return reject('[DURAARK::MetadataExtraction] HDF5 plugin not yet implemented. "ifc-spf" and "e57" are supported. Aborting ...');
      } else {
        console.log('[DURAARK::MetadataExtraction] Metadata extraction for filetype is not supported: ' + type + '.');
        return reject('[DURAARK::MetadataExtraction] Metadata extraction for filetype is not supported: ' + type + '.');
      }

      file.save(function(err, file) {
        if (err) {
          console.log('[DURAARK::MetadataExtraction] ERROR saving record 1:\n\n' + err + '\n');
          return reject('[DURAARK::MetadataExtraction] ERROR saving record 1:\n\n' + err);
        }

        extractor.asJSONLD(file).then(function(metadata) {
            console.log('[DURAARK::MetadataExtraction] successfully extracted metadata as JSON-LD');

            file.metadata = metadata;

            file.save(function(err, file) {
              if (err) {
                console.log('[DURAARK::MetadataExtraction] ERROR saving record 2:\n\n' + err + '\n');
                return reject('[DURAARK::MetadataExtraction] ERROR saving record 2:\n\n' + err);
              }

              // TODO: create correct URL!
              console.log('[DURAARK::MetadataExtraction] cached data at: http://localhost:5002/file/' + file.id);
              console.log('[DURAARK::MetadataExtraction] request completed!\n\n');
              return resolve(file);
            });
          })
          .catch(function(err) {
            console.log('[DURAARK::MetadataExtraction] ERROR: ' + err);
            return reject(err);
          });
      });
    });
  });
}
