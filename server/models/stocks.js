'use strict';

var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');

var Stocks = new mongoose.Schema({
    symbols: [String]
});

Stocks.plugin(findOrCreate);

module.exports = mongoose.model('Stocks', Stocks);
