const express = require("express");
var validUrl = require("valid-url");
const { nanoid } = require("nanoid");
//const db = require("db");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const rateLimit = require("express-rate-limit");
var cors = require("cors");

const app = express();
const basePath = process.env.BASE_PATH;

app.use(cors());

app.set("trust proxy", 1);
const apiLimiter = rateLimit({
  windowMs:  60 * 1000, // 15 minutes
  max: 15,
  message: "Too many requests, please try again later.",
});

//mongodb client
const uri = process.env.URI;

//handle '/favicon.ico' request from chrome
app.get("/favicon.ico", apiLimiter, (req, res) => res.status(204));

//generating the shortURL
app.get("/short/it", apiLimiter, (req, res) => {
  console.log("req received");
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

//redirect to LongURL Route
app.get("/:id", apiLimiter, (req, res) => {
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
        if (err)
          res.status(400).send({
            error: "something wrong with DB. Please try aafter sometime",
          });
        console.log(result);
        if (result != null) res.redirect(302, result.longURL);
        else
          res.status(400).send({
            error: "shortURL seems incorrect!! please try with valid value",
          });
        db.close();
      });
  });
});

app.listen(process.env.PORT || 3003);
