/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


Ext.define("viewer.voertuiglocaties.controllers.FalckIncidentsController", {
    extend: "viewer.voertuiglocaties.controllers.Incidents",
    incidentMarkerLayer: null,
    incidentsDetailWindow: null,
    incident: null,

    constructor: function (conf) {
        this.initConfig(conf);
        var me = this;
        viewer.voertuiglocaties.controllers.FalckIncidentsController.superclass.constructor.call(this, this.config);
        me.incidentMarkerLayer = Ext.create(viewer.voertuiglocaties.controllers.IncidentMarkerLayer, {'voertuiglocaties': me.config.voertuiglocaties});
        me.incidentsDetailWindow = Ext.create(viewer.voertuiglocaties.controllers.IncidentsDetailsWindow, {'voertuiglocaties': me.config.voertuiglocaties});

        window.setInterval(function () {
            if (window.localStorage.getItem("voertuigId") === "") {
                me.incidentMarkerLayer.clear();
                me.config.voertuiglocaties.vehicleController.getEenheidlocaties();
                me.getIncidents();
            } else {
                me.getIncidentForVoertuig(window.localStorage.getItem("voertuigId"));
            }
        }, 5000);
    },

    getIncidents: function () {
        console.log("get all incidents");
        var me = this;
        Ext.Ajax.request({
            url: me.config.voertuiglocaties.serviceUrl + "incident",
            //headers: {'Authorization': me.config.voertuiglocaties.token},
            success: function (result) {
                if(result.responseText!== ""){
                    var response = Ext.JSON.decode(result.responseText);
                    console.log(response);
                } else {
                    console.log("Geen incidenten");
                }
                
            },
            failure: function (result) {
                console.log(result);
            }
        });
    },

    getIncidentForVoertuig: function (voertuigId) {
        var me = this;
        Ext.Ajax.request({
            url: me.config.voertuiglocaties.serviceUrl + "eenheid/" + voertuigId,
            headers: {'Authorization': me.config.voertuiglocaties.token},
            success: function (result) {
                var response = Ext.JSON.decode(result.responseText);
                console.log(response);
                response = response[0];
                var incidenten = response && response.Incidenten && response.Incidenten.length > 0 ? response.Incidenten : null;
                if (incidenten && incidenten.length > 0) {
                    console.log("Got incident voor voertuig", voertuigId);
                    me.buildIncident(incidenten[incidenten.length - 1]);
                } else {
                    console.log("No incident voor voertuig", voertuigId);
                    me.geenInzet(true);
                }
            },
            failure: function (result) {
                console.log(result);
            }
        });
    },

    buildIncident: function (incidentNumbers) {
        var me = this;
        Ext.Ajax.request({
            url: me.config.voertuiglocaties.serviceUrl + "incident/" + incidentNumbers,
            headers: {'Authorization': me.config.voertuiglocaties.token},
            success: function (result) {
                var response = Ext.JSON.decode(result.responseText);
                if (response.length === 0) {
                    me.geenInzet(true);
                    return;
                }
                var incident = response[0];
                me.incident = incident;
                console.log("Got incident data", incident);
                me.config.voertuiglocaties.vehicleController.incidentFound(incident);
                me.incidentMarkerLayer.addIncident(incident, false, true);
                me.incidentsDetailWindow.updateInfo(incident);
            },
            failure: function (result) {
                console.log(result);
            }
        });
    },

    geenInzet: function (triggerEvent) {
        this.incidentId = null;
        this.incident = null;
        this.incidentMarkerLayer.clear();
    }
});