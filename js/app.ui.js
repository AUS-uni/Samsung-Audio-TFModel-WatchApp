/*
 * Copyright (c) 2016 Samsung Electronics Co., Ltd. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*global window, document*/

/**
 * Application UI module.
 * It is responsible for managing user interface.
 *
 * @module app.ui
 * @requires {@link app.model}
 * @requires {@link app.helpers}
 * @namespace app.ui
 * @memberof app
 */

window.app = window.app || {};

// strict mode wrapper
(function defineAppUi(app) {
    'use strict';

    /**
     * Photons to signal strength ratio.
     *
     * @memberof app.ui
     * @const {number}
     */
    var PHOTONS_RATIO = 0.002,

        /**
         * Update sensor data interval in milliseconds.
         *
         * @memberof app.ui
         * @private
         * @const {number}
         */
        SENSOR_DATA_UPDATE_INTERVAL = 1000,

        /**
         * Device radius in pixels.
         *
         * @memberof app.ui
         * @private
         * @const {number}
         */
        DEVICE_RADIUS = 180,

        /**
         * Maximum photon velocity (pixels per frame on axis).
         *
         * @memberof app.ui
         * @private
         * @const {number}
         */
        MAX_PHOTON_VELOCITY = 4,

        /**
         * Canvas element.
         *
         * @memberof app.ui
         * @private
         * @type {HTMLElement}
         */
        canvas = document.getElementById('app-canvas'),

        /**
         * Canvas context.
         *
         * @memberof app.ui
         * @private
         * @type {CanvasRenderingContext2D}
         */
        context = canvas.getContext('2d'),

        /**
         * Counter element.
         *
         * @memberof app.ui
         * @private
         * @type {HTMLElement}
         */
        counter = document.getElementById('counter'),

        /**
         * Stores photons instances.
         *
         * @memberof app.ui
         * @private
         * @type {Photon[]}
         */
        photons = [],

        /**
         * Photons count.
         *
         * @memberof app.ui
         * @private
         * @type {number}
         */
        count = app.model.MAX_SIGNAL_STRENGTH * PHOTONS_RATIO;

    /**
     * Creates Photon instance.
     * Sets initial parameters.
     *
     * @memberof app.ui
     * @private
     * @constructor
     * @param {number} i Photon index.
     */
    function Photon(i) {
        // initial position
        this.x = (Math.random() - 0.5) * DEVICE_RADIUS;
        this.y = (Math.random() - 0.5) * DEVICE_RADIUS;

        // velocity vector;
        this.dx = (Math.random() - 0.5) * MAX_PHOTON_VELOCITY;
        this.dy = (Math.random() - 0.5) * MAX_PHOTON_VELOCITY;

        this.color = 'rgb(' + [
            Math.round(i / count * 192) + 64,
            Math.round(i / count * 255 * 0.5) + 32,
            Math.round(i / count * 24) + 24
        ].join() + ')';

    }

    /**
     * Reflects velocity vector by provided vector.
     *
     * @memberof app.ui.Photon
     * @private
     * @param {object} vector
     */
    Photon.prototype.reflect = function reflectVelocityVector(vector) {
        var velocityVectorLength = app.helpers.getVectorLength({
                x: this.dx,
                y: this.dy
            }),
            unitVelocity = app.helpers.unitVector({
                x: this.dx,
                y: this.dy
            }),
            unitCircleNormal = app.helpers.unitVector({
                x: vector.x,
                y: vector.y
            }),
            d = 0;

        this.x -= this.dx;
        this.y -= this.dy;

        d = Math.max(
            0.03,
            app.helpers.vectorsDotProduct(unitCircleNormal, unitVelocity)
        );

        // reflect
        this.dx = unitVelocity.x - 2 * d * unitCircleNormal.x;
        this.dy = unitVelocity.y - 2 * d * unitCircleNormal.y;

        // restore velocity
        this.dx *= velocityVectorLength;
        this.dy *= velocityVectorLength;
    };

    /**
     * Draws filled circle in the place of Photon.
     *
     * @memberof app.ui.Photon
     * @private
     */
    Photon.prototype.drawHit = function drawHit() {
        var pos = this.getCanvasCoords();

        context.beginPath();
        context.arc(pos.x, pos.y, 12, 0, 2 * Math.PI, false);
        context.fillStyle = this.color;
        context.fill();
    };

    /**
     * Moves Photon.
     *
     * @memberof app.ui.Photon
     * @private
     */
    Photon.prototype.move = function movePhoton() {
        this.x += this.dx;
        this.y += this.dy;

        if (Math.sqrt(this.x * this.x + this.y * this.y) > 180) {
            this.drawHit();
            this.reflect({x: this.x, y: this.y - 0.5});
        }
    };

    /**
     * Draws Photon.
     *
     * @memberof app.ui.Photon
     * @private
     */
    Photon.prototype.draw = function drawPhoton() {
        var pos = this.getCanvasCoords();

        context.beginPath();
        context.arc(pos.x, pos.y, 2, 0, 2 * Math.PI, false);
        context.fillStyle = this.color;
        context.fill();
    };

    /**
     * Calculates and returns translated Photon position.
     *
     * @memberof app.ui.Photon
     * @private
     * @returns {object}
     */
    Photon.prototype.getCanvasCoords = function getCanvasCoords() {
        return {
            x: this.x + DEVICE_RADIUS,
            y: this.y + DEVICE_RADIUS
        };
    };

    /**
     * Draws animation frame.
     *
     * @memberof app.ui
     * @private
     */
    function draw() {
        var i = 0;

        context.globalAlpha = 0.1;
        context.fillStyle = '#000';
        context.fillRect(0, 0, 360, 360);
        context.globalAlpha = 1;

        for (i = 0; i < count; i += 1) {
            photons[i].move();
            photons[i].draw();
        }

        window.requestAnimationFrame(draw);
    }

    /**
     * Handles update counter value and sets number of visible photons.
     *
     * @memberof app.ui
     * @private
     * @param {LightData} sensorData
     */
    function onSensorValueReceived(sensorData) {
        counter.innerText = sensorData.lightLevel + ' lx';
        count = sensorData.lightLevel * PHOTONS_RATIO;
    }

    /**
     * Updates view. Gets value from model.
     * Provides callback function to be called on model value return.
     *
     * @memberof app.ui
     * @private
     */
    function updateView() {
        app.model.getSensorValue(onSensorValueReceived);
    }

    /**
     * Initializes view.
     * Sets canvas size.
     * Initializes Photons instances.
     *
     * @memberof app.ui
     * @public
     */
    function init() {
        var i = 0;

        canvas.width = DEVICE_RADIUS * 2;
        canvas.height = DEVICE_RADIUS * 2;

        for (i = 0; i < count; i += 1) {
            photons.push(new Photon(i));
        }

        count = 0;

        draw();

        window.setInterval(updateView, SENSOR_DATA_UPDATE_INTERVAL);
    }

    app.ui = {
        init: init
    };

}(window.app));
