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


function getRouteStops(response, start) {
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

  var legs = response.routes[0].legs;


  for (i=0;i<legs.length;i++) {
    var end_loc = [legs[i].end_location.lat(), legs[i].end_location.lng()];
    var elements = [[11.333112, 22.655543], [35.31231, 33.2232], [122352, 343421]],
    search_element = [32.1113, 34.5433];
    route.push(allNames[all.indexOf(findClosestPair(all,end_loc))])
  }


  for (i=0;i<route.length;i++) {
    var node=document.createElement("LI");
    var textnode=document.createTextNode(route[i]);
    node.appendChild(textnode);
    document.getElementById("rute").appendChild(node);
  }
  
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
  
  var currRoute = []
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
      getRouteStops(response, startName);
    }).catch((e) => window.alert("Directions request failed due to " + status));
      const route = response.routes[0];
}

window.initMap = initMap();