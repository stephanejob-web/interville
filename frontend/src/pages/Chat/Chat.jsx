import { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'
import { API_URL } from '../../config/api';


export const Chat = () => {
	const socketRef = useRef(null)
	const messagesEndRef = useRef(null)
	const [user, setUser] = useState(null)
	const [users, setUsers] = useState([])
	const [messages, setMessages] = useState([])
	const [inputMessage, setInputMessage] = useState('')

	useEffect(() => {
        // Récupérer l'utilisateur connecté depuis localStorage
		const userString = localStorage.getItem('user')
		const loggedUser = userString ? JSON.parse(userString) : null

        // Connecter le socket dès le début
		const newSocket = io(API_URL)
		socketRef.current = newSocket

		newSocket.on('connect', () => {
			console.log('✅ Connecté au serveur Socket.IO')
			console.log('ID de socket:', newSocket.id)

            // Utiliser le pseudo de l'utilisateur connecté
			const username = loggedUser ? loggedUser.pseudo : `Utilisateur_${Math.floor(Math.random() * 10000)}`
			newSocket.emit('setUsername', username)
		})

		newSocket.on('usernameAccepted', (username, usernames) => {
			console.log('✅ Nom accepté:', username)
			console.log('👥 Utilisateurs connectés:', usernames)
			setUser(username)
			setUsers(usernames)
		})

        // Écouter si le nom est refusé (regénérer un nouveau nom)
		newSocket.on('usernameRejected', (message) => {
			console.log('❌ Nom refusé:', message)
			const newUsername = `Utilisateur_${Math.floor(Math.random() * 10000)}`
			newSocket.emit('setUsername', newUsername)
		})

        // Écouter quand un utilisateur rejoint
		newSocket.on('userJoined', (username, usernames) => {
			console.log('👤 Utilisateur rejoint:', username)
			console.log('👥 Utilisateurs connectés:', usernames)
			setUsers(usernames)
		})

        // Écouter quand un utilisateur se déconnecte
		newSocket.on('userLeft', (username, usernames) => {
			console.log('👋 Utilisateur déconnecté:', username)
			console.log('👥 Utilisateurs connectés:', usernames)
			setUsers(usernames)
		})

        // Écouter les messages reçus
		newSocket.on('message', (data) => {
			console.log('💬 Message reçu:', data)
			setMessages((prevMessages) => [...prevMessages, data])
            // Scroller vers le bas
			setTimeout(() => scrollToBottom(), 100)
		})

		newSocket.on('disconnect', () => {
			console.log('❌ Déconnecté du serveur')
		})

		return () => {
			newSocket.close()
		}
	}, [])

	const handleSendMessage = (e) => {
		e.preventDefault()
		if (inputMessage.trim() && socketRef.current) {
            // Envoyer le message au serveur
			socketRef.current.emit('sendMessage', inputMessage.trim())
			setInputMessage('')
		}
	}

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}

	return (
		<div className="min-h-screen bg-white">
			<div className="container mx-auto px-6 py-12 max-w-6xl">
				<h1 className="text-3xl font-light text-gray-900 mb-8">Chat</h1>

				<div className="flex gap-6 h-[600px]">
                    {/* Sidebar - Liste des utilisateurs */}
					<div className="w-64 border border-gray-200 rounded-lg shadow-lg p-4 overflow-y-auto">
						<h2 className="text-sm font-medium text-gray-900 mb-4">
							En ligne ({users.length})
						</h2>
						<div className="space-y-2">
							{users.map((username) => (
								<div
									key={username}
									className={`flex items-center gap-3 p-2 rounded ${
										username === user ? 'bg-gray-100' : ''
									}`}
								>
                                    {/* Avatar */}
									<div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-medium shadow-md">
										{username.charAt(0).toUpperCase()}
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-gray-900 truncate">
											{username}
										</p>
										{username === user && (
											<p className="text-xs text-gray-500">Vous</p>
											)}
									</div>
								</div>
								))}
						</div>
					</div>

                    {/* Zone de chat principale */}
					<div className="flex-1 border border-gray-200 rounded-lg shadow-lg flex flex-col">
                        {/* Header */}
						<div className="p-4 border-b border-gray-200">
							<h2 className="text-lg font-medium text-gray-900">
								{user || 'Connexion en cours...'}
							</h2>
							<p className="text-sm text-gray-600">Chat Interville</p>
						</div>

                        {/* Messages */}
						<div className="flex-1 overflow-y-auto p-4 space-y-4">
							{messages.length === 0 ? (
								<div className="h-full flex items-center justify-center text-gray-500">
									Aucun message pour le moment...
								</div>
								) : (
								messages.map((msg, index) => (
									<div
										key={index}
										className={`p-3 rounded-lg ${
											msg.username === user
											? 'bg-gray-900 text-white ml-12'
											: 'bg-gray-100 text-gray-900 mr-12'
										}`}
									>
										<div className="flex items-center gap-2 mb-1">
											<span className={`text-sm font-medium ${
												msg.username === user ? 'text-white' : 'text-gray-900'
											}`}>
											{msg.username}
										</span>
										<span className={`text-xs ${
											msg.username === user ? 'text-gray-300' : 'text-gray-500'
										}`}>
										{new Date(msg.timestamp).toLocaleTimeString('fr-FR', {
											hour: '2-digit',
											minute: '2-digit'
										})}
									</span>
								</div>
								<p className="text-sm break-words">{msg.text}</p>
							</div>
							))
								)}
								<div ref={messagesEndRef} />
							</div>

                        {/* Input */}
							<form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
								<div className="flex gap-2">
									<input
										type="text"
										value={inputMessage}
										onChange={(e) => setInputMessage(e.target.value)}
										placeholder="Tapez votre message..."
										disabled={!user}
										className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:bg-gray-100 text-gray-900 bg-white"
									/>
									<button
										type="submit"
										disabled={!user || !inputMessage.trim()}
										className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
									>
										Envoyer
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
			)
}
