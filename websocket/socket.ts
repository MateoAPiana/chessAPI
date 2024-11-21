import type { Socket } from '../node_modules/socket.io/dist/index'
import type { DefaultEventsMap } from '../node_modules/socket.io/dist/typed-events'
import type { Server } from '../node_modules/socket.io/dist/index'

type user = [string, string]
let users: [user, user][] = []
const usersWithoutOpponent: user[] = []

export default async function websocket(
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
	io: Server,
) {
	const { id }: { id: string } = socket

	socket.on('disconnect', () => {
		users = users.filter((i) => !i.some(j => j.includes(id)))
	})

	socket.on("foundGame", (name: string) => {
		if (!usersWithoutOpponent.some(i => i[0] === name) &&
			users.findIndex((i) => i.some(j => j.includes(id))) === -1 &&
			!usersWithoutOpponent.some(i => i[1] === id)) {
			usersWithoutOpponent.push([name, id])
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
				console.log({ usersWithoutOpponent, users })
			}
			console.log({ name, id })
		}
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
			const index = users.findIndex((i) => i.some(j => j.includes(id)))
			console.log({ fromEnemy, toEnemy, index, users: users[0] })
			if (index !== -1)
				socket
					.to(users[index].filter((i) => i[1] !== id)[0])
					.emit('getMove', { from, to })
		},
	)

	socket.on(
		"end",
		async (color: string) => {
			const usersToEmit = users.filter(i => !i.some(j => j.includes(id))).flat()
			console.log(usersToEmit)
			socket.to(usersToEmit[0]).emit("winner", color)
			socket.to(usersToEmit[1]).emit("winner", color)
		}
	)
}
