const express = require("express");
const router = express.Router();
const pty = require("node-pty");

let terminals = {};
let logs = {};

router.post("/terminals", function (req, res) {
  const cols = parseInt(req.query.cols),
    rows = parseInt(req.query.rows),
    term = pty.spawn(process.platform === "win32" ? "cmd.exe" : "bash", [], {
      name: "xterm-color",
      cols: cols || 80,
      rows: rows || 24,
      cwd: process.env.HOME,
      env: process.env,
    });

  console.log("Created terminal with PID: " + term.pid);
  terminals[term.pid] = term;
  logs[term.pid] = "";
  term.on("data", function (data) {
    logs[term.pid] += data;
  });
  res.send(term.pid.toString());
  res.end();
});

router.post("/terminals/:pid/size", function (req, res) {
  const pid = parseInt(req.params.pid),
    cols = parseInt(req.query.cols),
    rows = parseInt(req.query.rows),
    term = terminals[pid];

  term.resize(cols, rows);
  console.log(
    "Resized terminal " + pid + " to " + cols + " cols and " + rows + " rows."
  );
  res.end();
});

router.ws("/terminals/:pid", function (ws, req) {
  const term = terminals[parseInt(req.params.pid)];
  console.log("Connected to terminal " + term.pid);
  ws.send(logs[term.pid]);

  term.on("data", function (data) {
    try {
      ws.send(data);
    } catch (ex) {
      // The WebSocket is not open, ignore
    }
  });
  ws.on("message", function (msg) {
    term.write(msg);
  });
  ws.on("close", function () {
    term.kill();
    console.log("Closed terminal " + term.pid);
    // Clean things up
    delete terminals[term.pid];
    delete logs[term.pid];
  });
});

module.exports = router;
