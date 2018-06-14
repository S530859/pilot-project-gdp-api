const express = require('express'),
    router = express.Router(),
    users = require('./controller/authenticate')

// Signin route for a user
router.route('/signin').post(users.signin,users.saveTokenNRespond);

// Signup route for a user
router.route('/signup').post(users.signup);

// Get user list route for a user
router.route('/getUsersList').get(users.getUsersList);

// Check user logged in or not
router.route('/isLoggedIn').get(users.isLoggedIn);

module.exports = router;