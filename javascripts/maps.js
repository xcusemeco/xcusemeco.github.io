var map;
var manhattan;
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();

function initialize() {
    directionsDisplay = new google.maps.DirectionsRenderer();
    manhattan = new google.maps.LatLng(40.7711329, -73.9741874);
    var mapOptions = {
        zoom: 13,
        center: manhattan,
        styles: [{
            "featureType": "administrative",
            "elementType": "labels",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "administrative.country",
            "elementType": "geometry.stroke",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "administrative.province",
            "elementType": "geometry.stroke",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "landscape",
            "elementType": "geometry",
            "stylers": [{
                "visibility": "on"
            }, {
                "color": "#ffffff"
            }]
        }, {
            "featureType": "landscape.natural",
            "elementType": "labels",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "poi",
            "elementType": "all",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "road",
            "elementType": "all",
            "stylers": [{
                "color": "#fa9e25"
            }]
        }, {
            "featureType": "road",
            "elementType": "labels",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "transit",
            "elementType": "labels.icon",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "transit.line",
            "elementType": "labels.text",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "transit.station.airport",
            "elementType": "geometry",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "transit.station.airport",
            "elementType": "labels",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{
                "color": "rgba(0,179,253,.1)"
            }]
        }, {
            "featureType": "water",
            "elementType": "labels",
            "stylers": [{
                "visibility": "off"
            }]
        }]
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('directions-panel'));

    var control = document.getElementById('control');
    // control.style.display = 'block';
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);

    loadExcuses();
}

function calcRoute() {
    clearRouting();
    var start = document.getElementById('start').value;
    var end = document.getElementById('end').value;
    console.log(start);
    console.log(end);
    var selectedMode = document.getElementById('mode').value;
    requestRoute(start, end, selectedMode);
}

function requestRoute(start, end, mode) {
  // Get directions from Google from start to end
  var minutesAlreadyExcused = minutesExcused;
  var request = {
    origin: start,
    destination: end,
    travelMode: google.maps.TravelMode[mode],
    waypoints: waypoints
  };

  // Add excuses to the suggested route. If we find one, it will be added to waypoints
  // and will add to the minutesExcused. We'll keep rerouting this way until we hit
  // the excuse threshold.
  directionsService.route(request, function (response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      embiggenRoute(response.routes[0]);
      if (minutesAlreadyExcused == minutesExcused) {
        directionsDisplay.setDirections(response);
        document.getElementById('intro').innerHTML = '';
        document.getElementById('intro').style.padding = "0px 0px 0px 0px";
      } else {
        requestRoute(start, end, mode);
      }
    }
  });
}

$("body").on("click", ".nav li", function () {
    $(this).addClass("active");
});
google.maps.event.addDomListener(window, 'load', initialize);
