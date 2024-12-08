import React from 'react'
import axios from 'axios'

import { useRef, useState, useEffect } from 'react'
import { Button } from 'primereact/button';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { InputText } from 'primereact/inputtext';
import { InputOtp } from 'primereact/inputotp';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import { ToastContainer, toast } from "react-toastify";
import { ProgressSpinner } from 'primereact/progressspinner';
import { Card } from 'primereact/card';

import NavbarClassic from '../../../components/Navbar/NavbarClassic'
import Footer from '../../../components/Footer/Footer';

import './StepsPage.css'
import 'primeicons/primeicons.css';

const StepsPage = () => {
    const stepperRef = useRef(null);
    const [department, setDepartment] = useState([]);
    const [teacher, setTeacher] = useState([]);
    const [schedule, setSchedule] = useState([]);
    const [duration, setDuration] = useState([]);
    const [loading, setLoading] = useState(false);
    const [otpValue, setOtpValue] = useState('');
    const [otpSend, setOtpSend] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const [referenceCode, setReferenceCode] = useState('');

    let today = new Date();
    let maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 9);
    let minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2);

    const url = import.meta.env.VITE_SERVER_API;

    // FORM DATA
    const [data, setData] = useState({
        // STUDENT
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        studentID: '',
        course: '',
        currentYear: '',
        // TEACHER
        teacher: '',   // teacherFirstName + teacherLastName
        schedule: '',   // startTime - endTime
        // DEPARTMENT
        department: '',
        // APPOINTMENT
        appointmentDate: '',
        appointmentDuration: '',
        appointmentPurpose: ''
    });

    const readDepartmentList = async () => {
        try {
            const newUrl = `${url}/read/appointment/all/departments`;
            const response = await axios.get(newUrl);
            if (response.status === 200) {
                const departmentList = response.data.departmentList;
                setDepartment(departmentList);
            }
        } catch (error) {
            throw error
        }
    }

    const readTeacherList = async (departmentID) => {
        try {
            const newUrl = `${url}/read/appointment/current/department/teachers?departmentID=${encodeURIComponent(departmentID)}`;
            const response = await axios.get(newUrl);
            if (response.status === 200) {
                const teacherList = response.data.teacherList;
                setTeacher(teacherList);
            }
        } catch (error) {
            throw error
        }
    }

    const readScheduleSlot = async (teacherID, inputDate) => {
        try {
            const newUrl = `${url}/read/appointment/current/teacher/schedule?teacherID=${encodeURIComponent(teacherID)}&inputDate=${encodeURIComponent(inputDate)}`;
            const response = await axios.get(newUrl);
            if (response.status === 200) {
                const scheduleSlotList = response.data.result[0];

                const formattedSchedules = scheduleSlotList.map(schedule => ({
                    scheduleID: schedule.scheduleID,
                    scheduleTime: `${schedule.startTime.slice(0, 5)} - ${schedule.endTime.slice(0, 5)}`
                }));

                setSchedule(formattedSchedules);
            }
        } catch (error) {
            throw error
        }
    }

    const readDurationLimiter = async (scheduleID, selectedDate) => {
        try {
            const newUrl = `${url}/read/appointment/current/schedule/avilable-duration?scheduleID=${encodeURIComponent(scheduleID)}&selectedDate=${encodeURIComponent(selectedDate)}`;
            const response = await axios.get(newUrl);
            if (response.status === 200) {
                const durationList = response.data.result[0].remainingDuration;

                const durationsArray = Array.from(
                    { length: Math.floor(durationList / 15) },
                    (_, index) => (index + 1) * 15
                );
                setDuration(durationsArray);
            }
        } catch (error) {
            throw error
        }
    }

    const handleDepartmentChange = (e) => {
        const selectedDepartment = e.value;
        readTeacherList(selectedDepartment.departmentID);
        setData({
            ...data,
            department: selectedDepartment
        })
    }

    const handleTeacherChange = (e) => {
        const selectedTeacher = e.value;
        setData((prevData) => ({
            ...prevData,
            teacher: selectedTeacher,
        }));
    }


    const handleDateChange = (e) => {
        setData((prevData) => ({
            ...prevData,
            appointmentDate: e.value,
        }));
        const newDate = e.value.toISOString().slice(0, 10);
        readScheduleSlot(data.teacher.teacherID, newDate);
    }

    const handleTimeChange = (e) => {
        const selectedTime = e.value;
        setData({
            ...data,
            schedule: selectedTime
        })
        readDurationLimiter(selectedTime.scheduleID, data.appointmentDate);
    }

    const handleNextToOne = () => {
        let errorCount = 0;

        if (!data.firstName.trim()) {
            errorCount += 1;
            showErrorMessage('Please enter your first name.');
        }
        if (!data.lastName.trim()) {
            errorCount += 1;
            showErrorMessage('Please enter your last name.');
        }
        if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            errorCount += 1;
            showErrorMessage('Please enter a valid email address.');
        }
        if (!data.phoneNumber.trim() || !/^\d{11}$/.test(data.phoneNumber)) {
            errorCount += 1;
            showErrorMessage('Please enter a valid 11-digit phone number.');
        }
        if (!data.course.trim()) {
            errorCount += 1;
            showErrorMessage('Please enter your course.');
        }
        if (!data.currentYear || data.currentYear < 1 || data.currentYear > 4) {
            errorCount += 1;
            showErrorMessage('Please enter your current year (1-4).');
        }
        if (!data.studentID || data.studentID <= 0 || !/^\d{8}$/.test(data.studentID)) {
            errorCount += 1;
            showErrorMessage('Please enter a valid 8-digit student ID.');
        }

        if (errorCount === 0) {
            stepperRef.current.nextCallback()
        }
    }

    const handleNextToTwo = () => {
        let errorCount = 0;

        if (!(data.department.departmentName && data.department.departmentID)) {
            errorCount += 1;
            showErrorMessage('Please select a department.');
        }
        if (!(data.teacher.fullName && data.teacher.teacherID)) {
            errorCount += 1;
            showErrorMessage('Please select a teacher.');
        }
        if (!data.appointmentDate) {
            errorCount += 1;
            showErrorMessage('Please select an appointment date.');
        }
        if (!data.appointmentDuration) {
            errorCount += 1;
            showErrorMessage('Please select an appointment duration.');
        }
        if (!data.appointmentPurpose.trim()) {
            errorCount += 1;
            showErrorMessage('Please enter a purpose for the appointment.');
        }
        if (!(data.schedule.scheduleID && data.schedule.scheduleTime)) {
            errorCount += 1;
            showErrorMessage('Please select a schedule.');
        }

        if (errorCount === 0) {
            stepperRef.current.nextCallback()
        }
    }

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

    const handleSendOTP = async () => {
        const newUrl = `${url}/send/email/otp`;
        setLoading(true);
        try {
            const response = await axios.post(newUrl, { email: data.email });
            if (response.status === 200) {
                setOtpSend(true);
                setIsResendDisabled(true);
                setResendTimer(60);
                startResendTimer();
                localStorage.setItem('otpToken', response.data.token);
                showSuccessMessage('OTP sent successfully.');
            }
        } catch (error) {
            showErrorMessage('Something went wrong.');
            throw error
        } finally {
            setLoading(false);
        }
    }

    const showSuccessMessage = (message) => {
        toast.success(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            theme: "light",
        });
    };

    const showErrorMessage = (message) => {
        toast.error(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            theme: "light",
        });
    };

    const handleSubmitOTP = async () => {
        const token = localStorage.getItem('otpToken');
        const newUrl = `${url}/send/email/verify`;
        try {
            const response = await axios.post(newUrl, { otpValue, token });
            if (response.status === 200) {
                localStorage.removeItem('otoken');
                showSuccessMessage('OTP verified successfully.');
                handleFormSubmit();
            }
        } catch (err) {
            showErrorMessage('Invalid OTP. Please try again.');
        } finally{
            localStorage.removeItem('otpToken');
        }
    };

    const handleFormSubmit = async () => {
        const newUrl = `${url}/create/appointment`;
        const departmentID = data.department.departmentID;
        const teacherID = data.teacher.teacherID;
        const scheduleID = data.schedule.scheduleID;

        const {
            appointmentDate,
            appointmentPurpose,
            appointmentDuration,
            firstName,
            lastName,
            email,
            phoneNumber,
            course,
            currentYear,
            studentID
        } = data;

        try {
            const response = await axios.post(newUrl, {
                departmentID,
                teacherID,
                appointmentDate,
                scheduleID,
                appointmentPurpose,
                appointmentDuration,
                firstName,
                lastName,
                email,
                phoneNumber,
                course,
                currentYear,
                studentID
            });

            if (response.status === 201) {
                const { referenceCode } = response.data;
                setReferenceCode(referenceCode);
                const messageUrl = `${url}/send/email/success`;
                const email = data.email;
                const result = await axios.post(messageUrl, { email, referenceCode });

                if (result.status === 200) {
                    showSuccessMessage('Appointment created successfully.');
                    stepperRef.current.nextCallback()
                }
            }

        } catch (err) {
            showErrorMessage('Something went wrong.');
        }
    };

    const header = (
        <img alt="Card" src="https://primefaces.org/cdn/primereact/images/usercard.png" />
    );

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

    useEffect(() => {
        readDepartmentList();
        console.log(department);
    }, [])

    useEffect(() => {
        if(data.selectedDate) {
            const interval = setInterval(() => {
                readScheduleSlot(data.teacher.teacherID, data.selectedDate.toISOString().slice(0, 10));
                readDurationLimiter(data.schedule.scheduleID, data.selectedDate.toISOString().slice(0, 10));
            }, 2000);
            return () => clearInterval(interval);
        }
    }, [data.selectedDate]);

    return (
        <>
            <NavbarClassic />
            <ToastContainer />
            <div className='steps-page'>
                <div className="card">
                    <Stepper ref={stepperRef} style={{ flexBasis: '50rem' }} linear={true}>
                        <StepperPanel header="Personal Information">
                            <div className="step-card">
                                <div className="step-title">
                                    <h2>Basic information about you</h2>
                                    <p>Provide your basic information about yourself make sure it's accurate as the department will validate your information.</p>
                                </div>
                                <div className="step-container">
                                    <div className="group-wrapper">
                                        <div className="p-inputgroup">
                                            <span className="p-inputgroup-addon">
                                                <i className="pi pi-user"></i>
                                            </span>
                                            <InputText placeholder="First name" value={data.firstName} onChange={(e) => setData({ ...data, firstName: e.target.value })} />
                                        </div>
                                        <div className="p-inputgroup">
                                            <span className="p-inputgroup-addon">
                                                <i className="pi pi-user"></i>
                                            </span>
                                            <InputText placeholder="Last name" value={data.lastName} onChange={(e) => setData({ ...data, lastName: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="p-inputgroup">
                                        <span className="p-inputgroup-addon">
                                            <i className="pi pi-at"></i>
                                        </span>
                                        <InputText placeholder="Email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} />
                                    </div>
                                    <div className="p-inputgroup">
                                        <span className="p-inputgroup-addon">
                                            <i className="pi pi-phone"></i>
                                        </span>
                                        <InputText placeholder="Contact Number" value={data.phoneNumber} onChange={(e) => setData({ ...data, phoneNumber: e.target.value })} />
                                    </div>
                                    <div className="group-wrapper">
                                        <div className="p-inputgroup">
                                            <span className="p-inputgroup-addon">
                                                <i className="pi pi-user"></i>
                                            </span>
                                            <InputText placeholder="Course" value={data.course} onChange={(e) => setData({ ...data, course: e.target.value })} />
                                        </div>
                                        <div className="p-inputgroup">
                                            <span className="p-inputgroup-addon">
                                                <i className="pi pi-user"></i>
                                            </span>
                                            <InputText placeholder="Year" value={data.currentYear} onChange={(e) => setData({ ...data, currentYear: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="p-inputgroup">
                                        <span className="p-inputgroup-addon">
                                            <i className="pi pi-user"></i>
                                        </span>
                                        <InputText placeholder="Student ID" value={data.studentID} onChange={(e) => setData({ ...data, studentID: e.target.value })} />
                                    </div>
                                </div>
                            </div>
                            <div className="step-footer">
                                <Button label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => handleNextToOne()} />
                            </div>
                        </StepperPanel>
                        <StepperPanel header="Appointment Information">
                            <div className="step-card">
                                <div className="step-title">
                                    <h2>Picky your schedule</h2>
                                    <p>Pick the time that works best for you.</p>
                                </div>
                                <div className="step-container">
                                    <div className="group-wrapper">
                                        <div className="p-inputgroup">
                                            <span className="p-inputgroup-addon">
                                                <i className="pi pi-warehouse"></i>
                                            </span>
                                            <Dropdown value={data.department} onChange={(e) => handleDepartmentChange(e)} options={department} optionLabel="departmentName" placeholder="Select a Department" className="w-full md:w-14rem" />
                                        </div>
                                        <div className="p-inputgroup">
                                            <span className="p-inputgroup-addon">
                                                <i className="pi pi-user"></i>
                                            </span>
                                            <Dropdown value={data.teacher} onChange={(e) => handleTeacherChange(e)} options={teacher} optionLabel="fullName" placeholder="Select a Teacher" className="w-full md:w-14rem" />
                                        </div>
                                    </div>
                                    <div className="group-wrapper">
                                        <div className="p-inputgroup">
                                            <span className="p-inputgroup-addon">
                                                <i className="pi pi-calendar"></i>
                                            </span>
                                            <Calendar value={data.appointmentDate} onChange={(e) => handleDateChange(e)} minDate={minDate} maxDate={maxDate} placeholder='Select a Date' />
                                        </div>
                                        <div className="p-inputgroup">
                                            <span className="p-inputgroup-addon">
                                                <i className="pi pi-clock"></i>
                                            </span>
                                            <Dropdown value={data.schedule} onChange={(e) => handleTimeChange(e)} options={schedule} optionLabel="scheduleTime" placeholder="Select your best time" className="w-full md:w-14rem" />
                                        </div>
                                        <div className="p-inputgroup">
                                            <span className="p-inputgroup-addon">
                                                <i className="pi pi-clock"></i>
                                            </span>
                                            <Dropdown value={data.appointmentDuration} onChange={(e) => setData({ ...data, appointmentDuration: e.value })} options={duration} placeholder="Select duration" className="w-full md:w-14rem" />
                                        </div>
                                    </div>
                                    <div className="p-inputgroup">
                                        <span className="p-inputgroup-addon">
                                            <i className="pi pi-tablet"></i>
                                        </span>
                                        <InputTextarea autoResize='false' placeholder="Appointment Purpose" value={data.appointmentPurpose} onChange={(e) => setData({ ...data, appointmentPurpose: e.target.value })} rows={5} cols={30} />
                                    </div>
                                </div>
                            </div>
                            <div className="step-footer">
                                <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
                                <Button label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => handleNextToTwo()} />
                            </div>
                        </StepperPanel>
                        <StepperPanel header="Summary">
                            <div className="step-card">
                                <div className="step-title">
                                    <h2>Summary</h2>
                                    <p>The following are the summary of your appointment. Please double check the information your provided. If the information is incorrect, please go back and update it. Thank you</p>
                                </div>
                                <div className="step-container">
                                    <div className="group-wrapper">
                                        <div className="p-inputgroup">
                                            <span className="p-inputgroup-addon">
                                                <i className="pi pi-user"></i>
                                            </span>
                                            <InputText value={data.firstName} disabled />
                                        </div>
                                        <div className="p-inputgroup">
                                            <span className="p-inputgroup-addon">
                                                <i className="pi pi-user"></i>
                                            </span>
                                            <InputText value={data.lastName} disabled />
                                        </div>
                                    </div>
                                    <div className="p-inputgroup">
                                        <span className="p-inputgroup-addon">
                                            <i className="pi pi-at"></i>
                                        </span>
                                        <InputText value={data.email} disabled />
                                    </div>
                                    <div className="p-inputgroup">
                                        <span className="p-inputgroup-addon">
                                            <i className="pi pi-phone"></i>
                                        </span>
                                        <InputText value={data.phoneNumber} disabled />
                                    </div>
                                    <div className="group-wrapper">
                                        <div className="p-inputgroup">
                                            <span className="p-inputgroup-addon">
                                                <i className="pi pi-user"></i>
                                            </span>
                                            <InputText value={data.course} disabled />
                                        </div>
                                        <div className="p-inputgroup">
                                            <span className="p-inputgroup-addon">
                                                <i className="pi pi-user"></i>
                                            </span>
                                            <InputText value={data.currentYear} disabled />
                                        </div>
                                    </div>
                                    <div className="p-inputgroup">
                                        <span className="p-inputgroup-addon">
                                            <i className="pi pi-user"></i>
                                        </span>
                                        <InputText value={data.studentID} disabled />
                                    </div>
                                    <div className="group-wrapper">
                                        <div className="p-inputgroup">
                                            <span className="p-inputgroup-addon">
                                                <i className="pi pi-warehouse"></i>
                                            </span>
                                            <InputText value={data.department.departmentName} disabled />
                                        </div>
                                        <div className="p-inputgroup">
                                            <span className="p-inputgroup-addon">
                                                <i className="pi pi-user"></i>
                                            </span>
                                            <InputText value={data.teacher.fullName} disabled />
                                        </div>
                                    </div>
                                    <div className="group-wrapper">
                                        <div className="p-inputgroup">
                                            <span className="p-inputgroup-addon">
                                                <i className="pi pi-calendar"></i>
                                            </span>
                                            <InputText value={data.appointmentDate} disabled />
                                        </div>
                                        <div className="p-inputgroup">
                                            <span className="p-inputgroup-addon">
                                                <i className="pi pi-clock"></i>
                                            </span>
                                            <InputText value={data.schedule.scheduleTime} disabled />
                                        </div>
                                        <div className="p-inputgroup">
                                            <span className="p-inputgroup-addon">
                                                <i className="pi pi-clock"></i>
                                            </span>
                                            <InputText value={data.appointmentDuration} disabled />
                                        </div>
                                    </div>
                                    <div className="p-inputgroup">
                                        <span className="p-inputgroup-addon">
                                            <i className="pi pi-tablet"></i>
                                        </span>
                                        <InputTextarea autoResize='false' value={data.appointmentPurpose} disabled rows={5} cols={30} />
                                    </div>
                                </div>
                            </div>
                            <div className="step-footer">
                                <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
                                <Button label="Submit" icon="pi pi-arrow-right" iconPos="right" onClick={() => { handleSendOTP(); stepperRef.current.nextCallback() }} />
                            </div>
                        </StepperPanel>
                        <StepperPanel header="OTP Verification">
                            <div className="otp">
                                {loading === true ? (
                                    <ProgressSpinner />
                                ) : (
                                    <>
                                        <div className="step-card">
                                            <div className="step-title">
                                                <h2>Enter OTP</h2>
                                                <p>Enter the 4 digit OTP code sent to your email.</p>
                                            </div>
                                            <InputOtp value={otpValue} onChange={(e) => setOtpValue(e.value)} integerOnly />
                                        </div>
                                        <div className="step-footer">
                                            <Button label="Resend Code" severity="secondary" icon="pi pi-arrow-left" onClick={() => { handleSendOTP() }} disabled={isResendDisabled} />
                                            <Button label="Submit Code" icon="pi pi-arrow-right" iconPos="right" onClick={() => { handleSubmitOTP() }} />
                                        </div>
                                    </>
                                )}
                            </div>
                        </StepperPanel>
                        <StepperPanel header="Success">
                            <div className="success-step">
                                <Card title={referenceCode} subTitle="Successfully booked appointment." header={header} className="md:w-25rem">
                                    <div className="card-content">
                                        <p>
                                            <br />
                                            <strong>We have received your appointment.</strong>
                                            <br />
                                            <br />
                                            Please check your email from time to time for any updates regarding your appointment. Present this reference code to the teacher upon arrival.
                                            Thank you for using Appointify as your booking service. 
                                        </p>
                                    </div>
                                </Card>
                            </div>

                        </StepperPanel>
                    </Stepper>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default StepsPage
