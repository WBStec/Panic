// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request



var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// routes ======================================================================
require('./app/routes.js')(app);
// require('./app/index.js')(app);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Panic server started ' + port);
