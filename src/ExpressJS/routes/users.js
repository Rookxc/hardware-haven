var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send({
    user: {
      name: 'Alen Škorjanc',
      email: 'alen.skorjanc@student.um.si'
    }
  });
});

module.exports = router;
