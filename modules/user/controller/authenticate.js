var User = require('../model/user.js');

/**
 * Signup
 */
var signup = function (req, res) {
    // Init user and add missing fields
    var user = new User(req.body);
    user.dob = new Date();
    console.log(user)
    // Then save the user
    user.save(function (err) {
      if (err) {/*
        console.log(err)*/
        res.status(389).json({message : err});
      } else {
        // Remove sensitive data before login
        user.password = undefined;
        user.salt = undefined;
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