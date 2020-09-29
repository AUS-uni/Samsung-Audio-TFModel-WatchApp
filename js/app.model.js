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

/*global window, tizen, console*/

/**
 * Application model module.
 * It is responsible for initializing and managing light sensor.
 *
 * @module app.model
 * @namespace app.model
 * @memberof app
 */

// make sure that "app" namespace is created
window.app = window.app || {};

(function defineAppModel(app) {
    'use strict';

    /**
     * Sensor type constant string.
     *
     * @memberof app.model
     * @private
     * @const {string}
     */
    var SENSOR_TYPE = 'LIGHT',

        /**
         * Maximal signal strength.
         *
         * @memberof app.model
         * @private
         * @const {number}
         */
        MAX_SIGNAL_STRENGTH = 65535,

        /**
         * Stores initialized sensor.
         *
         * @memberof app.model
         * @private
         * @type {LightSensor}
         */
        sensor = null;

    /**
     * Gets sensor state.
     * Calls callback when done with obtained object.
     *
     * @memberof app.model
     * @public
     * @param {function} onGetSuccessCB Success callback.
     */
    function getSensorValue(onGetSuccessCB) {
        if (!sensor) {
            return;
        }

        sensor.start(
            function onSensorStart() {
                sensor.getLightSensorData(
                    onGetSuccessCB,
                    function onError(err) {
                        console.error('Getting light sensor data failed.',
                            err.message);
                    }
                );
                sensor.stop();
            },
            function onError(err) {
                console.error('Could not start light sensor.',
                    err.message);
            }
        );
    }

    /**
     * Initializes model.
     *
     * @memberof app.model
     * @public
     */
    function init() {
        try {
            sensor = tizen.sensorservice.getDefaultSensor(SENSOR_TYPE);
        } catch (err) {
            console.error('Could not access light sensor.',
                err.message);
        }
    }

    app.model = {
        MAX_SIGNAL_STRENGTH: MAX_SIGNAL_STRENGTH,
        init: init,
        getSensorValue: getSensorValue
    };

}(window.app));
