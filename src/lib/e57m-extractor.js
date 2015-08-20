/**
 * e57m-extractor.js
 *
 * @description :: Library for extracting 'e57m' metadata information from
 *                 E57 files.
 */


var e57_metadata = require('./tools/e57_metadata');

var E57mExtractor = module.exports = function() {}

E57mExtractor.prototype.validateInput = function(req, res) {
  var file = req.params.all();

  if (!file) {
    console.log('[DURAARK::E57mExtractor] no data in payload, aborting');
    res.send(500, 'Error: Please provide an "file" object in the payload!')
    return false;
  }

  var path = file.path;
  if (!path) {
    console.log('[DURAARK::E57mExtractor] no "file.path" in payload, aborting');
    res.send(500, 'Error: Please provide a "file.path" property in the payload!')
    return false;
  }
  console.log('[DURAARK::E57mExtractor]   * file: ' + file.path);
  console.log('[DURAARK::E57mExtractor]')

  return true;
}

E57mExtractor.prototype.askCache = function(file) {
  return E57ms.find()
    .where({
      path: {
        'like': file.path
      }
    })
    .then(function(files) {
      if (files.length) {
        var file = files[0];
        // FIXXME: show public URL in output!
        console.log('[DURAARK::E57mExtractor] found entry: http://localhost:5012/e57m/' + file.id);
        return file;
      } else {
        console.log('[DURAARK::E57mExtractor] no entry found');
        return null;
      }
    });
}

E57mExtractor.prototype.extractFromFile = function(file) {
  return new Promise(function(resolve, reject) {
    return E57ms.create(file, function(err, file) {
      if (err) {
        console.log('[DURAARK::E57mExtractor] ERROR creating record:\n\n' + err + '\n');
        return reject('[DURAARK::E57mExtractor] ERROR creating record:\n\n' + err);
      }

      var extractor = new e57_metadata();

      file.save(function(err, file) {
        if (err) {
          console.log('[DURAARK::E57mExtractor] ERROR saving record 1:\n\n' + err + '\n');
          return reject('[DURAARK::E57mExtractor] ERROR saving record 1:\n\n' + err);
        }

        extractor.extractE57m(file).then(function(e57mString) {
            console.log('[DURAARK::E57mExtractor] successfully extracted metadata as XML');

            file.metadata = e57mString;
            file.format = 'application/xml';

            // FIXXME: how to determine the schema information dynamically?
            file.schemaName = 'e57m';
            file.schemaVersion = '1.1';

            file.save(function(err, file) {
              if (err) {
                console.log('[DURAARK::E57mExtractor] ERROR saving record 2:\n\n' + err + '\n');
                return reject('[DURAARK::E57mExtractor] ERROR saving record 2:\n\n' + err);
              }

              // TODO: return URL with correct host!
              console.log('[DURAARK::E57mExtractor] cached data at: http://localhost:5012/e57m/' + file.id);
              return resolve(file);
            });
          })
          .catch(function(err) {
            console.log('[DURAARK::E57mExtractor] ERROR extraction: ' + err);
            file.destroy();
            console.log('[DURAARK::E57mExtractor] removed dangling cache entry');
            return reject(err);
          });
      });
    });
  });
}
