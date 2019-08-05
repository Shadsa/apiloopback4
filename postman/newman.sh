#!/bin/bash
set -e

NEWMAN_IMAGE="sogeti/newman:alpine"
API_CONTAINER_NAME="mmw-data-api"
API_IMAGE="mmw-data/api"

BDD_IMAGE="bitnami/mongodb:4.1.10"
BDD_CONTAINER_NAME="mmw-data-bdd"

echo "Starting Mongo database"
docker run -d --name $BDD_CONTAINER_NAME \
-e MONGODB_USERNAME=admin \
-e MONGODB_USERNAME=admin \
-e MONGODB_PASSWORD=admin \
-e MONGODB_DATABASE=mmwdb \
--restart always \
$BDD_IMAGE

echo "Building API image"
docker build -t $NEWMAN_IMAGE --no-cache --pull ./postman

echo "Waiting Mongo is up & running"
docker run --rm --link $BDD_CONTAINER_NAME:mongo djbasster/wait-for-it:latest --strict --timeout=20 mongo:27017

echo "Starting API container"
docker run -d --name $API_CONTAINER_NAME \
-e DB_HOST=mongo \
--link $BDD_CONTAINER_NAME:mongo \
$API_IMAGE

echo "Starting newman process"
docker run --rm \
-v $WORKSPACE/postman:/etc/postman \
-v $WORKSPACE/target:/reports \
--link $API_CONTAINER_NAME:api \
$NEWMAN_IMAGE \
run "/etc/postman/mmw-api.postman_collection.json" \
--environment="/etc/postman/mmw-jenkins.postman_environment.json" \
-r htmlextra --reporter-htmlextra-darkTheme \
--reporter-htmlextra-title "Postman report" \
--reporter-htmlextra-export /reports/postman-report.html \
--verbose \
--suppress-exit-code

echo "Remove API and Mongo containers"
docker rm -f $API_CONTAINER_NAME $BDD_CONTAINER_NAME
