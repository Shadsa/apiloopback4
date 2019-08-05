# Manipulation des données copernicus

## Introduction

Dans le cadre du projet MapMyworld nous avons utilisé une base de donnée MongoDB qui est plus adapatée à notre projet et qui permet de manipuler du geojson utilisé pour l'affichage avec Leaflet.
Nous partons d'une base de donnée Spatialite : 

> Base de donnée 2018 : https://land.copernicus.eu/pan-european/corine-land-cover/clc2018?tab=download


## Migration vers MongoDB

Dans un premier temps le script `migrate.js` permet de lire les données de la base de données copernicus et de les enregistrer dans un mongodb en local. La base de données etant assez grande il faut plusieurs heures pour executer le script. 

Pour eviter les problèmes de mémoires avec node utilisez la commande 

```bash
node --max-old-space-size=6144 migrate.js
```

Il peut y avoir des erreurs sur cetaines lignes trop "grande" pour un document mongoDB 

Ne pas oublier de generer les `index` sur les données recherchées comme le `geoType` ou la `famille`
Pour les recherches Spatiales il faut indexer les données geographiques : 

```bash
db.copernicus.createIndex( { "geometry" : "2dsphere" } )
```


## Limiter les données à un pays

La base de données comporte plus de 2 millions de lignes pour toute l'europe, dans un premier temps pour le projet mmw on va se limiter aux données de la France. Pour ça on utilise le site `https://geojson-maps.ash.ms/` qui genere du geojson pour un ou plusieurs pays. Ce geojson va permettre de délimiter les données à saisir dans la base. 

Il suffit d'utiliser la fonction de mongodb `$geoWithin` qui va trouver les données à l'interieur du geojson de la France.

L'example est dans `france.js`


## Simplification

Si le jeu de données reste trop important pour le manipuler il est possible de simplifier avec un très bon site [Mapshaper](https://mapshaper.org/)
Il suffit d'importer un fichier GeoJson et de reduire le nombre de point qui forme un polygon. Il est ensuite possible de l'exporter en fichier Geojson ou shapefile.

Le seul problème avec cette methode c'est que notre fichier exporté de la base de donnée n'est pas de type Geojson. Pour corriger ça j'ai utilisé `writemongo.js` 

Une fois exporté il faudra utiliser la commande 
``` bash
mongoimport --db mmw --collection macollection --file file.json --jsonArray
```


## A venir

Pour afficher les données il peut y avoir un moyen plus simple je vous laisse consulter ce petit tuto : 
[Map Tiles](http://build-failed.blogspot.com/2012/03/custom-map-tiles-part-2-tilemill.html)
