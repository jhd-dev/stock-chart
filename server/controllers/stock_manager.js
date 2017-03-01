'use strict';

var yahooFinance = require('yahoo-finance');
var cts = require('check-ticker-symbol');
var dateFormat = require('dateformat');
var Stocks = require('../models/stocks');

function StockManager(){
    
    this.getStocks = function(callback){
        Stocks.findOrCreate({}, function(err, stocks){//console.log(stocks);
            if (err) throw err;
            if (typeof callback === 'function') return callback(stocks);
        });
    };
    
    this.addStock = function(symbol, callback){
        var caps = symbol.toUpperCase();
        if (cts.valid(caps)){
            Stocks.findOne({}, function(err, stocks){
                if (err) throw err;
                if (stocks.symbols.indexOf(caps) === -1){
                    stocks.symbols.push(caps);
                    stocks.markModified('symbols');
                    stocks.save(function(err){
                        if (err) throw err;
                        if (typeof callback === 'function') return callback(stocks);
                    });
                }
            });
        }
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
    
    this.getStockData = function(symbols, callback){
        var date = new Date();
        console.log((date.getFullYear() - 1) + '-' + date.getMonth() + '-' + date.getDate());
        yahooFinance.historical({
            symbols: symbols,
            from: dateFormat(date, (date.getFullYear() - 1) + '-mm-dd'),
            to: dateFormat(date, 'yyyy-mm-dd'),
            period: 'd'
        }, function(err, data){
            if (err) throw err;
            if (typeof callback === 'function') return callback(data);
        });
    };
    
    this.formatStockData = function(data){
        return Object.keys(data).map(function(symbol){
            return {
                name: symbol,
                data: data[symbol].map(function(day){
                    return [
                        new Date(day.date).getTime(),
                        day.open,
                        day.high,
                        day.low,
                        day.close,
                        day.volume,
                        day.adjClose,
                    ];
                })
            };
        });
    };
    
}

module.exports = StockManager;
