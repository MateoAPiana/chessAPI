import express from 'express'
import { corsMiddleware } from './middleware/corsMiddleware'
import routerMoves from './routes/movesSocket.router'

const PORT = process.env.PORT || 3000

const app = express()

app.use(corsMiddleware())

app.use('/moves', routerMoves)

app.listen(PORT, () => {
	console.log(`Port is listening in the port http://localhost:${PORT}`)
})
