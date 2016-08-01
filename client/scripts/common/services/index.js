'use strict';

module.exports = function(app) {
    // inject:start
    require('./contactDialog.service')(app);
    require('./pokefilter.service')(app);
    require('./pokemonFactory.service')(app);
    // inject:end
};