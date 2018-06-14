var User = require('../model/user.js');
const jwt = require('jsonwebtoken');

/**
 * Check whether user Logged in or not
 */
var isLoggedIn = function (req, res) {
  if(req && req.user){
      var userData  = req.user;
      userData.password = undefined;
      userData.salt= undefined;
      res.json({code: 200, isLoggedIn : true, message :'User is logged in'});
  }else{
      res.json({code: 500, isLoggedIn : false, message :'User  not logged in'});
  }

};

module.exports.isLoggedIn = isLoggedIn;

/**
 * Signin
 */
var signin = function (req, res,next) {
  // Init user and add missing fields
  User.findOne({
      email: req.body.email
    },'-__v -modifiedDate -createdDate')
  .exec(function (err, user) {
      if (err) {
        return res.status(389).json({message : err});
      }
      if (!user || !user.authenticate(req.body.password)) {
        return res.status(389).json({message : "Invalid email/password"});
      }
      if (user && user.status != 'ACTIVE') {
        return res.status(389).json({message : "Please contact admin."});
      }
      req.session.user = user;
      next();
    });
};
module.exports.signin = signin;

/**
 * Save the access token and share with the frontend
 */
var saveTokenNRespond = function (req, res,next) {
  var token = jwt.sign({ expiresIn: '2d', data: req.session.user },'pilot'); 
  var user = new User(req.session.user);
  user.token = token

  user.save(function (err) {
    if (err) {/*
      console.log(err)*/
      res.status(389).json({message : err});
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;
      res.status(200).json({message : "User signed in succeessfully",token : token});
    }
  });
};
module.exports.saveTokenNRespond = saveTokenNRespond;

/**
 * Signup 
 */
var signup = function (req, res) {
    // Init user and add missing fields
    var user = new User(req.body);
    user.dob = new Date();  //harcoded
    console.log(user)
    // Then save the user
    user.save(function (err) {
      if (err) {/*
        console.log(err)*/
        res.status(389).json({message : err});
      } else {
        res.status(200).json({message : "User signed up succeessfully"});
      }
    });
  };
  module.exports.signup = signup;

  /**
 * Signup
 */
var getUsersList = function (req, res) {
    
    User.find({ },'-__v -modifiedDate -createdDate -password -salt')
       .exec(function (err, userDetail) {
      if (err) {/*
        console.log(err)*/
        res.status(389).json({message : err});
      } else {
       res.status(200).json({message : "User listfetched succeessfully", data:userDetail});
      }
    });
  };
  module.exports.getUsersList = getUsersList;