#!/bin/sh

(cd src; pm2 delete ifcmetadata; pm2 start app.js -x --name "ifcmetadata" --watch $1)

#(cd src; nodemon -w api -w config)
