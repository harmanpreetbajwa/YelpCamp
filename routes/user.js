const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');

router.get('/register', (req, res) => {
    res.render('user/register');
});

router.get('/login', (req, res) => {
    res.render('user/login');
})

router.post('/register', catchAsync(async (req, res)=> {
    try{
        const {username, email, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        req.flash('success', 'User successfully registered!!');
        res.redirect('/campgrounds');
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('register');
    }

}));

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), catchAsync(async (req, res)=> {
    req.flash('success', 'Welcome back !');
    res.redirect('/campgrounds');
}));

router.get('/logout', (req, res, next) => {
    req.logout(function (err){
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logged Out.');
        res.redirect('/campgrounds');
    });
});

module.exports = router;