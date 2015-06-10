// server.js
// call the packages we need
var express    = require('express');        
var app        = express();                 
var bodyParser = require('body-parser');
var crypto = require('crypto');
var r = require('./jsrsasign.js');
var fs = require('fs');
var rsa = require('node-rsa');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'welcome to the api!' });   
});



// on routes that end in /mvcr
var pemtext;
router.route('/mvcr')
.post(function(req, res) {

	// Header
	var oHeader = {alg: 'RS256', typ: 'JWT'};
	var sHeader = JSON.stringify(oHeader);
	// Payload
	var oPayload = req.body;

	var token = crypto.randomBytes(64).toString('hex');
	oPayload['jti'] = token;
	
	var sPayload = JSON.stringify(oPayload);
	//read key

	//sign jwt
	var sJWT = KJUR.jws.JWS.sign("RS256", sHeader, sPayload, app.okey);
	
	console.log(sJWT);
	
	
	// Return JWT
	res.set('Content-Type', 'application/jwt');
	res.send(sJWT);
});

// register routes
app.use(bodyParser());
app.use('/api', router);

fs.readFile('key.jwk', 'utf8', function (err, data) {
	if (err) throw err;

	var key = JSON.parse(data);
	app.okey = r.KEYUTIL.getKey(key);

	// start server
	app.listen(port);
	console.log('Magic happens on port ' + port);

});


