'use strict';

module.exports = function(app) {
    // inject:start
    require('./home.controller')(app);
    require('./scanResults.controller')(app);
    require('./settings.controller')(app);
    // inject:end
};