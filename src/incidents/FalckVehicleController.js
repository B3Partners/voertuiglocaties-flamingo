/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


Ext.define("viewer.voertuiglocaties.controllers.FalckVehicleController", {
    positionLayer: null,

    constructor: function (conf) {
        this.initConfig(conf);
        var me = this;

        me.positionLayer = Ext.create(viewer.voertuiglocaties.controllers.VehiclePositionLayer, {'voertuiglocaties': me.config.voertuiglocaties});

    },

    getEenheidlocaties: function () {
        var me = this;
        var url = "";
        if ((window.localStorage.getItem("allVehicles") === 'true' && window.localStorage.getItem("incidentVehicles") === 'true') || window.localStorage.getItem("allVehicles") === 'true') {
            url = me.config.voertuiglocaties.serviceUrl + "eenheidlocatie";
        } else {
            url = me.config.voertuiglocaties.serviceUrl + "eenheidlocatie?extended=false";
        }
        Ext.Ajax.request({
            url: url,
            headers: {'Authorization': me.config.voertuiglocaties.token},
            success: function (result) {
                var response = Ext.JSON.decode(result.responseText);
                console.log(response);
                me.updateVehicles(response.features);
            },
            failure: function (result) {
                console.log(result);
            }
        });
    },

    getEenheidLocatieIncident: function (betrokkenEenheden) {
        console.log("Betrokken eenheden", betrokkenEenheden);
        var me = this;
        var features = [];
        for (var i = 0; i < betrokkenEenheden.length; i++) {
            Ext.Ajax.request({
                url: me.config.voertuiglocaties.serviceUrl + "eenheidlocatie?id=" + betrokkenEenheden[i],
                headers: {'Authorization': me.config.voertuiglocaties.token},
                async: false,
                success: function (result) {
                    var response = Ext.JSON.decode(result.responseText);
                    console.log(response);
                    features.push(response.features[0]);
                },
                failure: function (result) {
                    console.log(result);
                }
            });
        }
        me.updateVehicles(features);
    },

    updateVehicles: function (features) {
        var me = this;
        var transformedFeatures = me.transformFeaturesForVehiclePositionLayer(features);
        console.log("transformedEenheden: ", transformedFeatures);
        me.positionLayer.features(transformedFeatures);
    },

    transformFeaturesForVehiclePositionLayer: function (features) {
        var transformedFeatures = [];
        for (var i = 0; i < features.length; i++) {
            var feat = features[i];
            feat.attributes = feat.properties;
            delete feat.properties;
            feat.attributes.IncidentID = (feat.attributes.incidentNummer === null) ? "" : feat.attributes.incidentNummer;
            //feat.attributes.IncidentID=null;
            delete feat.attributes.incidentNummer;
            feat.attributes.Voertuigsoort = "";
            feat.attributes.Roepnummer = feat.attributes.id;
            feat.attributes.Speed = feat.attributes.speed;
            //feat.attributes.Speed = 35;
            feat.attributes.Direction = feat.attributes.heading;
            feat.geometry = new OpenLayers.Geometry.Point(feat.geometry.coordinates[0], feat.geometry.coordinates[1]);
            var feature = new OpenLayers.Feature.Vector(feat.geometry, feat.attributes);
            transformedFeatures[i] = feature;
        }
        return transformedFeatures;
    },

    incidentFound: function (incidenten) {
        console.log("incidenten: ", incidenten);
        var betrokkenEenheden = [];
        var me = this;
        for (var i = 0; i < incidenten.BetrokkenEenheden.length; i++) {
            var eenheid = incidenten.BetrokkenEenheden[i];
            betrokkenEenheden.push(eenheid.Roepnaam);
        }
        me.getEenheidLocatieIncident(betrokkenEenheden);
    }
});