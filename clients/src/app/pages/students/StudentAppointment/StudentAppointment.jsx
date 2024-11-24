import React from 'react'

import { useState } from 'react'

import StudentNavbar from '../../../components/Navbar/StudentNavbar/StudentNavbar'

import CompanyStatement from './CompanyStatement'
import PersonalInformation from './PersonalInformation'
import TeacherInformation from './TeacherInformation'
import ScheduleInformation from './ScheduleInformation'
import SummaryForm from './SummaryForm'

import './StudentAppointment.css'
import './FormInput.css'

const StudentAppointment = () => {
    const [activeStep, setActiveStep] = useState(0);
    const steps = [
        "Terms and Condition / Privacy Policy",
        "Personal Information",
        "Teacher Information",
        "Schedule",
        "Summary",
    ];

    const handleNext = () => {
        if (activeStep < steps.length - 1) {
            setActiveStep((prevStep) => prevStep + 1);
        }
    };

    const handleBack = () => {
        if (activeStep > 0) {
            setActiveStep((prevStep) => prevStep - 1);
        }
    }

    const [formData, setFormData] = useState({
        // Contact Information
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        course: '',
        currentYear: '',
        studentID: '',
        // studentPhoto: '',
        // Teacher Information
        departmentID: '',
        departmentName: '',
        teacherID: '',
        fullName: '',
        appointmentPurpose: '',
        // Schedule Information
        appointmentDate: '',
        scheduleID: '',
        scheduleSlot: '',
        appointmentDuration: '',
    });

    return (
        <>
            <StudentNavbar />
            <div className='appointmentContainer'>
                <div className="stepDetails">
                    <table className='stepTable'>
                        <tbody>
                            <tr className='stepRow title'><td>Appointment</td></tr>
                            {steps.map((step, index) => (
                                <tr key={index} className={`stepRow ${index === activeStep ? "active" : ""} ${index > activeStep ? "disabled" : ""}`}><td>{step}</td></tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="formContainer">
                    {activeStep === 0
                        ? <CompanyStatement activeStep={activeStep} steps={steps} handleBack={handleBack} handleNext={handleNext} />
                        : activeStep === 1
                        ? <PersonalInformation formData={formData} setFormData={setFormData} setActiveStep={setActiveStep} activeStep={activeStep} steps={steps}/>
                        : activeStep === 2
                        ? <TeacherInformation formData={formData} setFormData={setFormData} setActiveStep={setActiveStep} activeStep={activeStep} steps={steps}/>
                        : activeStep === 3
                        ? <ScheduleInformation formData={formData} setFormData={setFormData} setActiveStep={setActiveStep} activeStep={activeStep} steps={steps}/>
                        : activeStep === 4
                        ? <SummaryForm formData={formData} activeStep={activeStep} steps={steps} handleBack={handleBack} handleNext={handleNext} />
                        : <CompanyStatement activeStep={activeStep} steps={steps} handleBack={handleBack} handleNext={handleNext} />
                    }
                </div>
            </div>
        </>
    )
}

export default StudentAppointment