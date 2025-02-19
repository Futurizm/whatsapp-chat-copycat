import React from 'react'
import styles from './styles/message.module.css'

type MessageProps = {
  text: string
  isSent: boolean
}

export const Message: React.FC<MessageProps> = ({ text, isSent }) => {
  return (
    <div className={`${styles.message} ${isSent ? styles.sent : styles.received}`}>
      <p>{text}</p>
    </div>  
  )
}