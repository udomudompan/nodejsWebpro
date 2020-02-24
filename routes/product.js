var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render("product");
  });
router.get('/add', function(req, res, next) {
    res.send('Add Product');
  });
  router.get('/edit', function(req, res, next) {
    res.send('Edit Product');
  });
  router.get('/delete', function(req, res, next) {
    res.send('Delete Product');
  });
  
  module.exports = router;