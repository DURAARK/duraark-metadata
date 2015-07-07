/**
 * metadata-extraction.js
 *
 * @description :: High-level library for using DURAARK's metadata extraction tools
 */


var MetadataExtractorIfcSpf = require('./tools/pyIfcExtract/app'),
  MetadataExtractorE57 = require('./tools/E57Extract/app');

var MetadataExtraction = module.exports = function() {}

MetadataExtraction.prototype.validateInput = function(req, res) {
  var file = req.params.all();

  if (!file) {
    console.log('[DURAARK::MetadataExtraction] no data in payload, aborting');
    res.send(500, 'Error: Please provide an "file" object in the payload!')
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

MetadataExtraction.prototype.askCache = function(file) {
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
      if (files.length) {
        var file = files[0];
        console.log('[DURAARK::MetadataExtraction] found entry: http://localhost/file/' + file.id);
        return file;
      } else {
        console.log('[DURAARK::MetadataExtraction] no entry found');
        return null;
      }
    });
}

MetadataExtraction.prototype.extractFromFile = function(file) {
  return new Promise(function(resolve, reject) {
    return File.create(file, function(err, file) {
      if (err) {
        console.log('[DURAARK::MetadataExtraction] ERROR creating record:\n\n' + err + '\n');
        return reject('[DURAARK::MetadataExtraction] ERROR creating record:\n\n' + err);
      }

      var extractor = null,
        type = file.type.toLowerCase();

      if (type === 'ifc-spf') {
        var schema = '/duraark-storage/tools/pyIfcExtract/buildm_v3.0.rdf'; // TODO: refactor into config object!
        // var schema = '/duraark-storage/schemas/rdf/buildm+v3.1.rdf'; // TODO: refactor into config object!
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

            file.metadata = {
              physicalAsset: {},
              digitalObject: {}
            };

            _.each(metadata, function(element) {
              console.log('element: ' + JSON.stringify(element, null, 4));

              var type = element['@type'][0];
              if (type === 'http://data.duraark.eu/vocab/PhysicalAsset') {
                file.metadata.physicalAsset = element;
              } else if (type === 'http://data.duraark.eu/vocab/IFCSPFFile') {
                file.metadata.digitalObject = element;
              } else {
                throw new Error('[DURAARK::MetadataExtraction] element type "' + type + '" not supported. Aborting...');
              }
            });

            file.save(function(err, file) {
              if (err) {
                console.log('[DURAARK::MetadataExtraction] ERROR saving record 2:\n\n' + err + '\n');
                return reject('[DURAARK::MetadataExtraction] ERROR saving record 2:\n\n' + err);
              }

              // TODO: return URL with correct host!
              console.log('[DURAARK::MetadataExtraction] cached data at: http://localhost:5002/file/' + file.id);
              return resolve(file);
            });
          })
          .catch(function(err) {
            console.log('[DURAARK::MetadataExtraction] ERROR extraction: ' + err);
            file.destroy();
            console.log('[DURAARK::MetadataExtraction] removed dangling cache entry');
            return reject(err);
          });
      });
    });
  });
}
