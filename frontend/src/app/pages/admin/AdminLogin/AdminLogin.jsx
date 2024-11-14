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
import './AdminLogin.css'

const AdminLogin = () => {
    // VARIABLES
    const [error, setError] = useState('');
    const [data, setData] = useState({
        username: '',
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
            const { data: { departmentID, token } } = await axios.post(`${url}/admin/login`, data)
            sessionStorage.setItem('token', token)
            signIn({ auth: { token, type: 'Bearer' }, userState: { departmentID } })
            navigate(`/admin/home `, { state: { departmentID } })
        } catch (error) {
            setError(error.message)
            console.error(error)
        }
    }

    return (
        <div className='adminLogin'>
            <form className='loginForm' onSubmit={login}>
                <h2><span>Admin</span> Login</h2>
                {error && <p style={{ color: 'red', background: '#0000' }}>{error}</p>}
                <div className="inputContainer">
                    <p>Username</p>
                    <input type="text" id='username' placeholder='Enter username' required onChange={onInputChange} />
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

export default AdminLogin