#!/bin/bash
cd /home/ubuntu/beerCheer_server/bin

export DEV_DB_USERNAME=$(aws ssm get-parameters --region ap-northeast-2 --names DEV_DB_USERNAME --query Parameters[0].Value | sed 's/"//g')
export DEV_DB_PASSWORD=$(aws ssm get-parameters --region ap-northeast-2 --names DEV_DB_PASSWORD --query Parameters[0].Value | sed 's/"//g')
export DEV_DB_NAME=$(aws ssm get-parameters --region ap-northeast-2 --names DEV_DB_NAME --query Parameters[0].Value | sed 's/"//g')
export DEV_DB_HOST=$(aws ssm get-parameters --region ap-northeast-2 --names DEV_DB_HOST --query Parameters[0].Value | sed 's/"//g')
export PORT=$(aws ssm get-parameters --region ap-northeast-2 --names PORT --query Parameters[0].Value | sed 's/"//g')
export BEER_NAVER_CLIENTID=$(aws ssm get-parameters --region ap-northeast-2 --names BEER_NAVER_CLIENTID --query Parameters[0].Value | sed 's/"//g')
export BEER_NAVER_CLIENT_SECRET=$(aws ssm get-parameters --region ap-northeast-2 --names BEER_NAVER_CLIENT_SECRET --query Parameters[0].Value | sed 's/"//g')

authbind --deep pm2 start server.js -f