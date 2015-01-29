FROM duraark/microservice-base

RUN DEBIAN_FRONTEND=noninteractive

# Install Python 3.3 from PPA
RUN apt-get install software-properties-common -y
RUN add-apt-repository ppa:fkrull/deadsnakes -y
RUN apt-get update -y
RUN apt-get install python3.3 -y

COPY ./src /microservice
COPY ./pyIfcExtract /pyIfcExtract

WORKDIR /microservice
RUN npm install

EXPOSE 5002

ENTRYPOINT ["sails", "lift"]
