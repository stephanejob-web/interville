import { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
    Sidebar,
    ConversationList,
    Conversation,
    ConversationHeader
} from '@chatscope/chat-ui-kit-react'

export const Chat = () => {
    const socketRef = useRef(null)
    const [user, setUser] = useState(null)
    const [users, setUsers] = useState([])
    const [messages, setMessages] = useState([])

    useEffect(() => {
        // Connecter le socket dès le début
        const newSocket = io('http://localhost:3000')
        socketRef.current = newSocket

        newSocket.on('connect', () => {
            console.log('✅ Connecté au serveur Socket.IO')
            console.log('ID de socket:', newSocket.id)

            const randomUsername = `Utilisateur_${Math.floor(Math.random() * 10000)}`
            newSocket.emit('setUsername', randomUsername)
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
        })

        newSocket.on('disconnect', () => {
            console.log('❌ Déconnecté du serveur')
        })

        return () => {
            newSocket.close()
        }
    }, [])

    const handleSendMessage = (textContent) => {
        if (textContent.trim() && socketRef.current) {
            // Envoyer le message au serveur
            socketRef.current.emit('sendMessage', textContent.trim())
        }
    }

    return (
        <div style={{ position: 'relative', height: 'calc(100vh - 80px)' }}>
            <MainContainer responsive>
                {/* Sidebar avec la liste des utilisateurs */}
                <Sidebar position="left" scrollable={false}>
                    <ConversationHeader>
                        <ConversationHeader.Content userName="Utilisateurs en ligne" info={`${users.length} connecté(s)`} />
                    </ConversationHeader>
                    <ConversationList>
                        {users.map((username) => (
                            <Conversation
                                key={username}
                                name={username}
                                info={username === user ? '(vous)' : ''}
                                active={username === user}
                            />
                        ))}
                    </ConversationList>
                </Sidebar>

                {/* Zone de chat principale */}
                <ChatContainer>
                    <ConversationHeader>
                        <ConversationHeader.Content userName={user || 'Connexion en cours...'} info="Chat Interville" />
                    </ConversationHeader>

                    <MessageList>
                        {messages.length === 0 ? (
                            <MessageList.Content style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', textAlign: 'center', fontSize: '1.2em', color: '#aaa' }}>
                                Aucun message pour le moment...
                            </MessageList.Content>
                        ) : (
                            messages.map((msg, index) => (
                                <Message
                                    key={index}
                                    model={{
                                        message: msg.text,
                                        sentTime: new Date(msg.timestamp).toLocaleTimeString(),
                                        sender: msg.username,
                                        direction: msg.username === user ? 'outgoing' : 'incoming',
                                        position: 'single'
                                    }}
                                >
                                    <Message.Header sender={msg.username} sentTime={new Date(msg.timestamp).toLocaleTimeString()} />
                                </Message>
                            ))
                        )}
                    </MessageList>

                    <MessageInput
                        placeholder="Tapez votre message..."
                        onSend={handleSendMessage}
                        disabled={!user}
                        attachButton={false}
                    />
                </ChatContainer>
            </MainContainer>
        </div>
    )
}
