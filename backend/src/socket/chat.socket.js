// ═══════════════════════════════════════════════════════════════════════════
// 💬 SOCKET.IO - Gestionnaires d'événements temps réel
// ═══════════════════════════════════════════════════════════════════════════

/**
 * EVENT: connection - Nouveau client connecté
 *
 * Gère la connexion d'un nouveau client WebSocket et écoute les événements suivants :
 * - setUsername : Définir le nom d'utilisateur (vérifie l'unicité)
 * - sendMessage : Envoyer un message au chat
 * - disconnect : Déconnexion du client
 * @param {Server} io - Socket.IO server instance
 */

let usernames = []

module.exports = (io) => {
	io.on('connection', (socket) => {
		console.log('✅ Nouveau client connecté:', socket.id)

		socket.on('setUsername', (username) => {

		//verifie l'unicite de lutilisateur
			if (usernames.includes(username)) {
				console.log(`❌ Nom refusé: ${username} (déjà pris)`)
				socket.emit('usernameRejected', 'Ce nom d\'utilisateur est déjà pris')
			} else {
				socket.username = username
				usernames.push(username)
				console.log(`👤 Utilisateur ${username} connecté (ID: ${socket.id})`)
				socket.emit('usernameAccepted', username, usernames)
			// À TOUS les autres clients (pour mettre à jour leur liste)
				socket.broadcast.emit('userJoined', username, usernames)

			}
		})

		socket.on('sendMessage', (text) => {
			if (socket.username) {
				const messageData = {
					username: socket.username,
					text: text,
					timestamp: new Date().toISOString()
				}
				console.log(`💬 Message de ${socket.username}: ${text}`)
				// Envoyer le message à TOUS les clients (y compris l'émetteur)
				io.emit('message', messageData)
			}
		})

		socket.on('disconnect', () => {
			console.log('❌ Client déconnecté:', socket.username || socket.id)
			// Retirer le username de la liste
			if (socket.username) {
				usernames = usernames.filter(name => name !== socket.username)
				// Notifier TOUS les clients de la déconnexion
				io.emit('userLeft', socket.username, usernames)
			}
		})
	})
}