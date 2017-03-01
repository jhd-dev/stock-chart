'use strict';

var StockManager = require('../controllers/stock_manager');

module.exports = function(wss){
    
    function sendJSON(ws, obj){
        ws.send(JSON.stringify(obj), function(){});
    }
    
    var stockManager = new StockManager();
    
    wss.on('connection', function(ws){
        console.log('websocket connection open');
        
        function updateClient(){
            stockManager.getStocks(function(stocks){
                if (stocks.__v !== dataVersion){
                    dataVersion = stocks.__v;
                    stockManager.getStockData(stocks.symbols, function(data){
                        var formatted = stockManager.formatStockData(data);
                        console.log(JSON.stringify(formatted).substr(0, 100));
                        sendJSON(ws, formatted);
                    });
                }
            });
        }
        
        updateClient();
        
        var dataVersion = -1;
        var update = setInterval(updateClient, 3000);
        
        ws.on('message', function(message){
            var data = JSON.parse(message);
            if (data.add){
                stockManager.addStock(data.add, updateClient);
            }
            if (data.remove){
                stockManager.removeStock(data.remove, updateClient);
            }
        });
        
        ws.on('close', function(){
            console.log("websocket connection close");
            clearInterval(update);
        });
    });
};