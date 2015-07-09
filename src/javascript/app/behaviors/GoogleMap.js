var app = require('app/app');
var Marionette = require('backbone.marionette');
var gmaps = require('utils/gmaps');
var _ = require('underscore');

var assetsUrl = require('utils/assetsUrl');

module.exports = app.Behaviors.GoogleMap = Marionette.Behavior.extend({

    ui: {},

    defaults: {
        mapCanvas: '#map-canvas',
        locations: [],
        mapOptions: {
            zoom: 10,
            center: [34.096118, -118.124171]
        },
        userAddress: ''
    },

    mapListeners: [],

    initialize: function () {
        _.bindAll(this, 'onMapsApiReady');
    },

    onRender: function () {
        this.ui.mapCanvas = this.$(this.getOption('mapCanvas'));
        gmaps.api.then(this.onMapsApiReady);
    },

    onMapsApiReady: function (gapi) {
        this.gapi = gapi;

        var mapOptions = this.getOption('mapOptions');
        var showPlaces = this.getOption('showPlaces');
        var userAddress = this.options.userAddress;
        this.address;

        this.geocoder = new gapi.maps.Geocoder();

        if (_.isArray(mapOptions.center)) {
            mapOptions.center = new gapi.maps.LatLng(mapOptions.center[0], mapOptions.center[1]);
        }

        this.geocoder.geocode( { 'address': userAddress}, _.bind(function(results, status) {
            var controlOptions = {
                mapTypeControl: false,
                mapTypeControlOptions: {
                    style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                    position: google.maps.ControlPosition.BOTTOM_CENTER
                },
                zoomControl: true,
                zoomControlOptions: {
                    // style: google.maps.ZoomControlStyle.LARGE,
                    position: google.maps.ControlPosition.RIGHT_TOP
                },
                scaleControl: false,
                streetViewControl: false,
                panControl: false,
                // streetViewControlOptions: {
                //     position: google.maps.ControlPosition.LEFT_TOP
                // }
            };

            mapOptions = _.defaults(mapOptions, _.clone(gmaps.defaults, true));
            mapOptions = _.defaults(mapOptions, controlOptions);

            var map = this.map = new gapi.maps.Map(this.ui.mapCanvas.get(0), mapOptions);
            map.setCenter(results[0].geometry.location);

            var infowindow = new google.maps.InfoWindow();

            var locations = this.getOption('locations');
            var bounds = new gapi.maps.LatLngBounds();

            var marker = new gapi.maps.Marker({
                position: results[0].geometry.location,
                map: map,
                icon: {
                    url: assetsUrl(gmaps.markerIcon),
                    scaledSize: new gapi.maps.Size(32, 52)
                }
            });
            
            bounds.extend(marker.position);

            google.maps.event.addListenerOnce(map, 'idle', _.bind(function () {

                _.defer(_.bind(function () {
                    map.fitBounds(bounds);
                    map.setZoom(mapOptions.zoom);
                    if (locations.length === 1) {
                        
                    }

                    if (showPlaces) {
                        // this.addNearbyPlaces(infowindow);
                    }
                }, this));

            }, this));
        }, this));

        this.setupListeners();
    },

    addNearbyPlaces: function (infowindow) {
        var gapi = this.gapi;
        var map = this.map;
        var placesTypes = this.getOption('placesTypes');

        // debugger;
        var service = new gapi.maps.places.PlacesService(map);
        var infoWindow = new gapi.maps.InfoWindow();

        function getIcon(types) {
            var markerType = _.first(_.intersection(_.keys(gmaps.markers), types));

            return assetsUrl(gmaps.markers[markerType]);
        }

        _.map(placesTypes, function (placesTypes) {
            service.nearbySearch({
                location: map.center,
                radius: 2000,
                types: placesTypes
            }, function (result) {
                _.each(result, function (place) {
                    var marker = new gapi.maps.Marker({
                        position: place.geometry.location,
                        map: map,
                        icon: {
                            url: getIcon(place.types),
                            scaledSize: new gapi.maps.Size(35, 35)
                        },
                    });

                    // gapi.maps.event.addListener(marker, 'click', (function (marker) {
                    //     return function () {
                    //         infowindow.setContent(place.name);
                    //         infowindow.open(map, marker);
                    //     };
                    // })(marker));
                });
            }, function (error) {
                console.error(error);
            });
        });
    },

    setupListeners: function () {
        var gapi = this.gapi;
        var map = this.map;

        var resizeListener = gapi.maps.event.addDomListener(window, 'resize', function () {
            var center = map.getCenter();
            gapi.maps.event.trigger(map, 'resize');
            map.setCenter(center);
        });

        this.mapListeners.push(resizeListener);
    },

    removeListeners: function () {
        var gapi = this.gapi;

        _.each(this.mapListeners, function (listener) {
            gapi.maps.event.removeListener(listener);
        });
    },

    onDestroy: function () {
        this.removeListeners();
    },

});