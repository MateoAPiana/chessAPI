import type { Socket } from 'node:dgram'
import type { DefaultEventsMap } from '../node_modules/socket.io/dist/typed-events'

let users: string[] = []

export default async function websocket(
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
) {
	console.log('a user has connected!')
	const { id } = socket
	users.push(id)

	socket.on('disconnect', () => {
		users = users.filter((i) => i !== id)
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
			socket.to(users.filter((i) => i !== id)[0]).emit('getMove', { from, to })
		},
	)
}
