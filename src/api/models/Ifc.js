/**
 * Ifc.js
 *
 * @description :: Model representing an IFC file
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

    ifcm: {
      type: 'array',
      required: false
    }

  }
};
