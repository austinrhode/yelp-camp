const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require("../models/user");
const catchAsync = require('../utils/catchAsync');


router.get('/register', (req, res) => {
    res.render("users/register", { title: 'Register' });
})

router.post('/register', catchAsync(async (req, res, next) => {
    try{
        const { username, email, password } = req.body;
        const user = new User({username, email});
        const completeUser = await User.register(user, password);
        req.logIn(completeUser, (err) => {
            if(err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp');
            res.redirect('/campgrounds');
        })
        
    } catch(e){
        req.flash('error', e.message);
        res.redirect('/register');
    }
}))

router.get('/login', (req, res) => {
    res.render('users/login', {title: 'Login'});
})

router.post('/login', passport.authenticate('local',{ failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    const returnUrl = req.session.originalUrl || '/campgrounds';
    delete req.session.originalUrl;
    req.flash('success', 'Welcome Back');
    res.redirect(returnUrl);
})

router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success', 'Catch you later');
    res.redirect('/campgrounds');
})

module.exports = router;