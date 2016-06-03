var app = require('../server'),
    request = require('supertest');

describe("Test: status.server.controller", function () {
    it("GET /", function (done) {
        request(app).get("/")
            .expect(301, done);
    });

    it("GET /api", function (done) {
        request(app).get("/api")
            .expect(301, done);
    });

    it("GET /api/status", function (done) {
        request(app).get('/api/status')
            .expect(200, {
                "code": 200,
                "text": "server is running"
            }, done);
    });
});