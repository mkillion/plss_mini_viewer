
require( [
    "esri/Map",
    "esri/widgets/ScaleBar",
    "esri/layers/TileLayer",
    "esri/views/MapView",
    "esri/tasks/FindTask",
    "esri/tasks/support/FindParameters",
    "esri/tasks/GeometryService",
    "esri/geometry/Point",
    "esri/geometry/SpatialReference",
    "esri/tasks/support/ProjectParameters",
    "dojo/domReady!"
],
function(
    Map,
    ScaleBar,
    TileLayer,
    MapView,
    FindTask,
    FindParameters,
    GeometryService,
    Point,
    SpatialReference,
    ProjectParameters
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
            var dat = items[2].substring(4);
            var twn = items[3].substring(2);
            var rng = items[4].substring(2);
            var sec = items[5].substring(2);
        }

        var findTask = new FindTask("http://services.kgs.ku.edu/arcgis8/rest/services/plss/plss/MapServer");
        var findParams = new FindParameters();
    	findParams.returnGeometry = true;
        findParams.contains = false;
        findParams.layerIds = [3];
        findParams.searchFields = ["S_R_T"];
        findParams.searchText = "S" + sec + "-T" + twn + "-R" + rng;
        findTask.execute(findParams).then(function(response) {
            view.extent = response.results[0].feature.geometry.extent;
            plotPoint(lat, lon, dat);
        } );
    }


    function plotPoint(lat, lon, dat) {
        switch (dat) {
            case "27":
                var wkid = 4267;
                break;
            case "83":
                var wkid = 4269;
                break;
            case "84":
                var wkid = 4326;
                break;
        }

        var pt = new Point( {
            x: lon,
            y: lat,
            spatialReference: new SpatialReference( {
                wkid: wkid
            } )
        } );

        var gs = new GeometryService( {
            url: "http://services.kgs.ku.edu/arcgis8/rest/services/Utilities/Geometry/GeometryServer"
        } );
        var pp = new ProjectParameters( {
            geometries: pt,
            outSpatialReference: 3857
        } );
        console.log(pp);
        gs.project(pp).then(function(geom) {
            console.log("bar");
            console.log(geom);
        } );
    }
} );
