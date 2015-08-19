/**
 * E57mController
 *
 * @description :: Server-side logic for extracting technical and descriptive
 *                 metadata for IFC-SPF, E57 and (in future) HDF5 files
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var duraark = require('../../lib/duraark');

/**
 * @apiDefine MetadataSuccess
 * @apiSuccess (File) {String} path Location of the File.
 * @apiSuccess (File) {String} type Type of the File ('e57' or 'ifc-spf').
 * @apiSuccess (File) {Date} createdAt Creation time of the database instance.
 * @apiSuccess (File) {Date} updatedAt Last modification time of the database instance.
 * @apiSuccess (File) {Number} id Database instance's unique ID.
 * @apiSuccess (File) {Object} metadata The extracted metadata is returned as [JSON-LD](http://json-ld.org/). The data is logically separated into a 'physicalAsset' and a 'digitalObject' section and follows the [buildM+](https://github.com/DURAARK/Schemas/blob/master/rdf/buildm%2Bv3.1.rdf) schema description.
 */

module.exports = {
  /**
   * @api {get} /file/:id Request cached metadata
   * @apiVersion 0.7.0
   * @apiName GetMetadata
   * @apiGroup Metadata
   * @apiPermission none
   *
   * @apiDescription Requests cached metadata from the server.
   *
   * @apiParam {Number} id File's unique ID.
   *
   * @apiExample {curl} Example usage:
   * curl -i http://data.duraark.eu/services/api/metadata/file/1
   *
   * @apiUse MetadataSuccess
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *        "path": "/duraark-storage/files/Nygade_Scan1001.e57",
   *        "type": "e57",
   *        "createdAt": "2015-08-05T15:20:24.963Z",
   *        "updatedAt": "2015-08-05T15:20:25.005Z",
   *        "id": 1,
   *        "metadata": {
   *          "physicalAsset": { ... JSON-LD data ... },
   *          "digitalObject": { ... JSON-LD data ... }
   *      }
   *
   * @apiError NotFound The metadata information was not found.
   *
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 404 Not Found
   *     Not Found
   *
   */

  /**
   * @api {post} /metadata Extract metadata
   * @apiVersion 0.7.0
   * @apiName PostMetadata
   * @apiGroup Metadata
   * @apiPermission none
   *
   * @apiDescription Extracts metadata from the given File.
   *
   * @apiParam (File) {String} path Location of the File as provided by the [DURAARK Sessions API](http://data.duraark.eu/services/api/sessions/).
   * @apiParam (File) {String} type Type of the File ('e57' or 'ifc-spf').
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *        "path": "/duraark-storage/files/Nygade_Scan1001.e57",
   *        "type": "e57",
   *        "createdAt": "2015-08-05T15:20:24.963Z",
   *        "updatedAt": "2015-08-05T15:20:25.005Z",
   *        "id": 1,
   *        "metadata": {
   *          "physicalAsset": { ... JSON-LD data ... },
   *          "digitalObject": { ... JSON-LD data ... }
   *      }
   *
   */
  create: function(req, res, next) {
    var e57mExtractor = new duraark.E57mExtractor();

    console.log('\n[DURAARK::E57mController] incoming request');
    console.log('[DURAARK::E57mController]');

    if (e57mExtractor.validateInput(req, res)) {
      handleExtraction(e57mExtractor, req, res);
    }
  }
}

function handleExtraction(extractor, req, res) {
  var file = req.params.all();

  console.log('[DURAARK::E57mController] searching in cache ...');

  extractor.askCache(file).then(function(cachedFile) {
    if (cachedFile) {
      console.log('[DURAARK::E57mController] request completed!');
      return res.send(200, cachedFile);
    }

    return extractor.extractFromFile(file)
      .then(function(file) {
        console.log('[DURAARK::E57mController] request completed!');
        return res.send(201, file);
      })
      .catch(function(err) {
        console.log('[DURAARK::E57mController] ERROR extracting from file:\n\n' + err + '\n');
        file.extractionErrors = [{
          type: 'extraction',
          msg: err
        }];

        return res.send(201, file); // FIXXME: find out how to make ember handle a '500' status code!!
      });
  });
}
