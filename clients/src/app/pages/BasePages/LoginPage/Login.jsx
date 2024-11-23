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
import DefaultNavbar from '../../../components/Navbar/DefaultNavbar/DefaultNavbar'
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
    const [type, setType] = useState('Teacher')
    const [error, setError] = useState('');
    const [data, setData] = useState({
        email: '',
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
            if(type === 'Teacher') {
                const response = await axios.post(`${url}/teacher/login`, data);
                if(response.status === 200) {
                    const token = response.data.token
                    const teacherID = response.data.teacherID
                    sessionStorage.setItem('token', token)
                    signIn({ auth: { token, type: 'Bearer' }, userState: { teacherID } })
                    navigate(`/teacher/home `, { state: { teacherID } })
                } else if (response.status === 401) {
                    setError('Invalid credentials')
                }
            } else if (type === 'Admin') {
                const response = await axios.post(`${url}/admin/login`, data);
                if(response.status === 200) {
                    const token = response.data.token
                    const departmentID = response.data.departmentID
                    sessionStorage.setItem('token', token)
                    signIn({ auth: { token, type: 'Bearer' }, userState: { departmentID } })
                    navigate(`/admin/home `, { state: { departmentID } })
                } else if (response.status === 401) {
                    setError('Invalid credentials')
                }            
            }
        } catch (error) {
            throw error
        }
    }

    return (
        <>
            <DefaultNavbar />
            <div className='teacherLogin'>
                {type === 'Teacher' ? (
                    <form className='loginForm' onSubmit={login}>
                        <h2><span>{type}</span> Login</h2>
                        {error && <p style={{ color: 'red', background: '#0000' }}>{error}</p>}
                        <div className="inputContainer">
                            <p>Email</p>
                            <input type="email" id='email' placeholder='name@company.com' required onChange={onInputChange} />
                        </div>
                        <div className="inputContainer">
                            <p>Password</p>
                            <input type="password" id='password' placeholder='********' required onChange={onInputChange} />
                        </div>
                        <Button btn_name={'LOGIN'} btn_type={'submit'}/>
                        <p className='returnButton' onClick={() => setType('Admin')}>Admin? Click Here!</p>
                    </form>
                ) : (
                    <form className='loginForm' onSubmit={login}>
                        <h2><span>{type}</span> Login</h2>
                        {error && <p style={{ color: 'red', background: '#0000' }}>{error}</p>}
                        <div className="inputContainer">
                            <p>Username</p>
                            <input type="text" id='username' placeholder='username123' required onChange={onInputChange} />
                        </div>
                        <div className="inputContainer">
                            <p>Password</p>
                            <input type="password" id='password' placeholder='********' required onChange={onInputChange} />
                        </div>
                        <Button btn_name={'LOGIN'} btn_type={'submit'}/>
                        <p className='returnButton' onClick={() => setType('Teacher')}>Teacher? Click Here!</p>
                    </form>
                )}
            </div>
        </>
    )
}

export default Login