import React from 'react'

import './FormInput.css'

const CompanyStatement = ({ activeStep, steps, handleNext }) => {
    return (
        <div className='contentForm companyStatement'>
            <div className='header'>
                <h1>Company Statement</h1>
            </div>
            <div className='body'>
                <p className='welcomeMessage'>Welcome to the UC Online Appointment System. <br /> Review all fields in the online form before proceeding and provide accurate information.</p>
                <h4 className='disclaimer'>Appointments allocates slots on a first come, first server basis.</h4>
                <p className='description'>Users accept the responsibility for supplying, checking, and verifying the accuracy and correctness of the information they provide on this system in connection with their application. Incorrect or inaccurate information supplied may result in forfeiture of the appointment.</p>
                <div className="overview">
                    <div className="rules">
                        <h4>Basic Instructions</h4>
                        <ul>
                            <li>1. Provide your personal accurate information.</li>
                            <li>2. Select your department and teacher. Then state the purpose of the appointment.</li>
                            <li>3. Pick your best schedule. Appointment duration will depend upon the remaining time of the selected time slot.</li>
                            <li>4. Verify appointment details on the Summary tab.</li>
                            <li>5. Click 'Submit' to confirm your appointment and wait for one-time-password (OTP) to be sent to your registered email.</li>
                            <li>6. Once your appointment is confirmed, you will receive a notification via email.</li>
                        </ul>
                    </div>
                </div>
                <h3>By clicking continue, you agree to the <a>Terms and Condition</a> and <a>Privacy Policy</a> of Appointify.</h3>
            </div>
            <div className="footer">
                <button onClick={handleNext} disabled={activeStep === steps.length - 1} className="formButton"> Continue </button>
            </div>
        </div>
    )
}

export default CompanyStatement
