# duraark-metadata

[![Circle CI](https://circleci.com/gh/DURAARK/duraark-metadata.svg?style=svg)](https://circleci.com/gh/DURAARK/duraark-metadata)

## Overview

This library is part of the [DURAARK](http://github.com/duraark/duraark-system) system and contains the metadata extraction components.

### Format support

The following file types are supported for the extraction of data:

* IFC-SPF
* E57
* HDF5 (in development)

After the metadata extraction the information can be exported into the following formats (depending on the input file type):

* Input: IFC-SPF -> Output-Schema: buildm -> Serialization: JSON-LD
* Input: IFC-SPF -> Output-Schema: ifcm   -> Serialization: XML
* Input: E57     -> Output-Schema: e57m   -> Serialization: XML

### Plugins

The extraction service comes with a plugin system to extend support for other file formats. Currently two core extractors are implemented:

* IFC-SPF
* E57

A plugin for the HDF5 file format is in development and will be available end of 2015.

### Dependencies

The service depends on two components which are used by the core extraction plugins to do the actual metadata extraction:

* [e57Extract](http://github.com/duraark/e57extract)
* [pyIfcExtract](http://github.com/duraark/pyIfcExtract)

### Used By

This service is used by the

* [DURAARK System](https://github.com/duraark/duraark-system)

## Installation

The following instructions will deploy the SailsJS-based service which exports a REST API.

### Prerequisites

The deployment is tested on Ubuntu 14.04 LTS. Other Linux distribution should work too, but are not tested. [Docker](https://docs.docker.com/userguide/) and [Docker Compose](https://docs.docker.com/compose/) are used for installation and have to be installed on the system you want to deploy the DURAARK system on. The following instructions assume that Docker and Docker Compose are installed on working on the system. See the above links on how to install them for various platforms. [Git](https://git-scm.com/downloads) has to be installed, too.

It is also possible to install DURAARK on Windows and Mac users via the [Docker Toolbox](https://docs.docker.com/installation/windows/). Installing Docker Compose on windows is possible, but seems to be a bit of a hurdle. See this [Stackoverflow answer](http://stackoverflow.com/questions/29289785/how-to-install-docker-compose-on-windows) for details.

Our recommended stack is to install DURAARK on a Docker-compatible Linux system or to use [VirtualBox](https://www.virtualbox.org/) to install a Linux virtual machine on your Windows host.

### Installation Steps

On the host you want to deploy the service execute the following simple steps (assuming that Docker and Docker Compose are installed and working):

```js
> git clone https://github.com/DURAARK/duraark-metadata.git
> cd duraark-metadata
> docker-compose up -d
```

This will deploy the system in the current stable version (v0.7.0) which exposes its API at **http://HOST_IP:5012/** (http://localhost:5012/ if you did the setup on your local host).

The files you want to use have to be put into the folder /tmp/duraark/files. You may want to also install the [duraark-sessions](https://github.com/DURAARK/duraark-sessions), which acts as the data volume container for files in the [DURAARK System](https://github.com/DURAARK/duraark-system).

## Development Environment

To setup the environment follow these steps:

```js
> git clone https://github.com/DURAARK/duraark-system.git
> cd duraark-metadata
> npm install
> docker-compose -f devenv-compose.yml build
> docker-compose -f devenv-compose.yml up -d
```

This will build the dockerized development environment. After building the docker container is started and you can access the service at **http://localhost:5012**. Changing the source code in a sub-module will live reload the container.

The files you want to use have to be put into the folder **/tmp/duraark/files**. You may want to also install the [duraark-sessions](https://github.com/DURAARK/duraark-sessions), which acts as the data volume container for files in the [DURAARK System](https://github.com/DURAARK/duraark-system).

### Testing

Run **npm test** in the **src** folder.

## Platform Support

This library is running on [NodeJS](https://nodejs.org/) and provides a Dockerfile for deployments on [Docker](https://www.docker.com/)-enabled hosts.

## Public API

We are hosting a public API endpoint at

* http://data.duraark.eu/services/api/metadata/

which also provides API documentation for the current stable version.

## Demo

A public demo of the [DURAARK System](http://github.com/duraark/duraark-system) which incorporates this service is available [here](http://workbench.duraark.eu).
