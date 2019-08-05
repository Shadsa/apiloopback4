var fs = require("fs");
var turf = require("@turf/turf");
var classifyPoint = require("robust-point-in-polygon");
/*
EXAMPLE FOR LAND FORMAT

{
  "ID": 0,
  "geometry": {
    "type": "string",
    "coordinates": [
      {
        "long": 0,
        "lat": 0
      }
    ]
  },
  "properties": {
    "Country": "string",
    "Dep": 0,
    "geoType": "string",
    "family": "string",
    "region" : {
      "name" : string,
      "code": 0
    }
    "Nests": [
      {
        "year": 0,
        "species": "string",
        "count": 0
      }
    ],
    "neighbours": [
      0
    ]
  }
};*/

const NBNEIGHBOURS = 10;

//point have to be a turf transformed point, landlist a feature collection in geojson format, and have to have an ID in its properties
function NearestPolygon(point, landlist) {
  let r;
  let min = -1;
  landlist.some(function (element, index) {
    let coords = [];
    element.geometry.coordinates.every(function (pointoadapt, index) {
      coords.push(Object.values(pointoadapt));
      return true;
    });
    let turfpoly = turf.polygon([coords]);
    let turfpoint = turf.points([point]);
    if (classifyPoint(coords, point) != 1) {
      r = element.id;
      return true;
    } else {
      let vertices = turf.explode(turfpoly);
      let closestVertex = turf.nearest(turfpoint.features[0], vertices);
      let distance = turf.distance(turfpoint.features[0], closestVertex);
      if (min == -1 || min > distance) {
        min = distance;
        r = element.id;
      }
    }
  });
  return r;
}

//Compute if a land is in a Polygon
function LandWithinPolygon(land, region) {
  let coords = [];
  land.geometry.coordinates.every(function (pointoadapt, index) {
    coords.push(Object.values(pointoadapt));
    return true;
  });
  let turfpolyLand = turf.polygon([coords]);
  let centerLand = turf.centerOfMass(turfpolyLand);
  let searWithin;
  if (region.geometry.type == "Polygon") {
    searWithin = turf.polygon(region.geometry.coordinates);
  } else {
    searWithin = turf.multiPolygon(region.geometry.coordinates);
  }
  ptsWithin = turf.pointsWithinPolygon(centerLand, searWithin);

  return ptsWithin;
}


function compare(a, b) {
  return a[1] - b[1];
}

function binarySearch(distlist, el, compare) {
  var start = 0;
  var end = distlist.length - 1;

  while (start <= end) {
      var mid = (start + end) >> 1;
      var cmp = compare(el, distlist[mid]);
      if (cmp >= 0) { // el > distlist[mid]
          start = mid + 1;
      } else if (cmp < 0) { // el < distlist[mid]
          end = mid - 1;
      }
  }
  return start;
}

//Return the closest land to the current one
function calculateNeighbours(land, landlist) {
  let dist = 0;
  let distList = [];
  let turfpolyLand = turf.polygon([stringToCoordArray(land.geometry.coordinates)]);
  let centerLand = turf.centerOfMass(turfpolyLand);

  landlist.every(function (element, index) {
      if (element.id != land.id) {
          let turfpolyElement = turf.polygon([stringToCoordArray(element.geometry.coordinates)]);
          let centerElement = turf.centerOfMass(turfpolyElement);
          dist = turf.distance(centerLand, centerElement);

          // binary search algorithm
          // finding index of placement of dist element
          // using divide and conquer method
          if ( distList.length > 0 && (distList.length < NBNEIGHBOURS || (distList[distList.length - 1][1] > dist && distList.length >= NBNEIGHBOURS))){

              if (distList.length >= NBNEIGHBOURS)
                  distList.pop();
              distList.splice(binarySearch(distList, [index, dist], compare), 0, [index, dist]);
      
          }else if(distList.length <= 0){
              distList.push([index, dist]);
          }
      }
      return true;
  });

  let neighbours = [];
  distList.every(function (elem, index) {
      neighbours.push(landlist[elem[0]].geometry.coordinates[0]);
      return true;
  });
  return neighbours;
}


