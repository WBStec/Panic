var express  = require('express');
var User     = require('./models/user');
var Alarm     = require('./models/alarm');
var mongoose   = require('mongoose');
var path = require('path');
mongoose.connect('mongodb://localhost:27017/panic'); // connect to our database


module.exports = function(app) {

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

app.use('/',express.static(path.join(__dirname + '/../public'))); // set the static files location /public/img will be /img for users
app.use('/bower_components', express.static(path.join(__dirname + '/../bower_components'))); //bower components status

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');

    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    next(); // make sure we go to the next routes and don't stop here
});


// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
// router.get('/', function(req, res) {
//     res.json({ message: 'hooray! welcome to our api!' });
// });

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);




router.route('/users')

    // create a bear (accessed at POST http://localhost:8080/api/users)
    .post(function(req, res) {
         // res.json({ message: 'User created!' });
         // return;
         
	console.log('POST USER ' + JSON.stringify(req.body));        
        var user = new User();      // create a new instance of the User model
        user.uuid = req.body.uuid;  // set the users name (comes from the request)
        user.name = req.body.name;  // set the users name (comes from the request)
        user.surname = req.body.surname;  // set the users name (comes from the request)
        user.phone = req.body.phone;  // set the users name (comes from the request)
        user.address = req.body.address;  // set the users name (comes from the request)
        user.photo = req.body.photo;  // set the users name (comes from the request)
	    user.active = true;	
        // save the bear and check for errors
        user.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'User created!' });
        });
        
    })
    // get all the users (accessed at GET http://localhost:8080/api/users)
    .get(function(req, res) {
        User.find(function(err, users) {
            if (err)
                res.send(err);

            res.json(users);
        });
    });

router.route('/users/:uuid')

    // get the user with that uuidid (accessed at GET http://localhost:8080/api/userss/:uuid)
    .get(function(req, res) {
        User.findOne({uuid:req.params.uuid}, function(err, user) {
            if (err)
                res.send(err);
            res.json(user);
        });
    });
  

router.route('/alarms/')

    // create a alarm (accessed at POST http://localhost:8080/api/alarms)
    .post(function(req, res) {
	console.log('POST ALARM');        
        var alarm = new Alarm();      // create a new instance of the User model
        alarm.alarmDate = req.body.alarmDate;  
        alarm.closeDate = req.body.closeDate;  
        alarm.uuid = req.body.uuid;  
        alarm.gpsLat = req.body.gpsLat;  
        alarm.gpsLon = req.body.gpsLon;  
        alarm.state = 'open';  


        // save the bear and check for errors
        alarm.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Alarm created!' });
        });
        
    })
    // get all the users (accessed at GET http://localhost:8080/api/alarms)
    .get(function(req, res) {
        Alarm.find().sort({$natural:-1}).limit(20).exec(function(err, alarms) {
            if (err)
                res.send(err);

            // alarms.reverse();
            res.json(alarms);
        });
    });

    router.route('/alarms/:id').put(function(req, res) {
        console.log('alarm PUT ' + JSON.stringify(req.body));
        console.log('alarm PUT ' + req.params.id);

        var obj = {
          "_id": req.params.id,
          "state": req.body.state,
          "uuid": req.body.uuid,
          "gpsLon": req.body.gpsLon,
          "gpsLat": req.body.gpsLat,
          "alarmDate": req.body.alarmDate,
          "closeDate": req.body.closeDate,
        }

        var query = {'_id':req.params.id};
        Alarm.findOneAndUpdate(query, obj, {upsert:true}, function(err, doc){
            if (err) 
                res.send(err);
            else
                res.json("succesfully saved");
        }); 
    });

}
