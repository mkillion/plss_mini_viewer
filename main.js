
require( [
    "esri/Map",
    "esri/widgets/ScaleBar",
    "esri/layers/TileLayer",
    "esri/views/MapView",
    "esri/geometry/support/webMercatorUtils",
    "dojo/domReady!"
],
function(
    Map,
    ScaleBar,
    TileLayer,
    MapView,
    webMercatorUtils
) {
    var plssLayer = new TileLayer( {url:"http://services.kgs.ku.edu/arcgis8/rest/services/plss/plss/MapServer", id:"Section-Township-Range"} );
	var topoLayer = new TileLayer( {url:"https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer", id:"Topo"} );

    var map = new Map( {
        layers: [topoLayer, plssLayer]
    } );

    var view = new MapView( {
        map: map,
        container: "map-div",
        center: [-98, 38],
        zoom: 7,
        ui: { components: ["zoom"] },
		constraints: { rotationEnabled: false }
    } );

    view.when(function() {
        urlParams = location.search.substr(1);
        urlZoom(urlParams);
    } );

    function urlZoom(params) {
        var items = urlParams.split("&");
        if (items.length > 1) {
            var lat = items[0].substring(4);
            var lon = items[1].substring(4);
            var datum = items[2].substring(4);
            var trs = items[3].substring(4);
        }
        
        //
    }
} );