//Array of 2 size (long, lat). The array contain an array of array. Each array contain 2 elem, a long and lat
function coordArrayToString(array) {
  let r = [];
  array.every(function (element, index) {
    r.push({
      lng: element[0],
      lat: element[1]
    });
    return true;
  });
  return r;
}

//Array of 2 size (long, lat) converted to an array of [lng, lat] - an array of arrays of 2 elems
function stringToCoordArray(array) {
  let r = [];
  array.every(function (element, index) {
    r.push(Object.values(element));
    return true;
  });
  return r;
}

//filename standing for output filename
function combinedDataForNestsAndLands(datapath1, datapath2, filename) {
  let region;
  let department;
  if (filename != "") {
    let options = {
      encoding: "utf-8",
      flag: "r"
    };
    let data1stream = fs.readFileSync(datapath1, options);
    let data2stream = fs.readFileSync(datapath2, options);
    let data3stream = fs.readFileSync("../regions.geojson", options);
    let data4stream = fs.readFileSync("../departements.geojson", options);

    let landlist = [];

    let tempdata1 = JSON.parse(data1stream);
    let tempdata2 = JSON.parse(data2stream);
    region = JSON.parse(data3stream).features;
    department = JSON.parse(data4stream).features;
    let tempdata3;

    //First, we parse data from Lands then we store it in the LandList item.
    if (
      tempdata1.every(function (element, index) {
        landlist.push({
          id: "" + index,
          geometry: {
            type: element.geometry.type,
            coordinates: coordArrayToString(element.geometry.coordinates[0])
          },
          properties: {
            country: "France",
            dep: 0,
            region: { code: 00, name: "N/A" },
            geoType: element.properties.geoType,
            family: element.properties.family,
            nests: [],
            neighbours: []
          }
        });
        console.log("processing the entry N°" + index + " on datastream N°1");
        return true;
      })
    ) {
      console.log(
        "End processing Lands for parsing, start processing region/dep/neighbours"
      );
    } else {
      console.log("unexpected behaviour in processing lands data");
    }

    //Compute region,department and neighbours for each node.
    if (
      landlist.every(function (elem, index) {
        console.log("Processing Lands N°" + elem.id);
        elem.properties.neighbours =  calculateNeighbours(elem, landlist);
        region.some(function (elem2, index2) {
          if (LandWithinPolygon(elem, elem2).features.length > 0) {
            elem.properties.region.name = elem2.properties.nom;
            elem.properties.region.code = elem2.properties.code;
            return true;
          }
          return false;
        });
        department.some(function (elem2, index2) {
          if (LandWithinPolygon(elem, elem2).features.length > 0) {
            elem.properties.dep = elem2.properties.code;
            return true;
          }
          return false;
        });
        return true;
      })
      
    ) {
      console.log(
        "End processing region/dep/neighbours for parsing, start processing Nest"
      );
    } else {
      console.log("unexpected behaviour in processing region/dep data");
    }

    //Second, we processing each nest, searching for each the most accurate land to attach it, then insert it in a
    //matching category, or create one if none match.
    if (
      tempdata2.features.every(function (element, index) {
        console.log("Treating the nest N°" + index);
        let landID = NearestPolygon(element.geometry.coordinates, landlist);
        landlist.some(function (land, index) {
          if (land.id == landID) {
            if (
              !land.properties.nests.some(function (nest, index) {
                if (
                  nest.year == element.properties.Year &&
                  nest.species == element.properties.species
                ) {
                  nest.count = nest.count + 1;
                  return true;
                } else {
                  return false;
                }
              })
            ) {
              land.properties.nests.push({
                year: element.properties.Year,
                species: element.properties.species,
                count: 1
              });
            }
            return true;
          }

          return false;
        });

        return true;
      })
    ) {
      console.log(
        "End processing Nest, writting down the merged data file under " +
        filename +
        " name"
      );
    } else {
      console.log("unexpected behaviour in processing nest data");
    }

    options = {
      encoding: "utf-8",
      flag: "w"
    };

    let writeStream = fs.createWriteStream(filename, options);

    writeStream.write("[");
    landlist.every(function (land, index) {
      if (index == landlist.length - 1) {
        tempdata3 = JSON.stringify(land);
      } else {
        tempdata3 = JSON.stringify(land) + ",";
      }
      writeStream.write(tempdata3);
      return true;
    });
    writeStream.write("]");
    writeStream.on("close", function () {
      console.log("Write stream is closed. ");
    });

    console.log("combinedData for Nests and Lands have finished sucessfully");
  } else {
    console.log("Invalid parameter for function combinedData: empty filename");
  }
}

