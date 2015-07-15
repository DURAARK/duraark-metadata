FROM duraark/microservice-base

RUN DEBIAN_FRONTEND=noninteractive
RUN apt-get update

# Install Python 3.3 from PPA
RUN apt-get install build-essential python software-properties-common -y
RUN add-apt-repository ppa:fkrull/deadsnakes -y
RUN apt-get update -y
RUN apt-get install python3.3 python3-httplib2 -y

RUN mkdir -p /duraark/microservice /duraark/tools /duraark/schemas

COPY ./src /duraark/microservice
COPY ./pyIfcExtract /duraark/tools/pyIfcExtract
COPY ./pyIfcExtract/buildm_v3.0.rdf /duraark/schemas/

WORKDIR /duraark/microservice

RUN npm install

EXPOSE 5012

ENTRYPOINT ["sails", "lift"]
