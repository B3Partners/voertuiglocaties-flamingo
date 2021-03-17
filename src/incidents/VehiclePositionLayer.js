/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


Ext.define("viewer.voertuiglocaties.controllers.VehiclePositionLayer", {

    constructor: function (conf) {
        OpenLayers.Renderer.symbol.pointer = [1, -7, 0, -9, -1, -7, 1, -7];

        this.initConfig(conf);
        var me = this;

        me.createLayer();
    },

    createLayer: function () {
        var me = this;

        this.layer = new OpenLayers.Layer.Vector("_Vehicle positions 1", {
            rendererOptions: {
                zIndexing: true
            },
            styleMap: new OpenLayers.StyleMap({
                "default": new OpenLayers.Style({
                    externalGraphic: "${graphic}",
                    graphicWidth: 16,
                    graphicHeight: 16,
                    label: "${Voertuigsoort} ${Roepnummer} ${speed}",
                    fontColor: "black",
                    fontSize: "12px",
                    fontWeight: "bold",
                    labelYOffset: -20,
                    labelOutlineColor: "white",
                    labelOutlineWidth: 3,
                    display: "${display}"
                }, {
                    context: {
                        speed: function (feature) {
                            if (feature.attributes.Speed === 0) {
                                return "";
                            } else {
                                return feature.attributes.Speed + "km/h";
                            }
                        },
                        display: me.displayFunction,
                        graphic: function (feature) {
                            if (me.voertuiglocaties.vehicleStyling) {
                                if (feature.attributes.statusCode === 4 || feature.attributes.statusCode === 6) {
                                    return me.voertuiglocaties.imagePath + "zwaailicht-geel.png";
                                } else if (feature.attributes.statusCode === 5) {
                                    return me.voertuiglocaties.imagePath + "zwaailicht-blauw.png";
                                } else if (feature.attributes.statusCode === 8) {
                                    return me.voertuiglocaties.imagePath + "zwaailicht-donkergroen.png";
                                } else if (feature.attributes.statusCode === 9) {
                                    return me.voertuiglocaties.imagePath + "zwaailicht-groen.png";
                                } else if (feature.attributes.statusCode === 11) {
                                    return me.voertuiglocaties.imagePath + "zwaailicht-roodwit.png";
                                }  else if (feature.attributes.statusCode === 15 || feature.attributes.statusCode === 16) {
                                    return me.voertuiglocaties.imagePath + "zwaailicht-oranje.png";
                                }
                            } else {
                                if (feature.attributes.IncidentID === "") {
                                    return me.voertuiglocaties.imagePath + "zwaailicht-grijs.png";
                                }
                                return me.voertuiglocaties.imagePath + "zwaailicht-blauw.png";
                            }
                        }
                    }
                })
            })
        });
        this.layer2 = new OpenLayers.Layer.Vector("_Vehicle positions 2", {
            rendererOptions: {
                zIndexing: true
            },
            styleMap: new OpenLayers.StyleMap({
                "default": new OpenLayers.Style({
                    strokeColor: "#ff0000",
                    fillColor: "#dd0000",
                    fillOpacity: 1.0,
                    strokeWidth: 1,
                    pointRadius: 16,
                    display: "${display}",
                    graphicName: "pointer",
                    rotation: "${Direction}"
                }, {
                    context: {
                        display: me.displayFunction
                    }
                })
            })
        });
    },

    displayFunction: function () {
        return "visible";
    },

    features: function (features) {
        var me = this;
        if (me.selectedFeature) {
            me.selectControl.unselectAll();
        }
        this.layer.destroyFeatures();
        this.layer2.destroyFeatures();
        this.layer.addFeatures(features);
        var features2 = [];
        $.each(features, function (i, f) {
            features2.push(f.clone());
        });
        this.layer2.addFeatures(features2);
    }
});