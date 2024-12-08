import React from 'react'
import axios from 'axios'

import { ToastContainer, toast } from "react-toastify";
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { ProgressSpinner } from 'primereact/progressspinner';
import { InputText } from 'primereact/inputtext'
import { RiCloseLine } from "react-icons/ri";;
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';

import './EditTeacher.css'

const EditTeacher = ({ closeModal }) => {
    const teacherID = useLocation().state?.teacherID;
    const [loading, setLoading] = useState(false);
    const [editingProfile, setEditingProfile] = useState(false);
    const [editingPassword, setEditingPassword] = useState(false);

    const url = import.meta.env.VITE_SERVER_API;
    const [data, setData] = useState({
        teacherID: teacherID,
        firstName: '',
        lastName: '',
        teacherEmail: '',
        contactNumber: '',
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

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

    const showWarningMessage = (message) => {
        toast.warning(message, {
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

    const checkValidPassword = (password) => {
        const passwordRegex = /^.{8,}$/;
        return passwordRegex.test(password);
    }

    const passwordMatch = (password, confirmPassword) => {
        return password === confirmPassword;
    }

    const onInputChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

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

    const updatePassword = async () => {
        const token = sessionStorage.getItem('token');
        const newUrl = `${url}/update/current/teacher/password`;

        if (!passwordMatch(data.newPassword, data.confirmPassword)) {
            showErrorMessage('Password did not match. Please verify password.');
            return;
        }

        if (!checkValidPassword(data.newPassword)) {
            showErrorMessage('Password must be at least 8 characters long.');
            return;
        }

        if (!data.newPassword) {
            showErrorMessage('Please enter a new password.');
        }

        if (!data.confirmPassword) {
            showErrorMessage('Please confirm your new password.');
        }

        setLoading(true);
        try {
            const response = await axios.patch(newUrl, { teacherID, oldPassword: data.oldPassword, newPassword: data.newPassword }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 201) {
                showSuccessMessage('Successfully updated password.');
            } else if (response.status === 202) {
                showWarningMessage(response.data.message);
            }
        } catch (error) {
            if (error.response) {
                showErrorMessage(error.response.data.message);
            }
            throw error;
        } finally {
            setLoading(false);
            setEditingPassword(false)
        }
    }

    const updateProfile = async () => {
        const token = sessionStorage.getItem('token');
        const newUrl = `${url}/update/current/teacher/info`;

        if(!data.firstName || !data.lastName || !data.teacherEmail || !data.contactNumber) {
            showErrorMessage('Missing or invalid firstName, lastName, teacherEmail, or contactNumber data.');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.patch(newUrl, { teacherID, firstName: data.firstName, lastName: data.lastName, teacherEmail: data.teacherEmail, contactNumber: data.contactNumber}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 201) {
                showSuccessMessage('Successfully updated password.');
            } else if (response.status === 202) {
                showWarningMessage(response.data.message);
            }
        } catch (error) {
            if (error.response) {
                showErrorMessage(error.response.data.message);
            }
            throw error;
        } finally {
            setLoading(false);
            setEditingProfile(false)
        }
    }

    const readTeacher = async (teacherID) => {
        const token = sessionStorage.getItem('token');
        const newUrl = `${url}/read/current/teacher?teacherID=${encodeURIComponent(teacherID)}`;
        setLoading(true);
        try {
            const response = await axios.get(newUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                const teacher = response.data.teacher[0];
                setData((prevData) => ({
                    ...prevData,
                    firstName: teacher.firstName,
                    lastName: teacher.lastName,
                    teacherEmail: teacher.teacherEmail,
                    contactNumber: teacher.contactNumber,
                }));
                console.table({data});
            }
        } catch (error) {
            if (error.response) {
                showErrorMessage(error.response.data.message);
            }
            throw error;
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        readTeacher(teacherID);
    }, [teacherID])

    return (
        <div className='modal show'>
            <ToastContainer />
            <div className="profile-modal">
                {loading === true ? (
                    <ProgressSpinner />
                ) : (
                    <>
                        <div className="edit-profile">
                            <div className="teacher-header">
                                <h1>Personal Details</h1>
                                <RiCloseLine onClick={closeModal} className='close-button' />
                            </div>
                            <div className="teacher-body">
                                {[
                                    { id: 'firstName', value: 'firstName' },
                                    { id: 'lastName', value: 'lastName' },
                                    { id: 'teacherEmail', value: 'teacherEmail' },
                                    { id: 'contactNumber', value: 'contactNumber' },
                                ].map(({ id, value },) => (
                                    <div className="p-inputgroup flex-1" key={id}>
                                        <span className="p-inputgroup-addon">
                                            <i className="pi pi-user"></i>
                                        </span>
                                        <InputText id={id} name={value} value={data[value]} onChange={onInputChange} disabled={!editingProfile} />
                                    </div>
                                ))}
                            </div>
                            <div className="teacherfooter">
                                {editingProfile === true ? (
                                    <>
                                        <Button label="Save" onClick={updateProfile} className='edit-button' />
                                        <Button label="Cancel" onClick={() => setEditingProfile(false)} className='edit-button' />
                                    </>
                                ) : (
                                    <Button label="Edit" onClick={() => setEditingProfile(true)} className='edit-button' />
                                )}
                            </div>
                        </div>
                        <div className="edit-profile">
                            <div className="teacher-header">
                                <h1>Password</h1>
                            </div>
                            <div className="teacher-body">
                                {editingPassword === true && (
                                    <>
                                        {[
                                            { id: 'oldPassword', value: 'oldPassword', placeholder: 'Old password'},
                                            { id: 'newPassword', value: 'newPassword', placeholder: 'New password' },
                                            { id: 'confirmPassword', value: 'confirmPassword', placeholder: 'Confirm new password' },
                                        ].map(({ id, value, placeholder }) => (
                                            <div className="p-inputgroup flex-1" key={id}>
                                                <span className="p-inputgroup-addon">
                                                    <i className="pi pi-user"></i>
                                                </span>
                                                <Password id={id} name={value} value={data[value]} onChange={onInputChange} placeholder={placeholder}/>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                            <div className="teacherfooter">
                                {editingPassword === true ? (
                                    <>
                                        <Button label="Save" onClick={updatePassword} className='edit-button' />
                                        <Button label="Cancel" onClick={() => setEditingPassword(false)} className='edit-button' />
                                    </>
                                ) : (
                                    <Button label="Edit" onClick={() => setEditingPassword(true)} className='edit-button' />
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default EditTeacher
