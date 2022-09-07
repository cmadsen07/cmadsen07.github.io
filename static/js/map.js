function initMap() {
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();
  var katrinebjerg = new google.maps.LatLng(56.17201368939738, 10.19168180572234)
  var mapProp= {
    center:katrinebjerg,
    zoom:15,
  };
  var map = new google.maps.Map(document.getElementById("googleMap"),mapProp);
  directionsRenderer.setMap(map);
  document.getElementById("submit").addEventListener("click", () => {
    calculateAndDisplayRoute(directionsService, directionsRenderer);
  });
  document.getElementById("submitRegen").addEventListener("click", () => {
    let regenText = document.getElementById("regenText").value;
    regenRoute(directionsService, directionsRenderer, regenText);
  });
}

function remove(array, element) {
  const index = array.indexOf(element);

  if (index !== -1) {
    array.splice(index, 1);
  }
}

function arrayEquals(a, b) {
  return Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index]);
}

function closestIndex(numTemp, arr) {
    let num = parseFloat(numTemp);
    var curr = arr[0],
        diff = Math.abs(num - curr),
        index = 0;

    for (var val = 0; val < arr.length; val++) {
        let newdiff = Math.abs(num - arr[val]);
        if (newdiff < diff) {
            diff = newdiff;
            curr = arr[val];
            index = val;
        }
    }
    return index;
}

function findClosestPair(elements, search) {
    return elements.reduce(function (a, b) {
        function getDelta(v, w) {
            return Math.abs(v[0] - w[0]) * Math.abs(v[1] - w[1]);
        }                
        return getDelta(a, search) < getDelta(b, search) ? a : b;
    });
}

String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};


function getRouteStops(response, start, startNum) {
  let selectElement = document.querySelectorAll('[name=bodegalist]');
  var allTemp = [...selectElement[0].options].map(o => o.value);
  var all = []
  for (i=0;i<allTemp.length;i++) {
    var allTempSplit = allTemp[i].split(',').map(element => {
      return Number(element);
    });
    all.push(allTempSplit)
  }
  var allNames = [...selectElement[0].options].map(o => o.text);

  route = [];
  route.push(start);

  var routeNum = [];
  routeNum.push(startNum);

  var legs = response.routes[0].legs;


  for (i=0;i<legs.length;i++) {
    var end_loc = [legs[i].end_location.lat(), legs[i].end_location.lng()];
    let index = all.indexOf(findClosestPair(all,end_loc));
    route.push(allNames[index]);
    routeNum.push(index);
  }




  for (i=0;i<route.length;i++) {
    var node=document.createElement("LI");
    var textnode=document.createTextNode(route[i]);
    node.appendChild(textnode);
    document.getElementById("rute").appendChild(node);
  }
  document.getElementById("saveRoute").innerHTML = "Gem rute til senere: " + routeNum.toString();
}

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  document.getElementById("rute").innerHTML = "";

  let selectElement = document.querySelectorAll('[name=bodegalist]');
  var allTemp = [...selectElement[0].options].map(o => o.value);
  var all = []
  for (i=0;i<allTemp.length;i++) {
    var allTempSplit = allTemp[i].split(',').map(element => {
      return Number(element);
    });
    all.push(allTempSplit)
  }
  
  var e = document.getElementById("start");
  startName = e.options[e.selectedIndex].text

  const waypts = [];
  var start = document.getElementById("start").value;
  var num = document.getElementById("num").value;
  const startArr = start.split(',').map(element => {
    return Number(element);
  });
  while (waypts.length < num - 2) {
    rand_num = Math.floor(Math.random() * all.length);
    if (arrayEquals(startArr, all[rand_num])) {
      rand_num = Math.floor(Math.random() * all.length);
    } else {
      waypts.push({
        location: new google.maps.LatLng(all[rand_num][0], all[rand_num][1]),
        stopover: true,
      });
      all.splice(rand_num, 1);
    }
  }
  var end = start;
  while (end == start) {
 rand_num = Math.floor(Math.random() * all.length);
  if (arrayEquals(startArr, all[rand_num])) {
    rand_num = Math.floor(Math.random() * all.length);
  } else {
    var end = new google.maps.LatLng(all[rand_num][0], all[rand_num][1])
    all.splice(rand_num, 1);
  }
}

  
  if (end == start) {
    alert("Der er sket en fejl, prøv at genindlæse siden.");
    return
  }

  directionsService
    .route({
      origin: start,
      destination: end,
      waypoints: waypts,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.WALKING,
    })
    .then((response) => {
      directionsRenderer.setDirections(response);
      getRouteStops(response, startName, e.selectedIndex);
    }).catch((e) => window.alert("Directions request failed due to " + status));
      const route = response.routes[0];

}

function regenRoute(directionsService, directionsRenderer, routeString) {
  var routeArray = routeString.split(",").map(Number);
  let selectElement = document.querySelectorAll('[name=bodegalist]');
  var allTemp = [...selectElement[0].options].map(o => o.value);
  var all = []
  for (i=0;i<allTemp.length;i++) {
    var allTempSplit = allTemp[i].split(',').map(element => {
      return Number(element);
    });
    all.push(allTempSplit)
  }
  var allNames = [...selectElement[0].options].map(o => o.text);
  var currRoute = [];
  let startName = allNames[routeArray[0]];
  let startNum = routeArray[0];
  let start = new google.maps.LatLng(all[routeArray[0]][0], all[routeArray[0]][1]);
  routeArray.splice(0, 1);
  let end = new google.maps.LatLng(all[routeArray[routeArray.length-1]][0],all[routeArray[routeArray.length-1]][1]);
  routeArray.splice(routeArray.length-1,1);
  for (i=0;i<routeArray.length;i++) {
    currRoute.push({
      location: new google.maps.LatLng(all[routeArray[i]][0], all[routeArray[i]][1]),
      stopover: true,
    });
  }



  directionsService
    .route({
      origin: start,
      destination: end,
      waypoints: currRoute,
      optimizeWaypoints: true,
      travelMode: google.maps.TravelMode.WALKING,
    })
    .then((response) => {
      directionsRenderer.setDirections(response);
      getRouteStops(response, startName, startNum);
    }).catch((e) => window.alert("Directions request failed due to " + status));
      const route = response.routes[0];
}

window.initMap = initMap();