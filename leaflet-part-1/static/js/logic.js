// Gather data
const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson';
let eq_data = {};

d3.json(url).then(function(data){
    // Store data
    eq_data = data.features;
    map_creation(eq_data);
})

function map_creation(eq_data) {    
// Create a map
    let myMap = L.map("map", {
        center: [
            30, -99.1526775
        ],
        zoom: 4.4,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);

// Loop through data and create markers for each earthquake
    for (let i = 0; i< eq_data.length; i++) {

        // Variables creation:
        let c_color = 'turquoise';
        let depth = eq_data[i].geometry.coordinates[2];
        let long = eq_data[i].geometry.coordinates[0];
        let lat = eq_data[i].geometry.coordinates[1];
        let eq_loc = [lat, long]
        let eq_radius = eq_data[i].properties.mag * 25000;

        // Conditionals for circle color:
        if (depth <= 10) {
            c_color = 'yellowgreen';
        }
        else if (depth > 10 && depth < 30) {
            c_color = "gold";
        }      
        else if (depth > 30 && depth < 50) {
            c_color = "orange";
        }
        else if (depth > 50 && depth < 70) {
            c_color = "darkorange";
        }
        else if (depth > 70 && depth < 90) {
            c_color = "orangered";
        }
        else if (depth > 90) {
            c_color = "red";
        }

        // Add circles to map
        L.circle(eq_loc, {
            fillOpacity: 0.75,
            color: c_color,
            fillColor: c_color,
            radius: eq_radius 
        }).bindPopup(`<h3>${eq_data[i].properties.place}</h3> <hr> <h3>Magnitude: ${eq_data[i].properties.mag}</h3>`).addTo(myMap);
    }
// Map Legend:

var legend = L.control({ position: "bottomleft" });

legend.onAdd = function(myMap) {
  const div = L.DomUtil.create("div", "legend");
  div.innerHTML += "<h3>Earthquake depth</h3>";
  div.innerHTML += '<i style="background:yellowgreen"></i> < 10 <br>';
  div.innerHTML += '<i style="background:gold"></i> 10 - 30 <br>';
  div.innerHTML += '<i style="background:orange"></i> 30 - 50 <br>';
  div.innerHTML += '<i style="background:darkorange"></i> 50 - 70 <br>';
  div.innerHTML += '<i style="background:orangered"></i> 70 - 90 <br>';
  div.innerHTML += '<i style="background:red"></i> > 90 <br>';

  return div;
};
legend.addTo(myMap);
}
