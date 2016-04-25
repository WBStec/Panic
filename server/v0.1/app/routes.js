var express  = require('express');
var User     = require('./models/user');
var Alarm     = require('./models/alarm');
var mongoose   = require('mongoose');
mongoose.connect('mongodb://localhost:27017/panic'); // connect to our database


module.exports = function(app) {

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);




router.route('/users')

    // create a bear (accessed at POST http://localhost:8080/api/users)
    .post(function(req, res) {
	console.log('POST USER');        
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
  





router.route('/alarms')

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
        Alarm.find(function(err, alarms) {
            if (err)
                res.send(err);

            res.json(alarms);
        });
    });

}
