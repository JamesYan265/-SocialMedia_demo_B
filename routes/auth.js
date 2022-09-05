const router = require("express").Router();
const User = require('../models/User');

//user register API
// new User && findOne 是 Mongoose的doc
router.post('/register', async (req, res) => {
    try {
        const newUser =  await new User({
            username: req.body.username,
            email:req.body.email,
            password:req.body.password,
        });

        const user = await newUser.save();
        return res.status(200).json(user);

    } catch (err) {
        return res.status(500).json(err);
    }
})

//login API
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({email:req.body.email})
        if(!user) return res.status(404).send("The user is not exist");

        const vailedPassword = req.body.password === user.password;
        if(!vailedPassword) return res.status(400).json("Wrong Password!");

        return res.status(200).json(user);

    } catch (err) {
        return res.status(500).json(err);
    }
})

// router.get("/", (req, res) => {
//     res.send("auth Router");
// })

module.exports = router;