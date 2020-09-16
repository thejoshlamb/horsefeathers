
const express = require('express')
const socketio = require('socket.io')
const http = require('http')

const port = process.env.PORT || 4200
const routes = require ("./routes/index")

const app = express()
app.use(routes)

const server = http.createServer(app)

const io = socketio(server)

const getAPIAndEmit = socket => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit("FromAPI", response);
};

let interval;

io.on("connection", (client) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }

  // client.on('join', handleJoin)

  interval = setInterval(() => getAPIAndEmit(socket), 1000);
  client.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
