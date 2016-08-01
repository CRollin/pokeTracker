'use strict';
var servicename = 'contactDialog';

module.exports = function(app) {

    var dependencies = ['$mdDialog'];

    function service($mdDialog) {
        var alert = $mdDialog.alert({
            title: 'Contact',
            content: 'Want to report a bug, suggest an improvement or simply share your feedback? Send an email to <a href="mailto:poke.tracker.dev@gmail.com">poke.tracker.dev@gmail.com</a> :)',
            ok: 'Got it!'
        });

        var showContactDialog = function () {
            $mdDialog.show(alert);
        };

        return {
            showContactDialog: showContactDialog
        };

    }
    service.$inject = dependencies;
    app.factory(app.name + '.' + servicename, service);
};