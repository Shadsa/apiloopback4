# Datasources

This directory contains config for datasources used by this app. It's the description of "where" the data reside.

## How to know if the DB is working well ?
(first run the dev script in order to setup the env)
```
docker exec -it mmw-db mongo -u admin -p admin --authenticationDatabase mmwdb
use mmwdb
db.Land.find()
```

## Seeding Databases :

The collection containing the object on which the queries are executed must always be named in the same way as the object !
For example, if the object is called "Land", the collection has to be named "Land". As an example, refer to the  `build/script/dev-env.ps1` script that create the dockerized database, and seed it from a file.