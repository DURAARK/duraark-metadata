/**
 * Buildm.js
 *
 * @description :: Buildm model
 */

module.exports = {
  attributes: {
    path: {
      type: 'string',
      required: true
    },

    serialization: {
      type: 'string',
      required: false
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
