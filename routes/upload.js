const router = require("express").Router();
//upload img plugin
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images");
    },
    filename: (req, file, cb) => { 
        cb(null, req.body.name);
    },
});

const upload = multer({storage});
//upload Image API
router.post("/", upload.single('file'), (req, res) => {
    try {
        return res.status(200).json("Image Upload Success !")
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;