const express = require('express');
const router = express.Router();

router.get("/", (request, response) => {
  response.send({ response: "this is the root" }).status(200);
});

router.get("/new-room", (request, response) => {
  response.send({ response: "new room" }).status(200);
});

router.get("/", (request, response) => {
  response.send({ response: "new room" }).status(200);
});

module.exports = router;