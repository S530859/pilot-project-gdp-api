const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv').config();
const config = require('./config/config')
const dbCon = require('./config/database')
const app = express()

console.log(config)
// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



//enabling express session
app.use(session({resave: true, saveUninitialized: true,secret: 'gdp'}));


// view engine setup
app.set("views", path.resolve(__dirname, "views")); // path to views
app.use(express.static(path.join(__dirname, 'frontend/dist')));
app.set('views', path.join(__dirname, 'frontend/dist'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(function (req, res, next) {
  var token = (req.headers && req.headers.accesstoken) || (req.query && req.query.accessToken);
  if (token && token.length) {
    jwt.verify(token, config.jwtTokenSecret, function(err, decoded) {
      // if(err || !decoded){
      //   return res.json({
      //     code : 400,message : 'Unauthorized user'
      //   })
      // }
      // //req.user
      // var sql = "SELECT * from  users WHERE accessToken='" + token+"'";

      // dbCon.query(sql, function (err, result) {
      //     if (err) {
      //       return res.json({
      //         code : 400,message : 'Unauthorized user'
      //       })
      //     } else {
      //         req.user = result[0];
      //         next();
      //     }
      // });
      
    });
    
  } else {
    next();
  }
});

// set port 
app.set('port', (process.env.PORT || 4003));



// catch 404 and forward to error handler
app.use((req, res, next) => {
    res.redirect("/404");
});


app.listen(app.set('port'), function () {
  console.log('Server started art port: ' + app.get('port'));
});


