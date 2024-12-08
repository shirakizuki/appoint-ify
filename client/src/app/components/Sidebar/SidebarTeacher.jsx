import React from 'react'

import { useState } from 'react'
import { RiFileCopy2Line, RiFileCopy2Fill, 
         RiCalendarFill, RiCalendarLine, 
         RiTeamFill, RiTeamLine } from "react-icons/ri";

import './SidebarStyling.css'

const SidebarTeacher = ({ setContent }) => {
    const [active, setActive] = useState(0);

    const iconClick = (index) => {
        setActive(index);
        setContent(index);
    }

    return (
        <div className='sidebar teacher'>
            {/* 0 - PROFILE */}
            <div className={`sidebar-icon ${active === 0 ? "active" : ""}`} onClick={() => iconClick(0)}>
                {active === 0 ? (
                    <RiTeamFill className='icon'/>
                ) : (
                    <RiTeamLine className='icon'/>
                )}
            </div>
            {/* 1 - SCHEDULE */}
            <div className={`sidebar-icon ${active === 1 ? "active" : ""}`} onClick={() => iconClick(1)}>
                {active === 1 ? (
                    <RiCalendarFill className='icon'/>
                ) : (
                    <RiCalendarLine className='icon'/>
                )}
            </div>
            {/* 2 - APPOINTMENTS */}
            <div className={`sidebar-icon ${active === 2 ? "active" : ""}`} onClick={() => iconClick(2)}>
                {active === 2 ? (
                    <RiFileCopy2Fill className='icon'/>
                ) : (
                    <RiFileCopy2Line className='icon'/>
                )}
            </div>
        </div>
    )
}

export default SidebarTeacher
