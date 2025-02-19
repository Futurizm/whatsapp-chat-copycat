import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './styles/sign-in-page.module.css'
import { Container } from '../../components/container'


export const SignInPage = () => {
    const navigate = useNavigate()
    const [idInstance, setIdInstance] = React.useState<string>('')
    const [apiTokenInstance, setApiTokenInstance] = React.useState<string>('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (idInstance.length < 1 || apiTokenInstance.length < 1) {
            alert('Id Instance и Api Token Instance не могут быть пустыми')
            return
        }

        localStorage.setItem(`idInstance`, idInstance)
        localStorage.setItem(`apiTokenInstance_${idInstance}`, apiTokenInstance)
        navigate('/chat-page')
        console.log('Данные сохранены в localStorage')
    }

  return (
    <Container>
        <form className={styles.form}>
            <div className={styles.input__block}>
                <input 
                    className={`${styles.input__block__input}`} 
                    value={idInstance}
                    onChange={(e) => setIdInstance(e.target.value)}
                    type="text" 
                    placeholder='Id Instance' 
                />
                <input 
                    value={apiTokenInstance}
                    onChange={(e) => setApiTokenInstance(e.target.value)}
                    className={styles.input__block__input} 
                    type="password" 
                    placeholder='Api Token Instance' 
                />
                <button 
                    className={styles.input__block__button}
                    onClick={handleSubmit}
                >Войти</button>
            </div>
        </form>
    </Container>
  )
}
