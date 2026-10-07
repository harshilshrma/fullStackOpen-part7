import { useState } from 'react'
import { TextField, Button } from '@mui/material'

const Login = ({ user, handleLogin }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleLoginSubmit = async (event) => {
        event.preventDefault()
        const success = await handleLogin(username, password)

        if (success) {
            setUsername('')
            setPassword('')
        }
    }

    const loginForm = () => {
        return (
            <form onSubmit={handleLoginSubmit} className='login-form'>
                <TextField
                    label="Username"
                    type="text"
                    value={username}
                    size='small'
                    onChange={({ target }) => setUsername(target.value)}
                />
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    size='small'
                    onChange={({ target }) => setPassword(target.value)}
                />
                <Button color='primary' variant='contained' type="submit">Login</Button>
            </form>
        )
    }

    return (
        <div>
            {!user &&
                <>
                    <h2>Login to the Blogs application!</h2>
                    {loginForm()}
                </>
            }
            {user &&
                <>
                    <h3>Hey {user.name}, you are already logged in! </h3>
                    <p>Go to <a href='/'>Blogs</a> to access blogs.</p>
                </>
            }
        </div>
    )
}

export default Login