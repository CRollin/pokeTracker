'use strict';
var servicename = 'pokefilter';

module.exports = function(app) {

    var dependencies = ['$window'];

    function service($window) {
        var pokemons = [];

        var setPokemons = function (new_pokemons) {
            var i;
            pokemons = new_pokemons;
            for (i = 0; i < pokemons.length; i += 1) {
                $window.localStorage.setItem((i + 1).toString(), pokemons[i].status ? "1" : "0");
            }
        };
        var getPokemons = function () {
            if (pokemons.length === 0) {
                var i,
                    current_pokeStatus;
                for (i = 1; i < 152; i += 1) {
                    current_pokeStatus = $window.localStorage.getItem(i.toString());
                    if (current_pokeStatus === null) {
                        $window.localStorage.setItem(i.toString(), "1");
                        current_pokeStatus = "1";
                    }
                    pokemons.push({
                        img: "./images/app/" + i + ".png",
                        status: current_pokeStatus === "1"
                    });
                }
            }
            return pokemons;
        };

        return {
            setPokemons: setPokemons,
            getPokemons: getPokemons
        };

    }
    service.$inject = dependencies;
    app.factory(app.name + '.' + servicename, service);
};