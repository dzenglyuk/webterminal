const express = require("express");
const bodyParser = require("body-parser");
const graphqlHttp = require("express-graphql");
const mongoose = require("mongoose");

const graphQlSchema = require("./graphql/schema");
const graphQlResolvers = require("./graphql/resolvers/index");
const isAuth = require('./middleware/is-auth');
const fs = require('fs');
const https = require('https');
const privateKey  = fs.readFileSync('ssl/private.key', 'utf8');
const certificate = fs.readFileSync('ssl/private.crt', 'utf8');

const credentials = {key: privateKey, cert: certificate};
const app = express();

const expressWs = require('express-ws');
const os = require('os');
const pty = require('node-pty');
const path = require('path');
const FtpClient = require('ftp');
const Client = require('ssh2').Client;

const server = https.createServer(credentials, app)
expressWs(app, server);

let terminals = {},
    logs = {},
    ftpSessions = []
    sshSessions = {},
    sshLogs = {};

app.use(express.static('public'));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(isAuth);

const generateId = () => {
  return '_' + Math.random().toString(36).substr(2, 9);
};

app.post('/terminals', function (req, res) {
  var cols = parseInt(req.query.cols),
      rows = parseInt(req.query.rows),
      term = pty.spawn(process.platform === 'win32' ? 'cmd.exe' : 'bash', [], {
        name: 'xterm-color',
        cols: cols || 80,
        rows: rows || 24,
        cwd: process.env.HOME,
        env: process.env
      });

  console.log('Created terminal with PID: ' + term.pid);
  terminals[term.pid] = term;
  logs[term.pid] = '';
  term.on('data', function(data) {
    logs[term.pid] += data;
  });
  res.send(term.pid.toString());
  res.end();
});

app.post('/terminals/:pid/size', function (req, res) {
  var pid = parseInt(req.params.pid),
      cols = parseInt(req.query.cols),
      rows = parseInt(req.query.rows),
      term = terminals[pid];
  
  term.resize(cols, rows);
  console.log('Resized terminal ' + pid + ' to ' + cols + ' cols and ' + rows + ' rows.');
  res.end();
});

app.ws('/terminals/:pid', function (ws, req) {
  var term = terminals[parseInt(req.params.pid)];
  console.log('Connected to terminal ' + term.pid);
  ws.send(logs[term.pid]);

  term.on('data', function(data) {
    try {
      ws.send(data);
    } catch (ex) {
      // The WebSocket is not open, ignore
    }
  });
  ws.on('message', function(msg) {
    term.write(msg);
  });
  ws.on('close', function () {
    term.kill();
    console.log('Closed terminal ' + term.pid);
    // Clean things up
    delete terminals[term.pid];
    delete logs[term.pid];
  });
});

app.post("/ftp", function (req, res) {
  const { address, port, password } = req.body;
  const user = req.body.suser;
  const c = new FtpClient();
  ftpSessions = [...ftpSessions, c];
  c.on('ready', function() {
    console.log("Ftp connected");
    c.list(function(err, list) {
      if (err) throw err;
      // console.dir(list);
      res.json({sessionId: ftpSessions.length-1, list: list});
      res.end();
    });
  });
  c.connect({
      host: address,
      port: port,
      user: user,
      password: password
  });
});

app.post('/ftp/:pid', function (req, res) {
  const pid = parseInt(req.params.pid),
      ftp = ftpSessions[pid],
      path = req.body.path,
      type = req.body.type;
  if (type === 'd') {
    if (path === '/') {
      ftp.list(function(err, list) {
        if (err) throw err;
        res.json({list: list});
        res.end();
      });
    } else {
      ftp.list(path, function(err, list) {
        if (err) throw err;
        res.json({list: list});
        res.end();
      });
    }
  } else {
    ftp.get(path, function(err, stream) {
      if (err) throw err;
      let fileName = path.split('/').slice(-1)[0]; 
      stream.pipe(fs.createWriteStream('./public/ftp/' + fileName));
      stream.once('close', function() {
        res.sendFile('/ftp/' + path);
        fs.unlinkSync('./public/ftp/' + fileName);
      });
    });
  }         
});

app.post('/ftp/:pid/close', function (req, res) {
  const pid = parseInt(req.params.pid),
      ftp = ftp[pid];
  ftp.end();
  //Add function to delete connection from ftp Sessions
  res.end();
});

app.post('/ssh', function (req, res) {
  const connection = new Client();
  connection.connect({
    host: '192.168.1.3',
    port: 22,
    username: 'solomiayusyp',
    password: 'solomiayusyp1997'
  });
  connection.on('ready', function() {
    const connectionId = generateId();
    sshSessions[connectionId] = connection;
    sshLogs[connectionId] = '';

    res.send(connectionId);
    res.end();
  });
});

app.ws('/ssh/:pid', function (ws, req) {
  const connectionId = req.params.pid;
  const connection = sshSessions[connectionId];
  
  // ws.send(sshLogs[connectionId]);

  connection.shell(function(err, stream) {
    if (err) throw err;
    stream.on('close', function() {
      console.log('Connection closed.');
      connection.end();
    }).on('data', function(data) {
      sshLogs[connectionId] += data;
      try {
        ws.send(data);
      } catch (ex) {
        // The WebSocket is not open, ignore
      }
    }).stderr.on('data', function(data) {
      console.log(data);
    });
    
    ws.on('message', function(msg) {
      stream.write(msg);
    });

    ws.on('close', function () {
      stream.end('exit\n');
      console.log('Closed terminal ' + connectionId);
      delete sshSessions[connectionId];
      delete sshLogs[connectionId];
    });
  });    
});

const port = process.env.PORT || 8000,
    host = os.platform() === 'win32' ? '127.0.0.1' : '0.0.0.0';

app.use(
  "/graphql",
  graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
  })
);

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
