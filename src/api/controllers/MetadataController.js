/**
 * MetadataExtractionController
 *
 * @description :: Server-side logic for extracting technical and descriptive
 *                 metadata for IFC-SPF, E57 and (in future) HDF5 files
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var duraark = require('../../lib/duraark');

module.exports = {
  create: function(req, res, next) {
    var metadataExtraction = new duraark.MetadataExtraction();

    console.log('\n[DURAARK::MetadataExtraction] incoming request');
    console.log('[DURAARK::MetadataExtraction]');

    if (metadataExtraction.validateInput(req, res)) {
      handleExtraction(metadataExtraction, req, res);
    }
  }
}

function handleExtraction(extractor, req, res) {
  var file = req.params.all();

  console.log('[DURAARK::MetadataExtraction] searching in cache ...');

  extractor.askCache(file).then(function(cachedFile) {
    if (cachedFile) {
      console.log('[DURAARK::MetadataExtraction] request completed!');
      return res.send(200, cachedFile);
    }

    return extractor.extractFromFile(file)
      .then(function(file) {
        console.log('[DURAARK::MetadataExtraction] request completed!');
        return res.send(201, file);
      })
      .catch(function(err) {
        console.log('[DURAARK::MetadataExtraction] ERROR extracting from file:\n\n' + err + '\n');
        file.extractionErrors = [{
          type: 'extraction',
          msg: err
        }];

        return res.send(201, file); // FIXXME: find out how to make ember handle a '500' status code!!
      });
  });
}
