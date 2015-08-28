FROM duraark/microservice-base

RUN DEBIAN_FRONTEND=noninteractive
RUN apt-get update

# Install Python 3.3 from PPA
RUN apt-get install build-essential python software-properties-common -y
RUN add-apt-repository ppa:fkrull/deadsnakes -y
RUN apt-get update -y
RUN apt-get install python3.3 python3-httplib2 -y

RUN mkdir -p /duraark/microservice /duraark/tools /duraark/schemas

COPY ./ /duraark/microservice
WORKDIR /duraark/microservice

RUN (cd src && npm install sails nodemon -g && npm install)

EXPOSE 5012

# Compile e57Extract:
RUN apt-get install -y git build-essential cmake vim unzip wget scons
RUN apt-get install -y libboost-filesystem1.55-dev libboost-system1.55-dev \
                       libboost-thread1.55-dev libboost-program-options1.55-dev \
		       libeigen3-dev libxerces-c-dev

# Copy sources and dependencies for the 'e57metadata' binary:
COPY ./e57Extract /e57_metadata

# Extract dependencies from local archives:
WORKDIR /e57_metadata/aux_
RUN unzip E57RefImpl_src-1.1.312.zip
RUN unzip cereal-v1.0.0.zip

# Compile E57RefImpl library:
WORKDIR /e57_metadata/aux_/E57RefImpl_src-1.1.312
RUN cmake .
RUN make -j2

# Perform user-local install:
RUN make install
RUN cp libtime_conversion.a /usr/local/E57RefImpl-1.1.unknown-x86_64-linux-gcc48/lib/
RUN cp include/time_conversion/*.h /usr/local/E57RefImpl-1.1.unknown-x86_64-linux-gcc48/include/e57
RUN export PATH=$PATH:/usr/local/E57RefImpl-1.1.unknown-x86_64-linux-gcc48/bin

# Perform system-wide installation:
RUN cp -r /usr/local/E57RefImpl-1.1.unknown-x86_64-linux-gcc48/include/e57 /usr/include
RUN cp -r /usr/local/E57RefImpl-1.1.unknown-x86_64-linux-gcc48/lib/* /usr/lib

# Compile E57SimpleImpl library:
WORKDIR /e57_metadata/aux_/E57SimpleImpl-src-1.1.312_fixed
RUN scons .

# Perform system-wide installation:
RUN cp libE57SimpleImpl.so /usr/lib
RUN cp -r include/* /usr/include/e57

# Compile e57metadata binary:
WORKDIR /e57_metadata
#RUN wget https://github.com/USCiLab/cereal/archive/v1.0.0.zip
RUN mkdir build
WORKDIR build
RUN CEREAL_ROOT=./aux_/cereal-1.0.0 cmake ../
RUN make -j2
RUN make install

# Perform system-wide installation as 'e57_metadata':
RUN cp /usr/local/bin/test_cpplib /usr/bin/e57_metadata
RUN echo $(pwd) > /etc/ld.so.conf.d/e57_metadata.conf
RUN ldconfig

WORKDIR /duraark/microservice/src

CMD ["sails", "lift", "--prod"]
