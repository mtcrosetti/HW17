var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Query url to retrieve earthquake data
d3.json(url, function(data) {
    mapFeatures(data.features);
  });
  
  // Create function to make map 
  function mapFeatures(quakeData) {
    
    // Create popup and info inside
    function onEachFeature(feature, layer) {
      var dateString2 = moment(feature.properties.time).format('MMMM Do YYYY, h:mm:ss a')  
      layer.bindPopup("<h2><center>" + feature.properties.place + 
        "</center></h2><hr><p><center>" + dateString2 + " (local time)" + "</center></p>" + 
        "</h3><hr><h3><p><center>Magnitude: " + feature.properties.mag + "</center></p></h3>");
    }
    // Create markers on the map  
    var quakes = L.geoJSON(quakeData, {
      onEachFeature: onEachFeature,
      pointToLayer: function (feature, latlng) {
        
        // Style the markers by color - weighted by quake magnitude
        var color;
        var quakeMag = Math.round(feature.properties.mag)
        var r = 255;
        var g = Math.floor(255-30*quakeMag);
        var b = Math.floor(255-30*quakeMag);
        color= "rgb("+r+" ,"+g+","+ b+")"
        
        // Style the markers - using circleMarker
        var markerCircles = {
          radius: 3.5*feature.properties.mag,
          fillColor: color,
          color: "black",
          weight: 1.5,
          opacity: 1,
          fillOpacity: 0.9
        };
        return L.circleMarker(latlng, markerCircles);
      }
    });
    // Display map
    makeMap(quakes);
  }
  // Create map base layer
  function makeMap(quakes) {
  
    var baselayer = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
      "access_token=pk.eyJ1IjoidHAwMDciLCJhIjoiY2ptbzN1aWRmMGo4ejNxbHU0eW56MmcwNyJ9.6b4WaJePjB_n2GWUdUj9TA");

    // Map starts at my house - don't be jealous that I live in the heart of San Leandro - no one else is
    var myMap = L.map("map", {
      center: [
        37.7248, -122.1556
      ],
      zoom: 15,
      layers: [baselayer, quakes]
    });
  
    // Create colors for the legend - make sure they match with formula from before (round the numbers)  
    function getColor(d) {
      return d < 1 ? 'rgb(255,225,225)' :
          d < 2  ? 'rgb(255,195,195)' :
          d < 3  ? 'rgb(255,165,165)' :
          d < 4  ? 'rgb(255,135,135)' :
          d < 5  ? 'rgb(255,105,105)' :
          d < 6  ? 'rgb(255,75,75)' :
          d < 7  ? 'rgb(255,45,45)' :
          d < 8  ? 'rgb(255,15,15)' :
                      'rgb(255,0,0)';
  
    }
    
    // Create the legend
    var legend = L.control({position: 'topright'});
  
    legend.onAdd = function (map) {
        
        // Create divisions for the legend to use
        var div = L.DomUtil.create('div', 'info legend'),
        divisions = [0, 1, 2, 3, 4, 5, 6, 7];
      
        // Using innerHTML for first time to create the legend in a static position
        div.innerHTML+='<strong>Magnitude</strong><br><hr>'
    
        for (var i = 0; i < divisions.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(divisions[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
                divisions[i] + (divisions[i + 1] ? '&ndash;' + divisions[i + 1] + '<br>' : '+');
    }
    
    return div;
    };
    
    legend.addTo(myMap);
  
  }

  

