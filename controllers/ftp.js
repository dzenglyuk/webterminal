const express = require("express");
const router = express.Router();
const FtpClient = require("ftp");

let ftpSessions = [];

router.post("/ftp", function (req, res) {
  const { address, port, password } = req.body;
  const user = req.body.suser;
  const c = new FtpClient();
  ftpSessions = [...ftpSessions, c];
  c.on("ready", function () {
    console.log("Ftp connected");
    c.list(function (err, list) {
      if (err) throw err;
      // console.dir(list);
      res.json({ sessionId: ftpSessions.length - 1, list: list });
      res.end();
    });
  });
  c.connect({
    host: address,
    port: port,
    user: user,
    password: password,
  });
});

router.post("/ftp/:pid", function (req, res) {
  const pid = parseInt(req.params.pid),
    ftp = ftpSessions[pid],
    path = req.body.path,
    type = req.body.type;
  if (type === "d") {
    if (path === "/") {
      ftp.list(function (err, list) {
        if (err) throw err;
        res.json({ list: list });
        res.end();
      });
    } else {
      ftp.list(path, function (err, list) {
        if (err) throw err;
        res.json({ list: list });
        res.end();
      });
    }
  } else {
    ftp.get(path, function (err, stream) {
      if (err) throw err;
      let fileName = path.split("/").slice(-1)[0];
      stream.pipe(fs.createWriteStream("../public/ftp/" + fileName));
      stream.once("close", function () {
        res.sendFile("/ftp/" + path);
        fs.unlinkSync("../public/ftp/" + fileName);
      });
    });
  }
});

router.post("/ftp/:pid/close", function (req, res) {
  const pid = parseInt(req.params.pid),
    ftp = ftp[pid];
  ftp.end();
  //Add function to delete connection from ftp Sessions
  res.end();
});

module.exports = router;
