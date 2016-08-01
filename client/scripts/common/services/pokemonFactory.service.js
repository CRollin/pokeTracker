'use strict';
var servicename = 'pokemonFactory';

module.exports = function(app) {

    var dependencies = ['Restangular', '$http', '$q', app.name + '.pokefilter'];

    function service(Restangular, $http, $q, pokefilter) {
        var current_position,
            status;

        var equirectangularDistance = function (poke_lat, poke_long) {
            var deg2rad,
                rad_poke_lat,
                rad_current_lat,
                rad_delta_long,
                x,
                y;
            deg2rad = function (deg) {
                return deg * (Math.PI / 180);
            };
            rad_poke_lat = deg2rad(poke_lat);
            rad_current_lat = deg2rad(current_position.latitude);
            rad_delta_long = deg2rad(poke_long - current_position.longitude);
            x = rad_delta_long * Math.cos(0.5 * (rad_poke_lat + rad_current_lat));
            y = rad_poke_lat - rad_current_lat;
            return 6371 * Math.sqrt(x * x + y * y);
        };

        var are_duplicates = function (poke1, poke2) {
            return poke1.pokemonId === poke2.pokemonId && poke1.latitude === poke2.latitude && poke1.longitude === poke2.longitude;
        };

        var processPokemonList = function (response) {
            var i,
                time,
                pokemons,
                poke_statuses,
                is_filtered_pokemon,
                is_duplicate;
            poke_statuses = pokefilter.getPokemons();
            pokemons = [];
            if (response.pokemon.length === 0) {
                status = -1;
            } else {
                time = Math.floor(new Date().getTime() / 1000);
                for (i = 0; i < response.pokemon.length; i += 1) {
                    is_filtered_pokemon = !poke_statuses[response.pokemon[i].pokemonId - 1].status;
                    is_duplicate = i > 0 && are_duplicates(response.pokemon[i - 1], response.pokemon[i]);
                    if (!is_filtered_pokemon && !is_duplicate) {
                        response.pokemon[i].expiration_time -= time;
                        response.pokemon[i].distance = equirectangularDistance(response.pokemon[i].latitude, response.pokemon[i].longitude);
                        pokemons.push(response.pokemon[i]);
                    }
                }
                if (pokemons.length === 0) {
                    status = 0;
                } else {
                    status = 1;
                }
            }
            return pokemons;
        };

        var loadPokemonNearPosition = function (position) {
            var result = $q.defer();
            current_position = position.coords;
            console.log(position);
            if (typeof cordova === 'undefined') {
                $http({
                    method: 'GET',
                    url: 'http://localhost:8080'
                }).then(function successCallback(response) {
                    result.resolve(processPokemonList(response.data));
                }, function errorCallback(response) {
                    console.log("Error: " + response);
                    result.reject(0);
                });
            } else {
                Restangular.one(position.coords.latitude.toString(), position.coords.longitude).get().then(function (response) {
                    result.resolve(processPokemonList(response));
                });
            }
            return result.promise;
        };

        return {
            loadPokemonNearPosition: loadPokemonNearPosition
        };

    }
    service.$inject = dependencies;
    app.factory(app.name + '.' + servicename, service);
};