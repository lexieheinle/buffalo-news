// Create the map and set it's opening coordinates and the zoom level
var mymap = L.map('mapid').setView([43.083637, -79.063493], 14);
//Add the MapBox title layer which is the map area to the map
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoibGhlaW5sZSIsImEiOiJHeXJXRng0In0.5Lhs-wZ06UQ3a7LfcRc9cg'
}).addTo(mymap);

//Array which holds the lat, long coordinates as well as the popup content for each marker
var markers = [
  [43.080911, -79.050708, "<img src='img/img2.jpg' class='img-responsive'> <p>The view greeting visitors approaching Niagara Falls State Park from the Niagara Scenic Parkway.<p /> "],
  [43.081197, -79.057489, "<img src='img/img4.jpg' class='img-responsive'><p>Visitors to Niagara Falls  this season find construction barriers and cones everywhere as they approach and enter Niagara Falls State Park.</p> "],
  [43.083637, -79.063493, "<img src='img/img11.jpg' class='img-responsive'><p>Visitors driving into Niagara Falls State Park pass construction cones on the new Riverway in the park.</p> "],
  [43.086175, -79.068599, "<img src='img/img20.jpg' class='img-responsive'><p>Visitors to the American side of the Falls this season are confronted at all turns by the unlovely evidence of construction.</p> "],
  [43.081932, -79.067716, "<img src='img/img22.jpg' class='img-responsive'><p> Construction cones and barrels mar the natural beauty of Goat Island.</p> "],
  [43.081491, -79.071362, "<img src='img/img25.jpg' class='img-responsive'><p>A construction fence  blocks views of the Bridal Veil Falls in Niagara Falls.</p> "],
  [43.080482, -79.071295, "<img src='img/img31.jpg' class='img-responsive'><p>A construction fence on Goat Island behind picnic tables near the Cave of the Winds ticket office blocks views of the Bridal Veil Falls.</p> "],
  [43.080694, -79.073231, "<img src='img/img37.jpg' class='img-responsive'><p>Joslin Streck of Oswego perches on a friend's shoulders to get a better photo  as a construction fence at Niagara Falls State Park blocks views of Terrapin Point and the Horseshoe Falls.</p> "],
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
