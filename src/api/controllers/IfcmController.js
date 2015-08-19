/**
 * IfcmController
 *
 * @description :: Server-side logic for extracting technical metadata for
 *                 IFC-SPF files
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var duraark = require('../../lib/duraark');

/**
 * @apiDefine IfcmSucess
 * @apiSuccess (Ifcm) {String} path Location of the File.
 * @apiSuccess (Ifcm) {Date} createdAt Creation time of the database instance.
 * @apiSuccess (Ifcm) {Date} updatedAt Last modification time of the database instance.
 * @apiSuccess (Ifcm) {Number} id Database instance's unique ID.
 * @apiSuccess (Ifcm) {string} Schema name (i.e. 'ifcm')
 * @apiSuccess (Ifcm) {Number} Schema version (e.g. '1.1')
 * @apiSuccess (Ifcm) {Object} metadata The extracted metadata is returned as XML serialization
 */

module.exports = {
  /**
   * @api {get} /ifcm/:id Request cached metadata
   * @apiVersion 0.7.1
   * @apiName GetIfcm
   * @apiGroup Ifcm
   * @apiPermission none
   *
   * @apiDescription Requests (cached) metadata from the server.
   *
   * @apiParam {Number} id File's unique ID.
   *
   * @apiExample {curl} Example usage:
   * curl -i http://data.duraark.eu/services/api/metadata/file/1
   *
   * @apiUse IfcmSucess
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
   * @apiName PostIfcm
   * @apiGroup Ifcm
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
    var ifcmExtractor = new duraark.IfcmExtractor();

    console.log('\n[DURAARK::IfcmController] incoming request');
    console.log('[DURAARK::IfcmController]');

    if (ifcmExtractor.validateInput(req, res)) {
      handleExtraction(ifcmExtractor, req, res);
    }
  }
}

function handleExtraction(extractor, req, res) {
  var file = req.params.all();

  console.log('[DURAARK::IfcmController] searching cache ...');

  extractor.askCache(file).then(function(cachedFile) {
    if (cachedFile) {
      console.log('[DURAARK::IfcmController] request completed!');
      return res.send(200, cachedFile);
    }

    return extractor.extractFromFile(file)
      .then(function(file) {
        console.log('[DURAARK::IfcmController] request completed!');
        return res.send(201, file);
      })
      .catch(function(err) {
        console.log('[DURAARK::IfcmController] ERROR extracting from file:\n\n' + err + '\n');
        file.extractionErrors = [{
          type: 'extraction',
          msg: err
        }];

        return res.send(201, file); // FIXXME: find out how to make ember handle a '500' status code!!
      });
  });
}
