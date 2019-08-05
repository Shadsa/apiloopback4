# Models

This directory contains code for models provided by this app. It describes the data template.

## Warning :

The model is case sensitive! `Nest != nest` in the model. So if the object in db is written in lowercase, it must also be named lowercase in the model.

## Land Model : 
```
json
{
  "id": 0,
  "geometry": {
    "type": "string",
    "coordinates": [
      {
        "lng": 0,
        "lat": 0
      }
    ]
  },
  "properties": {
    "country": "string",
    "dep": 0,
    "geoType": "string",
    "family": "string",
    "nests": [
      {
        "year": 0,
        "species": "string",
        "count": 0
      }
    ],
    "neighbours": [
      {
        "lng": 0,
        "lat": 0
      }
    ]
  }
}
```