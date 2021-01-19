const express = require("express");
var validUrl = require("valid-url");
const { nanoid } = require("nanoid");
//const db = require("db");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const app = express();
const basePath = process.env.BASE_PATH;

//mongodb client
const uri = process.env.URI;

//handle '/favicon.ico' request from chrome
app.get("/favicon.ico", (req, res) => res.status(204));

//redirect to  LongURL
app.get("/:id", (req, res) => {
  console.log(req.url);
  var baseURL = basePath + req.params.id;
  console.log("baseurl formed " + baseURL);
  //mongodb instantiated
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  client.connect(function (err, db) {
    if (err) throw err;
    var dbo = db.db("ShortURL");
    dbo
      .collection("urlMappings")
      .findOne({ shortURL: baseURL }, function (err, result) {
        if (err) throw err;
        console.log(result);
        res.redirect(302, result.longURL);
        db.close();
      });
  });
});

//generating the shortURL
app.get("/short/it", (req, res) => {
  console.log(req.query.longURL);
  if (validUrl.isUri(req.query.longURL)) {
    console.log("Looks like an URI");
    var uniquePath = nanoid(6);
    var timestamp = parseInt(Date.now() / 1000);
    var resData = {
      longURL: req.query.longURL,
      shortURL: basePath + uniquePath,
      createdAt: timestamp,
      expiryAt: timestamp + 120,
    };
    //mongodb instantiated
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    //DB Store part

    client.connect(function (err, db) {
      if (err) throw err;
      var dbo = db.db("ShortURL");
      dbo.collection("urlMappings").insertOne(resData, function (err, result) {
        if (err) {
          res.status(500).send("Failed");
          throw err;
        }
        db.close();
        res.status(200).send(resData);
      });
    });
  } else {
    console.log("Not a URI");
    res.status(400).send("malformed longURL");
  }
});

app.listen(process.env.PORT || 3003);
