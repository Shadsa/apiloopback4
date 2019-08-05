# Base de données spaciales

## Presentation

Une base de données spatiales est une base de données optimisée pour stocker et requêter des données reliées à des objets référencés géographiquement, y compris des points, les lignes et des polygones. Alors que les bases de données classiques peuvent comprendre différents types de données numériques et caractères, des fonctions additionnelles ont besoin d'être ajoutées pour traiter les types de données spatiales.
Il existe de nombreuse bases de données qui supportent les données spatiales.


## Le cas de Spatialite

Spatialite est une extention de SQLite qui permet de stocker des données vectorielles comme des données geographiques. Le but de ce type de bases de données est de pouvoir stocker des points et des zones via leur coordonnées. 
Les bases de données de ce type contiennent des fonctions qui permettent de verifier l'appartenance d'un point à une zone , de calculer la distance entre deux points et bien d'autres.

Exemple avec la base de données copernicus :
> Base de donnée 2018 : https://land.copernicus.eu/pan-european/corine-land-cover/clc2018?tab=download


La base de données spatialite de copernicus est composée de plusieurs tables mais nous n'utiliserons que celle qui contient les coordonnées des zones geographiques: `CLC2018_CLC2018_V2018_20b2`

Elle possède 6 champs :

* OBJECTID : l'id autogeneré
* Shape : les coordonnes de la zone encodé
* code_18 : l'id du type de terrain
* ID : l'id de la zone
* Remark : champ null
* Area_Ha : la taille de la zone


Les deux informations utiles ici sont le type de terrain et les coordonnées

Le type de terrain est liée au fichier csv fourni avec la bdd qui indique le label de la zone
> ex : 123 correspond  aux zones portuaires



Les coordonnées sont dans un format utilisé par spatialite pour le stockage. 
Pour lire ces données il faut utiliser les fonctions de Spatialite, `Transform` qui permet de retourner des coordonnées à partir d'un certain modèle EPSG , ici on veut le type 4326 ( celui de leaftlet ).


Exemple pour obtenir en GeoJSON 10 lignes de zones portuaires :
```sql=
let sql = `SELECT AsGeoJSON(Transform(Shape,4326)) AS geo , code_18, ID FROM CLC2018_CLC2018_V2018_20b2 WHERE code_18 = 123 LIMIT 10`;
```


