//
//  growingPlantEntityScript.js
//  examples/homeContent/plant
//
//  Created by Eric Levin on 2/10/16.
//  Copyright 2016 High Fidelity, Inc.
//
//  This entity script handles the logic for growing a plant when it has water poured on it
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html



(function() {
    Script.include("../../libraries/tween.js");
    Script.include("../../libraries/utils.js");

    var _this;
    var TWEEN = loadTween();
    GrowingPlant = function() {
        _this = this;
        _this.flowers = [];
        _this.delay = 1000;
    };

    GrowingPlant.prototype = {


        water: function() {
            print("EBL IM BEING WATERED!");
        },

        createFlowers: function() {
            var NUM_FLOWERS = 20
            for (var i = 0; i < NUM_FLOWERS; i++) {
                var segment = i / NUM_FLOWERS * Math.PI * 2;
                var radius = randFloat(0.13, 0.25);
                var position = Vec3.sum(_this.position, {
                    x: radius * Math.cos(segment),
                    y: 0.15,
                    z: radius * Math.sin(segment)
                });
                _this.createFlower(position);
            }
        },

        createFlower: function(position) {
            var size = randFloat(0.1, 0.2);
            var startingFlowerDimensions = {
                x: size,
                y: 0.001,
                z: size
            };
            var flowerUserData = {
                ProceduralEntity: {
                    shaderUrl: "file:///C:/Users/Eric/hifi/examples/homeContent/plant/flower.fs",
                    uniforms: {
                        iBloomPct: randFloat(0.4, 0.7),
                        hueTwerking: randFloat(10, 30)
                    }
                }
            };
            var flower = Entities.addEntity({
                type: "Sphere",
                position: position,
                dimensions: startingFlowerDimensions,
                userData: JSON.stringify(flowerUserData)
            });
            _this.flowers.push(flower);
     
        },

        createCactus: function() {
            var MODEL_URL = "https://s3-us-west-1.amazonaws.com/hifi-content/eric/models/cactus.fbx"
            var dimensions = {
                x: 0.09,
                y: 0.01,
                z: 0.09
            };
            _this.cactus = Entities.addEntity({
                type: "Model",
                modelURL: MODEL_URL,
                position: _this.position,
                dimensions: dimensions
            });

   
     
        },


        preload: function(entityID) {
            print("EBL PRELOAD");
            this.entityID = entityID;
            this.props = Entities.getEntityProperties(this.entityID, ["position", "dimensions"]);
            this.position = this.props.position;
            this.dimensions = this.props.dimensions;
            this.createCactus();
            this.createFlowers();
        },

    

        unload: function() {
            Entities.deleteEntity(_this.cactus);
            _this.flowers.forEach(function(flower) {
                Entities.deleteEntity(flower);
            });
            print("EBL UNLOAD DONE")
        }

    };

    // entity scripts always need to return a newly constructed object of our type
    return new GrowingPlant();
});