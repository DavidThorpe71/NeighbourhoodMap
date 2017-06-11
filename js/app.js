// Model
var initialLocations = [
	{
		name: 'Mangal 2'
	},
	{
		name: 'Dukes Brew & Que'
	},
	{
		name: 'Honest Burgers - Dalston'
	},
	{
		name: 'Berber & Q - Grill House'
	},
	{
		name: 'Rudies'
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
	
};

ko.applyBindings(new LocationsViewModel());

// Maps API

var map;

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
    	center: {lat: 51.546207, lng: -0.075643},
        zoom: 15,
    });
}



