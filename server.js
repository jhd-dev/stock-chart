var express = require('express');
var http = require('http');
var WebSocket = require('ws');
var MongoClient = require('mongodb').MongoClient;
var path = process.cwd();
var port = process.env.PORT || 8080;

var app = express();

app.use('/', express.static(path + '/client'));

var server = http.createServer(app);
var wss = new WebSocket.Server({
    server: server
});

wss.on('connection', function(ws){
    var id = setInterval(function(){
        ws.send(JSON.stringify(new Date()), function(){});
    }, 1000);
    
    console.log('websocket connection open');
    
    ws.on('close', function(){
        console.log("websocket connection close");
        clearInterval(id);
    });
});


server.listen(port, function(){
    console.log('Listening on port ' + port);
});