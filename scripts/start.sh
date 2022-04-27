#!/bin/bash
cd /home/ubuntu/beerCheer_server/bin

export DATABASE_USER=$(aws ssm get-parameters --region ap-northeast-2 --names DEV_DB_USERNAME --query Parameters[0].Value | sed 's/"//g')
export DATABASE_PASSWORD=$(aws ssm get-parameters --region ap-northeast-2 --names DEV_DB_PASSWORD --query Parameters[0].Value | sed 's/"//g')
export DATABASE_PORT=$(aws ssm get-parameters --region ap-northeast-2 --names DEV_DB_NAME --query Parameters[0].Value | sed 's/"//g')
export DATABASE_HOST=$(aws ssm get-parameters --region ap-northeast-2 --names DEV_DB_HOST --query Parameters[0].Value | sed 's/"//g')
authbind --deep pm2 start server.js -f