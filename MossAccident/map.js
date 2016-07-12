// Create the map and set it's opening coordinates and the zoom level
var mymap = L.map('mapid').setView([42.712841, -78.957321], 10);
//Add the MapBox title layer which is the map area to the map
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoibGhlaW5sZSIsImEiOiJHeXJXRng0In0.5Lhs-wZ06UQ3a7LfcRc9cg'
}).addTo(mymap);

//Array which holds the lat, long coordinates as well as the popup content for each marker
var markers = [
  [42.641626, -79.066523, "<img src='img/img1.jpg' class='img-responsive'> <p>Ballowe's SUV was seen pulling into South Shore Beach Club in Angola the night of the hit-and-run.<p /> "],
  [42.654741, -79.037253, "<img src='img/img2.jpg' class='img-responsive'><p>Site of the hit-and-run accident in Evans that killed Barry 'Bob' Moss.</p> "],
  [42.650533, -79.061219, "<p>Ballowe's SUV was seen running a stop sign at this intersection.</p> "],
  [42.783832, -78.849317, "<p>Gabriele Ballowe was seen getting into her SUV from the Rust Belt Bar and Grill on Route 5 on Dec. 22, 2013.</p> "],
  [42.477966, -79.334746, "<p>Ballowe took her damaged SUV to a collision shop in Dunkirk hours after the early morning hit-and-run.</p> "],
]

//Loop through the markers array to build the chart
         for (var i=0; i<markers.length; i++) {
            var lon = markers[i][1];
            var lat = markers[i][0];
            var popupText = markers[i][2];
             var markerLocation = new L.LatLng(lat, lon);
             var markered = new L.Marker(markerLocation).addTo(mymap);
             markered.bindPopup(popupText);
         }

//This allows resonpsive element
var pymChild = new pym.Child();
