/**
 * duraark.js
 *
 * @description :: DURAARK namespace holding high-level libraries for extracting
 *                 metadata from files.
 */


var BuildmExtractor = require('./buildm-extractor'),
  IfcmExtractor = require('./ifcm-extractor'),
  E57mExtractor = require('./e57m-extractor');

module.exports = {
  BuildmExtractor: BuildmExtractor,
  IfcmExtractor: IfcmExtractor,
  E57mExtractor: E57mExtractor
}
