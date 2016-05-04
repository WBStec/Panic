var express = require('express');
var path = require('path');


module.exports = function(app) {

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

	router.use(function(req, res, next) {
    	console.log('Something is happening.');
    	console.log((req));
    	next(); // make sure we go to the next routes and don't stop here
	});



router.route('/bower_components')

    .get(function(req, res) {
    	console.log('bower_components');
    	res.sendFile(express.static(path.join(__dirname + '/bower_components'))); // load the single view file (angular will handle the page changes on the front-end)
    });

	// router.get('/bower_components', function(req, res) {
	// 	console.log('bower_components');
	//     res.sendFile(express.static(path.join(__dirname + '/bower_components'))); // load the single view file (angular will handle the page changes on the front-end)
	// });

	router.get('/css', function(req, res) {
	    res.sendFile(express.static(path.join(__dirname + '/css'))); // load the single view file (angular will handle the page changes on the front-end)
	});

	router.get('/js', function(req, res) {
	    res.sendFile(express.static(path.join(__dirname + '/js'))); // load the single view file (angular will handle the page changes on the front-end)
	});

	router.get('/partials', function(req, res) {
	    res.sendFile(express.static(path.join(__dirname + '/partials'))); // load the single view file (angular will handle the page changes on the front-end)
	});

	router.get('/', function(req, res) {
		console.log('index');
	    res.sendFile(path.join(__dirname + '/../public/index.html')); // load the single view file (angular will handle the page changes on the front-end)
	});

	app.use('/', router);
}