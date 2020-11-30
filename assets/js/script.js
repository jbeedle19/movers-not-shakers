// Variables:



// Functions:

// Event Listeners:
// Placeholder listener to test Search Field
$("#search-btn").on("click", function(event) {
    event.preventDefault();
    var searchTerm = $("#search-term").val();
    console.log(searchTerm);
    var timeframe = $("#timeframe").val();
    console.log(timeframe)
})
