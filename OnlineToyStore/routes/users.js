var express = require('express');
var router = express.Router();

var MongoClient = require('mongodb').MongoClient;

/* GET users listing. */
router.get('/', function(req, res, next) {
  
MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true },function (err, db) {
  if (err) throw err

  var dbo = db.db('test')
  
  dbo.collection('users').find().toArray(function (err, result) {
    if (err) throw err

    res.json(result);
  })
})
});



module.exports = router;
