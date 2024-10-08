import express from 'express'
import { corsMiddleware } from './middleware/corsMiddleware'
import morgan from 'morgan'
import cors from 'cors'

import { Server } from './node_modules/socket.io/dist/index'
import { createServer } from 'node:http'
import { ACCEPTED_ORIGINS } from './constants'
import websocket from './websocket/socket'

const PORT = process.env.PORT || 3000

const app = express()

const server = createServer(app)

app.use(
	cors({
		origin: 'http://localhost:5173',
		methods: ['GET', 'POST'],
		credentials: true, // Si estás usando cookies o autenticación
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

// app.use(corsMiddleware())

// app.use(cors())

server.listen(PORT, () => {
	console.log(`Port is listening in the port http://localhost:${PORT}`)
})
