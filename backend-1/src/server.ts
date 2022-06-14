import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { io } from 'socket.io-client'

import { IClientEvents, IServerEvents } from './events'

const port = 5000
const app = express()
const httpServer = createServer(app)
const server = new Server<IClientEvents, IServerEvents>(httpServer, {
  cors: { origin: ['http://localhost:3000'] },
})
const backend_2 = io('http://localhost:5001')

// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html')
// })

server.on('connection', socket => {
  console.log('connected')

  /* A -> B */
  socket.on('message:send', message => {
    console.log('backend 1', message)

    /* B -> C */
    backend_2.emit('message:repass', message)
  })
})

httpServer.listen(port, () => console.log(`Running on port: ${port}`))
