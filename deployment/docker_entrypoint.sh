#!/bin/bash

export APPJS_NAME=$(cd /usr/share/nginx/html && ls js/app.*.js)
if [ ! -z ${APPJS_NAME} ]
then
    echo 'app.js is ${APPJS_NAME}'
    sed -i 's|APPJS_NAME|'${APPJS_NAME}'|g' /etc/nginx/conf.d/default.conf
    sed -i 's|# ||g' /etc/nginx/conf.d/default.conf
else
    echo 'app.js is app.js, no changes'
fi
