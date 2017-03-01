'use strict';

var express = require('express');
var mongoose = require('mongoose');
var http = require('http');
var WebSocket = require('ws');
var routes = require('./server/routes/router');
var socketEvents = require('./server/routes/socket');
require('dotenv').config();

var path = process.cwd();
var port = process.env.PORT || 8080;

mongoose.connect(process.env.MONGO_URI);
mongoose.Promise = global.Promise;

var app = express();
app.use('/', express.static(path + '/client'));
routes(app);

var server = http.createServer(app);
var wss = new WebSocket.Server({
    server: server
});
socketEvents(wss);

server.listen(port, function(){
    console.log('Listening on port ' + port);
});