function setRegionAndDepForCustomFormat(filename) {
  if (filename != "") {
    let options = {
      encoding: "utf-8",
      flag: "r"
    };
    let data1stream = fs.readFileSync(filename, options);
    let data2stream = fs.readFileSync("../regions.geojson", options);
    let data3stream = fs.readFileSync("../departements.geojson", options);
    let lands = JSON.parse(data1stream);
    let region = JSON.parse(data2stream).features;
    let department = JSON.parse(data3stream).features;

    lands.every(function (elem, index) {
      console.log("Processing Lands N°" + elem.id);
      region.some(function (elem2, index2) {
        if (LandWithinPolygon(elem, elem2).features.length > 0) {
          elem.properties.region.name = elem2.properties.nom;
          elem.properties.region.code = elem2.properties.code;
          return true;
        }
        return false;
      });
      department.some(function (elem2, index2) {
        if (LandWithinPolygon(elem, elem2).features.length > 0) {
          elem.properties.dep = elem2.properties.code;
          return true;
        }
        return false;
      });

      return true;
    });

    options = {
      encoding: "utf-8",
      flag: "w"
    };

    let writeStream = fs.createWriteStream(filename, options);

    writeStream.write("[");
    lands.every(function (land, index) {
      if (index == lands.length - 1) {
        tempdata3 = JSON.stringify(land);
      } else {
        tempdata3 = JSON.stringify(land) + ",";
      }
      writeStream.write(tempdata3);
      return true;
    });
    writeStream.write("]");
    writeStream.on("close", function () {
      console.log("Write stream is closed. ");
    });

    console.log("combinedData for Nests and Lands have finished sucessfully");
  } else {
    console.log("Invalid parameter for function combinedData: empty filename");
  }
}

//Adding the list of 10 nearest neighbours for each nest
function addNeighbours(filename, outfile){
  if (filename != "") {
      let options = {
        encoding: "utf-8",
        flag: "r"
      };
      let datastream = fs.readFileSync(filename, options);
      let combinedData = JSON.parse(datastream);

      combinedData.every(function(elem, index){
          console.log("Processing Land N°"+elem.id);
          elem.properties.neighbours =  calculateNeighbours(elem, combinedData);
          return true;
      });

      options = {
          encoding: "utf-8",
          flag: "w"
      };
      let writeStream = fs.createWriteStream(outfile, options);

      writeStream.write("[");
      combinedData.every(function(elem, index){
          tempdata = JSON.stringify(elem);
          if(index < combinedData.length - 1)
              tempdata += ",";
          writeStream.write(tempdata);
          return true;
      });
      writeStream.write("]");
      writeStream.on("close", function(){
          console.log("Write stream is closed.");
      });

      console.log("Update of neighbouring lands finished sucessfully");
  } else {
      console.log("Invalid parameter for function combinedData: empty filename");
  }
}

/*         SCRIPT ZONE          */
combinedDataForNestsAndLands("../Lands.json", "../Nest.json", "../FinalData.json");
// combinedDataForNestsAndLands("../tests/LandsTest.json", "../tests/NestTest.json", "../tests/FinalDataTest.json");
