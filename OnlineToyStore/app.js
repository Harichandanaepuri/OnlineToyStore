let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let bodyParser   = require('body-parser');
let logger = require('morgan');
let MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let userRegisterRouter = require('./routes/register');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/register', userRegisterRouter);
// have to move it to register.js
app.use(bodyParser.json())
app.post('/register', function(req,res){
  console.log(req.body);
  let fname = req.body.fname;
  let lname = req.body.lname;
  let username = req.body.username;
  let email = req.body.email;
  let pwd = req.body.pwd;
  let hash = bcrypt.hashSync(pwd, 10);
  //connecting to mongo db
  MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true },function (err, db) {
    if (err) next(err);
    let dbo = db.db('test')
    let obj = {
      first_name : fname,
      last_name : lname,
      username : username,
      email : email,
      password : hash
    } 

  let obj2 = {
    username : username,
    items : []
  }
    dbo.collection('users').insertOne(obj, function(err,res) {
      if (err) throw err;
      db.close();
    });
    dbo.collection('cart').insertOne(obj2, function(err,res) {
      if (err) throw err;
      db.close();
    });
    dbo.collection('history').insertOne(obj2, function(err,res) {
      if (err) throw err;
      db.close();
    });
  })
})

// login check
app.post('/login', function(req,res){
  let username1 = req.body.username1;
  let password1 = req.body.password1;
  console.log(req.body)
  MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true },function (err, db) {
    if (err) console.log("no username found")
    let dbo = db.db('test')
    let obj = {
      username : username1,
    };
    let result = {
      value : true,
      username : ''
    } 
    dbo.collection('users').findOne(obj, function(err,res1) {
      if (err) next(err);
      //check if username exists by checking if we get any response
      if (res1 !== null){
        if(bcrypt.compareSync(password1, res1.password)) {
          // Passwords match
          result = {
            value : true,
            username : res1.username
          }
        } 
        else {
          // Passwords don't match
          console.log(password1)
          console.log(res1.password)
          console.log("password doesn't match")
          result = {
            value : false,
            username : res1.username
          }
        }
        db.close();
        res.json(result);
      }
      else{
        result = {
          value : false,
          username : ''
        }
        console.log("username doesnot exist");
        res.json(result);
      }
      
    });
    
  });
})
//products retrieval
app.get('/products', function(req, res, next) {
  
  MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true },function (err, db) {
    if (err) throw err
  
    var dbo = db.db('test')
    
    dbo.collection('products').find().toArray(function (err, result) {
      if (err) throw err
  
      res.json(result);
    })
  })
  });

//cart updation
app.post('/items', function(req,res,next) {
  let username1 = req.body.username;
  //if (username1 == null)
  //username1 = 'Akshay';
  console.log(req.body);
  MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true },function (err, db) {
    if (err) throw err
    var dbo = db.db('test');
    let obj = {
      username : username1,
    };
    
    dbo.collection('cart').findOne(obj, function(err,result) {
      if (err) next(err);
      result1 = result.items;
      //console.log(json(result1));
      res.json(result1);
    })
  })
});

//add to cart
app.post('/addtocart', function(req,res,next) {
  let username1 = req.body.username;
  let id = req.body.id;
  let check = false;
  let items2 = [];
  let insert2 = {
    username : username1,
    items : []
  }
  MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true },function (err, db) {
    if (err) throw err
    var dbo = db.db('test');
    let obj = {
      username : username1,
    };
    dbo.collection('cart').findOne(obj, function(err,result) {
      if (err) next(err);
      result1 = result.items;
      items2 = result1;
      console.log('before', result1);
      result1.map(x => {
        if (x.id === id){
          check = true;
        }
      });
      if (check === false) {
        let obj1 = {
          id : id,
          quantity : 1
        };
        items2.push(obj1);
        console.log(items2)
        insert2 = {
          username : username1,
          items : items2
        }
        console.log('after', items2);
        dbo.collection('cart').updateOne(obj, {$set : insert2}, function(err,result2) {
          if (err) next(err);
          console.log(insert2);
          //console.log(result2);
          //console.log(items2);
        });
      }
      res.json(result1);
    });
  })
});

