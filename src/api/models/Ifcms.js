/**
 * Ifcm.js
 *
 * @description :: Ifcm model
 */

module.exports = {
  attributes: {
    path: {
      type: 'string',
      required: true
    },

    schemaName: {
      type: 'string',
      required: false
    },

    schemaVersion: {
      type: 'string',
      required: false
    },

    metadata: {
      type: 'object',
      required: false
    }
  }
};
