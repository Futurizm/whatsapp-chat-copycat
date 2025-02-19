import { Chat } from '../../components/chat'
import styles from './styles/chat-page.module.css'

export const ChatPage = () => {
  return (
    <div className={styles.chat__page}>
      <Chat />
    </div>
  )
}

