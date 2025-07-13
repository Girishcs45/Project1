const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require ("../controllers/user.js");
function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(next);
    };
};

router.get("/signup", userController.rendersign);

router.post("/signup" , wrapAsync(userController.signup));

router.get("/login",userController.loginpage);

router.post("/login", saveRedirectUrl,
    passport.authenticate("local",{failureRedirect: "/login",failureFlash:true}),
    userController.login);

router.get("/logout",userController.logout);

module.exports = router;
