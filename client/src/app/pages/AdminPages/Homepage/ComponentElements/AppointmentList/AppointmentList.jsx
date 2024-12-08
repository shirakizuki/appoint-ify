import React from 'react'
import axios from 'axios'

import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react'
import { RiSortAsc, RiSortDesc, RiFilterLine, RiCloseLine } from "react-icons/ri";
import { Calendar } from 'primereact/calendar';

import Button_1 from '../../../../../components/Button/Button_1'
import TextBox from '../../../../../components/InputContainer/TextBox'
import ViewAppointmentModal from '../../../../../components/Modals/AppointmentModals/ViewAppointment/ViewAppointmentModal';

import './AppointmentList.css'
import "primereact/resources/themes/lara-light-cyan/theme.css";

const AppointmentList = () => {
    const departmentID = useLocation().state?.departmentID;
    const url = import.meta.env.VITE_SERVER_API;

    const [appointments, setAppointments] = useState([]);
    const [showViewAppointmentModal, setShowViewAppointmentModal] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [currentAppointment, setCurrentAppointment] = useState(null);
    const [searchQuery, setSearch] = useState('');
    const [sort, setSort] = useState('asc');
    const [filter, setFilter] = useState({
        from: '',
        to: '',
        status: '',
    })

    const loadAppointments = async (departmentID) => {
        const token = sessionStorage.getItem('token');
        const newUrl = `${url}/read/all/current/appointment?departmentID=${encodeURIComponent(departmentID)}&searchQuery=${encodeURIComponent(searchQuery)}`;
        try {
            const response = await axios.get(newUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                setAppointments(response.data.appointmentList);
            }
        } catch (error) {
            throw error
        }
    }

    const filterAppointment = async (departmentID, filter) => {
        const token = sessionStorage.getItem('token');
        const newUrl = `${url}/read/filter/current/appointment?departmentID=${encodeURIComponent(departmentID)}&from=${encodeURIComponent(filter.from)}&to=${encodeURIComponent(filter.to)}&status=${encodeURIComponent(filter.status)}`;
        try {
            const response = await axios.get(newUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                setAppointments(response.data.appointmentList);
            }
        } catch (error) {
            throw error
        }
    }

    const sortedAppointments = () => {
        return [...appointments].sort((a, b) => {
            const nameA = `${a.studentFirstName, ' ', a.studentLastName} ${a.teacherFirstName, ' ', a.teacherLastName}`.toLowerCase();
            const nameB = `${b.studentFirstName, ' ', b.studentLastName} ${b.teacherFirstName, ' ', b.teacherLastName}`.toLowerCase();
            if (sort === 'asc') {
                return nameA.localeCompare(nameB);
            } else {
                return nameB.localeCompare(nameA);
            }
        });
    }

    const viewAppointmentModal = (appointment) => {
        setShowViewAppointmentModal(true);
        setCurrentAppointment(appointment);
    }

    const resetFilter = () => {
        setFilter({
            ...filter,
            from: '',
            to: '',
            status: '',
        })
    }

    useEffect(() => {
        loadAppointments(departmentID);
    }, [departmentID]);

    useEffect(() => {
        loadAppointments(departmentID, searchQuery);
    }, [departmentID, searchQuery]);

    return (
        <>
            {showViewAppointmentModal && (
                <ViewAppointmentModal closeModal={() => setShowViewAppointmentModal(false)} appointment={currentAppointment} onClose={() => loadAppointments(departmentID)} />
            )}
            <div className="appointmentlist-container">
                <div className="container-left">
                    <div className="wrapper-title">
                        <h2>Appointment List</h2>
                    </div>
                    <div className="wrapper-body">
                        <div className="table-top">
                            <div className="right">
                                <TextBox type="text" placeholder="Search Teacher" name="search-teacher" identifier="search-teacher" change={(e) => setSearch(e.target.value)} value={searchQuery} />
                                <div className="small-icon">
                                    <RiFilterLine className='icon' onClick={() => setShowFilterModal(!showFilterModal)} style={{ position: 'relative' }} />
                                </div>
                                <div className="small-icon">
                                    {sort === 'asc' ? (
                                        <RiSortAsc className='icon' onClick={() => setSort('desc')} />
                                    ) : (
                                        <RiSortDesc className='icon' onClick={() => setSort('asc')} />
                                    )}
                                </div>
                            </div>
                        </div>
                        {showFilterModal && (
                            <div className="filter-top">
                                <div className="input-picker">
                                    <label htmlFor="date" className='label'>From: </label>
                                    <input type="date" name='date' className='input' onChange={(e) => setFilter({...filter, from: e.target.value})} value={filter.from}/>
                                </div>
                                <div className="input-picker">
                                    <label htmlFor="date" className='label'>To: </label>
                                    <input type="date" name='date' className='input'onChange={(e) => setFilter({...filter, to: e.target.value})} value={filter.to}/>
                                </div>
                                <div className="input-picker">
                                    <label htmlFor="select" className='label'>Status: </label>
                                    <select className='input' onChange={(e) => setFilter({...filter, status: e.target.value})} value={filter.status}>
                                        <option value='Pending'>Pending</option>
                                        <option value='Active'>Active</option>
                                        <option value='Cancelled'>Canceled</option>
                                        <option value='Declined'>Declined</option>
                                        <option value='Completed'>Completed</option>
                                    </select>
                                </div>
                                <p className='clicker' id='reset' onClick={() => {loadAppointments(departmentID); resetFilter()}}>Reset</p>
                                <p className='clicker' id='apply' onClick={() => filterAppointment(departmentID, filter)}>Apply</p>
                            </div>
                        )}
                        <div className="table-container">
                            <table className="appointment-table">
                                <thead>
                                    <tr>
                                        <th>Reference Code</th>
                                        <th>Student Name</th>
                                        <th>Teacher Name</th>
                                        <th>Appointment Date</th>
                                        <th>Appointment Time</th>
                                        <th>Appointment Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedAppointments().length > 0 ? (
                                        sortedAppointments().map((appointment, index) => (
                                            <tr key={index}>
                                                <td>{appointment.referenceCode}</td>
                                                <td>{appointment.studentFirstName} {appointment.studentLastName}</td>
                                                <td>{appointment.teacherFirstName} {appointment.teacherLastName}</td>
                                                <td>{appointment.appointmentDate.slice(0, 10)}</td>
                                                <td>{appointment.startTime.slice(0, 5)} - {appointment.endTime.slice(0, 5)}</td>
                                                <td className={`status ${appointment.appointmentStatus.toLowerCase()}`}>{appointment.appointmentStatus}</td>
                                                <td>
                                                    <button className="view-button" onClick={() => viewAppointmentModal(appointment)}>
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7}>No data found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="container-right">
                    <div className="calendar-container">
                        <Calendar inline/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AppointmentList
