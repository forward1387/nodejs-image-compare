var express = require('express'),
    path = require('path'),
    morgan = require("morgan"),
    compress = require("compression");

module.exports = function() {
    var app = express();

    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    } else if (process.env.NODE_ENV === 'production') {
        app.use(compress());
    }

    require('../app/routes/status.server.routes.js')(app);
    require('../app/routes/diff.server.routes.js')(app);

    app.use(express.static(path.join(__dirname, '../public')));

    return app;
};