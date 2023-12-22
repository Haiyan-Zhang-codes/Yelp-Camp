const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const passport = require('passport');
const {storeReturnTo} = require('../middleware')
const Users = require('../controllers/users')

router.route('/register')
    .get( Users.renderRegisterForm)
    .post( catchAsync(Users.createUser));

router.route('/login')
    .get( Users.renderLoginForm)
    .post(storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), Users.login)

router.get('/logout', Users.logout)


module.exports = router;