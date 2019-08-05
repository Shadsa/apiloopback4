var fs = require("fs");
var turf = require("@turf/turf");

const NBNEIGHBOURS = 10;

//Array of 2 size (long, lat) converted to an array of [lng, lat] - an array of arrays of 2 elems
function stringToCoordArray(array) {
    let r = [];
    array.every(function (element, index) {
        r.push(Object.values(element));
        return true;
    });
    return r;
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

//Adding the list of 10 nearest neighbours for each nest
function addNeighbours(filename, outfile) {
    if (filename != "") {
        let options = {
            encoding: "utf-8",
            flag: "r"
        };
        let datastream = fs.readFileSync(filename, options);
        let combinedData = JSON.parse(datastream);

        combinedData.every(function (elem, index) {
            console.log("Processing Land N°" + elem.id);
            elem.properties.neighbours = calculateNeighbours(elem, combinedData);
            return true;
        });

        options = {
            encoding: "utf-8",
            flag: "w"
        };
        let writeStream = fs.createWriteStream(outfile, options);

        writeStream.write("[");
        combinedData.every(function (elem, index) {
            tempdata = JSON.stringify(elem);
            if (index < combinedData.length - 1)
                tempdata += ",";
            writeStream.write(tempdata);
            return true;
        });
        writeStream.write("]");
        writeStream.on("close", function () {
            console.log("Write stream is closed.");
        });

        console.log("Update of neighbouring lands finished sucessfully");
    } else {
        console.log("Invalid parameter for function combinedData: empty filename");
    }
}

//addNeighbours("../tests/combinedDataTest0.json", "../tests/finalDataTest0.json");
// addNeighbours("../tests/combinedDataTest1.json", "../tests/finalDataTest1.json");
//addNeighbours("../tests/combinedDataTest2.json", "../tests/finalDataTest2.json");
//addNeighbours("../tests/combinedDataTest3.json", "../tests/finalDataTest3.json");
addNeighbours("../tests/combinedDataTest4.json", "../tests/finalDataTest4.json");