//updating the cart 
app.post('/updatecart', function(req,res,next){
  console.log(req.body.username);
  console.log(req.body.items);
  let user = req.body.username;
  let items = req.body.items;
  MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true },function (err, db) {
    if (err) throw err
    var dbo = db.db('test');
    let obj = {
      username : user,
    };
    let obj2 = {
      username : user,
      items : items
    }
    dbo.collection('cart').updateOne(obj, {$set : obj2}, function(err,result2) {
      if (err) next(err);
      console.log('updated');
  })
  });
});
//checkout
app.post('/checkout', function(req,res,next){
  let user = req.body.username;
  let items = [];
  let items2 = req.body.items;
  MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true },function (err, db) {
    if (err) throw err
    var dbo = db.db('test');
    let obj = {
      username : user,
    };
    let obj2 = {
      username : user,
      items : items
    }
    let obj3 = {
      username : user,
      items : items2
    }
    dbo.collection('cart').updateOne(obj, {$set : obj2}, function(err,result2) {
      if (err) next(err);
      console.log('updated');
   });
   dbo.collection('history').findOne(obj, function(err, res2 ){
    if (err) next(err);
    console.log(items2);
    res2.items.map((item) => items2.push(item));
    obj3 = {
      username : user,
      items : items2
    }
      console.log(obj3)
      dbo.collection('history').updateOne(obj, {$set : obj3}, function(err,result2) {
      if (err) next(err);
      console.log('history updated');
      });
   });
   
  });
});
//checks if user already exists
app.post('/user', function(req,res){
  let username1 = req.body.username1;
  console.log(req.body)
  MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true },function (err, db) {
    if (err) console.log("no username found")
    let dbo = db.db('test')
    let obj = {
      username : username1,
    };
    let result = {
      value : true,
    } 
    dbo.collection('users').findOne(obj, function(err,res1) {
      if (err) next(err);
      //check if username exists by checking if we get any response
      if (res1 !== null){
        result = {
          value : true,
        }
      }
      else{
        result = {
          value : false,
        }
        console.log("username doesnot exist")
      }
      db.close();
      res.json(result);  
    });
    
  });
})
//history
app.post('/history', function(req,res,next) {
  let username1 = req.body.username;
  //if (username1 == null)
  //username1 = 'Akshay';
  console.log(req.body);
  MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true },function (err, db) {
    if (err) throw err
    var dbo = db.db('test');
    let obj = {
      username : username1,
    };
    
    dbo.collection('history').findOne(obj, function(err,result) {
      if (err) next(err);
      result1 = result.items;
      //console.log(json(result1));
      res.json(result1);
    })
  })
});

//add a product by admin
app.post('/product', function(req,res){
  console.log(req.body);
  let title = req.body.title;
  let price = req.body.price;
  let img=req.body.img;
  let company=req.body.company;
  let category = req.body.category;
  let inventory = req.body.inventory;
  //connecting to mongo db
  MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true },function (err, db) {
    if (err) next(err);
    let dbo = db.db('test')
    let length = 0;
    dbo.collection('products').find().toArray(function (err, result) {
      result.forEach((item) => {
        length = Math.max(length,item.id);
      })
      let obj = {
        id : length+1,
        title : title,
        img:img,
        price : price,
        company:company,
        category:category,
        inventory:inventory
      } 
      dbo.collection('products').insertOne(obj, function(err,res) {
        if (err) throw err;
        db.close();
      })
    });
    
  })
})
//admin login
app.post('/adminlogin', function(req,res){
  let username1 = req.body.username1;
  let password1 = req.body.password1;
  console.log(req.body)
  MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true },function (err, db) {
    if (err) console.log("no username found")
    let dbo = db.db('test')
    let obj = {
      username : username1,
    };
    let result = {
      value : true,
      username : ''
    } 
    dbo.collection('admin').findOne(obj, function(err,res1) {
      if (err) next(err);
      //check if username exists by checking if we get any response
      if (res1 !== null){
        if(bcrypt.compareSync(password1, res1.password)) {
          // Passwords match
          result = {
            value : true,
            username : res1.username
          }
        } else {
          // Passwords don't match
          console.log(password1)
          console.log(res1.password)
          console.log("password doesn't match")
          result = {
            value : false,
            username : res1.username
          }
        }
        db.close();
        res.json(result);
      }
      else{
        console.log("username doesnot exist")
      }
    });
  });
})

//delete a product
app.delete('/products/:i', function(req, res){
  var monk = require('monk');
  var db = monk('localhost:27017/test');
    var collection = db.get('products');
    

    collection.remove({ id: req.params.i }, function(err, product){
        if (err) throw err;
    });
  });
  

//update a product
app.put('/products/:i', function(req, res){
  let obj1 = {
    id : parseInt(req.body.id)
  }
  
  let obj = {
    price:req.body.price,
    title:req.body.title,
    id:parseInt(req.body.id),
    company:req.body.company,
    img:req.body.img,
    inventory: req.body.inventory
  }
  MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true },function (err, db) {
    let dbo = db.db('test');
    console.log(obj1);
    console.log(obj);
    dbo.collection('products').updateOne(obj1,{$set : obj}, function(err, res){
      console.log('updated');
    });
  })
});
//get product
app.get('/:i', function(req, res) {
  var monk = require('monk');
var db = monk('localhost:27017/test');
  
    var collection = db.get('products');
    collection.findOne({id:req.params.i}, function(err, product){
        if (err) throw err;
      	res.json(product);
    });
});
//update inventory after checkout
app.post('/updateinventory', function(req,res){
  console.log(req.body);
  let products = req.body.products;
  //connecting to mongo db
  MongoClient.connect('mongodb://localhost:27017/', { useNewUrlParser: true },function (err, db) {
    if (err) next(err);
    let dbo = db.db('test')
    products.forEach((product) => {
      let obj1 = {
        "title" : product.title
      }
      dbo.collection('products').updateOne(obj1,{$set : product}, function(err, res){
        console.log('updated inventory');
      });
    })
    
  })
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
