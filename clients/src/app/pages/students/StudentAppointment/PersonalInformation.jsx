import React from 'react'

import { useState, useEffect, useContext } from 'react'

import './FormInput.css'

const PersonalInformation = ({ formData, setFormData, activeStep, steps, setActiveStep }) => {
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const errors = {};
        if (!formData.firstName.trim()) errors.firstName = "First Name is required.";
        if (!formData.lastName.trim()) errors.lastName = "Last Name is required.";
        if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Valid email is required.";
        if (!formData.phoneNumber.trim() || !/^\d{11}$/.test(formData.phoneNumber)) errors.phoneNumber = "A valid 11-digit contact number is required.";
        if (!formData.course.trim()) errors.course = "Course is required.";
        if (!formData.currentYear || formData.currentYear < 1 || formData.currentYear > 4) errors.currentYear = "Year must be between 1 and 4.";
        if (!formData.studentID || formData.studentID <= 0 || !/^\d{8}$/.test(formData.studentID)) errors.studentID = "A valid Student ID is required.";
        setErrors(errors);
        return Object.keys(errors).length === 0;
    }

    const handleNext = () => {
        if(validateForm() && activeStep < steps.length - 1) {
            setActiveStep((prevStep) => prevStep + 1);
        }
    }

    const handleBack = () => {
        if (activeStep > 0) {
            setActiveStep((prevStep) => prevStep - 1);
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
        <div className='contentForm'>
            <div className='header'>
                <h1>Contact Information</h1>
            </div>
            <div className="body">
                <div className="inputField">
                    <label>First Name:</label>
                    <div className="inputCont">
                        <input type="text" name="firstName" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                        {errors.firstName && <span className="error">{errors.firstName}</span>}
                    </div>
                </div>
                <div className="inputField">
                    <label>Last Name:</label>
                    <div className="inputCont">
                        <input type="text" name="lastName" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                        {errors.lastName && <span className="error">{errors.lastName}</span>}
                    </div>
                </div>
                <div className="inputField">
                    <label>Email:</label>
                    <div className="inputCont">
                        <input type="email" name="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                        {errors.email && <span className="error">{errors.email}</span>}
                    </div>
                </div>
                <div className="inputField">
                    <label>Contact Number:</label>
                    <div className="inputCont">
                        <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} />
                        {errors.phoneNumber && <span className="error">{errors.phoneNumber}</span>}
                    </div>
                </div>
                <div className="inputField">
                    <label>Course:</label>
                    <div className='inputCont'>
                        <input type="text" name="course" value={formData.course} onChange={(e) => setFormData({ ...formData, course: e.target.value })} />
                        {errors.course && <span className="error">{errors.course}</span>}
                    </div>
                </div>
                <div className="inputField">
                    <label>Year:</label>
                    <div className='inputCont'>
                        <input type="number" name="year" min="1" max="4" value={formData.currentYear} onChange={(e) => setFormData({ ...formData, currentYear: e.target.value })} />
                        {errors.currentYear && <span className="error">{errors.currentYear}</span>}
                    </div>
                </div>
                <div className="inputField">
                    <label>Student ID:</label>
                    <div className="inputCont">
                        <input type="number" name="studentID" value={formData.studentID} onChange={(e) => setFormData({ ...formData, studentID: e.target.value })} />
                        {errors.studentID && <span className="error">{errors.studentID}</span>}
                    </div>
                </div>
            </div>
            <div className="footer">
                <button onClick={handleBack} disabled={activeStep === 1} className="formButton"> Back </button>
                <button onClick={handleNext} disabled={activeStep === steps.length - 1} className="formButton"> Continue </button>
            </div>
        </div>
    )
}

export default PersonalInformation;