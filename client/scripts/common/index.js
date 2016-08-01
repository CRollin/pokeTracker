'use strict';
var angular = require('angular');
require('angular-ui-router');
require('angular-material');
require('restangular');

var modulename = 'common';

module.exports = function(namespace) {

    var fullname = namespace + '.' + modulename;

    var app = angular.module(fullname, ['ui.router', 'ngMaterial', 'restangular']);
    // inject:folders start
    require('./controllers')(app);
require('./services')(app);
    // inject:folders end
    app.namespace = app.namespace || {};

    var configBackDeps = ['RestangularProvider'];
    var configBack = function(RestangularProvider) {
        RestangularProvider.setBaseUrl('https://pokevision.com/map/data/');
    };
    configBack.$inject = configBackDeps;
    app.config(configBack);

    var configRoutesDeps = ['$stateProvider', '$urlRouterProvider'];
    var configRoutes = function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider.state('home', {
            url: '/',
            template: require('./views/home.html'),
            controller: fullname + '.home',
            controllerAs: 'home'
        }).state('scanResults', {
            url: '/scan',
            template: require('./views/scanResults.html'),
            controller: fullname + '.scanResults',
            controllerAs: 'scanResults'
        }).state('settings', {
            url: '/settings',
            template: require('./views/settings.html'),
            controller: fullname + '.settings',
            controllerAs: 'settings'
        });
    };
    configRoutes.$inject = configRoutesDeps;
    app.config(configRoutes);

    return app;
};