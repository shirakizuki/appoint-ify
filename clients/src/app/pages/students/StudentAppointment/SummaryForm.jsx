import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ServerContext } from '../../../../context/ServerContext';
import './FormInput.css';
import './OneTimePin.css';

const SummaryForm = ({ formData, activeStep, handleBack }) => {
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const [resendTimer, setResendTimer] = useState(0);
    const [otp, setOtp] = useState(Array(5).fill(''));
    const [loading, setLoading] = useState(false);
    const [otpSend, setOtpSend] = useState(false);
    const { url } = useContext(ServerContext);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const startResendTimer = () => {
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
        }
    };

    const sendOtp = async () => {
        const newUrl = `${url}/appointment/sendotp`;
        setLoading(true);
        setError('');
        try {
            const response = await axios.post(newUrl, { email: formData.email });
            if (response.status === 200) {
                setOtpSend(true);
                setIsResendDisabled(true);
                setResendTimer(60);
                startResendTimer();
                localStorage.setItem('otoken', response.data.token);
            }
        } catch (err) {
            setError('Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const resendOTP = async () => {
        setIsResendDisabled(true);
        setResendTimer(60);
        setError('');
        const newUrl = `${url}/appointment/sendotp`;
        try {
            const response = await axios.post(newUrl, { email: formData.email });
            if (response.status === 200) {
                localStorage.setItem('otoken', response.data.token);
            }
        } catch (err) {
            setError('Failed to resend OTP. Please try again.');
        } finally {
            setTimeout(() => setIsResendDisabled(false), 60000);
        }
    };

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
            const response = await axios.post(newUrl, { otpCode, token });
            if (response.status === 200) {
                localStorage.removeItem('otoken');
                handleFormSubmit();
            }
        } catch (err) {
            setError('Invalid OTP. Please try again.');
        }
    };

    const handleFormSubmit = async () => {
        const newUrl = `${url}/appointment/createappointment`;
        try {
            const response = await axios.post(newUrl, { formData });
            if (response.status === 201) {
                const { referenceCode } = response.data;
                const messageUrl = `${url}/appointment/success`;
                const email = formData.email;
                await axios.post(messageUrl, { email, referenceCode });
                navigate('/appointment/success', { state: { referenceCode } });
            }
        } catch (err) {
            setError('Failed to submit form. Please try again.');
        }
    };

    const handleChange = (index, value) => {
        const newOtp = [...otp];
        newOtp[index] = value.replace(/[^0-9]/g, '');
        setOtp(newOtp);

        if (value && index < otp.length - 1) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    useEffect(() => {
        window.addEventListener('beforeunload', (event) => {
            event.preventDefault();
            event.returnValue = '';
        });

        return () => {
            window.removeEventListener('beforeunload', () => { });
        };
    }, []);

    return (
        <div className="contentForm summaryForm">
            {error && <p className="error">{error}</p>}
            {!loading ? (
                <>
                    {!otpSend ? (
                        <>
                            <div className="header">
                                <h1>Summary</h1>
                            </div>
                            <div className="body">
                                <p>Name: <span>{formData.firstName} {formData.lastName}</span></p>
                                <p>Email: <span>{formData.email}</span></p>
                                <p>Number: <span>{formData.phoneNumber}</span></p>
                                <p>Course & Year: <span>{formData.course} {formData.currentYear}</span></p>
                                <p>Student ID: <span>{formData.studentID}</span></p>
                                <p>Department: <span>{formData.departmentName}</span></p>
                                <p>Teacher Name: <span>{formData.fullName}</span></p>
                                <p>Schedule Date: <span>{formData.appointmentDate}</span></p>
                                <p>Time Slot: <span>{formData.scheduleSlot}</span></p>
                                <p>Duration: <span>{formData.appointmentDuration} minutes</span></p>
                                <p>Purpose: <span>{formData.appointmentPurpose}</span></p>
                            </div>
                            <div className="footer">
                                <button onClick={handleBack} disabled={activeStep === 0} className="formButton">
                                    Back
                                </button>
                                <button className="formButton" onClick={sendOtp}>
                                    Submit
                                </button>
                            </div>
                        </>
                    ) : (
                        <section className='oneTimePin'>
                            <h1 className='title'>OTP Form</h1>
                            <p className='descTitle'>Please enter the 6 digit OTP sent to your email <span>{formData.email}</span> </p>
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
                            <div className="button">
                                <button id="verify-btn" onClick={handleOtpSubmit}>
                                    Verify OTP
                                </button>
                                <button id="resend-btn" onClick={resendOTP} disabled={isResendDisabled}>
                                    {isResendDisabled ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                                </button>
                            </div>
                        </section>
                    )}
                </>
            ) : (
                <div className="loading">Loading...</div>
            )}
        </div>
    );
};

export default SummaryForm;
