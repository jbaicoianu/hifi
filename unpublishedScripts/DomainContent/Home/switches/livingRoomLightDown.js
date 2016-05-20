//
//
//  Created by The Content Team 4/10/216
//  Copyright 2016 High Fidelity, Inc.
//
// this finds lights and toggles thier visibility, and flips the emissive texture of some light models
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

(function() {

    var SEARCH_RADIUS = 100;

    var _this;
    var utilitiesScript = Script.resolvePath('../utils.js');
    Script.include(utilitiesScript);
    Switch = function() {
        _this = this;
        this.switchSound = SoundCache.getSound("atp:/switches/lamp_switch_2.wav");
    };

    Switch.prototype = {
        prefix: 'hifi-home-living-room-disc-',
        clickReleaseOnEntity: function(entityID, mouseEvent) {
            if (!mouseEvent.isLeftButton) {
                return;
            }
            this.toggleLights();
        },

        startNearTrigger: function() {
            this.toggleLights();
        },

        modelEmitOn: function(glowDisc) {
            var data = {
                "Metal-brushed-light.jpg": "atp:/models/Lights-Living-Room-2.fbx/Lights-Living-Room-2.fbm/Metal-brushed-light.jpg",
                "Tex.CeilingLight.Emit": "atp:/models/Lights-Living-Room-2.fbx/Lights-Living-Room-2.fbm/CielingLight-On-Diffuse.jpg",
                "TexCeilingLight.Diffuse": "atp:/models/Lights-Living-Room-2.fbx/Lights-Living-Room-2.fbm/CielingLight-Base.jpg"
            }

            Entities.editEntity(glowDisc, {
                textures: JSON.stringify(data)
            })
        },

        modelEmitOff: function(glowDisc) {
            var data = {
                "Metal-brushed-light.jpg": "atp:/models/Lights-Living-Room-2.fbx/Lights-Living-Room-2.fbm/Metal-brushed-light.jpg",
                "Tex.CeilingLight.Emit": "",
                "TexCeilingLight.Diffuse": "atp:/models/Lights-Living-Room-2.fbx/Lights-Living-Room-2.fbm/CielingLight-Base.jpg"
            }

            Entities.editEntity(glowDisc, {
                textures: JSON.stringify(data)

            })
        },

        masterLightOn: function(masterLight) {
            Entities.editEntity(masterLight, {
                visible: true
            });
        },

        masterLightOff: function(masterLight) {
            Entities.editEntity(masterLight, {
                visible: false
            });
        },

        glowLightOn: function(glowLight) {
            Entities.editEntity(glowLight, {
                visible: true
            });
        },

        glowLightOff: function(glowLight) {
            Entities.editEntity(glowLight, {
                visible: false
            });
        },

        findGlowLights: function() {
            var found = [];
            var results = Entities.findEntities(this.position, SEARCH_RADIUS);
            results.forEach(function(result) {
                var properties = Entities.getEntityProperties(result);
                if (properties.name === _this.prefix + "light-glow") {
                    found.push(result);
                }
            });
            return found;
        },

        findMasterLights: function() {
            var found = [];
            var results = Entities.findEntities(this.position, SEARCH_RADIUS);
            results.forEach(function(result) {
                var properties = Entities.getEntityProperties(result);
                if (properties.name === _this.prefix + "light-master") {
                    found.push(result);
                }
            });
            return found;
        },

        findEmitModels: function() {
            var found = [];
            var results = Entities.findEntities(this.position, SEARCH_RADIUS);
            results.forEach(function(result) {
                var properties = Entities.getEntityProperties(result);
                if (properties.name === _this.prefix + "light-model") {
                    found.push(result);
                }
            });
            return found;
        },

        findSwitch: function() {
            var found = [];
            var results = Entities.findEntities(this.position, SEARCH_RADIUS);
            results.forEach(function(result) {
                var properties = Entities.getEntityProperties(result);
                if (properties.name === "hifi-home-living-room-light-switch-up") {
                    found.push(result);
                }
            });
            return found;
        },

        toggleLights: function() {

            var glowLights = this.findGlowLights();
            var masterLights = this.findMasterLights();
            var emitModels = this.findEmitModels();

            glowLights.forEach(function(glowLight) {
                //     _this.glowLightOff(glowLight);
            });

            masterLights.forEach(function(masterLight) {
                _this.masterLightOff(masterLight);
            });

            emitModels.forEach(function(emitModel) {
                _this.modelEmitOff(emitModel);
            });


            Audio.playSound(this.switchSound, {
                volume: 0.5,
                position: this.position
            });

            Entities.editEntity(this.entityID, {
                position: {
                    x: 1103.9894,
                    y: 460.6867,
                    z: -75.5650
                }
            });


            var otherSwitch = this.findSwitch();

            print('other switch:: ' + otherSwitch)


            var success = Entities.editEntity(otherSwitch.toString(), {
                position: {
                    x: 1103.5823,
                    y: 460.6867,
                    z: -75.6313
                }
            })
            print('edit success ' + success)
        },

        preload: function(entityID) {
            this.entityID = entityID;
            setEntityCustomData('grabbableKey', this.entityID, {
                wantsTrigger: true
            });

            var properties = Entities.getEntityProperties(this.entityID);

            //The light switch is static, so just cache its position once
            this.position = Entities.getEntityProperties(this.entityID, "position").position;
        }
    };

    // entity scripts always need to return a newly constructed object of our type
    return new Switch();
});