exports.render = function(req, res) {
    res.json({"code": 200, "text": "server is running"});
};

exports.redirect = function(req, res) {
    res.redirect(301, '/api/status');
};