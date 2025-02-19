import React from 'react'
import styles from './styles/container.module.css'

type Props = {
  children: React.ReactElement[] | React.ReactElement
}

export const Container: React.FC<Props> = ({ children }) => {
  return (
    <div className={styles.container}>
      { children }
    </div>
  )
}

