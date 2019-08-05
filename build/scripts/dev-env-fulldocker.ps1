Write-Host "--->Setup Var<---"

$Mongo_Image = "bitnami/mongodb:4.1.10"
$API_Image = "sogeti/mmw-api"
$API_Container = "mmw-api"
$DB_Container = "mmw-db"
$DB_Launcher = ""

function SetupDB{
 Write-Host "--->Setup database<---"
 if($(docker ps --filter "name=mmw-db" | measure).Count -le 1){
    if($(docker ps -af "name=mmw-db").Count -ge 2){
       Write-Host "--->Removing sleeping DB<---"
       docker rm $(docker ps -aqf "name=mmw-db")
    }
    Write-Host "--->Creating DB<---"
    $DB_ID = $(docker create --name $DB_Container -e MONGODB_USERNAME=admin -e MONGODB_PASSWORD=admin -e MONGODB_DATABASE=mmwdb -p 127.0.0.1:27017:27017 --restart always $Mongo_Image)
    Write-Host "$DB_ID" 
    Write-Host "--->Starting DB<---"
    docker start $DB_ID
    Start-Sleep -Seconds 30
    Write-Host "--->Copying JSON into DB Container<---"
    docker cp ./data/FinalData.json ${DB_ID}:/init.json
    Write-Host "--->Importing JSON into DB<---"
    docker exec -it $DB_ID mongoimport -u admin -p admin --db mmwdb --collection Land --type json --file /init.json --jsonArray
 }
 else{
    Write-Host "--->DB already running<---"
 }
}

function deployAPI{
Write-Host "--->Setup API<---"
if($(docker ps -af "name=mmw-api" | measure).Count -ge 2){
docker rm -f $API_Container
}
docker build --rm --no-cache -t $API_Image lbcore
docker run -itd -e DB_HOST=database -e LDAP_URL="ldap://innovation-factory.io:389/" -e LDAP_BINDDN="cn=reader,dc=innovation-factory,dc=io" -e LDAP_BINDCREDENTIALS="S@geti34!" -e LDAP_SEARCHBASE="dc=innovation-factory,dc=io" -e LDAP_SEARCHFILTER="(uid={{username}})" -p 0.0.0.0:3000:3000 --link ${DB_Container}:database --name $API_Container $API_Image
Start-Sleep -Seconds 10

docker logs $API_Container
}

SetupDB
deployAPI
