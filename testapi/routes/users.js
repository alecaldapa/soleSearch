var express = require('express');
var AWS = require('aws-sdk');
var app = express();

AWS.config.update({
  region: "us-west-1",
  endpoint: "http://dynamodb.us-west-1.amazonaws.com",
  //CHANGE THIS ASAP!!!!! >>
  accessKeyId: "AKIAJBMSZCPN6A5SHPRQ",
  secretAccessKey: "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"
});
var router = express.Router();
var docClient = new AWS.DynamoDB.DocumentClient();

var table = "User";

/* GET users listing. */
router.get('/', function(req, res, next) {
  var params = {
    TableName: table,
  }
  docClient.scan(params, function (err, data) {
    if (err) console.log(err, err.stack); // error
    else {
      res.send(data);
    }
  })
});

/* POST */
router.post('/create', function(req, res, next) {
  const { UserId, Email } = req.body;
  if (typeof UserId !== 'string') {
    res.status(400).jason({ error: 'UserId must be a string!'});
  }
  else if (typeof Email !== 'string') {
    res.status(400).json({ error: 'Email must be a string!'});
  }

  const params = {
    TableName: table,
    Item: {
      UserId : UserId,
      Email: Email,
    },
  };

  docClient.put(params, (error) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not create user'});
    }
    res.json({ UserId, Email});
  })

})

/* GET user by userid. */
router.get('/:id', function(req, res, next) {
  var userid = req.params.id;
  console.log("USERID: " + userid);
  var params = {
    TableName: table,
    KeyConditionExpression: "UserId = :u",
    ExpressionAttributeValues: {
      ":u": userid
    }
  }
  docClient.query(params, function(err, data) {
    if (err) console.log(err, err.stack); //error
    else {
      res.send(data);
    }
  })
});

module.exports = router;
