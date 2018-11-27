
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
    "esri/layers/GraphicsLayer",
    "esri/Graphic",
    "esri/symbols/SimpleMarkerSymbol",
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
    ProjectParameters,
    GraphicsLayer,
    Graphic,
    SimpleMarkerSymbol
) {
    var wmSR = new SpatialReference( {
        wkid: 3857
    } );
    var plssLayer = new TileLayer( {url:"http://services.kgs.ku.edu/arcgis8/rest/services/plss/plss/MapServer", id:"Section-Township-Range"} );
	var topoLayer = new TileLayer( {url:"https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer", id:"Topo"} );
    var graphicsLayer = new GraphicsLayer();

    var map = new Map( {
        layers: [topoLayer, plssLayer, graphicsLayer]
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
        var items = location.search.substr(1).split("&");
        if (items.length > 1) {
            var lat = items[0].substring(4);
            var lon = items[1].substring(4);
            var dat = items[2].substring(4);
            var lod = items[3].substring(4);
            if (items.length > 4) {
                if (items[4].substring(5) === "false") {
                    plssLayer.visible = false;
                }
            }

        }

        plotPoint(lat, lon, dat, lod);
    } );


    function plotPoint(lat, lon, dat, lod) {
        switch (dat) {
            case "27":
                var wkid = 4267;
                var transWkid = 1175;
                break;
            case "83":
                var wkid = 4269;
                var transWkid = 1188;
                break;
            case "84":
                var wkid = 4326;
                var transWkid;
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

        var projParams = new ProjectParameters( {
            geometries: [pt],
            outSpatialReference: wmSR,
            transformation: {
                wkid: transWkid
            },
            transformForward: true
        } );

        gs.project(projParams).then(function(response) {
            wmPt = new Point( {
                x: response[0].x,
                y: response[0].y,
                spatialReference: wmSR
            } );

            var symbol = {
                type: "simple-marker",
                style: "circle",
                color: "blue",
                size: "12px",
            };

            var g = new Graphic ( {
				geometry: wmPt,
				symbol: symbol
			} );

            view.center = wmPt;
            view.zoom = lod;
            graphicsLayer.add(g);
        } );
    }
} );
