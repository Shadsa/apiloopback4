# Data format

## Lands
```json
{
    "id": {
        "$oid": "5c7fa725863f29825357dee1"
    },
    "type": "Feature",
    "geometry": {
        "type": "Polygon",
        "coordinates": [
            [
                [
                    -1.221590014417269,
                    42.98502408168607
                ],
                [
                    -1.219706955206717,
                    42.97665590006353
                ],
                [
                    -1.227140396693542,
                    42.97356310785795
                ],
                [
                    -1.227622260540403,
                    42.98020861873398
                ],
                [
                    -1.221590014417269,
                    42.98502408168607
                ]
            ]
        ]
    },
    "properties": {
        "year": 2018,
        "geoType": 231,
        "family": 2
    }
}
```
## Nests
```json
{
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": [
            -0.470053437619597,
            45.518027824197176
        ]
    },
    "properties": {
        "species": "Vespa_velutina_nigrithorax",
        "Country": "France",
        "Dep": 17,
        "Year": 2006,
        "Precision": "3000",
        "CD_STATION": 242
    }
}
```

## Combined Data

```json
{
  "id": "",
  "geometry": {
    "type": "Polygon",
    "coordinates": []
  },
  "properties": {
    "country": "",
    "dep": "",
    "region": { "code": "", "name": "" },
    "geoType": "",
    "family": "",
    "nests": [],
    "neighboors": []
  }
}
```