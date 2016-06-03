module.exports = function(app) {
    var status = require('../controllers/status.server.controller');

    app.get('/', status.redirect);

    app.get('/api', status.redirect);

    app.get('/api/status', status.render);
};