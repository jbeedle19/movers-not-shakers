// Variables:
// Variable to store Weather API Key
var weatherApiKey = "f6fb688c99006ae63bed987a2574a6d4";


function initMap() {
  // Styles a map in night mode.
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 8,
    center: { lat: 40.674, lng: -73.945},
    MapTypeId: "terrain",
  });
  
    const geocoder = new google.maps.Geocoder();
  document.getElementById("search-btn").addEventListener("click", () => {
    geocodeAddress(geocoder, map);
  });

//Heat the map 
const script = document.createElement("script");
script.src = "https://developers.google.com/maps/documentation/javascript/examples/json/earthquake_GeoJSONP.js";
document.getElementsByTagName("head")[0].appendChild(script);

function eqfeed_callback(results) {
    var heatmapData = [];
    console.log("this works")
    // for (var i = 0; i &lt; results.features.length; i++) {
    //   var coords = results.features[i].geometry.coordinates;
    //   var latLng = new google.maps.LatLng(coords[1], coords[0]);
    //   heatmapData.push(latLng);
    // }
    var latLng = new google.maps.LatLng(40.674, -73.945);
    console.log (results.latitude)
    heatmapData.push(latLng);
    var heatmap = new google.maps.visualization.HeatmapLayer({
      data: heatmapData,
      dissipating: false,
      map: map
    });
    console.log ("finished", heatmap)
  }
    // Centers map for new users to their current location
    infoWindow = new google.maps.InfoWindow;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (p) {
            var position = {
                lat: p.coords.latitude,
                lng: p.coords.longitutde
            };
            eqfeed_callback (p.coords)
            infoWindow.setPosition(position);
            infoWindow.setContent('Your location');
            infoWindow.open(map);
        }, function () {
            handleLocationError('Geolocation service failed', map.center());
        })      
    } else {
        handleLocationError('No geolocation available', map.center());
  } 
      //Search for new places 
    var input = document.getElementById('search-term');
    var searchBox = new google.maps.places.SearchBox(input);

    //Looks for areas close to their location first 
    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });
    
    //shows search results on map
    var markers = [];
    
    //Selects places predicted from searchbox
    searchBox.addListener('places_changes', function () {
        var places = searchBox.getPlaces();

        if (places.length === 0)
            return;
         
         //clears out previous markers
        markers.forEach(function (m) { m.setMap(null); });
        markers = [];

        //Coordinate boundaries of map
        var bounds = new google.maps.LatLngBounds();
        
        places.forEach(function (p) {
            if (!p.geometry)
                return;
            
            markers.push(new google.maps.Marker({
                map: map,
                title: p.name,
                position: p.geometry.location
            }));

            if (p.geometry.viewport)
                bounds.union(p.geometry.viewport);
            else
                bounds.extend(p.geometry.location);
        });
        map.fitBounds(bounds);
    });
}
initMap()     

// // // Location error function 
function handleLocationError(content, position) {
    infoWindow.setPosition(position); 
    infowWindow.setContent(content);
    infoWindow.open(map);
}

function geocodeAddress(geocoder, resultsMap) {
  const address = document.getElementById("search-term").value;
  geocoder.geocode({ address: address }, (results, status) => {
    if (status === "OK") {
        console.log (results,"ARRAY")
      resultsMap.setCenter(results[0].geometry.location);
      new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location,
      });
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
}
  


//Function for displaying Current Weather
function currentWeather(city) {
    var apiURLCurrent =  "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + weatherApiKey;
    fetch(apiURLCurrent)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(response) {
                var iconCode = response.weather[0].icon;
                var iconURL = "https://openweathermap.org/img/wn/" + iconCode + ".png";
                var currentTemp = response.main.temp + "°F";
                var iconTempHTML = '<p class="subtitle" id="icon-container"><img id="weatherIcon" src="' + iconURL + '"/></p>' +
                                   '<p class="subtitle" id="temp">' + currentTemp + '</p>'; 
                    $('#icon-container').remove();
                    $('#temp').remove();
                    $("#weather-container").append(iconTempHTML);
            });
            } else {
                alert("Error: " + response.statusText);
            }
        })
        .catch(function(error) {
            alert("Unable to connect to Weather Report");
        });
  };

function currentWeather(city) {
    var apiURLCurrent =  "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + weatherApiKey;
    fetch(apiURLCurrent)
        .then(function(response) {
            if (response.ok) {
                response.json().then(function(response) {
                var iconCode = response.weather[0].icon;
                var iconURL = "http://openweathermap.org/img/wn/" + iconCode + ".png";
                var currentTemp = response.main.temp + "°F";
                var iconTempHTML = '<p class="subtitle" id="icon-container"><img id="weatherIcon" src="' + iconURL + '"/></p>' +
                                   '<p class="subtitle" id="temp">' + currentTemp + '</p>'; 
                    $('#icon-container').remove();
                    $('#temp').remove();
                    $("#weather-container").append(iconTempHTML);
            });
            } else {
                alert("Error: " + response.statusText);
            }
        })
        .catch(function(error) {
            alert("Unable to connect to Weather Report");
        });
  };


// Function to load anything that was saved in localStorage
function loadStorage() {
  if (lastSearch === '') {
    return;
  } else {
    $("#search-term").val(lastSearch);
    currentWeather(lastSearch);
    console.log(lastSearch);
  } 
}
loadStorage();

// Event Listeners:
// Listens for search to be clicked and runs currentWeather
$("#search-btn").on("click", function(event) {
    event.preventDefault();
    var searchTerm = $("#search-term").val();
    localStorage.setItem("search", searchTerm);
    currentWeather(searchTerm);
})
