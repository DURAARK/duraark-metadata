# duraark-metadata

[![Circle CI](https://circleci.com/gh/DURAARK/duraark-metadata.svg?style=svg)](https://circleci.com/gh/DURAARK/microservice-ifcmetadata)

This library is part of the [DURAARK](http://github.com/duraark/duraark-system) system and contains the metadata extraction components.

## Format support

The following file types are supported for the extraction of data:

* IFC-SPF
* E57
* HDF5 (in development)

After the metadata extraction the information can be exported into the following formats (depending on the input file type):

* Input: IFC-SPF -> Output-Schema: buildm -> Serialization: JSON-LD, N3
* Input: IFC-SPF -> Output-Schema: ifcm   -> Serialization: XML
* Input: E57     -> Output-Schema: e57m   -> Serialization: JSON-LD, XML

## Plugins

The extraction service comes with a plugin system to extend support for other file formats. Currently two core extractors are implemented:

* IFC-SPF
* E57

Currently a plugin for the HDF5 file format is in development and will be available end of 2015.

## Dependencies

The service depends on two components which are used by the core extraction plugins to do the actual metadata extraction:

* [e57Extract](http://github.com/duraark/e57extract)
* [pyIfcExtract](http://github.com/duraark/pyIfcExtract)

## Used By

This service is used by the

* [Service Platform](https://github.com/duraark/duraark-system)

## Platform Support

This library is running on [NodeJS](https://nodejs.org/).

## API

We are hosting a public API endpoint at

* http://juliet.cgv.tugraz.at/api/v0.7/sessions/

which links to the API documentation.

## Demo

A public demo of the [WorkbenchUI](http://github.com/duraark/workbench-ui) is available [here](http://workbench.duraark.eu). It uses the API of our [Service Platform](https://github.com/duraark/duraark-system) to power the GUI. The current version is v0.5.0.

The bleeding edge version of the [WorkbenchUI](http://github.com/duraark/workbench-ui) is also available on our [development server](http://juliet.cgv.tugraz.at). It is a development system. You've been warned...

That said, you will always have the newest version running there (its coupled with our continuous deployment platform), ready to be explored for in-development features. It can be buggy, though. The development is targeting v0.7.0 currently.

## Testing

Run **npm test** in the **src** folder.

## Development & Deployment

The repository comes with a set of deployment scripts for docker. They are available in the _devops folder.

The recommended way to get the best development experience is to use the [duraark-system](http://github.com/duraark/duraark-system) repository as predefined environment. It provides you with an [nscale]() setup for developing and deploying the fully-featured DURAARK system, which comes with a graphical user interface ([DURAARK WorkbenchUI](http://github.com/duraark/workbench-ui)) and the micro-services based [DURAARK Service Platform](http://github.com/duraark/duraark-system) hosting the DURAARK API.
