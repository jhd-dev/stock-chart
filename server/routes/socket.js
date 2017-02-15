'use strict';

var StockManager = require('../controllers/stock_manager');

module.exports = function(wss){
    
    function sendJSON(ws, obj){
        ws.send(JSON.stringify(obj), function(){});
    }
    
    var stockManager = new StockManager();
    
    wss.on('connection', function(ws){
        console.log('websocket connection open');
        stockManager.getStocks(function(stocks){
            sendJSON(ws, stocks);
        });
        
        ws.on('close', function(){
            console.log("websocket connection close");
        });
    });
};