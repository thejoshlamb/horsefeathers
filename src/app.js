 
const express = require('express')
const socketio = require('socket.io')
const http = require('http')

const port = process.env.PORT || 4201
const routes = require ("./routes/index")

const utils = require("./utils")

const app = express()
app.use(routes)

const server = http.createServer(app)

const io = socketio(server)

let interval
let games = {}
let users = {}
let connectedClients = {}

io.on("connection", (client) => {
  
  // New connection
  console.log("New client connected:", client.id);
  
  connectedClients[client.id] = {
    socketId: client.id,
    name: "Anonoymous"
  }

  // not certain that this is necessary
  if (interval) {
    clearInterval(interval);
  }

  // Disconnection
  client.on("disconnect", () => {
    console.log("Client disconnected: ", client.id);
    const uid = connectedClients[client.id].uid
    delete connectedClients[client.id]
    clearInterval(interval);

    // mark as disconnected
    users[uid].disconnected = true

    // probably shouldn't send all users
    io.to(users[uid].room).emit('users', users);

    console.log(`in 30 mins, ${users[uid].name} will be destroyed`)
    // after 30 mins, delete their user
    setInterval(() => {
      console.log(`${uid} will be destroyed now`)
      delete users[uid]
    }, 30 * 60 * 1000);
  });

  // Join a room
  client.on("joinRoom", ({name, room}) => {
    console.log(`${name} joined room ${room}`);
    client.join(room)

    uid = utils.uuid()

    //store client and uid link
    connectedClients[client.id].uid = uid

    //create user record
    users[uid] = {
      id: uid,
      name: name,
      room: room
    }

    //first one in?
    if (!games[room]) {
      // make admin
      games[room] = {
        name: room,
        players: [uid],
        admin: name,
        currentPlayer: uid,
        playOrder: [uid],
        state: "waiting"
      }
    } else {
      //otherwise add to room
      games[room].players.push(uid)
    }

    // probably shouldn't send all users
    io.to(room).emit('users', users);

    // Game tick
    interval = setInterval(() => {
      io.to(room).emit('gameState', games[room]);
    }, 1000);

    // After 4 hours, destroy the room
    setInterval(() => {
      console.log(`${room} should be destroyed now`)
    }, 4 * 60 * 60 * 1000);
  })

  // Leave a room
  client.on("leaveRoom", () => {
    connectedClients[client.id].room = null
    games[client.room].players
  })

  // Reconnection
  client.on("rejoinRoom", () => {

  })
});

server.listen(port, () => console.log(`Listening on port ${port}`));
