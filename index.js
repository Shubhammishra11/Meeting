var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var thenrequest = require('then-request');
var path = require('path');
var async = require('async');

// app initialization params
app.set('views', './views');
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));

//Your Api key-secret pair for Authentication
var zoom_key = 'PjdwexdIS1WvHU3LkUmbEg';
var zoom_sec = 'QDR2xOv2QDMAdaNVa93Rd1ABil2UD2wX';
var redirectUrl = 'http://192.168.43.187:5443/';

var router = express.Router();

router.get('/', (req, res) => {

    if (req.query.code) {
        res.redirect('/home');
        console.log("already authenticated");
        return;
    }

    res.redirect('https://zoom.us/oauth/authorize?response_type=code&client_id=' + zoom_key + '&redirect_uri=' + redirectUrl);
});
//Set the routes
router.get('/home', function(req, res) {
  res.render('home', {title: 'Welcome'});
});


router.get('/createUser', function(req, res) {
  res.render('users', {title: 'User Management'});
});

router.post('/createUser', function(req, res) {
    console.log(req);
  
  var options = {
    qs: {api_key: zoom_key, api_secret: zoom_sec, data_type: "JSON", email: req.body.email , type: 2}
  };

  // make an asynchronous request to zoom to create a User
  var asyncres = thenrequest('POST',"https://api.zoom.us/v2/user/create",options).done(function (res) {
    console.log(res.getBody('utf8'));
    });
  res.redirect('/');
});

router.get('/autoUser', function(req, res) {
  res.render('autoUsers', {title: 'User Management'});
});

router.post('/autoUser', function(req, res) {
  console.log(req.body);
  console.log("email:", req.body.email);
  var options = {
    qs: {api_key: zoom_key, api_secret: zoom_sec, data_type: "JSON", email: req.body.email , password: req.body.pwd, type: 2}
  };

  // make an asynchronous request to zoom to create a user without email verification
  var asyncres = thenrequest('POST',"https://api.zoom.us/v2/user/autocreate2",options).done(function (res) {
    console.log(res.getBody('utf8'));
    });
  res.redirect('/home');
});

router.get('/updateUser', function(req, res) {
  res.render('upUsers', {title: 'User Management'});
});

router.post('/updateUser', function(req, res) {
  console.log(req.body);
  console.log("email:", req.body.id);
  
  var options = {
    qs: {api_key: zoom_key, api_secret: zoom_sec, data_type: "JSON", id: req.body.id , type: req.body.type}
  };

  // make an asynchronous request to zoom to update a user
  var asyncres = thenrequest('POST',"https://api.zoom.us/v2/user/update",options).done(function (res) {
    console.log(res.getBody('utf8'));
    });
  res.redirect('/home');
});

router.get('/createMeeting', function(req, res) {
  res.render('meetings', {title: 'Manage Meetings'});
});

router.post('/createMeeting', function(req, res) {
  console.log(req.body);
  console.log("id:", req.body.id);

  console.log("topic:", req.body.topic);
   var Moptions = {
    qs: {api_key: zoom_key, api_secret: zoom_sec, data_type: "JSON", host_id: req.body.id , topic: req.body.topic, type: 3}
  };

  // make an asynchronous request to zoom to create a meeting
  var asyncres = thenrequest('POST',"https://api.zoom.us/v2/meeting/create",Moptions).done(function (res) {
    console.log(res.getBody('utf8'));
    });
  res.redirect('/');
});

router.get('/listMeeting', function(req, res) {
  res.render('listMeetings', {title: 'Manage Meetings'});
});

router.post('/listMeeting', function(req, res) {
  console.log(req.body);
  console.log("id:", req.body.id);

  var Moptions = {
    qs: {api_key: zoom_key, api_secret: zoom_sec, data_type: "JSON", host_id: req.body.id }
  };
  // make an asynchronous request to zoom to list all meetings
  var asyncres = thenrequest('POST',"https://api.zoom.us/v2/meeting/list",Moptions).done(function (res) {
    console.log(res.getBody('utf8'));
    });
  res.redirect('/home');
});

router.get('/updateMeeting', function(req, res) {
  res.render('upMeetings', {title: 'Manage Meetings'});
});

router.post('/updateMeeting', function(req, res) {
  console.log(req.body);
  console.log("id:", req.body.id);

  console.log("topic:", req.body.topic);
  var Moptions = {
    qs: {api_key: zoom_key, api_secret: zoom_sec, data_type: "JSON", host_id: req.body.id , id: req.body.mId, type: req.body.type}
  };
  // make an asynchronous request to zoom to update a meeting
  var asyncres = thenrequest('POST',"https://api.zoom.us/v2/meeting/update",Moptions).done(function (res) {
    console.log(res.getBody('utf8'));
    });
  res.redirect('/home');
});


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/', router);
app.listen(5443);

console.log("Node has started");
