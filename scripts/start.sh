#!/bin/bash
cd /home/ubuntu/beerCheer_server
authbind --deep pm2 start bin/server.js