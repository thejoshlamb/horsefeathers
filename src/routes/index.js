const express = require('express');
const router = express.Router();

router.get("/", (request, response) => {
  response.sendFile('/index.html', { root: __dirname });
});

router.get("/new-room", (request, response) => {
  response.send({ response: "new room" }).status(200);
});

router.get("/", (request, response) => {
  response.send({ response: "new room" }).status(200);
});

module.exports = router;
