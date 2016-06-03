var resemble = require("node-resemble-js"),
    fs = require("fs"),
    uuid = require("uuid"),
    _ = require("underscore"),
    path = require("path"),
    util = require("util");

var pathTemplate = "../../public/diff/%s_diff.png";

exports.render = function(req, res) {
    var actual = req.files.actual[0].path;
    var expect = req.files.expect[0].path;

    console.log(`Actual: ${actual} \nExpected: ${expect}`);

    var actualData = fs.readFileSync(actual);
    var expectData = fs.readFileSync(expect);

    resemble(actualData).compareTo(expectData).onComplete(function(data){
        fs.unlinkSync(actual);
        fs.unlinkSync(expect);

        var respData = {"code": 200, "data": data };

        if(Number(data.misMatchPercentage) >= 0.01) {
            respData.code = 300;
        }

        if(Boolean(data.isSameDimensions) !== true) {
            respData.code = 400;
        }

        if(Number(data.misMatchPercentage) >= 0.01
            && Boolean(data.isSameDimensions) !== true) {
            respData.code = 500;
        }

        if (Number(data.misMatchPercentage) >= 0.01
            || Boolean(data.isSameDimensions) !== true) {
            var key = uuid.v1();

            data.getDiffImage().pack().pipe(fs.createWriteStream(path.join(__dirname
                , util.format(pathTemplate, key))));

            _.extend(respData, {diff: {key: key}});
        }

        res.json(respData);
    });
};

exports.renderFile = function(req, res) {
    res.sendFile(path.join(__dirname, util.format(pathTemplate, req.params.key)));
};

exports.deleteFile = function(req, res) {
    fs.unlink(path.join(__dirname, util.format(pathTemplate, req.params.key)), function (err) {
        if(err) {
            res.status(404)
               .send(util.format("Image by key(%s) was not found.", req.params.key));
        } else {
            res.json({message: util.format("Diff file by key(%s) was deleted success!"
                , req.params.key)});
        }
    });
};