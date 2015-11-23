var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register', function(req, res, next){
    if(!req.body.email || !req.body.password){
        return res.status(400).json({message: 'Please fill out all fields.'});
    }
    
    var user = new User();
});

module.exports = router;
