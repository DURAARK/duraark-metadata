#!/bin/sh

(cd src; pm2 delete ifcmetadata; pm2 start app.js -x --name "ifcmetadata" -- --prod)

#(cd src; nodemon -w api -w config)
