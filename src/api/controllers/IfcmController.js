/**
 * IfcmController
 *
 * @description :: Server-side logic for extracting technical metadata for
 *                 IFC-SPF files.
 */

var duraark = require('../../lib/duraark');

/**
 * @apiDefine IfcmSuccess
 * @apiSuccess (Ifcm) {String} path Location of the file.
 * @apiSuccess (Ifcm) {Date} createdAt Creation time of the database instance.
 * @apiSuccess (Ifcm) {Date} updatedAt Last modification time of the database instance.
 * @apiSuccess (Ifcm) {Number} id Database instance's unique ID.
 * @apiSuccess (Ifcm) {string} format Format of the metadata serialization (i.e. "application/xml")
 * @apiSuccess (Ifcm) {string} schemaName Schema name (i.e. "ifcm")
 * @apiSuccess (Ifcm) {Number} schemaVersion Schema version (e.g. "1.0")
 * @apiSuccess (Ifcm) {String} metadata The extracted metadata is returned in the serialization format above
 */

module.exports = {
  /**
   * @api {get} /ifcm/:id Request cached ifcM metadata
   * @apiVersion 0.8.0
   * @apiName GetIfcm
   * @apiGroup IfcM
   * @apiPermission none
   *
   * @apiDescription Requests cached technical metadata as ifcM/XML serialization from an IFC-SPF file.
   *
   * @apiParam {Number} id File's unique ID.
   *
   * @apiExample {curl} Example usage:
   * curl -i http://data.duraark.eu/services/api/metadata/ifcm/1
   *
   * @apiUse IfcmSuccess
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
   *        "schemaName": "ifcm",
   *        "schemaVersion": "1.0"
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
   * @api {post} /ifcm Extract technical metadata as ifcM/XML serialization
   * @apiVersion 0.8.0
   * @apiName PostIfcm
   * @apiGroup IfcM
   * @apiPermission none
   *
   * @apiDescription Extracts technical metadata from the given IFC-SPF file.
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
   *        "schemaName": "ifcm",
   *        "schemaVersion": "1.0"
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
