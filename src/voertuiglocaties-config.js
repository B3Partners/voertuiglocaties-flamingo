/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/*
 * Copyright (C) 2012-2013 B3Partners B.V.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
/**
 * Custom configuration object for HTML configuration
 * @author <a href="mailto:roybraam@b3partners.nl">Roy Braam</a>
 */
Ext.define("viewer.components.CustomConfiguration", {
    extend: "viewer.components.SelectionWindowConfig",
    constructor: function (parentId, configObject, configPage) {
        var me = this;
        if (configObject === null) {
            configObject = {};
        }

        configObject.showLabelconfig = true;
        viewer.components.CustomConfiguration.superclass.constructor.call(this, parentId, configObject, configPage);
        this.form.add([
            {
                xtype: 'checkbox',
                fieldLabel: 'Falck service',
                name: 'falck',
                value: this.configObject.falck !== undefined ? this.configObject.falck : false,
                labelWidth: this.labelWidth
            },
            {
                xtype: 'textfield',
                fieldLabel: 'Service url',
                name: 'serviceUrl',
                value: this.configObject.serviceUrl !== undefined ? this.configObject.serviceUrl : "",
                labelWidth: this.labelWidth,
                width: 500
            },
            {
                xtype: 'checkbox',
                id: "allVehicles",
                fieldLabel: 'Toon alle voertuigen',
                name: 'allVehicles',
                value: this.configObject.allVehicles !== undefined ? this.configObject.allVehicles : true,
                labelWidth: this.labelWidth,
                listeners: {
                    change: {
                        fn: function(){
                            if(Ext.getCmp('allVehicles').getValue()){
                                Ext.getCmp('incidentVehicles').setValue(false);
                            }                       
                        }
                    }
                }
            },
            {
                xtype: 'checkbox',
                id: "incidentVehicles",
                fieldLabel: 'Toon voertuigen met incident',
                name: 'incidentVehicles',
                value: this.configObject.incidentVehicles !== undefined ? this.configObject.incidentVehicles : false,
                labelWidth: this.labelWidth,
                listeners: {
                    change: {
                        fn: function(){
                            if(Ext.getCmp('incidentVehicles').getValue()){
                                Ext.getCmp('allVehicles').setValue(false);
                            }  
                        }
                    }
                }
            },
            {
                xtype: 'checkbox',
                fieldLabel: 'Gebruik status voor styling',
                name: 'vehicleStyling',
                value: this.configObject.vehicleStyling !== undefined ? this.configObject.vehicleStyling : false,
                labelWidth: this.labelWidth,
            }
        ]);
    },
    getDefaultValues: function () {
        return {
            details: {
                minWidth: 400,
                minHeight: 250
            }
        };
    }
});

