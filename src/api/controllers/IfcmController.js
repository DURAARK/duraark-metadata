/**
 * IfcmController
 *
 * @description :: Server-side logic for managing ifcms
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var IfcMetadata = require('../../bindings/pyIfcExtract/app');

module.exports = {
    extract: function(req, res, next) {
        var files = req.params.all().files,
            ifcms = [];

        // console.log('files: ' + JSON.stringify(files, null, 4));

        for (var idx = 0; idx < files.length; idx++) {
            var file = files[idx],
                ifcmInfo = {
                    type: 'ifc',
                    status: 'pending',
                };

            // The outside 'idx' is bound to the anonymous callback function in line 43
            // to have the idx available for triggering the sending of the response.
            Ifcm.create(ifcmInfo, function(idx, err, ifcm) {
                if (err) return next(err);

                // var ifcMetadata = new IfcMetadata();
                // ifcMetadata.extractFromFile(ifcm);

                ifcm.physicalAsset = {
                    schema: 'buildm',
                    file: file.path,
                    instance: {
                        Identifier: '1234-2345-3456-4567',
                        latitude: 13,
                        longitude: 44,
                        owner: 'TU Graz',
                        buildingArea: 4932,
                        floorCount: 3,
                        numberOfRooms: 145,
                        'function': 'Educational building',
                        architecturalStyle: 'reduced',
                        description: 'Campus building',
                        location: 'At the campus',
                        streetAddress: 'Inffeldgasse 16c, III',
                        postalCodeStart: '16',
                        postalCodeEnd: '16',
                        postOfficeBoxNumber: '',
                        addressRegion: 'Graz',
                        postalLocality: 'Graz',
                        architect: 'Martina Musterfrau',
                        contributor: 'Max Mustermann',
                        startDate: 2001,
                        completionDate: 2004,
                        constructionTime: 1024,
                        rebuildingDate: 0,
                        modificationDetails: 'none',
                        cost: 1,
                        rightsDetails: 'unknown'
                    }
                };

                ifcm.digitalObject = {
                    schema: 'buildm',
                    file: file.path,
                    instance: {
                        Identifier: '2345-3456-4567-5678',
                        creator: 'Martin Hecher',
                        name: '3DSDI.ifc',
                        dateCreated: new Date(),
                        isPartOf: '1234-2345-3456-4567',
                        hasPart: '',
                        format: 'IFC-SPF',
                        hasType: 'plan',
                        hasFormatDetails: 'SPF',
                        description: 'no description given',
                        provenance: 'none',
                        license: 'unknown',
                        unitCode: 'sii',
                        levelOfDetail: 'none'
                    }
                };

                ifcm.ifcm = {
                    schema: 'ifcm',
                    file: file.path,
                    instance: {
                        header: {
                            creationDate: new Date(),
                            author: 'Martin Hecher',
                            organization: 'TU Graz',
                            preprocessor: 'none',
                            originatingSystem: 'none',
                            authorization: 'none',
                            fileSchema: 'IFC-SPF',
                            viewDefinition: 'none',
                            exportOptions: 'none'
                        },
                        ifcparameters: {
                            ifcApplication: 'Blender',
                            IfcGeometricRepresentationContext: 'none',
                            ifcSiUnit: 'none'
                        },
                        countObjects: {
                            floorCount: 3,
                            roomCount: 3,
                            wallCount: 3,
                            windowsCount: 3,
                            doorCount: 3,
                            pipeCount: 3,
                            columnCount: 3,
                            numberOfComponents: 3,
                            numberOfRelations: 3,
                            numberOfActors: 3
                        },
                        informationMetric: {
                            numberOfEntityTypesUsed: 3,
                            numberOfTotalEntitiesUsed: 3,
                            optionalAttributes: 0
                        },
                        dependencies: {
                            webResourceLink: 'none'
                        }
                    }
                };

                ifcm.status = 'finished';

                ifcms.push(ifcm);

                if (idx === files.length - 1) {
                    res.send(ifcms);
                }
            }.bind(this, idx));
        };
    }
};