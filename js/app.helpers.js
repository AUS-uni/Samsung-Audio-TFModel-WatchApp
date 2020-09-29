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

/*global window*/

/**
 * Application helpers module.
 * Provides helper function.
 *
 * @module app.helpers
 * @requires {@link app}
 * @namespace app.helpers
 * @memberof app
 */

// make sure that "app" namespace is created
window.app = window.app || {};

(function defineAppModel(app) {
    'use strict';

    /**
     * Calculates vector length.
     *
     * @memberof app.ui
     * @public
     * @param {object} vector
     * @returns {number}
     */
    function getVectorLength(vector) {
        return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
    }

    /**
     * Computes unit vector from provided vector.
     *
     * @memberof app.ui
     * @public
     * @param {object} vector
     * @returns {object}
     */
    function unitVector(vector) {
        var length = getVectorLength(vector);

        return {
            x: vector.x / length,
            y: vector.y / length
        };
    }

    /**
     * Calculates dot product of two vectors.
     *
     * @memberof app.ui
     * @public
     * @param {object} vector1
     * @param {object} vector2
     * @returns {number}
     */
    function vectorsDotProduct(vector1, vector2) {
        return vector1.x * vector2.x + vector1.y * vector2.y;
    }

    app.helpers = {
        getVectorLength: getVectorLength,
        unitVector: unitVector,
        vectorsDotProduct: vectorsDotProduct
    };

}(window.app));
