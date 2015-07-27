# microservice-metadata-extraction

[![Circle CI](https://circleci.com/gh/DURAARK/microservice-metadata-extraction.svg?style=svg)](https://circleci.com/gh/DURAARK/microservice-ifcmetadata)

This library is part of the [DURAARK](http://github.com/duraark/duraark-system) system and contains the extraction functionality required in DURAARK to retrieve metadata on files in the system.

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

* [duraark-system](https://github.com/duraark/duraark-system)

## Platform Support

This library is intended to be used inside **NodeJS**.

## API

http://juliet.cgv.tugraz.at/api/v0.7/sessions/

## Demo-Server

A showcasing demo incorporating the service is running on our [development system](http://juliet.cgv.tugraz.at). It is a development system, not a production one. You will always have the newest version running there, but it is also possible to experience bugs. A production demo will be available soon beginning of august 2015 at http://workbench.duraark.eu. Currently we have the first prototype version (v0.5.0) running there.

## Deploying the code

The repository comes with a set of deployment scripts for docker. They are available in the _devops folder.

The recommended way to get the best development experience is to use the [duraark-system](http://github.com/duraark/duraark-system) repository as predefined environment. It provides you with an [nscale]() setup for developing and deploying the fully-featured DURAARK system, which comes with a graphical user interface ([DURAARK WorkbenchUI](http://github.com/duraark/workbench-ui)) and the micro-services based [DURAARK Service Platform](http://github.com/duraark/duraark-system) hosting DURAARK's Web-API.
