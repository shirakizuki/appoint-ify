import React from 'react'
import axios from 'axios'

import { ServerContext } from '../../../../context/ServerContext'
import { useState, useEffect, useContext } from 'react'

import './FormInput.css'

const TeacherInformation = ({ formData, setFormData, activeStep, steps, setActiveStep }) => {
    const [departmentList, setDepartmentList] = useState([]);
    const [teacherList, setTeacherList] = useState([]);
    const [errors, setErrors] = useState({});
    const { url } = useContext(ServerContext);

    const validateForm = () => {
        const errors = {};
        if (!formData.departmentName.trim()) errors.departmentName = "Department is required.";
        if (!formData.fullName.trim()) errors.fullName = "Teacher is required.";
        if (!formData.purpose.trim()) errors.purpose = "Please provide a valid purpose.";
        setErrors(errors);
        return Object.keys(errors).length === 0;
    }

    const handleNext = () => {
        if (validateForm() && activeStep < steps.length - 1) {
            setActiveStep((prevStep) => prevStep + 1);
        }
    }

    const handleBack = () => {
        if (activeStep > 0) {
            setActiveStep((prevStep) => prevStep - 1);
        }
    }

    const loadDepartmentList = async () => {
        const newUrl = `${url}/appointment/departmentlist`
        const response = await axios.get(newUrl);
        if (response.status === 200) {
            setDepartmentList(response.data.departmentList);
        } else {
            console.log('Failed to load department:', response.error.message);
        }
    }

    const loadTeacherList = async (departmentID) => {
        try {
            const newUrl = `${url}/appointment/teacherlist?departmentID=${encodeURIComponent(departmentID)}`;
            const response = await axios.get(newUrl);
            if (response.status === 200) {
                setTeacherList(response.data.teacherList);
            } else {
                console.error("Failed to load departments:", response.data.error);
            }
        } catch (error) {
            console.error("Error loading departments:", error.message);
        }
    }

    const handleDepartmentChange = (e) => {
        const departmentID = e.target.value;
        const departmentName = departmentList.find(
            (department) => department.departmentID === parseInt(departmentID)
        )?.departmentName;
        setFormData({
            ...formData,
            departmentID,
            departmentName,
            teacherID: "",
            fullName: ""
        });
        loadTeacherList(departmentID);
    };

    const handleTeacherChange = (e) => {
        const teacherID = e.target.value;
        const fullName = teacherList.find(
            (teacher) => teacher.teacherID === parseInt(teacherID)
        )?.fullName;

        setFormData({
            ...formData,
            teacherID,
            fullName
        });
    };

    useEffect(() => {
        loadDepartmentList();
    }, []);

    useEffect(() => {
        if (formData.departmentID) {
            loadTeacherList(formData.departmentID);
        }
    }, [formData.departmentID]);

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
                <h1>Choose Your Teacher</h1>
            </div>
            <div className="body">
                <div className="inputField">
                    <label>Department:</label>
                    <div className="inputCont">
                        <select name='department' id='department' value={formData.departmentID || ""} required onChange={handleDepartmentChange}>
                            <option value="" disabled defaultValue={0} >Select your department</option>
                            {departmentList.map((department) => (
                                <option key={department.departmentID} value={department.departmentID}>{department.departmentName}</option>
                            ))}
                        </select>
                        {errors.departmentName && <span className="error">{errors.departmentName}</span>}
                    </div>
                </div>
                <div className="inputField">
                    <label>Teacher:</label>
                    <div className="inputCont">
                        <select name='teacher' id='teacher' value={formData.teacherID || ""} required onChange={handleTeacherChange}>
                            <option value="" disabled defaultValue={0}>Select your teacher</option>
                            {teacherList.map((teacher) => (
                                <option key={teacher.teacherID} value={teacher.teacherID}>{teacher.fullName}</option>
                            ))}
                        </select>
                        {errors.fullName && <span className="error">{errors.fullName}</span>}
                    </div>
                </div>
                <div className="inputField">
                    <label>Appointment Purpose:</label>
                    <div className="inputCont">
                        <div className="inputCont">
                            <textarea id='purpose' name='purpose' maxLength={400} value={formData.purpose} onChange={(e) => setFormData({ ...formData, purpose: e.target.value })} />
                            {errors.purpose && <span className="error">{errors.purpose}</span>}
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer">
                <button onClick={handleBack} disabled={activeStep === 0} className="formButton"> Back </button>
                <button onClick={handleNext} disabled={activeStep === steps.length - 1} className="formButton"> Continue </button>
            </div>
        </div>
    )
}

export default TeacherInformation
