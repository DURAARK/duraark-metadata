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
    var file = req.params.all().file,
      metadataExtraction = new duraark.MetadataExtraction();

    console.log('\n[DURAARK::MetadataExtraction] incoming request');
    console.log('[DURAARK::MetadataExtraction]');

    if (metadataExtraction.validateInput(req, res)) {
      handleExtraction(metadataExtraction, file, res);
    }
  }
}

function handleExtraction(extractor, file, res) {
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
        return res.send(500, '[DURAARK::MetadataExtraction] ERROR extracting from file:\n\n' + err);
      });
  });
}
