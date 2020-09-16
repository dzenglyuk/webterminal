const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");
const graphQlSchema = require("./graphql/schema");
const graphQlResolvers = require("./graphql/resolvers/index");
const fs = require('fs');
const https = require('https');
const expressWs = require('express-ws');
const os = require('os');

const privateKey  = fs.readFileSync('ssl/private.key', 'utf8');
const certificate = fs.readFileSync('ssl/private.crt', 'utf8');
const credentials = {key: privateKey, cert: certificate};

const app = express();
const server = https.createServer(credentials, app)

expressWs(app, server);

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(require('./controllers'));
app.use(require('./middleware/is-auth'));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
app.use(
  "/graphql",
  graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
  })
);

const port = process.env.PORT || 8000;
const host = os.platform() === 'win32' ? '127.0.0.1' : '0.0.0.0';

mongoose
  .connect(
    // `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-ltzhu.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-shard-00-00-ltzhu.mongodb.net:27017,cluster0-shard-00-01-ltzhu.mongodb.net:27017,cluster0-shard-00-02-ltzhu.mongodb.net:27017/${process.env.MONGO_DB}?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority`
  )
  .then(_ => {
    server.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  })
  .catch(err => {
    console.log(err);
  });
