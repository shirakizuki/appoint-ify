import React from 'react'
import axios from 'axios'

import { ToastContainer, toast } from "react-toastify";
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';

import Button_1 from '../../../../../components/Button/Button_1'
import TextBox from '../../../../../components/InputContainer/TextBox'
import AddAdminModal from '../../../../../components/Modals/AdminModal/AddAdminModal';

import './TeamManagement.css'
const TeamManagement = () => {
    const departmentID = useLocation().state?.departmentID;
    const url = import.meta.env.VITE_SERVER_API;

    const [accounts, setAccounts] = useState([]);
    const [showAddAccount, setShowAddAccount] = useState(false);
    const [searchQuery, setSearch] = useState('');

    const loadAdmin = async (departmentID, searchQuery = '') => {
        const token = sessionStorage.getItem('token');
        const newUrl = `${url}/read/all/accounts?departmentID=${encodeURIComponent(departmentID)}&searchQuery=${encodeURIComponent(searchQuery)}`;
        const response = await axios.get(newUrl, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.status === 200) {
            const adminList = response.data.adminList;
            setAccounts(adminList);
        }
    }

    const deAuthorizeAdmin = async (accountID) => {
        const token = sessionStorage.getItem('token');
        const newUrl = `${url}/delete/current/account?accountID=${encodeURIComponent(accountID)}&departmentID=${encodeURIComponent(departmentID)}`;
        
        try {
            const response = await axios.delete(newUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response.data)

            if (response.status === 200) {
                loadAdmin(departmentID, searchQuery);
                showSuccessMessage(response.data.message);
                return;
            } else {
                showErrorMessage(response.data.message);
            }
        } catch (error) {
            showErrorMessage('Something went wrong.');
            throw error
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
        loadAdmin(departmentID);
    }, [departmentID]);

    useEffect(() => {
        loadAdmin(departmentID, searchQuery);
    }, [departmentID, searchQuery]);

    return (
        <>  
            <ToastContainer />
            {showAddAccount && <AddAdminModal closeModal={() => setShowAddAccount(false)} onClose={() => loadAdmin(departmentID)} />}
            <div className='adminlist-container'>
                <div className="admin-title">
                    <h1>Admin</h1>
                </div>
                <div className="admin-body">
                    <div className="table-top">
                        <div className="left">
                            <Button_1 text="Add Admin" onClick={() => { setShowAddAccount(true) }} identifier='add-teacher' disabled={false} />
                        </div>
                        <div className="right">
                            <TextBox type="text" placeholder="Search Admin" name="search-admin" identifier="search-admin" change={(e) => setSearch(e.target.value)} value={searchQuery} />
                        </div>
                    </div>
                    <div className="table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Account Username</th>
                                    <th>Full Name</th>
                                    <th>Date Created</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {accounts.length > 0 ? (
                                    accounts.map((admin) => (
                                        <tr key={admin.accountID}>
                                            <td>{admin.accountUsername}</td>
                                            <td>{admin.fullName}</td>
                                            <td>{admin.dateCreated}</td>
                                            <td>
                                                <button className="dlt-button" onClick={() => deAuthorizeAdmin(admin.accountID)}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: "center" }}>
                                            No data available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TeamManagement
