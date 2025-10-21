const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const { renderRegister, renderLogin, createReview, login, logout } = require('../controllers/users')


router.route('/register')
    .get(renderRegister)
    .post(catchAsync(createReview));

router.route('/login')
    .get(renderLogin)
    .post(storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), catchAsync(login));

router.get('/logout', logout);

module.exports = router;