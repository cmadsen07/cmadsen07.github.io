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

function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  var all = [[56.15832592879012, 10.197811869512595], 
              [56.158965236429026, 10.201105621938014], 
              [56.14595066379803, 10.193434446243746]];
  const waypts = []
  var start = document.getElementById("start").value;
  var num = document.getElementById("num").value;
  const startArr = start.split(',').map(element => {
    return Number(element);
  });
  console.log(num - 1)
  while (waypts.length < num - 2) {
    rand_num = Math.floor(Math.random() * all.length);
    if (arrayEquals(startArr, all[rand_num])) {
      rand_num = Math.floor(Math.random() * all.length);
    } else {
      waypts.push({
        location: new google.maps.LatLng(all[rand_num][0], all[rand_num][1]),
        stopover: true,
      });
      all.splice(rand_num, 1)
    }
  }
  var end = start;
 rand_num = Math.floor(Math.random() * all.length);
  if (arrayEquals(startArr, all[rand_num])) {
    rand_num = Math.floor(Math.random() * all.length);
  } else {
    var end = new google.maps.LatLng(all[rand_num][0], all[rand_num][1])
    all.splice(rand_num, 1)
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
    }).catch((e) => window.alert("Directions request failed due to " + status));
      const route = response.routes[0];

  all = [[56.15832592879012, 10.197811869512595], 
              [56.158965236429026, 10.201105621938014], 
              [56.14595066379803, 10.193434446243746]];
}

window.initMap = initMap();