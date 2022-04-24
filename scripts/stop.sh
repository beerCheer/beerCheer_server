#!/bin/bash
cd /home/ubuntu/beerCheer_server/bin
pm2 stop server.js 2> /dev/null || true
pm2 delete server.js 2> /dev/null || true