"Remove previous running mmw-db"
docker-compose down
docker rm -f mmw-db
docker-compose -f ../../docker-compose.yml build
invoke-expression 'cmd /c start powershell -Command {docker-compose -f ../../docker-compose.yml up}'
Start-Sleep -Seconds 30.5
docker cp ../../data/FinalData.json mmw-api_database_1:/
docker exec -it mmw-api_database_1 mongoimport -u mmwuser -p cKtrEudKZn638a6Q --db mmwdb --collection Land --type json --file /FinalData.json --jsonArray
