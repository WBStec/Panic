var express  = require('express');

var User     = require('./models/user');
var Alarm     = require('./models/alarm');
var ServiceProvider = require('./models/serviceProvider');
var Area = require('./models/area');

var mongoose   = require('mongoose');
var path = require('path');
var crypto = require('crypto');
var fs = require('fs');

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

router.route('/login/:username/:password').get(function(req, res) {

        //req.params.username
        console.log('AUTH ' + req.params.username + " " + req.params.password);
       

        ServiceProvider.findOne({login:req.params.username,password:req.params.password,}, function(err, sp) {
            if (err)
                res.send(err);

            console.log(JSON.stringify(sp))

            if(sp == null)
            {
                res.json('Login Failed');
            }else
            {
                 var data = 
                {
                    login : 'good',
                    id : sp._id,
                    name : sp.name,
                    role : sp.role
                }
                res.json(data);
            }
        });


        
    });


router.route('/areas').get(function(req, res) {
        var content = fs.readFileSync("./app/areas.json");
        var jsonContent = JSON.parse(content);
        res.json(jsonContent);
    });

router.route('/sms')

    // create a bear (accessed at POST http://localhost:8080/api/users)
    .post(function(req, res) {
        console.log('POST SMS ' + JSON.stringify(req.body));
        res.send('True');
    })
    .get(function(req, res) {

        console.log('GET SMS ' + JSON.stringify(req.query.Phonenumber));

        var num = req.query.Phonenumber ;
        num = num.slice(-9);
        console.log(num);

        User.findOne({phone: new RegExp(num, "i")}, function(err, user) {
            if (err)
            {
                console.log(err);
                res.send('True');
            }
            if(user != null)
            {
                console.log(user);

                var alarm = new Alarm();      // create a new instance of the User model
                alarm.alarmDate = new Date();  

                alarm.uuid = user.uuid;    
                alarm.state = 'open';  
                alarm.source = 'sms';
                alarm.closeDate = null;
                // save the bear and check for errors
                alarm.save(function(err,alarm) {
                    if (err)
                        res.send(err);

                    console.log(JSON.stringify(alarm));
                    // res.json({ message: 'Alarm created!' ,alarm:alarm.id});
                    res.send('True');
                });

            }else
            {
                console.log('Number Not found');
                res.send('True');
            }
            
            

        });

        

        


    });



router.route('/users')

    // create a bear (accessed at POST http://localhost:8080/api/users)
    .post(function(req, res) {
         // res.json({ message: 'User created!' });
         // return;
         if(typeof req.body.uuid == 'undefined')
         {
            req.body.uuid = crypto.randomBytes(32).toString('hex');
         }
         if(typeof req.body.active == 'undefined')
         {
            req.body.active = true;
         }
         if(typeof req.body.area == 'undefined')
         {
            req.body.area = 0;
         }

    console.log('POST USER ' + JSON.stringify(req.body));        
        var user = new User();      // create a new instance of the User model
        user.uuid = req.body.uuid;  // set the users name (comes from the request)
        user.name = req.body.name;  // set the users name (comes from the request)
        user.surname = req.body.surname;  // set the users name (comes from the request)
        user.phone = req.body.phone;  // set the users name (comes from the request)
        user.address = req.body.address;  // set the users name (comes from the request)
        user.direction = req.body.direction;  // set the users name (comes from the request)
        user.photo = req.body.photo;  // set the users name (comes from the request)
        user.active = req.body.active;  
        user.area = req.body.area;  
        user.lat = req.body.lat;  
        user.lon = req.body.lon;
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



router.route('/users/:id').put(function(req, res) {
        console.log('user PUT ' + JSON.stringify(req.body));
        console.log('user PUT ' + req.params.id);

        var idd = mongoose.Types.ObjectId(req.params.id);

        User.update({_id: idd}, {
            name: req.body.name, 
            surname: req.body.surname, 
            phone: req.body.phone, 
            address: req.body.address, 
            direction: req.body.direction, 
            active: req.body.active, 
            area : req.body.area
        }, function(err, affected, resp) {
            if (err) 
                res.send(err);
            else
                 res.json("succesfully saved");
        })

        // User.findOneAndUpdate(query, obj, {upsert:true}, function(err, doc){
        //     if (err) 
        //         res.send(err);
        //     else
        //         res.json("succesfully saved");
        // }); 
    });


router.route('/sp')

    // create a bear (accessed at POST http://localhost:8080/api/users)
    .post(function(req, res) {
         // res.json({ message: 'User created!' });
         // return;

         if(typeof req.body.active == 'undefined')
         {
            req.body.active = true;
         }

        console.log('POST ServiceProvider ' + JSON.stringify(req.body));        
        var serviceProvider = new ServiceProvider();      // create a new instance of the User model
        serviceProvider.login = req.body.login;
        serviceProvider.password = req.body.password;
        serviceProvider.role = "SP";
        serviceProvider.name = req.body.name;
        serviceProvider.phone = req.body.phone;
        serviceProvider.active = req.body.active;
        serviceProvider.areas = req.body.areas;


        // save the bear and check for errors
        serviceProvider.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'created!' });
        });
        
    })
    // get all the users (accessed at GET http://localhost:8080/api/users)
    .get(function(req, res) {
        ServiceProvider.find({role:'SP'},function(err, users) {
            if (err)
                res.send(err);

            res.json(users);
        });
    });



