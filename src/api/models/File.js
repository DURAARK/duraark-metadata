/**
 * E57.js
 *
 * @description :: Model representing an E57 point cloud file
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  attributes: {

    type: {
      type: 'string',
      required: true
    },

    path: {
      type: 'string',
      required: true
    },

    metadata: {
      type: 'array',
      required: false
    }

  }
};
