import React from 'react'
import axios from 'axios'

import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';

import Button_1 from '../../../../../components/Button/Button_1'
import TextBox from '../../../../../components/InputContainer/TextBox'
import AddTeacherModal from '../../../../../components/Modals/TeacherModals/AddTeacher/AddTeacherModal';
import ViewTeacherModal from '../../../../../components/Modals/TeacherModals/ViewTeacher/ViewTeacherModal';

import { RiSortAsc, RiSortDesc } from "react-icons/ri";

import './TeacherList.css'

const TeacherList = () => {
    const departmentID = useLocation().state?.departmentID;
    const url = import.meta.env.VITE_SERVER_API;

    const [teachers, setTeachers] = useState([]);
    const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
    const [showViewTeacherModal, setShowViewTeacherModal] = useState(false);
    const [currentTeacher, setCurrentTeacher] = useState(null);
    const [searchQuery, setSearch] = useState('');
    const [sort, setSort] = useState('asc');

    const loadTeacher = async (departmentID, searchQuery = '') => {
        const token = sessionStorage.getItem('token');
        const newUrl = `${url}/read/all/teachers?departmentID=${encodeURIComponent(departmentID)}&searchQuery=${encodeURIComponent(searchQuery)}`;
        const response = await axios.get(newUrl, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.status === 200) {
            const teacherList = response.data.teacherList;
            setTeachers(teacherList);
        }
    };

    const sortedTeachers = () => {
        return [...teachers].sort((a, b) => {
            const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
            const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();

            if (sort === 'asc') {
                return nameA.localeCompare(nameB);
            } else {
                return nameB.localeCompare(nameA);
            }
        });
    };

    const viewTeacherModal = (teacher) => {
        setShowViewTeacherModal(true);
        setCurrentTeacher(teacher);
    }

    useEffect(() => {
        loadTeacher(departmentID);
    }, [departmentID]);

    useEffect(() => {
        loadTeacher(departmentID, searchQuery);
    }, [departmentID, searchQuery]);

    return (
        <>
            {showAddTeacherModal && (
                <AddTeacherModal closeModal={() => setShowAddTeacherModal(false)} onClose={() => loadTeacher(departmentID)} />
            )}
            {showViewTeacherModal && (
                <ViewTeacherModal closeModal={() => setShowViewTeacherModal(false)} teacher={currentTeacher} onClose={() => loadTeacher(departmentID)} />
            )}
            <div className='teacherlist-container'>
                <div className="teacher-title">
                    <h1>Teacher</h1>
                </div>
                <div className="teacher-body">
                    <div className="table-top">
                        <div className="left">
                            <Button_1 text="Add Teacher" onClick={() => { setShowAddTeacherModal(true) }} identifier='add-teacher' disabled={false} />
                        </div>
                        <div className="right">
                            <TextBox type="text" placeholder="Search Teacher" name="search-teacher" identifier="search-teacher" change={(e) => setSearch(e.target.value)} value={searchQuery} />
                            <div className="small-icon">
                                {sort === 'asc' ? (
                                    <RiSortAsc className='icon' onClick={() => setSort('desc')} />
                                ) : (
                                    <RiSortDesc className='icon' onClick={() => setSort('asc')} />
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="table-container">
                        <table className="teacher-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Full Name</th>
                                    <th>Teacher Email</th>
                                    <th>Contact Number</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedTeachers().length > 0 ? (
                                    sortedTeachers().map((teacher) => (
                                        <tr key={teacher.teacherID}>
                                            <td>{teacher.teacherID}</td>
                                            <td>{teacher.firstName} {teacher.lastName}</td>
                                            <td>{teacher.teacherEmail}</td>
                                            <td>{teacher.contactNumber}</td>
                                            <td>
                                                <button className="view-button" onClick={() => viewTeacherModal(teacher)}>
                                                    View
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

export default TeacherList