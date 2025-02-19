import React from "react"
import axios from "axios"
import { Plus } from "lucide-react"
import styles from "./styles/chat.module.css"
import { MessageInput } from "../message-input"
import { Message } from "../message"
import { Link } from "react-router-dom"

interface Message {
    id: string
    text: string
    isSent: boolean
}

interface User {
    id: string
    number: string
}

export const Chat = () => {
    const currentUserId = localStorage.getItem('idInstance') || 'default'
    const [messages, setMessages] = React.useState<{ [userId: string]: Message[] }>(() => {
        const savedMessages = localStorage.getItem(`messages_${currentUserId}`)
        return savedMessages ? JSON.parse(savedMessages) : {}
    });
    const [isAddUserInputOpen, setIsAddUserInputOpen] = React.useState<boolean>(false)
    const [users, setUsers] = React.useState<User[]>(() => {
        const savedUsers = localStorage.getItem(`users_${currentUserId}`)
        return savedUsers ? JSON.parse(savedUsers) : []
    });
    const [selectedUser, setSelectedUser] = React.useState<User | null>(null)
    const [lastReceiptId, setLastReceiptId] = React.useState<string | null>(null)

    React.useEffect(() => {
        localStorage.setItem(`messages_${currentUserId}`, JSON.stringify(messages))
    }, [messages, currentUserId])

    React.useEffect(() => {
        localStorage.setItem(`users_${currentUserId}`, JSON.stringify(users))
    }, [users, currentUserId])

    const toggleAddUserInput = () => {
        setIsAddUserInputOpen(prev => !prev)
    }

    const addUser = (number: string) => {
        if (number && !users.some(user => user.number === number)) {
            setUsers(prevUsers => [...prevUsers, { id: number, number }])
            console.log(number)
        }
        setIsAddUserInputOpen(false)
    }

    const handleUserClick = (user: User) => {
        setSelectedUser(user);
        setMessages(prevMessages => ({
            ...prevMessages,
            [user.id]: prevMessages[user.id] || []
        }));
    }

    const onSendMessage = async (text: string) => {
        if (selectedUser) {
            const apiTokenInstance = localStorage.getItem(`apiTokenInstance_${currentUserId}`)
            const idInstance = localStorage.getItem(`idInstance`)

            const url = `https://7103.api.greenapi.com/waInstance${idInstance}/sendMessage/${apiTokenInstance}`
            const payload = {
                chatId: `${selectedUser.number}@c.us`,  
                message: text
            }


            try {
                const response = await axios.post(url, payload, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                console.log(lastReceiptId);
                
                console.log('Ответ на отправку сообщения:', response.data)

                setMessages(prevMessages => {
                    const userMessages = prevMessages[selectedUser.id] || []
                    return {
                        ...prevMessages,
                        [selectedUser.id]: [...userMessages, { id: Date.now().toString(), text, isSent: true }]
                    }
                })
            } catch (error) {
                console.error('Ошибка при отправке сообщения:', error)
            }
        }
    }

    React.useEffect(() => {
        if (selectedUser) {
            const apiTokenInstance = localStorage.getItem(`apiTokenInstance_${currentUserId}`)
            const idInstance = localStorage.getItem(`idInstance`) || ''
    
            const url = `https://7103.api.greenapi.com/waInstance${idInstance}/receiveNotification/${apiTokenInstance}?receiveTimeout=5`
    
            const fetchNotifications = async () => {
                try {
                    const response = await axios.get(url);
                    console.log(response.data)
                    
                    if (response.data && response.data.body) {
                        const { receiptId, body } = response.data
    
                        if (body.typeWebhook === "incomingMessageReceived" || 
                            body.typeWebhook === "outgoingAPIMessageReceived" || 
                            body.typeWebhook === "outgoingMessageReceived") {
    
                            let text = "";
                            if (body.messageData?.textMessageData?.textMessage) {
                                text = body.messageData.textMessageData.textMessage
                            } else if (body.messageData?.extendedTextMessageData?.text) {
                                text = body.messageData.extendedTextMessageData.text
                            }
    
                            if (text) {
                                const senderNumber = body.senderData?.sender?.replace("@c.us", "");
                                if (senderNumber && senderNumber === selectedUser.number) {
                                    const newMessage = {
                                        id: receiptId,
                                        text: text,
                                        timestamp: body.timestamp ? body.timestamp * 1000 : Date.now(),
                                        isSent: body.typeWebhook !== "incomingMessageReceived", 
                                    };
    
                                    setMessages(prevMessages => {
                                        const userMessages = prevMessages[selectedUser.id] || [];
                                        return {
                                            ...prevMessages,
                                            [selectedUser.id]: [...userMessages, newMessage]
                                        };
                                    });
    
                                    setLastReceiptId(receiptId)
                                }
                            }
                        }
    
                        if (receiptId) {
                            await axios.delete(
                                `https://7103.api.greenapi.com/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`
                            )
                        }
                    }
                } catch (error) {
                    console.error('Ошибка при получении уведомлений:', error)
                }
            };
    
            const intervalId = setInterval(fetchNotifications, 5000)
    
            return () => clearInterval(intervalId)
        }
    }, [selectedUser, currentUserId])



    return (
        <div className={styles.chat__window}>
            <div className={styles.chat__sidebar}>
                <div className={styles.users__list__block}>
                    <div className={styles.add__user__block}>
                        <button 
                            onClick={toggleAddUserInput} 
                            className={styles.add__user__button}
                        >
                            Добавить пользователя 
                            <Plus />
                        </button>
                        {isAddUserInputOpen && (
                            <input 
                                type="text" 
                                placeholder="Введите номер"
                                className={`${styles.add__user__input}`}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        addUser(e.currentTarget.value);
                                        e.currentTarget.value = ''; 
                                    }
                                }}
                            />
                        )}
                    </div>
                    <ul className={styles.users__list}>
                        {users.map(user => (
                            <li 
                                key={user.id} 
                                onClick={() => handleUserClick(user)} 
                                className={selectedUser?.id === user.id ? styles.user__item__selected : styles.user__item}
                            >
                                {user.number}
                            </li>
                        ))}
                    </ul>
                </div>
                <Link to={'/sign-in'} className={styles.logout__block}>
                    <button className={styles.logout__button}>Выйти</button>
                </Link>
            </div>
            <div className={styles.chat__main}>
                {selectedUser ? (
                    <>
                        <div className={styles.chat__messages}>
                            {(messages[selectedUser.id] || []).map((message) => (
                                <Message key={message.id} text={message.text} isSent={message.isSent} />
                            ))}
                        </div>
                        <MessageInput 
                            className={styles.message__input} 
                            onSendMessage={onSendMessage}
                        />
                    </>
                ) : (
                    <div className={styles.chat__main__empty}></div>
                )}
            </div>
        </div>
    )
}