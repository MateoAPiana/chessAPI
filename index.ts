import express from 'express'
import { corsMiddleware } from './middleware/corsMiddleware'
import routerMoves from './routes/movesSocket.router'
import morgan from 'morgan'
import cors from 'cors'

import { Server } from './node_modules/socket.io/dist/index'
import { createServer } from 'node:http'

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
		origin: 'http://localhost:5173',
		methods: ['GET', 'POST'],
		credentials: true,
	},
})

io.on('connection', async (socket) => {
	console.log('a user has connected!')

	socket.on('disconnect', () => {
		console.log('an user has disconnected')
	})

	socket.on('move', async (msg) => {
		console.log(msg)
	})
})

app.use(morgan('dev'))

// app.use(corsMiddleware())

// app.use(cors())

app.use('/moves', routerMoves)

server.listen(PORT, () => {
	console.log(`Port is listening in the port http://localhost:${PORT}`)
})
// app.listen(PORT, () => {
// 	console.log(`Port is listening in the port http://localhost:${PORT}`)
// })
