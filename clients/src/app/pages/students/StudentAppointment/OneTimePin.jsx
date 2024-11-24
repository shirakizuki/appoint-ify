import React, { useState, useContext, useEffect } from 'react'
import axios from 'axios'

import { useLocation, useNavigate } from 'react-router-dom';
import { ServerContext } from '../../../../context/ServerContext'

import StudentNavbar from '../../../components/Navbar/StudentNavbar/StudentNavbar'

import './OneTimePin.css'

const OneTimePin = () => {
    const formData = useLocation().state?.formData;
    const navigate = useNavigate();
    const { url } = useContext(ServerContext);
    const [otp, setOtp] = useState(Array(5).fill(''));
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const [resendTimer, setResendTimer] = useState(60);
    const [error, setError] = useState('');

    const handleChange = (index, value) => {
        const newOtp = [...otp];
        newOtp[index] = value.replace(/[^0-9]/g, '');
        setOtp(newOtp);

        if (value && index < otp.length - 1) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    const resendOTP = async () => {
        setIsResendDisabled(true);
        setResendTimer(60);
        const newUrl = `${url}/appointment/sendotp`
        try {
            const response = await axios.post(newUrl, {
                email: formData.email
            });
            if (response.status === 200) {
                localStorage.setItem('otoken', response.data.token)
            }
        } catch (error) {
            throw error;
        } finally {
            setTimeout(() => setIsResendDisabled(false), 60000);
        }
    }

    const handleOtpSubmit = async () => {
        setError('');
        const otpCode = otp.join('');
        if (!/^\d{5}$/.test(otpCode)) {
            setError('Please enter a valid 5-digit OTP.');
            return;
        }
        const token = localStorage.getItem('otoken');
        const newUrl = `${url}/appointment/verifyotp`;
        try {
            const response = await axios.post(newUrl, {
                otpCode,
                token
            });
            if (response.status === 200) {
                localStorage.removeItem('otoken');
                handleFormSubmit();
                console.table(formData);
            }
        } catch (error) {
            setError('Invalid OTP. Please try again.');
            throw error;
        }
    }

    const handleFormSubmit = async () => {
        const newUrl = `${url}/appointment/createappointment`;
        try {
            const response = await axios.post(newUrl, {
                formData: formData
            });
            if (response.status === 201) {
                const referenceCode = response.data.referenceCode;
                navigate('/appointment/success', { state: { referenceCode } });
            }
        } catch (error) {
            throw error;
        }
    }

    useEffect(() => {
        if (isResendDisabled) {
            const timer = setInterval(() => {
                setResendTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setIsResendDisabled(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [isResendDisabled]);

    return (
        <>
            <StudentNavbar />
            <div className='oneTimePin'>
                <section>
                    <div className="container">
                        <h1 className="title">Enter OTP</h1>
                        {error && <p className="error">{error}</p>}
                        <form id="otp-form">
                            {otp.map((value, index) => (
                                <input
                                    key={index}
                                    id={`otp-${index}`}
                                    type="text"
                                    className="otp-input"
                                    maxLength="1"
                                    value={value}
                                    onChange={(e) => {handleChange(index, e.target.value); console.log(e.target.value)}}
                                />
                            ))}
                        </form>
                        <div className="button">
                            <button id="verify-btn" onClick={handleOtpSubmit}>Verify OTP</button>
                            <button id="resend-btn" onClick={resendOTP} disabled={isResendDisabled}>{isResendDisabled ? `Resend ${resendTimer} seconds` : 'Resend OTP'}</button>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}

export default OneTimePin