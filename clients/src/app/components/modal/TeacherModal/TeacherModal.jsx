// IMPORT LIBRARY
import React from 'react'
import axios from 'axios'
// IMPORT HOOKS
import { ServerContext } from '../../../../context/ServerContext'
import { useState, useEffect, useContext } from 'react'

import './TeacherModal.css'

const TeacherModal = ({ closeModal, departmentID, onClose }) => {
  const [data, setData] = useState({
    departmentID: departmentID,
    firstName: '',
    lastName: '',
    teacherEmail: '',
    contactNumber: '',
    teacherPassword: '',
    teacherConfirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [success, setMessage] = useState('')
  const { url } = useContext(ServerContext)

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setMessage('');
    setErrors({});
  };

  const clearForm = () => {
    setData({
      firstName: '',
      lastName: '',
      teacherEmail: '',
      contactNumber: '',
      teacherPassword: '',
      teacherConfirmPassword: '',
    });
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
    const newErrors = {}; // Create a fresh object for errors
    if (!data.firstName.trim()) newErrors.firstName = "First Name is required.";
    if (!data.lastName.trim()) newErrors.lastName = "Last Name is required.";
    if (!data.teacherEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.teacherEmail)) {
      newErrors.teacherEmail = "Valid email is required.";
    }
    if (!data.contactNumber.trim() || !/^\d{11}$/.test(data.contactNumber)) {
      newErrors.contactNumber = "A valid 11-digit contact number is required.";
    }
    if (!data.teacherPassword.trim() || !checkValidPassword(data.teacherPassword)) {
      newErrors.teacherPassword = "Password must be at least 8 characters.";
    }
    if (!data.teacherConfirmPassword.trim() || !checkValidPassword(data.teacherConfirmPassword)) {
      newErrors.teacherConfirmPassword = "Password must be at least 8 characters.";
    }
    if (data.teacherPassword.trim() && data.teacherConfirmPassword.trim() &&
      !passwordMatch(data.teacherPassword, data.teacherConfirmPassword)) {
      newErrors.teacherPassword = "Password did not match. Please verify password.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const createTeacherInfo = async (event) => {
    if (validateForm()) {
      const token = sessionStorage.getItem('token');
      try {
        const response = await axios.post(`${url}/createteacher`, data, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 201) {
          clearForm();
          setMessage('Successfully added teacher.');
        } else {
          setMessage('Email or contact number already exists.');
        }
      } catch (error) {
        throw error
      }
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
    <div className='teacherModal show'>
      <div className="modalContainer">
        <div className="header">
          <h1>Add Teacher</h1>
          <button onClick={clearFormOnClose}>X</button>
        </div>
        {success && <p className='message'>{success}</p>}
        <div className="body">
          {[
            { id: 'firstName', label: 'First Name', type: 'text', value: 'firstName' },
            { id: 'lastName', label: 'Last Name', type: 'text', value: 'lastName' },
            { id: 'teacherEmail', label: 'Email', type: 'email', value: 'teacherEmail' },
            { id: 'contactNumber', label: 'Contact Number', type: 'text', value: 'contactNumber' },
            { id: 'teacherPassword', label: 'Password', type: 'password', value: 'teacherPassword' },
            { id: 'teacherConfirmPassword', label: 'Confirm Password', type: 'password', value: 'teacherConfirmPassword' },
          ].map(({ id, label, type, value }, index) => (
            <div className="inputContainer" key={id}>
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
          <button className='btn10' onClick={createTeacherInfo}>SUBMIT</button>
        </div>
      </div>
    </div>
  )
}

export default TeacherModal
