// Model



// View Model

var ViewModel = function() {

}

ko.applyBindings(new ViewModel());

// Maps API

var map;

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
    	center: {lat: 51.546207, lng: -0.075643},
        zoom: 13,
    });
}