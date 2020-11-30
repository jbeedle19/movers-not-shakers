// Variables:
var map, infoWindow;



// Functions:

function createMap() {
    var options = {
        center: { lat: 39.9526, lng: -75.1652},
        zoom: 10
    };

    map = new google.maps.Map(document.getElementById('map'), options);

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
}

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
    var timeframe = $(".option").data("timeframe")
    console.log(timeframe)
})
