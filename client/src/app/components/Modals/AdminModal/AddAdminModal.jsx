import React from 'react'
import axios from 'axios'

import { ToastContainer, toast } from "react-toastify";
import { useState, useEffect } from 'react'
import { RiCloseLine } from "react-icons/ri";
import { useLocation } from 'react-router-dom';

import Button_1 from '../../Button/Button_1';
import LoadingAnimation from '../../Animations/LoadingAnimation/LoadingAnimation'

import './AddAdminModal.css'
import "react-toastify/dist/ReactToastify.css";

const AddAdminModal = ({ closeModal, onClose }) => {
    const departmentID = useLocation().state?.departmentID;
    const [data, setData] = useState({
        departmentID: departmentID,
        firstName: '',
        lastName: '',
        accountUsername: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const url = import.meta.env.VITE_SERVER_API;
    const [loading, setLoading] = useState(false);

    const onInputChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setErrors({});
    };

    const clearForm = () => {
        setData((prevData) => ({
            ...prevData,
            firstName: '',
            lastName: '',
            accountUsername: '',
            password: '',
            confirmPassword: ''
        }));
    }

    const clearFormOnClose = () => {
        clearForm();
        onClose();
        closeModal();
        setErrors({});
    };

    const checkValidPassword = (password) => {
        const passwordRegex = /^.{8,}$/;
        return passwordRegex.test(password);
    }

    const passwordMatch = (password, confirmPassword) => {
        return password === confirmPassword;
    }

    const validateForm = () => {
        const newErrors = {};
        if (!data.firstName.trim()) newErrors.firstName = "First Name is required.";
        if (!data.lastName.trim()) newErrors.lastName = "Last Name is required.";
        if (!data.accountUsername.trim()) {
            newErrors.accountUsername = "Valid username is required.";
        }
        if (!data.password.trim() || !checkValidPassword(data.password)) {
            newErrors.password = "Password must be at least 8 characters.";
        }
        if (!data.confirmPassword.trim() || !checkValidPassword(data.confirmPassword)) {
            newErrors.confirmPassword = "Password must be at least 8 characters.";
        }
        if (data.password.trim() && data.confirmPassword.trim() &&
            !passwordMatch(data.password, data.confirmPassword)) {
            newErrors.password = "Password did not match. Please verify password.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const createAdminInfo = async () => {
        if (validateForm()) {
            const token = sessionStorage.getItem('token');
            setLoading(true);
            try {
                const response = await axios.post(`${url}/create/admin/account`, data, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const message = response.data.message;
                console.log(response.data)
                if (response.status === 201) {
                    clearForm();
                    showSuccessMessage('Successfully added teacher.');
                } else if (response.status === 202) {
                    showWarningMessage(message);
                }
            } catch (error) {
                showErrorMessage('Something went wrong.');
                console.log(error);
                throw error
            } finally {
                setLoading(false);
            }
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
        <div className='modal show'>
            <ToastContainer />
            <div className="teacher-modal">
                {loading === true ? (
                    <LoadingAnimation />
                ) : (
                    <>
                        <div className="teacher-header">
                            <h1>Add Admin</h1>
                            <RiCloseLine onClick={clearFormOnClose} className='close-button' />
                        </div>
                        <div className="teacher-body">
                            {[
                                { id: 'firstName', label: 'First Name', type: 'text', value: 'firstName' },
                                { id: 'lastName', label: 'Last Name', type: 'text', value: 'lastName' },
                                { id: 'accountUsername', label: 'Username', type: 'email', value: 'accountUsername' },
                                { id: 'password', label: 'Password', type: 'password', value: 'password' },
                                { id: 'confirmPassword', label: 'Confirm Password', type: 'password', value: 'confirmPassword' },
                            ].map(({ id, label, type, value }, index) => (
                                <div className="input-container" key={id}>
                                    <label htmlFor={id}>{label}</label>
                                    <input
                                        type={type}
                                        name={value}
                                        id={id}
                                        value={data[value]}
                                        onChange={onInputChange}
                                        tabIndex={index + 1}
                                    />
                                    {errors[value] && <span className="error">{errors[value]}</span>}
                                </div>
                            ))}
                        </div>
                        <div className="footer">
                            <Button_1 text="Submit" onClick={createAdminInfo} />
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default AddAdminModal
