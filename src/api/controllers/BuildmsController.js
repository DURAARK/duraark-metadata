/**
 * BuildmController
 *
 * @description :: Server-side logic for extracting descriptive metadata for
  *                IFC-SPF files.
 */

var duraark = require('../../lib/duraark');

  /**
   * @apiDefine BuildmSuccess
   * @apiSuccess (Ifcm) {String} path Location of the file.
   * @apiSuccess (Ifcm) {Date} createdAt Creation time of the database instance.
   * @apiSuccess (Ifcm) {Date} updatedAt Last modification time of the database instance.
   * @apiSuccess (Ifcm) {Number} id Database instance's unique ID.
   * @apiSuccess (Ifcm) {string} format Format of the metadata serialization (i.e. "application/ld+json")
   * @apiSuccess (Ifcm) {string} schemaName Schema name (i.e. "buildm")
   * @apiSuccess (Ifcm) {Number} schemaVersion Schema version (e.g. "2.2")
   * @apiSuccess (Ifcm) {Object} metadata The extracted metadata is returned in the serialization format above
   */

module.exports = {
  /**
   * @api {get} /buildm/:id Request cached buildM metadata
   * @apiVersion 0.8.0
   * @apiName GetBuildm
   * @apiGroup BuildM
   * @apiPermission none
   *
   * @apiDescription Requests cached descriptive metadata as buildM/JSON-LD serialization.
   *
   * @apiParam {Number} id File's unique ID.
   *
   * @apiExample {curl} Example usage:
   * curl -i http://data.duraark.eu/services/api/metadata/buildm/1
   *
   * @apiUse BuildmSuccess
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *        "path": "/duraark-storage/files/Plan3D_Haus30_PREVIEW.ifc",
   *        "createdAt": "2015-08-05T15:20:24.963Z",
   *        "updatedAt": "2015-08-05T15:20:25.005Z",
   *        "id": 1,
   *        "metadata": {
   *          "physicalAsset": { ... JSON-LD data ... },
   *          "digitalObject": { ... JSON-LD data ... }
   *        },
   *        "format": "application/ld+json",
   *        "schemaName": "buildm",
   *        "schemaVersion": "2.2"
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
   * @api {post} /buildm Extract descriptive metadata as buildM/JSON-LD serialization from an IFC-SPF file.
   * @apiVersion 0.8.0
   * @apiName PostBuildm
   * @apiGroup BuildM
   * @apiPermission none
   *
   * @apiDescription Extracts descriptive metadata from the given IFC-SPF file.
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
   *        "metadata": {
   *          "physicalAsset": { ... JSON-LD data ... },
   *          "digitalObject": { ... JSON-LD data ... }
   *        },
   *        "format": "application/ld+json",
   *        "schemaName": "buildm",
   *        "schemaVersion": "2.2"
   *      }
   *
   */
  create: function(req, res, next) {
    var buildmExtractor = new duraark.BuildmExtractor();

    console.log('\n[DURAARK::BuildmController] incoming request');
    console.log('[DURAARK::BuildmController]');

    if (buildmExtractor.validateInput(req, res)) {
      handleExtraction(buildmExtractor, req, res);
    }
  }
}

function handleExtraction(extractor, req, res) {
  var file = req.params.all(),
  schema_path = process.cwd() + '/../pyIfcExtract/buildm_v3.0.rdf';

  console.log('[DURAARK::BuildmController] searching in cache ...');

  extractor.askCache(file).then(function(cachedFile) {
    if (cachedFile) {
      console.log('[DURAARK::BuildmController] request completed!');
      return res.send(200, cachedFile);
    }

    return extractor.extractFromFile(file, schema_path)
      .then(function(file) {
        console.log('[DURAARK::BuildmController] request completed!');
        return res.send(201, file);
      })
      .catch(function(err) {
        console.log('[DURAARK::BuildmController] ERROR extracting from file:\n\n' + err + '\n');
        file.extractionErrors = [{
          type: 'extraction',
          msg: err
        }];

        return res.send(201, file); // FIXXME: find out how to make ember handle a '500' status code!!
      });
  });
}
