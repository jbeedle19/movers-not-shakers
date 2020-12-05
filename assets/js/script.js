// Variables:
var map, infoWindow;



// Functions:

// Creating map
function createMap() {
    var options = {
        center: { lat: 39.9526, lng: -75.1652},
        zoom: 10
    };

    map = new google.maps.Map(document.getElementById('map'), options);
    // Centers map for new users to their current location
    infoWindow = new google.maps.InfoWindow;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (p) {
            var position = {
                lat: p.coords.latitude,
                lng: p.coords.longitutde
            };
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

// Location error function 
function handleLocationError(content, position) {
    infoWindow.setPosition(position); 
    infowWindow.setContent(content);
    infoWindow.open(map);
}


// Event Listeners:
// Placeholder listener to test Search Field
$("#search-btn").on("click", function(event) {
    event.preventDefault();
    var searchTerm = $("#search-term").val();
    console.log(searchTerm);
    // Need to get value from whatever was selected in dropdown
    var timeframe = $(".opt-3").val();
    console.log(timeframe)
})
