const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

const uri = process.env.URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// client.connect((err) => {
//   const collection = client.db("ShortURL").collection("urlMappings");
//   // perform actions on the collection object
//   collection.findOne({}, (error, result) => {
//     console.log(result);
//   });
//   client.close();
// });

//findOne example
client.connect(function (err, db) {
  if (err) throw err;
  var dbo = db.db("ShortURL");
  dbo
    .collection("urlMappings")
    .findOne({ shortURL: "WODOFI" }, function (err, result) {
      if (err) throw err;
      console.log(result);
      db.close();
    });
});

//InsertOne example
// client.connect(function (err, db) {
//   if (err) throw err;
//   var dbo = db.db("ShortURL");
//   var myObj = {
//     longURL: "https://developer.mongodb.com/quickstart/node-connect-mongodb",
//     shortURL: "WODOFI",
//     createdAt: 1610990553,
//     expiryAt: 1610990673,
//   };
//   dbo.collection("urlMappings").insertOne(myObj, function (err, result) {
//     if (err) throw err;
//     //console.log(result.longURL);
//     db.close();
//   });
// });
