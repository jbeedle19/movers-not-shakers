//mobile CSS
const burgerIcon = document.querySelector("#burger");
const navbarMenu = document.querySelector("#nav-links");
burgerIcon.addEventListener("click", () => {
  navbarMenu.classList.toggle("is-active");
});
// Variables:
// Variable to store Weather API Key
var weatherApiKey = "f6fb688c99006ae63bed987a2574a6d4";

// Variable for localStorage and last searched item
var lastSearch = localStorage.getItem("search") || "";

function initMap() {
  // Styles a map in night mode.
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 40.674, lng: -73.945 },
    zoom: 7,
    styles: [
      { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
      {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
      },
      {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }],
      },
      {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
      },
    ],
  });

  const geocoder = new google.maps.Geocoder();
  $("#search-btn").on("click", () => {
    geocodeAddress(geocoder, map);
  });
  
  const script = document.createElement("script");
  script.setAttribute(
    "src",
    "https://storage.googleapis.com/mapsdevsite/json/quakes.geo.json"
  );
  document.getElementsByTagName("head")[0].appendChild(script);
  // Add a basic style.
  map.data.setStyle((feature) => {
    const mag = Math.exp(parseFloat(feature.getProperty("mag"))) * 0.1;
    return /** @type {google.maps.Data.StyleOptions} */ {
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: mag,
        fillColor: "#f00",
        fillOpacity: 0.35,
        strokeWeight: 0,
      },
    };
  });

  // Defines the callback function referenced in the jsonp file.
  function eqfeed_callback(data) {
    map.data.addGeoJson(data);
  }

  //Search for new places
  var input = document.getElementById("search-term");
  var searchBox = new google.maps.places.SearchBox(input);

  //Looks for areas close to their location first
  map.addListener("bounds_changed", function () {
    searchBox.setBounds(map.getBounds());
  });

  //shows search results on map
  var markers = [];

  //Selects places predicted from searchbox
  searchBox.addListener("places_changes", function () {
    var places = searchBox.getPlaces();

    if (places.length === 0) return;

    //clears out previous markers
    markers.forEach(function (m) {
      m.setMap(null);
    });
    markers = [];

    //Coordinate boundaries of map
    var bounds = new google.maps.LatLngBounds();

    places.forEach(function (p) {
      if (!p.geometry) return;

      markers.push(
        new google.maps.Marker({
          map: map,
          title: p.name,
          position: p.geometry.location,
        })
      );

      if (p.geometry.viewport) bounds.union(p.geometry.viewport);
      else bounds.extend(p.geometry.location);
    });
    map.fitBounds(bounds);
  });
}

function eqfeed_callback(data) {
  map.data.addGeoJson(data);
}

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
      resultsMap.setCenter(results[0].geometry.location);
      new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location,
      });
    } else {
      $("html").addClass("is-clipped");
      $("#error-modal").addClass("is-active");
      $("#error").text(
        "Geocode was not successful for the following reason: " + status
      );
    }
  });
}

//Function for displaying Current Weather
function currentWeather(city) {
  var apiURLCurrent =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=imperial&appid=" +
    weatherApiKey;
  fetch(apiURLCurrent)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (response) {
          var iconCode = response.weather[0].icon;
          var iconURL =
            "https://openweathermap.org/img/wn/" + iconCode + ".png";
          var currentTemp = response.main.temp + "°F";
          var iconTempHTML =
            '<p class="subtitle has-text-centered is-large" id="icon-container"><img id="weatherIcon" src="' +
            iconURL +
            '"/></p>' +
            '<p class="subtitle has-text-centered is-large" id="temp">' +
            currentTemp +
            "</p>";
          $("#icon-container").remove();
          $("#temp").remove();
          $("#weather-container").append(iconTempHTML);
        });
      } else {
        $("html").addClass("is-clipped");
        $("#error-modal").addClass("is-active");
        $("#error").text(
          "Not able to find weather for specific location. Please enter city, state or country."
        );
      }
    })
    .catch(function (error) {
      $("html").addClass("is-clipped");
      $("#error-modal").addClass("is-active");
      $("#error").text("Unable to connect to Weather Report");
    });
}

// Function to load anything that was saved in localStorage
function loadStorage() {
  if (lastSearch === "") {
    return;
  } else {
    $("#search-term").val(lastSearch);
    currentWeather(lastSearch);
    setTimeout(function () {
      $("#search-btn").click();
    }, 100);
  }
}

// Event Listeners:
// Listens for search to be clicked and runs currentWeather
$("#search-btn").on("click", function (event) {
  event.preventDefault();
  var searchTerm = $("#search-term").val();
  localStorage.setItem("search", searchTerm);
  currentWeather(searchTerm);
});
// closes error modal
$("#close").on("click", function (event) {
  event.preventDefault();
  $("html").removeClass("is-clipped");
  $("#error-modal").removeClass("is-active");
});

$(document).ready(function() {
  console.log('ready!')
  loadStorage();
  initMap();
});