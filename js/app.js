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
        
    // The following group uses the location array to create an array of markers on initialize.
	for (var i = 0; i < initialLocations.length; i++) {
          // Get the position from the location array.
          var position = initialLocations[i].location;
          var title = initialLocations[i].name;
          // Create a marker per location, and put into markers array.
          var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i
          });

          google.maps.event.addListener(marker, 'click', function() {
          	toggleBounce(marker);
          })
          // Push the marker to our array of markers.
          markers.push(marker);
    }

    

  	function toggleBounce(marker) {
		if (marker.getAnimation() !== null) {
			marker.setAnimation(null);
		} else {
	    	marker.setAnimation(google.maps.Animation.BOUNCE);
	  	}
	}
   
    // This function will loop through the markers array and display them all.
    function showListings() {
        var bounds = new google.maps.LatLngBounds();
        // Extend the boundaries of the map for each marker and display the marker
        for (var i = 0; i < markers.length; i++) {
        	markers[i].setMap(map);
        	bounds.extend(markers[i].position);
        }
        map.fitBounds(bounds);
      }

    showListings();
}



