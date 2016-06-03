var app = require('../server'),
    request = require('supertest'),
    expect = require("chai").expect,
    path = require("path");

describe("Test: diff.server.controller", function () {

    var images = [{f1: "file1.png", f2: "file2.png", misMatchPercentage: '0.00'}
            , {f1: "middle_file1.png", f2: "middle_file2.png", misMatchPercentage: '0.00'}];

    for(var i in images) {
        it(`POST /api/diff  Attachment:actual=${images[i].f1} expect=${images[i].f2}`, function (done) {
            request(app).post('/api/diff')
                .attach('expect', path.join(__dirname, "../test_img/", images[i].f1))
                .attach('actual', path.join(__dirname, "../test_img/", images[i].f2))
                .expect(200)
                .end(function (err, res) {
                    expect(err).to.be.an('null');
                    expect(res.body.code).to.be.deep.equal(200);
                    expect(res.body.data).to.be.an('object');
                    expect(res.body.data).to.be.an('object');
                    expect(res.body.data.isSameDimensions).to.be.true;
                    expect(res.body.data.misMatchPercentage).to.equal(images[i].misMatchPercentage);
                    expect(res.body.data.dimensionDifference).to.deep.equal({width: 0, height: 0});
                    expect(res.body.data.analysisTime).to.not.be.undefined;

                    done();
                });
        });
    }

    it("POST /api/diff Attachment: actual=file1.png expect=middle_file1.png", function (done) {
        request(app).post('/api/diff')
            .attach('expect', path.join(__dirname, "../test_img/file1.png"))
            .attach('actual', path.join(__dirname, "../test_img/middle_file1.png"))
            .expect(200)
            .end(function (err, res) {
                expect(err).to.be.an('null');
                expect(res.body.code).to.be.deep.equal(500);
                expect(res.body).to.have.property("diff");
                expect(res.body.diff).to.have.property("key");
                expect(res.body.diff.key).to.not.be.undefined;

                done();
            });
    });

    it("GET /api/diff/8e8f39a0-18e4-11e6-bf0c-9d703ae35d86", function (done) {
        request(app).get('/api/diff/8e8f39a0-18e4-11e6-bf0c-9d703ae35d86')
            .expect(200, done);
    });

    it("DELETE /api/diff/11111111", function(done) {
        request(app).delete("/api/diff/11111111")
            .expect(404, done);
    });
});