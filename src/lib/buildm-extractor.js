/**
 * metadata-extraction.js
 *
 * @description :: High-level library for using DURAARK's metadata extraction tools
 */


var PyIfcExtract = require('./tools/pyIfcExtract');

var BuildmExtractor = module.exports = function() {}

BuildmExtractor.prototype.validateInput = function(req, res) {
  var file = req.params.all();

  if (!file) {
    console.log('[DURAARK::BuildmExtractor] no data in payload, aborting');
    res.send(500, 'Error: Please provide an "file" object in the payload!')
    return false;
  }

  var path = file.path;
  if (!path) {
    console.log('[DURAARK::BuildmExtractor] no "file.path" in payload, aborting');
    res.send(500, 'Error: Please provide a "file.path" property in the payload!')
    return false;
  }
  console.log('[DURAARK::BuildmExtractor]   * file: ' + file.path);
  console.log('[DURAARK::BuildmExtractor]')

  return true;
}

BuildmExtractor.prototype.askCache = function(file) {
  return Buildms.find()
    .where({
      path: {
        'like': file.path
      }
    })
    .then(function(files) {
      if (files.length) {
        var file = files[0];
        // FIXXME: show public URL in output!
        console.log('[DURAARK::BuildmExtractor] found entry: http://localhost:5012/buildm/' + file.id);
        return file;
      } else {
        console.log('[DURAARK::BuildmExtractor] no entry found');
        return null;
      }
    });
}

BuildmExtractor.prototype.extractFromFile = function(file, schema) {
  return new Promise(function(resolve, reject) {
    return Buildms.create(file, function(err, file) {
      if (err) {
        console.log('[DURAARK::BuildmExtractor] ERROR creating record:\n\n' + err + '\n');
        return reject('[DURAARK::BuildmExtractor] ERROR creating record:\n\n' + err);
      }

      var extractor = new PyIfcExtract();

      file.save(function(err, file) {
        if (err) {
          console.log('[DURAARK::BuildmExtractor] ERROR saving record 1:\n\n' + err + '\n');
          return reject('[DURAARK::BuildmExtractor] ERROR saving record 1:\n\n' + err);
        }

        extractor.extractBuildm(file, schema).then(function(metadata) {
            console.log('[DURAARK::BuildmExtractor] successfully extracted metadata as JSON-LD');

            file.metadata = {
              physicalAsset: {},
              digitalObject: {}
            };

            file.format = 'application/ld+json';

            // FIXXME: how to determine the schema information dynamically?
            file.schemaName = 'buildm';
            file.schemaVersion = '2.2';

            _.each(metadata, function(element) {
              console.log('element: ' + JSON.stringify(element, null, 4));

              var type = element['@type'][0];
              if (type === 'http://data.duraark.eu/vocab/PhysicalAsset') {
                file.metadata.physicalAsset = element;
              } else if (type === 'http://data.duraark.eu/vocab/IFCSPFFile') {
                file.metadata.digitalObject = element;
              } else {
                throw new Error('[DURAARK::BuildmExtractor] element type "' + type + '" not supported. Aborting...');
              }
            });

            file.save(function(err, file) {
              if (err) {
                console.log('[DURAARK::BuildmExtractor] ERROR saving record 2:\n\n' + err + '\n');
                return reject('[DURAARK::BuildmExtractor] ERROR saving record 2:\n\n' + err);
              }

              // TODO: return URL with correct host!
              console.log('[DURAARK::BuildmExtractor] cached data at: http://localhost:5012/buildm/' + file.id);
              return resolve(file);
            });
          })
          .catch(function(err) {
            console.log('[DURAARK::BuildmExtractor] ERROR extraction: ' + err);
            file.destroy();
            console.log('[DURAARK::BuildmExtractor] removed dangling cache entry');
            return reject(err);
          });
      });
    });
  });
}
