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
 * Main application module.
 * Provides a namespace for other application modules.
 * Handles application life cycle.
 *
 * @module app
 * @requires {@link app.model}
 * @requires {@link app.ui}
 * @namespace app
 */

window.app = window.app || {};

// strict mode wrapper
(function defineApp(app) {
    'use strict';

    /**
     * Exits application.
     *
     * @memberof app
     * @public
     */
    function exitApplication() {
        try {
            tizen.application.getCurrentApplication().exit();
        } catch (e) {
            console.error('Error:', e.message);
        }
    }

    /**
     * Handles tizenhwkey event.
     *
     * @memberof app
     * @private
     * @param {Event} event
     */
    function onHardwareKeysTap(event) {
        if (event.keyName === 'back') {
            exitApplication();
        }
    }

    /**
     * Binds events.
     *
     * @memberof app
     * @private
     */
    function bindEvents() {
        window.addEventListener('tizenhwkey', onHardwareKeysTap);
    }

    /**
     * Initializes application.
     *
     * @memberof app
     * @private
     */
    function init() {
        bindEvents();

        app.model.init();
        app.ui.init();
    }

    window.addEventListener('load', init);
}(window.app));
