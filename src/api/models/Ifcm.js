/**
 * Ifcm.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        type: {
            type: 'string',
            required: true
        },

        status: {
            type: 'string',
            required: false
        },

        physicalAsset: {
            required: false
        },

        digitalObject: {
            required: false
        },

        ifcm: {
            required: false
        }
    }
};