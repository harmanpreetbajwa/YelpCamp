const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

router.get('/register', (req, res) => {
    res.render('user/register');
})

router.post('/register', catchAsync(async (req, res)=> {
    const {username, email, password} = req.body;
    const user = new User({email, username});
    const registeredUser = await User.register(user, password);
    req.flash('success', 'Welcome to YelpCamp!')
    res.redirect('/campgrounds')
}));

module.exports = router;