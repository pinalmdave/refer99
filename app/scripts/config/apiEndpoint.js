'use strict';

/**
 * @ngdoc constant
 * @name viralDi.API_ENDPOINT
 * @description
 * # API_ENDPOINT
 * Defines the API endpoint where our resources will make requests against.
 * Is used inside /services/ApiService.js to generate correct endpoint dynamically
 */


angular.module('viralDi')

    // development
    .constant('API_ENDPOINT', {
        host: 'http://localhost',
        port: 3000,
        path: '',
        needsAuth: false
    });


    // live example with HTTP Basic Auth
    /*
    .constant('API_ENDPOINT', {
        host: 'http://myserver.com',
        path: '/api/v2',
        needsAuth: true,
        username: 'whatever',
        password: 'foobar'
    });
    */

