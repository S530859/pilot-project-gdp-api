const express = require('express'),
    router = express.Router(),
    users = require('./controller/authenticate')

// Setting up the users authentication api
router.route('/signup').post(users.signup);

module.exports = router;