'use strict';

var Stocks = require('../models/stocks');

function StockManager(){
    
    this.getStocks = function(callback){
        Stocks.findOrCreate({}, function(err, stocks){console.log(stocks);
            if (err) throw err;
            if (typeof callback === 'function') return callback(stocks);
        });
    };
    
    this.addStock = function(symbol, callback){
        Stocks.findOne({}, function(err, stocks){
            if (err) throw err;
            stocks.symbols.push(symbol);
            stocks.markModified('symbols');
            stocks.save(function(err){
                if (err) throw err;
                if (typeof callback === 'function') return callback(stocks);
            });
        });
    };
    
    this.removeStock = function(symbol, callback){
        Stocks.findOne({}, function(err, stocks){
            if (err) throw err;
            var index = stocks.symbols.indexOf(symbol);
            if (index !== -1){
                stocks.symbols.splice(index, 1);
                stocks.markModified(symbol);
                stocks.save(function(){
                    if (typeof callback === 'function') return callback(stocks);
                });
            }
            if (typeof callback === 'function') return callback(stocks);
        });
    };
    
}

module.exports = StockManager;
