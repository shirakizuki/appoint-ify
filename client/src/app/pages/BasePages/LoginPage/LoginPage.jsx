import React from 'react'
import axios from 'axios'

import { assets } from '../../../../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useSignIn } from '../../../context/ServerContext'

import TextBox from '../../../components/InputContainer/TextBox'
import LoadingAnimation from '../../../components/Animations/LoadingAnimation/LoadingAnimation'
import Button_1 from '../../../components/Button/Button_1'

import './LoginPage.css'

const LoginPage = () => {
    const navigate = useNavigate();
    const signIn = useSignIn();
    const [error, setError] = useState('');
    const [state, setState] = useState('teacher');
    const [loading, setLoading] = useState(false);

    const url = import.meta.env.VITE_SERVER_API;

    const [loginData, setLoginData] = useState({
        email: '',
        username: '',
        password: '',
    })

    const onInputChange = (event) => {
        const elementID = event.target.id
        setLoginData({ ...loginData, [elementID]: event.target.value })
        setError('');
    }

    const handleStateChange = () => {
        setState((prevType) => (prevType === 'teacher' ? 'admin' : 'teacher'));
        setLoginData({
            email: '',
            username: '',
            password: '',
        });
    }

    const login = async (event) => {
        event.preventDefault()
        setLoading(true);
        try {
            if (state === 'teacher') {
                const response = await axios.post(`${url}/login/teacher`, loginData);
                if (response.status === 200) {
                    const token = response.data.token;
                    const teacherID = response.data.teacherID;
                    sessionStorage.setItem('token', token);
                    signIn({ auth: { token, type: 'Bearer' }, userState: { teacherID } });
                    navigate(`/teacher/home `, { state: { teacherID } });
                } else if (response.status === 401) {
                    setError('Invalid credentials');
                } else {
                    setError('Invalid credentials');
                }
            } else if (state === 'admin') {
                const response = await axios.post(`${url}/login/admin`, loginData);
                if (response.status === 200) {
                    const token = response.data.token;
                    const departmentID = response.data.departmentID;
                    const accountID = response.data.accountID;
                    sessionStorage.setItem('token', token);
                    signIn({ auth: { token, type: 'Bearer' }, userState: { departmentID } });
                    navigate(`/admin/home`, { state: { departmentID, accountID } });
                } else if (response.status === 401) {
                    setError('Invalid credentials');
                } else {
                    setError('Invalid credentials');
                }
            }
        } catch (error) {
            setError(error.response.data.message);
            throw error;
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='login-page-container'>
            <div className="first-section">
                <div className="title-wrapepr">
                    <img src={assets.logo} alt="appointify_logo.png" className='title-img' />
                    <h1 className='title'>Appointify</h1>
                </div>
            </div>
            <div className="second-section">
                {loading !== true ? (
                    <>
                        <div className="title-wrapper">
                            <div className="header-content">
                                <a onClick={() => navigate('/')}>Back To Home</a>
                            </div>
                            <div className="choice-content">
                                <a onClick={handleStateChange} className={state === 'teacher' ? 'active' : ''}>Teacher</a>
                                <a onClick={handleStateChange} className={state === 'admin' ? 'active' : ''}>Admin</a>
                            </div>
                            <div className="descriptor-content">
                                <p>The fastest way to get up and running with Appointify, our self-service platform allows you to easily track and manage your apppopintments.</p>
                            </div>
                        </div>
                        {error && <p style={{ color: 'red', background: '#0000' }}>{error}</p>}
                        <div className="body-wrapper">
                            {state === 'teacher' ? (
                                <>
                                    <TextBox type="email" change={onInputChange}placeholder="Email Address" name="email" identifier="email" value={loginData.email} />
                                    <TextBox type="password" change={onInputChange} placeholder="Password" name="password" identifier="password" value={loginData.password} />
                                </>
                            ) : (
                                <>
                                    <TextBox type="text" change={onInputChange} placeholder="Username" name="username" identifier="username" value={loginData.username} />
                                    <TextBox type="password" change={onInputChange} placeholder="Password" name="password" identifier="password" value={loginData.password} />
                                </>
                            )}
                            <div className="button-wrapper">
                                <Button_1 text='Login' onClick={login} identifier='login-button' disabled={false} />
                            </div>
                        </div>
                        <div className="footer-wrapper">
                            <p>By loging in, you agree to Appointify's Terms of Use and Privacy Policy.</p>
                        </div>
                    </>
                ) : (
                    <div className="loading-wrapper">
                        <LoadingAnimation />
                    </div>
                )}
            </div>
        </div>
    )
}

export default LoginPage
