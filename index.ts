import express from 'express'
import morgan from 'morgan'
import cors from 'cors'

import { Server } from './node_modules/socket.io/dist/index'
import { createServer } from 'node:http'
import { ACCEPTED_ORIGINS } from './constants'
import websocket from './websocket/socket'

import dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT || 3000

const app = express()

const server = createServer(app)

app.use(
	cors({
		origin: ACCEPTED_ORIGINS,
		methods: ['GET', 'POST'],
		credentials: true,
	}),
)

const io = new Server(server, {
	cors: {
		origin: ACCEPTED_ORIGINS,
		methods: ['GET', 'POST'],
		credentials: true,
	},
})

io.on('connection', async (socket) => {
	websocket(socket, io)
})

app.use(morgan('dev'))

server.listen(PORT, () => {
	console.log(`Port is listening in the port http://localhost:${PORT}`)
})
