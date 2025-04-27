import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { type authenticationType } from "../types/authentication";
import '../styles/Login.css'

export const Login = () => {
    // i need two options here, one for login and one for register
    // I will use a state to track the value of a radio field between the two options
    // I will use a form to login and another to register

    const [isLogin, setIsLogin] = useState<authenticationType>('login');
    const [password, setPassword] = useState('')
    const [validated, setValidated] = useState(false)
    const navigate = useNavigate()

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsLogin(event.target.value as authenticationType)
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const form = event.currentTarget

        const formData = new FormData(form)
        const data = Object.fromEntries(formData.entries())

        axios.post(`http://localhost:4000/${isLogin}`, data)
        .then(res => {
            console.log(res.data.message)
            if (isLogin === 'register') {
                setIsLogin('login')
            } else {
                navigate('/')
            }
        })
        .catch(err => console.error(err.response.data.error))
        .finally(() => console.log('authentication step completed'))

        console.log(data)

        form.reset()

    }

    const handleConfirmPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        const input = event.currentTarget
        if(isLogin === 'register') {
            setValidated(input.value === password)
        }
    }

    return (
        <>
            <section id="authentication-section">
                <fieldset className="radio-field">
                    <legend>Login or Register</legend>
                    <label htmlFor="login">
                        <input type="radio" name="authentication" id="login" value="login" checked={isLogin === 'login'} onChange={handleRadioChange} />
                        Login
                    </label>
                    <label htmlFor="register">
                        <input type="radio" name="authentication" id="register" value="register" checked={isLogin === 'register'} onChange={handleRadioChange} />
                        Register
                    </label>
                </fieldset>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-input-group">
                        {isLogin === 'register' && (
                            <div className="form-input-group">
                                <label htmlFor="login-email">Email</label>
                                <input type="email" id="login-email" name="email" required />
                            </div>    
                        )}
                        <label htmlFor="login-username">Username</label>
                        <input type="text" id="login-username" name="username" required />
                    </div>
                    <div className="form-input-group">
                        <label htmlFor="login-password">Password</label>
                        <input onChange={e => setPassword(e.currentTarget.value)} type="password" id="login-password" name="password" required />
                    </div>
                    {isLogin === 'register' && (
                        <div className="form-input-group">
                            <label htmlFor="login-confirm-password">Confirm Password</label>
                            <input onChange={handleConfirmPassword} type="password" id="login-confirm-password" name="confirm-password" required />
                        </div>
                    )}
                    <button disabled={isLogin === 'register' && !validated} type="submit">Submit</button>
                </form>
            </section>
        </>
    );
}