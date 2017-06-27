// twitter api
window.twttr = (function(d, s, id) {
	var js, fjs = d.getElementsByTagName(s)[0],
	t = window.twttr || {};
	if (d.getElementById(id)) return t;
	js = d.createElement(s);
	js.id = id;
	js.src = "https://platform.twitter.com/widgets.js";
	fjs.parentNode.insertBefore(js, fjs);

	t._e = [];
	t.ready = function(f) {
	t._e.push(f);
	};

	return t;
	}(document, "script", "twitter-wjs"));

// locations
var locations = [
	{
		name: 'Mangal 2',
		location: {lat: 51.5498958, lng: -0.0755666},
		twitter: 'mangal2'
	},
	{
		name: 'Dukes Brew & Que',
		location: {lat: 51.5389873, lng: -0.0807314},
		twitter: 'DukesJoint'
	},
	{
		name: 'Honest Burgers - Dalston',
		location: {lat: 51.5487942, lng: -0.0765496},
		twitter: 'honestburgers'
	},
	{
		name: 'Berber & Q - Grill House',
		location: {lat: 51.5368819, lng: -0.0759053},
		twitter: 'BERBERANDQ'
	},
	{
		name: 'Rudies',
		location: {lat: 51.5517604, lng: -0.0752843},
		twitter: 'RudiesLondon'
	},
	{
		name: 'Chick \'n\' Sours',
		location: {lat: 51.541015, lng:-0.075149},
		twitter: 'ChicknSours'
	}
];


// this function creates the locations
function Location(data) {
	var self = this;
	self.name = ko.observable(data.name);
	self.location = ko.observable(data.location);
}


// Maps API
var map;

var markers = [];

function googleError() {
	var map = document.getElementById('map');
	map.innerHTML = 'Google maps did not load';
}

function initMap() {
	
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
    	twitter = locations[i].twitter;
    	// create a marker per location
    	var marker = new google.maps.Marker({
    		map: map,
    		position: position,
    		title: title,
    		twitter: twitter,
    		animation: google.maps.Animation.DROP,
    		id: i,
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
	      	infowindow.setContent('<div>' + marker.title + '<div>' + '<div>Tweets by ' + marker.title + '</div>' + '<div id="timeline"></div>');
	      	

	      	toggleBounce(marker);
	      	
	      	infowindow.open(map, marker);

	      	// loads twitter timeline for location clicked on
	      	twttr.widgets.createTimeline(
  			{
    			sourceType: 'profile',
    			screenName: marker.twitter
  			},
  			document.getElementById('timeline'),
  			{
				width: '300',
				height: '250',
				related: 'twitterdev,twitterapi'
			}).then(function (el) {
				console.log('Embedded a timeline.')
			});
	      	
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
		    // timeout on bounce so marker bounces only once on click
		    setTimeout(function(){
		    	marker.setAnimation(null);
		    }, 750);
		}
	}
}

// View Model
var viewModel = function() {
	
	var self = this;

	// creates an array for storing locations
	self.locationList = ko.observableArray([]);
	self.query = ko.observable('');

	// pushes each location into locationList array
	locations.forEach(function(item) {
		self.locationList.push( new Location(item) );
	});

	// sets the current location onclick
	self.currentLocation = ko.observable( self.locationList()[0] );

	self.setLocation = function(clickedLocation) {
		self.currentLocation(clickedLocation);
		console.log(clickedLocation.name());
		for (var i = 0; i < markers.length; i++){
			if (clickedLocation.name() == markers[i].title){
				google.maps.event.trigger(markers[i], 'click');
			}
		}
		self.closeSideNavi();
	};


	// Filters which locations and markers are displayed from input box
	self.searchResults = ko.computed(function() {
		var filter = self.query().toLowerCase();
		
		// Filter markers
		for (i = 0; i < self.locationList().length; i++) {
		 	if (self.locationList()[i].name().toLowerCase().indexOf(filter) > -1) {
		 		for (var j = 0; j < markers.length; j++) {
		 			if (self.locationList()[i].name() == markers[j].title) {
		 				markers[j].setMap(map); 
		 			}
		 		}
		 	} else {
		 		for (var j = 0; j < markers.length; j++) {
		 			if (self.locationList()[i].name() == markers[j].title) {
		 				markers[j].setMap(null); 
		 			}
		 		}
		 	}
		 }

		// Filter list
		if (!filter) {
			 return self.locationList();
		} else {
			return ko.utils.arrayFilter(self.locationList(), function(item) {
				return item.name().toLowerCase().indexOf(filter) > -1;
			});
		}
	});

	self.openNav = ko.observable(false);
	self.closeNav = ko.observable(true);

	self.openSideNavi = function() {
		self.openNav(true);
		self.closeNav(false);
	}

	self.closeSideNavi = function() {
		self.openNav(false);
		self.closeNav(true);
	}
};

ko.applyBindings(new viewModel());