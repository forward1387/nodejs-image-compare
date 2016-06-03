var multer  = require("multer");
var path = require("path");
var fs = require("fs");

var imgUploadPath = path.join(__dirname, "../../public/uploads");

if (!fs.existsSync(imgUploadPath)){
    fs.mkdirSync(imgUploadPath);
}

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, imgUploadPath)
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + file.originalname)
    }
});

var upload = multer({ storage: storage });

module.exports = function(app) {
    var diff = require("../controllers/diff.server.controller");

    app.post('/api/diff'
        , upload.fields([{ name: 'expect', maxCount: 1 }, { name: 'actual', maxCount: 1 }])
        , diff.render);

    app.get('/api/diff/:key', diff.renderFile);

    app.delete('/api/diff/:key', diff.deleteFile);
};
