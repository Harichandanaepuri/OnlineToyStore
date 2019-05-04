var express = require('express');
var app = express();
var router = express.Router();
var bodyParser   = require('body-parser');
var MongoClient = require('mongodb').MongoClient
router.use(bodyParser.json())
/* Insert the user info into table */
router.post('/register', function(req, res) {
  console.log(req.body);
  var fname = req.body.fname;
  var lname = req.body.lname;
  var email = req.body.email;
  var pwd = req.body.pwd;
  //connecting to mongo db
  MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true },function (err, db) {
    if (err) throw err
    var dbo = db.db('test')
    var obj = {
      first_name : fname,
      last_name : lname,
      email : email,
      password : pwd
    } 
    dbo.collection('users').insertOne(obj, function(err,res) {
      if (err) throw err;
      db.close();
    })
  })
});


module.exports = router;