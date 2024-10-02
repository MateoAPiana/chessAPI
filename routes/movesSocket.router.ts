import { Router } from 'express'

const routerMoves = Router()

routerMoves.get('/', (req, res) => {
	res.send('Hola')
})

export default routerMoves
