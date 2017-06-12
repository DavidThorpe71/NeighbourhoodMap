// Model
var initialLocations = [
	{
		name: 'Mangal 2',
		location: {lat: 51.5498958, lng: -0.0755666}
	},
	{
		name: 'Dukes Brew & Que',
		location: {lat: 51.5389873, lng: -0.0807314}
	},
	{
		name: 'Honest Burgers - Dalston',
		location: {lat: 51.5487942, lng: -0.0765496}
	},
	{
		name: 'Berber & Q - Grill House',
		location: {lat: 51.5368819, lng: -0.0759053}
	},
	{
		name: 'Rudies',
		location: {lat: 51.5517604, lng: -0.0752843}
	}
];

function Location(data) {
	var self = this;
	self.name = ko.observable(data.name);
}

// View Model
var LocationsViewModel = function() {
	var self = this;

	this.locationList = ko.observableArray([]);

	initialLocations.forEach(function(locationItem) {
		self.locationList.push( new Location(locationItem) );
	});

	this.currentLocation = ko.observable( this.locationList()[0] )

	this.setLocation = function(clickedLocation) {
		self.currentLocation(clickedLocation);
		console.log(clickedLocation.name);
	};
};




ko.applyBindings(new LocationsViewModel());

// Maps API
var map;

var markers = [];

function initMap() {
	// Styles taken from Snazzy Maps: https://snazzymaps.com/style/77/clean-cut
	var styles = [
	    {
	        "featureType": "road",
	        "elementType": "geometry",
	        "stylers": [
	            {
	                "lightness": 100
	            },
	            {
	                "visibility": "simplified"
	            }
	        ]
	    },
	    {
	        "featureType": "water",
	        "elementType": "geometry",
	        "stylers": [
	            {
	                "visibility": "on"
	            },
	            {
	                "color": "#C6E2FF"
	            }
	        ]
	    },
	    {
	        "featureType": "poi",
	        "elementType": "geometry.fill",
	        "stylers": [
	            {
	                "color": "#C5E3BF"
	            }
	        ]
	    },
	    {
	        "featureType": "road",
	        "elementType": "geometry.fill",
	        "stylers": [
	            {
	                "color": "#D1D1B8"
	            }
	        ]
	    }
	];

	map = new google.maps.Map(document.getElementById('map'), {
    	center: {lat: 51.546207, lng: -0.075643},
        zoom: 14,
        styles: styles
    });

    var largeInfowindow = new google.maps.InfoWindow();
     
    function createMarker(position, title) {
    	position = initialLocations[i].location;
    	title = initialLocations[i].name;
    	var marker = new google.maps.Marker({
    		map: map,
    		position: position,
    		title: title,
    		animation: google.maps.Animation.DROP,
    	});
	
		google.maps.event.addListener(marker, 'click', function() {
  			toggleBounce(marker);
  			infowindow.open(map, this);
		});
		return marker;
	}

	for (var i = 0; i < initialLocations.length; i++) {
		initialLocations[i].marker = createMarker(initialLocations[i].location, initialLocations[i].name);
	}   

}




// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
      	// Clear the infowindow content to give the streetview time to load.
      	infowindow.setContent('');
      	infowindow.marker = marker;
      	// Make sure the marker property is cleared if the infowindow is closed.
      	infowindow.addListener('closeclick', function() {
        	infowindow.marker = null;
     	 });
      	
     	// Open the infowindow on the correct marker.
      	infowindow.open(map, marker);
   	}
}




function toggleBounce(marker) {
	if (marker.getAnimation() !== null) {
			marker.setAnimation(null);
	} else {
	    marker.setAnimation(google.maps.Animation.BOUNCE);
	}
}

	        

