import React from 'react'
import { SendHorizontal } from 'lucide-react'
import styles from './styles/message-input.module.css'

type Props = {
    className?: string
    onSendMessage: (text: string) => Promise<void>
}

export const MessageInput: React.FC<Props> = ({ className, onSendMessage }) => {
    const [message, setMessage] = React.useState('')


    const handleSend = async () => {
        if (message.trim()) {
            try {
                await onSendMessage(message.trim())
                setMessage('')
            } catch (error: unknown) {
                console.error('Ошибка при отправке сообщения:', error);         
            }
        }
        console.log(message)
    }


    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            handleSend()
        }
    }

    return (
        <div className={`${styles.message__input__block} ${className}`}>
            <input
                type="text" 
                value={message}
                onKeyDown={handleKeyDown}
                onChange={(e) => setMessage(e.target.value)}
                className={styles.message__input__block__input}
                placeholder='Введите сообщение...'
            />
            <button 
                className={styles.message__input__block__button}
                onClick={handleSend}
            >
                <SendHorizontal className={styles.message__input__block__button__icon} />
            </button>
        </div>
    )
}

