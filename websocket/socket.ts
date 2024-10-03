import type { Socket } from 'node:dgram'
import type { DefaultEventsMap } from '../node_modules/socket.io/dist/typed-events'

let users: [string, string][] = []
const usersWithoutOpponent: string[] = []

export default async function websocket(
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
) {
	console.log('a user has connected!', { users, usersWithoutOpponent })
	const { id } = socket
	usersWithoutOpponent.push(id)

	if (usersWithoutOpponent.length >= 2) {
		const white = Math.floor(Math.random() * 2)
		console.log(white)

		users.push([
			usersWithoutOpponent[white],
			usersWithoutOpponent[white ? 0 : 1],
		])
		usersWithoutOpponent.shift()
		usersWithoutOpponent.shift()
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
			const from = [fromEnemy[0], fromEnemy[1]]
			const to = [toEnemy[0], toEnemy[1]]
			const index = users.findIndex((i) => i.includes(id))
			console.log(users, index, id)

			if (index !== -1)
				socket
					.to(users[index].filter((i) => i !== id)[0])
					.emit('getMove', { from, to })
		},
	)
}
