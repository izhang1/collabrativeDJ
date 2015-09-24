var path = require('path');
var express = require ('express');

module.exports = function() {
  var root;
  root = express.Router();
  root.use('*', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    return next();
  });
  
  root.get('/', function(req, res) {
    res.send('Hello bitch.');
  });  

  return root;

};
