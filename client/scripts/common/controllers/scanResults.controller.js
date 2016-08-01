'use strict';
var controllername = 'scanResults';

module.exports = function(app) {
    var fullname = app.name + '.' + controllername;
    /*jshint validthis: true */

    var deps = ['$state', '$interval', app.name + '.pokemonFactory', app.name + '.contactDialog'];

    function controller($state, $interval, pokemonFactory, contactDialog) {
        var vm = this;
        var current_position;
        vm.controllername = fullname;
        vm.pokemons = [];
        vm.scanning = false;
        var scanInterval,
            countdownInterval;

        var startCountdown = function () {
            vm.countdown = 30;
            if (countdownInterval) {
                $interval.cancel(countdownInterval);
            }
            countdownInterval = $interval(function () {vm.countdown -= 1; }, 1000);
        };
        var stopCountdown = function () {
            vm.countdown = -1;
            $interval.cancel(countdownInterval);
        };

        var scan = function () {
            startCountdown();
            navigator.geolocation.getCurrentPosition(function (pos) {
                current_position = pos.coords;
                pokemonFactory.loadPokemonNearPosition(pos).then(function successCallback(pokemons) {
                    vm.loading = false;
                    vm.pokemons = pokemons;
                    if (pokemons.length === 0) {
                        vm.errorMessage = "No Pokemon to display. This can either be due to your filters or the PTC servers.";
                    }
                }, function errorCallback(err) {
                    console.log("Error: " + err);
                });
            });
        };
        vm.goToPokemon = function (poke_position) {
            console.log(poke_position);
            launchnavigator.navigate([poke_position.latitude, poke_position.longitude], {
                start: [current_position.latitude, current_position.longitude],
                transportMode: launchnavigator.TRANSPORT_MODE.BICYCLING
            });
        };
        vm.toSettings = function () {
            if (vm.scanning) {
                $interval.cancel(scanInterval);
                $interval.cancel(countdownInterval);
            }
            $state.go('settings');
        };
        vm.contact = function () {
            contactDialog.showContactDialog();
        };
        var launchScan = function () {
            vm.scanning = true;
            scan();
            scanInterval = $interval(scan, 30000);
        };
        var stopScan = function () {
            vm.loading = false;
            vm.scanning = false;
            $interval.cancel(scanInterval);
            stopCountdown();
        };
        vm.buttons = {
            control: {
                style: function () {
                    return (vm.scanning) ? "fa fa-lg fa-pause" : "fa fa-lg fa-play";
                },
                action: function () {
                    (vm.scanning) ? stopScan() : launchScan();
                }
            }
        };

        var activate = function() {
            vm.loading = true;
            launchScan();
        };
        activate();
    }

    controller.$inject = deps;
    app.controller(fullname, controller);
};
