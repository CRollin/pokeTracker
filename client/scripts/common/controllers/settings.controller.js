'use strict';
var controllername = 'settings';

module.exports = function(app) {
    var fullname = app.name + '.' + controllername;
    /*jshint validthis: true */

    var deps = ['$state', app.name + '.pokefilter'];

    function controller($state, pokefilter) {
        var vm = this;
        vm.controllername = fullname;

        vm.switchStatus = function (pokemon) {
            pokemon.status = !pokemon.status;
        };
        vm.toScan = function () {
            pokefilter.setPokemons(vm.pokemons);
            $state.go('scanResults');
        };

        vm.selectAll = function () {
            var i;
            for (i = 0; i < vm.pokemons.length; i += 1) {
                vm.pokemons[i].status = true;
            }
        };
        vm.unselectAll = function () {
            var i;
            for (i = 0; i < vm.pokemons.length; i += 1) {
                vm.pokemons[i].status = false;
            }
        };

        var activate = function() {
            vm.pokemons = pokefilter.getPokemons();
        };
        activate();
    }

    controller.$inject = deps;
    app.controller(fullname, controller);
};
