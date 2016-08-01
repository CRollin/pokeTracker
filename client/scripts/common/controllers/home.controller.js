'use strict';
var controllername = 'home';

module.exports = function(app) {
    var fullname = app.name + '.' + controllername;
    /*jshint validthis: true */

    var deps = ['$state', app.name + '.contactDialog'];

    function controller($state, contactDialog) {
        var vm = this;
        vm.controllername = fullname;

        vm.toSettings = function () {
            $state.go('settings');
        };
        vm.toScan = function () {
            $state.go('scanResults');
        };
        vm.contact = function () {
            contactDialog.showContactDialog();
        };

        var activate = function() {

        };
        activate();
    }

    controller.$inject = deps;
    app.controller(fullname, controller);
};
