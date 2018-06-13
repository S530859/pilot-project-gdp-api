const express = require('express'),
    router = express.Router(),
    users = require('./controller/authenticate')

router.route('/signin').post(users.signin,users.saveTokenNRespond);

// Setting up the users authentication api
router.route('/signup').post(users.signup);

router.route('/getUsersList').get(users.getUsersList);

module.exports = router;