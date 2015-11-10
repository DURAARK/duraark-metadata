/**
 * E57mController
 *
 * @description :: Server-side logic for extracting technical metadata for
 *                 IFC-SPF files.
 */

var duraark = require('../../lib/duraark');

/**
 * @apiDefine E57mSuccess
 * @apiSuccess (E57m) {String} path Location of the file.
 * @apiSuccess (E57m) {Date} createdAt Creation time of the database instance.
 * @apiSuccess (E57m) {Date} updatedAt Last modification time of the database instance.
 * @apiSuccess (E57m) {Number} id Database instance's unique ID.
 * @apiSuccess (E57m) {string} format Format of the metadata serialization (i.e. "application/xml")
 * @apiSuccess (E57m) {string} schemaName Schema name (i.e. "e57m")
 * @apiSuccess (E57m) {Number} schemaVersion Schema version (e.g. "1.1")
 * @apiSuccess (E57m) {String} metadata The extracted metadata is returned in the serialization format above
 */

module.exports = {
  /**
   * @api {get} /e57m/:id Request cached e57M metadata
   * @apiVersion 0.8.0
   * @apiName GetE57m
   * @apiGroup E57M
   * @apiPermission none
   *
   * @apiDescription Requests cached technical metadata as e57M/XML serialization.
   *
   * @apiParam {Number} id File's unique ID.
   *
   * @apiExample {curl} Example usage:
   * curl -i http://data.duraark.eu/services/api/metadata/e57m/1
   *
   * @apiUse E57mSuccess
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *        "path": "/duraark-storage/files/Plan3D_Haus30_PREVIEW.ifc",
   *        "createdAt": "2015-08-05T15:20:24.963Z",
   *        "updatedAt": "2015-08-05T15:20:25.005Z",
   *        "id": 1,
   *        "metadata": " ... XML schema instance ...",
   *        "format": "application/ld+json",
   *        "schemaName": "e57m",
   *        "schemaVersion": "1.1"
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
   * @api {post} /e57m Extract technical metadata as e57M/XML serialization from an E57 file.
   * @apiVersion 0.8.0
   * @apiName PostE57m
   * @apiGroup E57M
   * @apiPermission none
   *
   * @apiDescription Extracts technical metadata from the given E57 file.
   *
   * @apiParam (File) {String} path Location of the file as provided by the [DURAARK Sessions API](http://data.duraark.eu/services/api/sessions/).
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *        "path": "/duraark-storage/files/Plan3D_Haus30_PREVIEW.ifc",
   *        "createdAt": "2015-08-05T15:20:24.963Z",
   *        "updatedAt": "2015-08-05T15:20:25.005Z",
   *        "id": 1,
   *        "metadata": " ... XML schema instance ...",
   *        "format": "application/ld+json",
   *        "schemaName": "e57m",
   *        "schemaVersion": "1.1"
   *      }
   *
   */
  create: function(req, res, next) {
    var DURAARK_STORAGE_PATH = process.env.DURAARK_STORAGE_PATH || '/duraark-storage';
    console.log('DURAARK_STORAGE_PATH: ' + DURAARK_STORAGE_PATH);
    var e57mExtractor = new duraark.E57mExtractor(DURAARK_STORAGE_PATH);

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
