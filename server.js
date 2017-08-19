const express = require('express');
// const mongoose = require('mongoose');
const app = express();
const path = require('path');
const port = process.env.PORT || 443;
// const dbUri =
//     process.env.MONGOLAB_URI ||
//     process.env.PROD_MONGODB ||
//     process.env.MONGODB_URI;

// mongoose.Promise = global.Promise;
// let conn = mongoose.createConnection(dbUri, {
//   keepAlive: true,
//   reconnectTries: Number.MAX_VALUE,
//   useMongoClient: true
// });

app.use(express.static(path.join(__dirname + '/public')));

app.get('/', function(req, res){
	res.send('Hello');
	bot.sendMessage(333886641, 'ping');
});

app.get('/event', function(req, res){
  res.sendFile(path.join(__dirname+'/public/eventInfo.html'));
});

app.get('/seats', function(req, res){
  res.sendFile(path.join(__dirname+'/public/iframe.html'));
});

app.get('/userInfo', function(req, res){
	res.sendFile(path.join(__dirname+'/public/userInfo.html'));
});

app.listen(port);

// exports.conn = conn;
