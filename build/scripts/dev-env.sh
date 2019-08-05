#!/bin/bash
set -xe

# You must execute this script from root project

MONGO_IMAGE="bitnami/mongodb:4.1.10"

echo "Setup database..."

# Ensure container does not exist
COUNT=$(docker ps --filter ancestor=$MONGO_IMAGE -qa) || false
if [ $COUNT ]
then
    docker rm -f $(docker ps --filter ancestor=$MONGO_IMAGE -qa)
fi

MONGO_CONTAINER_ID=$(docker create \
--name mmw-db \
-e MONGODB_USERNAME=admin \
-e MONGODB_PASSWORD=admin \
-e MONGODB_DATABASE=mmwdb \
-p 127.0.0.1:27017:27017 \
--restart always \
$MONGO_IMAGE)
docker start $MONGO_CONTAINER_ID

# Ensure database is up and running
sleep 30
docker cp ./build/mongo/init.json $MONGO_CONTAINER_ID:/
docker exec -it $MONGO_CONTAINER_ID mongoimport -u admin -p admin --db mmwdb --collection Land --type json --file /init.json --jsonArray

echo "Setup Loopback API"
cd lbcore
npm install

echo "Install sucess"
echo "Run 'cd lbcore && npm start' to run this project"