var constants = require('./constants');

var GoogleMapsLoader = require('google-maps');
var Bluebird = require('bluebird');

GoogleMapsLoader.KEY = constants.GMAPS_API_KEY;
GoogleMapsLoader.LIBRARIES = ['places'];

//Let's promisify this shit
var resolve, reject;
var google = new Bluebird(function (resolveFn, rejectFn) {
    resolve = resolveFn;
    reject = rejectFn;
});

try {
    GoogleMapsLoader.load(function (google) {
        resolve(google);
    });
} catch (e) {
    reject(e);
}

var defaults = {
    scrollwheel: false,
    styles: [{
            "featureType": "administrative",
            "elementType": "labels.text.fill",
            "stylers": [{
                "color": "#525f66"
            }]
        }, {
            "featureType": "poi",
            "elementType": "labels",
            "stylers": [{
                "visibility": "on"
            }]
        },

        {
            "featureType": "poi.park",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#d4e0c1"
            }]
        }, {
            "featureType": "poi.school",
            "elementType": "geometry.fill",
            "stylers": [{
                "saturation": "-24"
            }, {
                "lightness": "6"
            }, {
                "weight": "1.28"
            }]
        }, {
            "featureType": "road",
            "elementType": "labels.icon",
            "stylers": [{
                "visibility": "off"
            }, {
                "lightness": "0"
            }, {
                "saturation": "0"
            }]
        }, {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#ffffff"
            }, {
                "visibility": "on"
            }]
        }, {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [{
                "color": "#ded7cc"
            }, {
                "weight": "1"
            }]
        }, {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [{
                "color": "#333333"
            }]
        }, {
            "featureType": "road.highway",
            "elementType": "labels.text.stroke",
            "stylers": [{
                "color": "#ffffff"
            }, {
                "gamma": 2
            }]
        }, {
            "featureType": "road.highway",
            "elementType": "labels.icon",
            "stylers": [{
                "visibility": "on"
            }, {
                "saturation": "-3"
            }]
        }, {
            "featureType": "road.highway.controlled_access",
            "elementType": "labels.icon",
            "stylers": [{
                "visibility": "on"
            }]
        }, {
            "featureType": "road.arterial",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#f2f1f1"
            }]
        }, {
            "featureType": "road.arterial",
            "elementType": "geometry.stroke",
            "stylers": [{
                "color": "#e7ddcd"
            }]
        }, {
            "featureType": "road.arterial",
            "elementType": "labels.text.fill",
            "stylers": [{
                "color": "#555555"
            }]
        }, {
            "featureType": "road.arterial",
            "elementType": "labels.icon",
            "stylers": [{
                "visibility": "on"
            }]
        }, {
            "featureType": "road.local",
            "elementType": "geometry.fill",
            "stylers": [{
                "visibility": "on"
            }, {
                "color": "#d2d2d2"
            }]
        }, {
            "featureType": "road.local",
            "elementType": "geometry.stroke",
            "stylers": [{
                "color": "#ded7cc"
            }, {
                "visibility": "on"
            }]
        }, {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [{
                "color": "#555555"
            }]
        }, {
            "featureType": "road.local",
            "elementType": "labels.icon",
            "stylers": [{
                "visibility": "on"
            }]
        }, {
            "featureType": "transit",
            "elementType": "labels.text.stroke",
            "stylers": [{
                "color": "#ddd4d4"
            }, {
                "gamma": 2
            }]
        }, {
            "featureType": "transit.line",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#c9c9c9"
            }]
        }, {
            "featureType": "transit.line",
            "elementType": "geometry.stroke",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "transit.line",
            "elementType": "labels.icon",
            "stylers": [{
                "visibility": "on"
            }]
        }, {
            "featureType": "transit.station.bus",
            "elementType": "labels.icon",
            "stylers": [{
                "visibility": "on"
            }]
        }, {
            "featureType": "transit.station.rail",
            "elementType": "labels.icon",
            "stylers": [{
                "visibility": "on"
            }]
        }, {
            "featureType": "water",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#bfd9e8"
            }, {
                "saturation": "-43"
            }]
        }
    ]
};

module.exports = {
    api: google,
    defaults: defaults,
    markerIcon: '/images/map-marker.png',
    markers: {}
};