router.route('/sp/:id').put(function(req, res) {
        console.log('ServiceProvider PUT ' + JSON.stringify(req.body));
        console.log('ServiceProvider PUT ' + req.params.id);

        var idd = mongoose.Types.ObjectId(req.params.id);

        ServiceProvider.update({_id: idd}, {
            login : req.body.login,
            password : req.body.password,
            name : req.body.name,
            phone : req.body.phone,
            active : req.body.active,
            areas : req.body.areas
        }, function(err, affected, resp) {
            if (err) 
                res.send(err);
            else
                 res.json("succesfully saved");
        })
    });



router.route('/users/state/:id').put(function(req, res) {
        console.log('user state PUT ' + JSON.stringify(req.body));
        console.log('user state PUT ' + req.params.id);

        var idd = mongoose.Types.ObjectId(req.params.id);

        User.update({_id: idd}, {
            active: req.body.active, 
        }, function(err, affected, resp) {
            if (err) 
                res.send(err);
            else
                 res.json("succesfully saved");
        })

        // User.findOneAndUpdate(query, obj, {upsert:true}, function(err, doc){
        //     if (err) 
        //         res.send(err);
        //     else
        //         res.json("succesfully saved");
        // }); 
    });


router.route('/users/:uuid')

    // get the user with that uuidid (accessed at GET http://localhost:8080/api/userss/:uuid)
    .get(function(req, res) {
        User.findOne({uuid:req.params.uuid},null,{sort:{$natural:-1}}, function(err, user)  {
        // User.findOne({uuid:req.params.uuid}, function(err, user) {
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
        alarm.source = 'app';


        // save the bear and check for errors
        alarm.save(function(err,alarm) {
            if (err)
                res.send(err);

            console.log(JSON.stringify(alarm));
            res.json({ message: 'Alarm created!' ,alarm:alarm.id});
        });
        
    })
    // get all the users (accessed at GET http://localhost:8080/api/alarms)
    .get(function(req, res) {



        User.find(function(err, users) {
            if (err)
                res.send(err);

            var flatList = {}
            for (var s in users) {
              flatList[users[s].uuid] = users[s];
            }

            // console.log(JSON.stringify(flatList));

            Alarm.find().sort({$natural:-1}).limit(20).exec(function(err, alarms) {
                if (err)
                    res.send(err);

                var sendAlarm = [];
                for(var i in alarms)
                {
                    var alarm = JSON.parse(JSON.stringify(alarms[i]));
                    alarm.user = flatList[alarm.uuid].name + ' ' +flatList[alarm.uuid].surname;
                    alarm.area = flatList[alarm.uuid].area;
                    sendAlarm.push(alarm);
                }
                res.json(sendAlarm);
                // alarms.reverse();
            });
                    // res.json([]); 
    })
    });;


router.route('/alarmUser/:id')
    console.log('alarmUser');
  .get(function(req, res) {
        Alarm.findOne({_id:req.params.id},function(err, ua) {
             if (err)
                res.send(err);
            res.json(ua);
        });
    })

router.route('/alarms/:id')

    // get the user with that uuidid (accessed at GET http://localhost:8080/api/userss/:uuid)
    .get(function(req, res) {

// Alarm.findOne({_id:req.params.id}, function(err, alarm) {
//             if (err)
//                 res.send(err);

//             console.log(JSON.stringify(alarm));
//             var obj = {};
//             obj.state = alarm.state;
//             res.json(obj);
//         });


        ServiceProvider.findOne({_id:req.params.id},function(err, sp) {


            if (err)
                res.send(err);

            if(sp != null)
            {
                
                var areas = sp.areas;
                
                User.find({ area : { $in : areas }},function(err, users) {
                    if (err)
                        res.send(err);

                    var flatList = {}
                    for (var s in users) {
                      flatList[users[s].uuid] = users[s];
                    }

                    // console.log(JSON.stringify(flatList));

                    var alarmUsers = [];
                    for (var i in users)
                    {
                        alarmUsers.push(users[i].uuid)
                    }

                    Alarm.find({ uuid : { $in : alarmUsers }}).sort({$natural:-1}).limit(20).exec(function(err, alarms) {
                        if (err)
                            res.send(err);

                        var sendAlarm = [];
                        for(var i in alarms)
                        {
                            var alarm = JSON.parse(JSON.stringify(alarms[i]));
                            alarm.user = flatList[alarm.uuid].name + ' ' +flatList[alarm.uuid].surname;
                            alarm.area = flatList[alarm.uuid].area;
                            sendAlarm.push(alarm);
                        }
                        res.json(sendAlarm);
                    });
                    // res.json([]); 

                });
                
            }
            else
            {
                res.json([]); 
            }

        });

        // Alarm.find().sort({$natural:-1}).limit(20).exec(function(err, alarms) {
        //     if (err)
        //         res.send(err);

        //     // alarms.reverse();
        //     res.json(alarms);
        // });
    });


    router.route('/alarms/:id')

    // get the user with that uuidid (accessed at GET http://localhost:8080/api/userss/:uuid)
    .get(function(req, res) {
        Alarm.findOne({_id:req.params.id}, function(err, alarm) {
            if (err)
                res.send(err);

            console.log(JSON.stringify(alarm));
            var obj = {};
            obj.state = alarm.state;
            res.json(obj);
        });
    });

    router.route('/alarms/:id').put(function(req, res) {
        console.log('alarm PUT ' + JSON.stringify(req.body));
        console.log('alarm PUT ' + req.params.id);

        if(typeof req.body.gpsLat == 'undefined')
        {
            req.body.gpsLat = "";
        }
        if(typeof req.body.gpsLon == 'undefined')
        {
            req.body.gpsLon = "";
        }

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
