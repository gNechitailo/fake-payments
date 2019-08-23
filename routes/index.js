const express = require('express');
const router = express.Router();

function randomHash(len = 32) {
  let stringlen = 0;
  let str = '';
  while (stringlen < len) {
    str += Math.random().toString(36).substr(2, 10);
    stringlen += 10;
  }
  return str.substr(0, len);
}

/* GET home page. */
router.put('/', function(req, res) {
  const body = req;
  console.log('req.params = ', req.params);
  setTimeout(function () {
      const str = {
        "result_code": 0,
        "bill": {
          "bill_id": randomHash(32),
          "amount": "100.00",
          "ccy": "RUB",
          "status": "waiting",
          "error": 0,
          "user": "tel:+71111111111"
        }
      };
      res.send(JSON.stringify(str));
  }, 2000);
});

module.exports = router;
