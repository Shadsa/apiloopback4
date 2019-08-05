"Remove previous running mmw-db"
docker rm -f mmw-db
docker-compose down
"Creating mmw-db image"
docker create --name mmw-db -e MONGODB_USERNAME=admin -e MONGODB_PASSWORD=admin -e MONGODB_DATABASE=mmwdb -p 127.0.0.1:27017:27017 --restart always "bitnami/mongodb:4.1.10"
"Starting mmw-db image"
docker start mmw-db
Start-Sleep -Seconds 30.5
"Import data in db"
docker cp ../../data/FinalData.json mmw-db:/
docker exec -it mmw-db mongoimport -u admin -p admin --db mmwdb --collection Land --type json --file /FinalData.json --jsonArray
Set-Location ../../lbcore/ | npm install
Remove-Item ./dist -recurse 
Remove-Item ./dist10 -recurse 
npm run build
npm start 