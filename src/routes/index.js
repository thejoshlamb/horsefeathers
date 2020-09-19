const express = require('express');
const router = express.Router();

router.get("/", (request, response) => {
  response.send({ response: "hogwash" }).status(200);
});

module.exports = router;
