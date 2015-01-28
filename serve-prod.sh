#!/bin/sh

SERVICENAME="ifcmetadata"
INDEXFILE="app.js"
FOLDER="src"

(cd $FOLDER; pm2 delete $SERVICENAME; pm2 start $INDEXFILE -x --name $SERVICENAME -- --prod)
