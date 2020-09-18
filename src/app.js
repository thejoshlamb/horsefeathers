 
const express = require('express')
const socketio = require('socket.io')
const http = require('http')

const port = process.env.PORT || 4200
const routes = require ("./routes/index")

const app = express()
app.use(routes)

const server = http.createServer(app)

const io = socketio(server)

const randomColor = () => Math.floor(Math.random()*16777215).toString(16);

// const getAPIAndEmit = client => {
//   const response = new Date();
//   // Emitting a new message. Will be consumed by the client
//   client.emit("FromAPI", response);
// };

// let interval;
let gameState = {
  players: {}
}

io.on("connection", (client) => {
  console.log("New client connected:", client.id);
  gameState.players[client.id] = { color: randomColor() }
  // if (interval) {
  //   clearInterval(interval);
  // }
  interval = setInterval(() => {
    io.sockets.emit('state', gameState);
  }, 1000);
  client.on("disconnect", () => {
    console.log("Client disconnected: ", client.id);
    delete gameState.players[client.id]
    // clearInterval(interval);
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
