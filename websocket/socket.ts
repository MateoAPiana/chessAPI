import type { Socket } from '../node_modules/socket.io/dist/index'
import type { DefaultEventsMap } from '../node_modules/socket.io/dist/typed-events'
import type { Server } from '../node_modules/socket.io/dist/index'

let users: [string, string][] = []
const usersWithoutOpponent: string[] = []

export default async function websocket(
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
	io: Server,
) {
	const { id } = socket
	usersWithoutOpponent.push(id)

	if (usersWithoutOpponent.length >= 2) {
		const whiteIndex = Math.floor(Math.random() * 2)
		const blackIndex = whiteIndex === 0 ? 1 : 0

		const whitePlayer = usersWithoutOpponent[whiteIndex]
		const blackPlayer = usersWithoutOpponent[blackIndex]

		users.push([whitePlayer, blackPlayer])

		io.to(usersWithoutOpponent[0]).emit(
			'paired',
			whiteIndex === 1 ? 'white' : 'black',
		)

		io.to(usersWithoutOpponent[1]).emit(
			'paired',
			whiteIndex === 1 ? 'black' : 'white',
		)

		usersWithoutOpponent.splice(0, 2)
	}

	socket.on('disconnect', () => {
		users = users.filter((i) => !i.includes(id))
		console.log('an user has disconnected')
	})

	socket.on(
		'move',
		async ({
			fromEnemy,
			toEnemy,
		}: {
			fromEnemy: [number, number]
			toEnemy: [number, number]
		}) => {
			const from = [7 - fromEnemy[0], 7 - fromEnemy[1]]
			const to = [7 - toEnemy[0], 7 - toEnemy[1]]
			const index = users.findIndex((i) => i.includes(id))
			if (index !== -1)
				socket
					.to(users[index].filter((i) => i !== id)[0])
					.emit('getMove', { from, to })
		},
	)

	socket.on(
		"end",
		async (color: string) => {
			const usersToEmit = users.filter(i => i.includes(id)).flat()
			console.log(usersToEmit)
			socket.to(usersToEmit[0]).emit("winner", color)
			socket.to(usersToEmit[1]).emit("winner", color)
		}
	)
}
