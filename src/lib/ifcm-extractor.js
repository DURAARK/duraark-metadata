/**
 * ifcm-extractor.js
 *
 * @description :: Library for extracting 'ifcm' metadata information from
 *                 IFC-SPF files.
 */


var PyIfcExtract = require('./tools/pyIfcExtract');

var IfcmExtractor = module.exports = function() {}

IfcmExtractor.prototype.validateInput = function(req, res) {
  var file = req.params.all();

  if (!file) {
    console.log('[DURAARK::IfcmExtractor] no data in payload, aborting');
    res.send(500, 'Error: Please provide an "file" object in the payload!')
    return false;
  }

  var path = file.path;
  if (!path) {
    console.log('[DURAARK::IfcmExtractor] no "file.path" in payload, aborting');
    res.send(500, 'Error: Please provide a "file.path" property in the payload!')
    return false;
  }
  console.log('[DURAARK::IfcmExtractor]   * file: ' + file.path);
  console.log('[DURAARK::IfcmExtractor]')

  return true;
}

IfcmExtractor.prototype.askCache = function(file) {
  return Ifcm.find()
    .where({
      path: {
        'like': file.path
      }
    })
    .then(function(files) {
      if (files.length) {
        var file = files[0];
        // FIXXME: show public URL in output!
        console.log('[DURAARK::IfcmExtractor] found entry: http://localhost:5012/ifcm/' + file.id);
        return file;
      } else {
        console.log('[DURAARK::IfcmExtractor] no entry found');
        return null;
      }
    });
}

IfcmExtractor.prototype.extractFromFile = function(file) {
  return new Promise(function(resolve, reject) {
    return Ifcm.create(file, function(err, file) {
      if (err) {
        console.log('[DURAARK::IfcmExtractor] ERROR creating record:\n\n' + err + '\n');
        return reject('[DURAARK::IfcmExtractor] ERROR creating record:\n\n' + err);
      }

      var extractor = new PyIfcExtract();

      file.save(function(err, file) {
        if (err) {
          console.log('[DURAARK::IfcmExtractor] ERROR saving record 1:\n\n' + err + '\n');
          return reject('[DURAARK::IfcmExtractor] ERROR saving record 1:\n\n' + err);
        }

        extractor.extractIfcm(file).then(function(metadata) {
            console.log('[DURAARK::IfcmExtractor] successfully extracted metadata as XML');

            file.metadata = metadata;
            file.format = 'application/xml';

            // FIXXME: how to determine the schema information dynamically?
            file.schemaName = 'ifcm';
            file.schemaVersion = '1.0';

            file.save(function(err, file) {
              if (err) {
                console.log('[DURAARK::IfcmExtractor] ERROR saving record 2:\n\n' + err + '\n');
                return reject('[DURAARK::IfcmExtractor] ERROR saving record 2:\n\n' + err);
              }

              // TODO: return URL with correct host!
              console.log('[DURAARK::IfcmExtractor] cached data at: http://localhost:5012/ifcm/' + file.id);
              return resolve(file);
            });
          })
          .catch(function(err) {
            console.log('[DURAARK::IfcmExtractor] ERROR extraction: ' + err);
            file.destroy();
            console.log('[DURAARK::IfcmExtractor] removed dangling cache entry');
            return reject(err);
          });
      });
    });
  });
}
