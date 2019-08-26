const express = require('express');
const axios = require('axios');
const router = express.Router();

currencies = {
  RUB: 643,
  KZT: 398,
};

const lalaMap = new Map();

lalaMap.set('7lzf78m21d5v6m356wq4f5nwi35dscaf', { // the obrazets
  response: {
    result_code: 0,
    "bill": {
      "bill_id": '7lzf78m21d5v6m356wq4f5nwi35dscaf',
      "amount": 100,
      "ccy": "RUB",
      "status": "waiting",
      "error": 0,
      "user": "tel:+71111111111",
    },
  },
});

router.get('/redirect-me', function (req, res) {
  const whereToRedirect = req.query.successUrl;
  console.log(whereToRedirect);
  if (whereToRedirect) {
    res.redirect(whereToRedirect);
    return;
  }
  res.status(400).json({ error: dunno });
});

function sendPayment(toSend) {
  axios.post('http://localhost:7846/payment', toSend).then((what) => {
    console.log(what);
  }, (err) => {
    console.log(err);
  });
}

router.get('/fasta', function (req, res) {
  const whatToSend = { // also obrazets
    "amount": 100,
    "currency": 643,
    "walletPhone":71111111111,
    "account": 79222222222,
    "extra": {
      "txn_id": "7lzf78m21d5v6m356wq4f5nwi35dscaf",
      "source": "qw",
      "alias": "easyaddress"
    },
  };
  res.status(200).json({ what: 'Sending smart shit' });
  setTimeout(() => {
    sendPayment(whatToSend)
  })
});

router.get('/invoice-me/:num/bills/:trhash', function(req, res) {
  const { trhash } = req.params;
  const data = lalaMap.get(trhash);
  res.status(200).json(data);
});

/* PUT invoice http://api.qiwi.com/api/v2/prv/%d/bills/%s invoice-me/%d/bills/%s  */
router.put('/invoice-me/:num/bills/:trhash', function(req, res) {
  const { body } = req;
  const { trhash } = req.params;
  console.log('body =', body);
  console.log('req.params = ', req.params);
  console.log(req.query);
  // const hash = randomHash(32);
  const responseData = {
    response: {
      "result_code": 0,
      "bill": {
        "bill_id": trhash,
        "amount": body.amount,
        "ccy": body.ccy,
        "status": "waiting",
        "error": 0,
        "user": body.user,
        "comment": body.comment,
      },
    },
  };
  lalaMap.set(trhash, responseData)
  res.status(200).send(JSON.stringify(responseData));
  setTimeout(function () {
    const walletPhoneStr = body.user.substring(5)
    const toSend = {
      amount: parseFloat(body.amount),
      currency: currencies[body.ccy],
      account: parseInt(body.account, 10),
      walletPhone: parseInt(walletPhoneStr, 10),
      extra: {
        txn_id: trhash,
        source: body['extras[source]'],
        alias: body['extras[alias]'],
      },
    };
    console.log(JSON.stringify(toSend));
    sendPayment(toSend);
  }, 10000);
});

module.exports = router;
