// locations
var locations = [
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


// this function creates the locations
function Location(data) {
	var self = this;
	self.name = ko.observable(data.name);
	self.location = ko.observable(data.location);
}

function query(data) {
	var self = this;
	self.query = ko.observable()
}

// View Model
var viewModel = function() {
	var self = this;

	// creates an array for storing locations
	self.locationList = ko.observableArray([]);

	//Look into using a Knockout.js computed observable to store the locations
	//that will be shown in the list view. A computed observable is dependent 
	// on one or more observables, and automatically updates whenever any of 
	// these dependencies change. You can make it depedent on your query 
	// observable and the function will automatically update the list view 
	// whenever the query value changes 

	// sets the current location onclick
	self.currentLocation = ko.observable( self.locationList()[0] )

	// self.setLocation = function(clickedLocation) {
	// 	self.currentLocation(clickedLocation);
	// 	// prints currentLocation to the console
	// 	console.log(clickedLocation.name);
	// };

	self.filter = ko.observable("");

	self.filteredItems = ko.computed(function() {
		var query = self.filter().toLowerCase();
	    if (!query) {
	        return self.locationList();
	    } else {
	        return ko.utils.arrayFilter(self.locationList(), function(item) {
	            return locations.indexOf(query) > -1 ;
	        });

	    }
	});
	// pushes each location into locationList array
	locations.forEach(function(item) {
		self.locationList.push( new Location(item) );
	});


	

	// google.maps.filteredItems.Marker
	// this.filteredItems = ko.computed(function() {
	// 	var filter = this.filter().toLowerCase();
	// 	if (!filter) {
	// 		return this.items();
	// 	} else {
	// 		return ko.utils.indexOf()
	// 		})
	// 	}
	// })
};


ko.applyBindings(new viewModel());

// Maps API
var map;

var markers = [];

function initMap() {
	// Styles taken from Snazzy Maps: https://snazzymaps.com/style/77/clean-cut
	// var styles = [
	//     {
	//         "featureType": "road",
	//         "elementType": "geometry",
	//         "stylers": [
	//             {
	//                 "lightness": 100
	//             },
	//             {
	//                 "visibility": "simplified"
	//             }
	//         ]
	//     },
	//     {
	//         "featureType": "water",
	//         "elementType": "geometry",
	//         "stylers": [
	//             {
	//                 "visibility": "on"
	//             },
	//             {
	//                 "color": "#C6E2FF"
	//             }
	//         ]
	//     },
	//     {
	//         "featureType": "poi",
	//         "elementType": "geometry.fill",
	//         "stylers": [
	//             {
	//                 "color": "#C5E3BF"
	//             }
	//         ]
	//     },
	//     {
	//         "featureType": "road",
	//         "elementType": "geometry.fill",
	//         "stylers": [
	//             {
	//                 "color": "#D1D1B8"
	//             }
	//         ]
	//     }
	// ];

	map = new google.maps.Map(document.getElementById('map'), {
    	center: {lat: 51.546207, lng: -0.075643},
        zoom: 14,
        // styles: styles
    });

    var largeInfowindow = new google.maps.InfoWindow();
    // this section creates an array of markers from the locations array on initialize
    var createMarkers = function() {
    	// get the position and title from the locations array
    	position = locations[i].location;
    	title = locations[i].name;
    	// create a marker per location
    	var marker = new google.maps.Marker({
    		map: map,
    		position: position,
    		title: title,
    		animation: google.maps.Animation.DROP,
    		id: i
    	});
		// Push the marker to array of markers
		markers.push(marker);
		// create onclick event to open infowindow at each marker
		marker.addListener('click', function() {
			populateInfoWindow(this, largeInfowindow);
			
		});
	}
	
	for (i = 0; i < locations.length; i++) {
		createMarkers(locations[i]);
	}
	// This function populates the infowindow when the marker is clicked. We'll only allow
	// one infowindow which will open at the marker that is clicked, and populate based
	// on that markers position.
	function populateInfoWindow(marker, infowindow) {
	    // Check to make sure the infowindow is not already opened on this marker.
	    if (infowindow.marker != marker) {
      	   	infowindow.marker = marker;
	      	infowindow.setContent('<div>' + marker.title + '<div');
	      	toggleBounce(marker);
	      	infowindow.open(map, marker);
	      	
	      	// Make sure the marker property is cleared if the infowindow is closed.
	      	infowindow.addListener('closeclick', function() {
	        	infowindow.marker = null;
	        	marker.setAnimation(null);
	     	 });
	   	}
	}

	function toggleBounce(marker) {
		if (marker.getAnimation() !== null) {
				marker.setAnimation(null);
		} else {
		    marker.setAnimation(google.maps.Animation.BOUNCE);
		    setTimeout(function(){
		    	marker.setAnimation(null);
		    }, 750);
		}
	}

}


