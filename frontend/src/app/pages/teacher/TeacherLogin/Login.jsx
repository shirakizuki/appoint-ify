// IMPORT LIBRARY
import React from 'react';
import axios from 'axios'
import useSignIn from 'react-auth-kit/hooks/useSignIn'
// IMPORT HOOKS
import { useNavigate } from 'react-router-dom';
import { ServerContext } from '../../../../context/ServerContext';
import { useState, useContext } from 'react';
// IMPORT COMPONENTS
import Button from '../../../components/ButtonType2/Button'
// IMPOR CSS STYLINGS
import './Login.css'

/**
 * The Login component renders a form for teachers to log in to their accounts.
 * The form takes an email and a password as input and checks them against the
 * stored credentials for the teacher. If the credentials are valid, the component
 * will log the teacher in and navigate to the teacher's homepage.
 * If the credentials are not valid, the component will show an error message.
 * The component also provides a button to return to the homepage.
 * @returns {React.ReactElement} The Login component.
 */
const Login = () => {
    // VARIABLES
    const [error, setError] = useState('');
    const [data, setData] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate();
    const signIn = useSignIn();
    const { url } = useContext(ServerContext);

    /**
     * Handles changes to the input fields in the login form.
     * 
     * This function is called whenever an input field in the login form is changed.
     * It retrieves the id of the changed element and updates the state with the
     * new value of the element.
     * 
     * @param {Event} event The event that triggered the function call.
     */
    const onInputChange = (event) => {
        const elementID = event.target.id
        setData({ ...data, [elementID]: event.target.value })
    }

    /**
     * Handles the login process for a teacher.
     * @param {event} event - The event triggered when the user clicks the login button.
     * @returns {Promise<void>}
     */
    const login = async (event) => {
        event.preventDefault()
        try {
            const { data: { teacherID, token } } = await axios.post(`${url}/teacher/login`, data)
            sessionStorage.setItem('token', token)
            signIn({ auth: { token, type: 'Bearer' }, userState: { teacherID } })
            navigate(`/teacher/home `, { state: { teacherID } })
        } catch (error) {
            setError(error.message)
            console.error(error)
        }
    }

    return (
        <div className='teacherLogin'>
            <form className='loginForm' onSubmit={login}>
                <h2><span>Teacher</span> Login</h2>
                {error && <p style={{ color: 'red', background: '#0000' }}>{error}</p>}
                <div className="inputContainer">
                    <p>Email</p>
                    <input type="email" id='email' placeholder='Enter email' required onChange={onInputChange} />
                </div>
                <div className="inputContainer">
                    <p>Password</p>
                    <input type="password" id='password' placeholder='Enter password' required onChange={onInputChange} />
                </div>
                <Button btn_name={'LOGIN'} btn_type={'submit'}/>
                <p className='returnButton' onClick={() => navigate('/')}>Return</p>
            </form>
        </div>
    )
}

export default Login