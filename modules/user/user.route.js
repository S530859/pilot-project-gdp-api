const express = require('express'),
    router = express.Router(),
    users = require('./controller/authenticate')

// Setting up the users authentication api
router.route('/signup').post(users.signup);

router.route('/getUsersList').get(users.getUsersList);

module.exports = router;