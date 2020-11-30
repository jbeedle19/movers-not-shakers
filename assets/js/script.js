// Variables:
var map;



// Functions:

function createMap() {
    var options = {
        center: { lat: 39.9526, lng: -75.1652},
        zoom: 10
    };

    map = new google.maps.Map(document.getElementById('map'), options);
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
