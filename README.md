# microservice-metadata-extraction

[![Circle CI](https://circleci.com/gh/DURAARK/microservice-metadata-extraction.svg?style=svg)](https://circleci.com/gh/DURAARK/microservice-ifcmetadata)

This library is part of the [DURAARK](http://github.com/duraark/duraark-system) system and contains the extraction functionality required in DURAARK to retrieve metadata on files in the system. The following file types are supported for extraction of data:

* IFC-SPF
* E57
* HDF5 (in development)

Dependent on the file type and metadata level the output has the following output:

* [IFC-SPF] buildm -> JSON-LD, N3
* [IFC-SPF] ifcm   -> XML
* [E57]     e57m   -> JSON, XML

For the metadata extraction plugin system provides an 'extractor' for a certain file type, where an extractor is also responsible for serializing the result data to the client. Currently two extractors are registered, one for 'IFC-SPF' and one for the 'E57' file type. In future a plugin for handling the 'HDF5' file type will be provided, targeted for the end of this year (2015).

## Dependencies

The service depends on two components which are used by the file type plugins to do the actual metadata extraction:

* [e57Extract](http://github.com/duraark/e57extract)
* [pyIfcExtract](http://github.com/duraark/pyIfcExtract)

## Used By

* [duraark-system](https://github.com/duraark/duraark-system)

## Platform Support

This library is intended to be used inside **NodeJS**.

## API

TODO

## Demo-Server

A showcasing demo incorporating the service is running on our [development system](http://juliet.cgv.tugraz.at). It is a development system, not a production one. You will always have the newest version running there, but it is also possible to experience bugs. A production demo will be available soon at http://workbench.duraark.eu. Currently we have the first prototype version running there.

## Deploying the code

The deployment setup is based on the repository [microservice-base](https://github.com/DURAARK/microservice-base). It provides development scripts and docker deployment. Have a look at the link to get more detailed information.
