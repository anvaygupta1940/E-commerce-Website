const router = require("express").Router();
const User = require("../models/User.js");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");


/* REGISTER  */
router.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.CRYPTO_SEC_KEY).toString()
    });

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json(err);
    }
})


/* LOGIN */
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) return res.status(401).json("Wrong Credentials");

        const Password = CryptoJS.AES.decrypt(user.password, process.env.CRYPTO_SEC_KEY);
        const OriginalPassword = Password.toString(CryptoJS.enc.Utf8);

        if (OriginalPassword !== req.body.password) return res.status(401).json("Wrong password Credentials");


        // after login -> creating json web token
        // after login process we provide the user a json token so whenever they make a request regarding
        // updating deleting .. we verify whether its his or not
        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin
            },
            process.env.JWT_SEC_KEY,
            { expiresIn: "3d" }  // after 3 days we should not be able to use this accesstoken and should login again
        )
        const { password, ...others } = user._doc;
        res.status(200).json({ ...others, accessToken });
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
})
module.exports = router;