require(["esri/map", "esri/dijit/Scalebar", "dojo/domReady!"], function(Map,Scalebar) {
    var map = new Map("map-div", {
        center: [-98.5, 38.25],
        zoom: 7,
        basemap: "national-geographic",
        logo: false
    });

    var scalebar = new Scalebar({
        map: map,
        scalebarUnit: "dual"
    });

    earthquakesLayer = new esri.layers.ArcGISDynamicMapServiceLayer("http://services.kgs.ku.edu/arcgis1/rest/services/co2/seismic_1/MapServer");
    earthquakesLayer.setVisibleLayers([8]);
    map.addLayers([earthquakesLayer]);
});

function filterQuakes(year, mag) {
    var nextYear = parseInt(year) + 1;
    var def = [];

    if (year !== "all") {
        if (mag !== "all") {
            def[8] = "the_date >= to_date('" + year + "-01-01 00:00:00','YYYY-MM-DD HH24:MI:SS') and the_date < to_date('" + nextYear + "-01-01 00:00:00','YYYY-MM-DD HH24:MI:SS') and net in ('us', ' ', 'US') and mag >=" + mag;
        } else {
            def[8] = "the_date >= to_date('" + year + "-01-01 00:00:00','YYYY-MM-DD HH24:MI:SS') and the_date < to_date('" + nextYear + "-01-01 00:00:00','YYYY-MM-DD HH24:MI:SS') and mag >= 2 and net in ('us', ' ', 'US')";
        }
    } else {
        if (mag !== "all") {
            def[8] = " mag >=" + mag;
        } else {
            def[8] = "";
        }
    }
    earthquakesLayer.setLayerDefinitions(def);
}

function filterQuakesRecent() {
    var def = [];
    def[8] = "state = 'KS' and mag >= 2 and net in ('us', ' ', 'US') and the_date = (select max(the_date) from earthquakes where state = 'KS' and mag >= 2 and net in ('us', ' ', 'US'))";
    earthquakesLayer.setLayerDefinitions(def);
}

function filterQuakesDays(days) {
    var def = [];

    if (days !== "all") {
        def[8] = "sysdate - the_date <= " + days + " and mag >= 2 and net in ('us', ' ', 'US')";
    } else {
        def[8] = "";
    }
    earthquakesLayer.setLayerDefinitions(def);
}

function clearQuakeFilter() {
    var def = [];
    def = "";
    earthquakesLayer.setLayerDefinitions(def);
    days.options[0].selected="selected";
    mag.options[0].selected="selected";
    year.options[0].selected="selected";
}