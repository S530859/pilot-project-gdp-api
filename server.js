const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv').config();
const config = require('./config/config')
const dbCon = require('./config/database')
const app = express()
const cors = require('cors')

//load routes files
var userRoutes = require('./modules/user/user.route');
//model
var User = require('./modules/user/model/user.js');

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//enabling express session
app.use(session({resave: true, saveUninitialized: true,secret: 'gdp'}));

//cors
app.use(cors())
// view engine setup
app.set("views", path.resolve(__dirname, "views")); // path to views
app.use(express.static(path.join(__dirname, 'views')));
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//server routes
app.use('/api/user', userRoutes);

//token authorization if required
app.use(function (req, res, next) {
  var token = (req.headers && req.headers.accesstoken) || (req.query && req.query.accessToken);
  if (token && token.length) {
    jwt.verify(token, config.jwtTokenSecret, function(err, decoded) {
      if(err || !decoded){
        return res.status(400).json({message : 'Unauthorized user'})
      }
      //req.user
      User.findOne({
        token: token
      },'-__v -modifiedDate -createdDate')
      .exec(function (err, user) {
        if (err) {
          return res.status(389).json({message : err});
        }
        req.user = user;
        next();
      });
    });
    
  } else {
    next();
  }
});

// set port 
app.set('port', (process.env.PORT || 4003));



// catch 404 and forward to error handler
app.use((req, res, next) => {
    res.render("404");
});


app.listen(app.set('port'), function () {
  console.log('Server started art port: ' + app.get('port'));
});


