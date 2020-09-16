const express = require("express");
const router = express.Router();
const Client = require("ssh2").Client;

let sshSessions = {};
let sshLogs = {};

const generateId = () => {
  return "_" + Math.random().toString(36).substr(2, 9);
};

router.post("/ssh", function (req, res) {
  const connection = new Client();
  connection.connect({
    host: "192.168.1.3",
    port: 22,
    username: "solomiayusyp",
    password: "solomiayusyp1997",
  });
  connection.on("ready", function () {
    const connectionId = generateId();
    sshSessions[connectionId] = connection;
    sshLogs[connectionId] = "";

    res.send(connectionId);
    res.end();
  });
});

router.ws("/ssh/:pid", function (ws, req) {
  const connectionId = req.params.pid;
  const connection = sshSessions[connectionId];

  // ws.send(sshLogs[connectionId]);

  connection.shell(function (err, stream) {
    if (err) throw err;
    stream
      .on("close", function () {
        console.log("Connection closed.");
        connection.end();
      })
      .on("data", function (data) {
        sshLogs[connectionId] += data;
        try {
          ws.send(data);
        } catch (ex) {
          // The WebSocket is not open, ignore
        }
      })
      .stderr.on("data", function (data) {
        console.log(data);
      });

    ws.on("message", function (msg) {
      stream.write(msg);
    });

    ws.on("close", function () {
      stream.end("exit\n");
      console.log("Closed terminal " + connectionId);
      delete sshSessions[connectionId];
      delete sshLogs[connectionId];
    });
  });
});

module.exports = router;
