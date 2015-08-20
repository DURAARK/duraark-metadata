/**
 * E57m.js
 *
 * @description :: E57m model
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
