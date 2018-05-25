/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


Ext.define("viewer.components.voertuiglocaties", {
    extend: "viewer.components.Component",
    incidentController: null,
    vehicleController: null,
    voertuigId: null,
    map: null,
    basePath: null,
    visible:null,
    imagePath: null,
    allVehicles: null,
    incidentVehicles: null,

    constructor: function (conf) {
        this.initConfig(conf);
        viewer.components.Edit.superclass.constructor.call(this, this.config);
        var me = this;
        me.visible = false;
        me.map = me.viewerController.mapComponent.getMap().getFrameworkMap();

        if (actionBeans && actionBeans["componentresource"]) {
            me.basePath = actionBeans["componentresource"];
            me.basePath = Ext.String.urlAppend(me.basePath, "className=" + Ext.getClass(me).getName());
            me.basePath = Ext.String.urlAppend(me.basePath, "resource=");
        } else {
            console.log("geen basePath gevonden");
            me.basePath = "";
        }

        me.imagePath = me.basePath + "/images/";

        this.renderButton({
            handler: function () {
                me.onClick();
            },
            text: me.config.title,
            icon: me.imagePath + "toggle-off.png",
            tooltip: me.config.tooltip,
            label: me.config.label
        });

        me.createController();
        me.setVoertuigId(window.localStorage.getItem("voertuigId"));
        me.setAllVehicles(window.localStorage.getItem("allVehicles"));
        me.setIncidentVehicles(window.localStorage.getItem("incidentVehicles"));
        me.loadWindow();
    },

    onClick: function () {
        var me = this;
        me.visible = !me.visible;
        me.setIcon(me.visible);
        this.vehicleController.setActive(me.visible);
        this.vehicleController.positionLayer.layer.setVisibility(me.visible);
        this.vehicleController.positionLayer.layer2.setVisibility(me.visible);
        //this.popup.show();
    },

    loadWindow: function () {
        var me = this;
        this.maincontainer = Ext.create('Ext.container.Container', {
            id: this.name + 'Container',
            width: '100%',
            height: '100%',
            autoScroll: true,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            style: {
                backgroundColor: 'White'
            },
            padding: 10,
            renderTo: this.getContentDiv(),
            items: [
                {
                    xtype: 'checkbox',
                    fieldLabel: 'Toon alle voertuigen',
                    id: 'allVehicles',
                    name: 'allVehicles',
                    value: me.allVehicles !== "" ? me.allVehicles : "",
                    labelWidth: 200
                },
                {
                    xtype: 'checkbox',
                    fieldLabel: 'Toon voertuigen met incident',
                    id: 'incidentVehicles',
                    name: 'incidentVehicles',
                    value: me.incidentVehicles !== "" ? me.incidentVehicles : "",
                    labelWidth: 200
                },
                {
                    xtype: 'textfield',
                    id: 'voertuignummer',
                    fieldLabel: 'Voertuignummer',
                    name: 'voertuigId',
                    value: me.voertuigId !== "" ? me.voertuigId : "",
                    width: 250,
                    labelWidth: 150
                },
                {
                    xtype: 'button',
                    text: 'Opslaan',
                    listeners: {
                        click: {
                            scope: me,
                            fn: me.saveSettings
                        }
                    }
                }
            ]
        });
    },
    
    setIcon: function(bool){
        if(bool){
            this.button.setIcon(this.imagePath + "toggle-on.png");
        }else {
            this.button.setIcon(this.imagePath + "toggle-off.png");
        }
    },
    
    createController: function () {
        console.log("creating controller...");
        var me = this;
        if (me.config.falck) {
            //me.incidentController = Ext.create(viewer.voertuiglocaties.controllers.FalckIncidentsController, {'voertuiglocaties': this});
            me.vehicleController = Ext.create(viewer.voertuiglocaties.controllers.FalckVehicleController, {'voertuiglocaties': this});
        } else if (me.config.mdt) {

        } else if (me.config.AGS) {

        } else {
            console.log("geen controller ingesteld");
        }
    },

    setVoertuigId: function (voertuigId) {
        this.voertuigId = voertuigId;
        window.localStorage.setItem("voertuigId", voertuigId);
    },

    setAllVehicles: function (allVehicles) {
        this.allVehicles = allVehicles;
        window.localStorage.setItem("allVehicles", allVehicles);
    },

    setIncidentVehicles: function (incidentVehicles) {
        this.incidentVehicles = incidentVehicles;
        window.localStorage.setItem("incidentVehicles", incidentVehicles);
    },

    saveSettings: function () {
        var voertuignummer = Ext.getCmp('voertuignummer').getValue();
        var allVehicles = Ext.getCmp('allVehicles').getValue();
        var incidentVehicles = Ext.getCmp('incidentVehicles').getValue();

        this.setVoertuigId(voertuignummer);
        this.setAllVehicles(allVehicles);
        this.setIncidentVehicles(incidentVehicles);

        this.popup.hide();
    }

});