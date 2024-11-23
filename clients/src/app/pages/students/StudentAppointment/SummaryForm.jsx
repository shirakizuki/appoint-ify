import React from 'react'
import axios from 'axios'

import { useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { ServerContext } from '../../../../context/ServerContext'

import './FormInput.css'

const SummaryForm = ({ formData, activeStep, handleBack }) => {
    const navigate = useNavigate();
    const { url } = useContext(ServerContext);
    
    const handleForm = async () => {
        const newUrl = `${url}/appointment/sendotp`
        try{
            const response = await axios.post(newUrl, {
                email:formData.email
            });
            if(response.status === 200) {
                navigate('/appointment/otp', {state: {formData}})
                localStorage.setItem('otoken', response.data.token)
            }
        } catch (error) {
            throw error;
        }
    }

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = "";
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);
    
    return (
        <div className="contentForm sumamryForm">
            <div className="header">
                <h1>Summary</h1>
            </div>
            <div className="body">
                <p>Name: <span>{formData.firstName} {formData.lastName}</span></p>
                <p>Email: <span>{formData.email}</span></p>
                <p>Number: <span>{formData.phoneNumber}</span></p>
                <p>Course & Year: <span>{formData.course} {formData.year}</span></p>
                <p>Student ID: <span>{formData.studentID}</span></p>
                <p>Department: <span>{formData.departmentName}</span></p>
                <p>Teacher Name: <span>{formData.fullName}</span></p>
                <p>Schedule Date: <span>{formData.scheduleDate}</span></p>
                <p>Time Slot: <span>{formData.scheduleSlot}</span></p>
                <p>Duration: <span>{formData.duration} minutes</span></p>
                <p>Purpose: <span>{formData.purpose}</span></p>
            </div>
            <div className="footer">
                <button onClick={handleBack} disabled={activeStep === 0} className="formButton"> Back </button>
                <button className="formButton" onClick={handleForm}> Submit </button>
            </div>
        </div>
    )
}

export default SummaryForm