import React, { useState, useContext } from 'react'
import axios from 'axios'
import { useLocation } from 'react-router-dom';
import { ServerContext } from '../../../../context/ServerContext'

import StudentNavbar from '../../../components/Navbar/StudentNavbar/StudentNavbar'

import './OneTimePin.css'

const OneTimePin = () => {
    const formData = useLocation().state?.formData;
    const { url } = useContext(ServerContext);
    const [refCode, setRefCode] = useState('');
    const [otp, setOtp] = useState(Array(5).fill(''));

    const handleChange = (index, value) => {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < otp.length - 1) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    const resentOTP = async () => {
        const newUrl = `${url}/appointment/sendotp`
        try{
            const response = await axios.post(newUrl, {
                email: formData.email
            });
            if(response.status === 200) {
                localStorage.setItem('otoken', response.data.token)
            }
        } catch (error) {
            throw error;
        }
    }

    const handleOtpSubmit = async () => {
        const otpCode = otp.join('');
        const token = localStorage.getItem('otoken');
        const newUrl = `${url}/appointment/verifyotp`;
        try {
            const response = await axios.post(newUrl, {
                otpCode,
                token
            });
            if(response.status === 200) {
                alert('OTP successfully verified')
            }
        } catch (error) {
            throw error;
        }
    }

    //TODO: If otp is valid, then proceed to next page

    const handleFormSubmit = async () => {
        const newUrl = `${url}/appointment/submitForm`;
        try {
            const response = await axios.post(newUrl, formData);
            if(response.status === 200) {
                const refCode = response.data.refCode
                setRefCode(refCode);
            }
        } catch (error) {
            throw error;
        }
    }

    return (
        <>
            <StudentNavbar/>
            <div className='oneTimePin'>
                <section>
                    <div className="container">
                        <h1 className="title">Enter OTP</h1>
                        <form id="otp-form">
                            {otp.map((value, index) => (
                                <input
                                    key={index}
                                    id={`otp-${index}`}
                                    type="text"
                                    className="otp-input"
                                    maxLength="1"
                                    value={value}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                />
                            ))}
                        </form>
                        <button id="verify-btn" onClick={handleOtpSubmit}>Verify OTP</button>
                        <button id="verify-btn" onClick={resentOTP}>Resend OTP</button>
                    </div>
                </section>
            </div>
        </>
    )
}

export default OneTimePin