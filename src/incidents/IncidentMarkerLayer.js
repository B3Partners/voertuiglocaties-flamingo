/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Ext.define("viewer.voertuiglocaties.controllers.IncidentMarkerLayer", {

    constructor: function (conf) {
        this.initConfig(conf);
        var me = this;
        console.log("markerLayer");
        me.createLayer();
    },

    createLayer: function () {
        var me = this;

        this.layer = new OpenLayers.Layer.Markers("Incident markers", {
            rendererOptions: {zIndexing: true}
        });

        me.voertuiglocaties.map.addLayer(this.layer);

        this.layer.setZIndex(1002);
        this.size = new OpenLayers.Size(24, 26);
        this.offset = new OpenLayers.Pixel(-(this.size.w / 2), -this.size.h);
    },

    addIncident: function (incident, archief, singleMarker) {
        var me = this;
        var xy = me.getIncidentXY(incident);
        var x = xy.x, y = xy.y;


        if (singleMarker) {
            if (x === me.x && y === me.y) {
                return;
            }

            this.layer.clearMarkers();

            me.x = x;
            me.y = y;
        }

        var pos = new OpenLayers.LonLat(x, y);

        var icon = me.voertuiglocaties.imagePath + "bell.png";

        var marker = new OpenLayers.Marker(
                pos,
                new OpenLayers.Icon(icon, this.size, this.offset)
                );
        if (me.ghor && incident.inzetEenhedenStats.standard) {
            marker.setOpacity(0.5);
        }
        marker.id = incident.INCIDENT_ID;
        var handler = function () {
            me.markerClick(marker, incident, archief);
        };
        marker.events.register("click", marker, handler);
        marker.events.register("touchstart", marker, handler);
        this.layer.addMarker(marker);

        return marker;
    },

    getIncidentXY: function (incident) {
        var x, y;
        if (incident.lon && incident.lat) {
            return {x: incident.lon, y: incident.lat};
        }
        if (incident.T_X_COORD_LOC && incident.T_Y_COORD_LOC) {
            x = incident.T_X_COORD_LOC;
            y = incident.T_Y_COORD_LOC;
        } else if (incident.IncidentLocatie) {
            x = incident.IncidentLocatie.XCoordinaat;
            y = incident.IncidentLocatie.YCoordinaat;
        } else {
            //x = $(incident).find("IncidentLocatie XYCoordinaten XCoordinaat").text();
            //y = $(incident).find("IncidentLocatie XYCoordinaten YCoordinaat").text();
        }
        return {x: x, y: y};
    },

    markerClick: function (marker, incident, archief) {
        this.voertuiglocaties.incidentController.incidentsDetailWindow.showWindow(incident);
    },

    clear: function () {
        this.layer.clearMarkers();
        this.x = null;
        this.y = null;
    }
});