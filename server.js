process.env.NODE_ENV = process.env.NODE_ENV || "development";

var express = require("./config/express"),
    config = require("./config/config");

var app = express();

app.listen(config.server.port, function(err) {
    if (err) {
        console.error(err);
    }

    console.log("server listening on http://%s:%d", config.server.host, config.server.port);
    console.log("press CTRL+C to exit");
});

module.exports = app;