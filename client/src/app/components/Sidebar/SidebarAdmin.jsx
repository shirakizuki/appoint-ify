import React, { useState } from 'react'

// 0 = Appointment
// 1 = Teacher List
// 2 = Team Management
import { RiLayoutGrid2Fill, RiLayoutGrid2Line, 
         RiParentFill, RiParentLine, 
         RiTeamFill, RiTeamLine } from "react-icons/ri";

import './SidebarStyling.css'

const SidebarAdmin = ({ setContent }) => {
    const [active, setActive] = useState(0);

    const iconClick = (index) => {
        setActive(index);
        setContent(index);
    }

    return (
        <div className='sidebar admin'>
            <div className={`sidebar-icon ${active === 0 ? "active" : ""}`} onClick={() => iconClick(0)}>
                {active === 0 ? (
                    <RiLayoutGrid2Fill className='icon'/>
                ) : (
                    <RiLayoutGrid2Line className='icon'/>
                )}
            </div>
            <div className={`sidebar-icon ${active === 1 ? "active" : ""}`} onClick={() => iconClick(1)}>
                {active === 1 ? (
                    <RiParentFill className='icon'/>
                ) : (
                    <RiParentLine className='icon'/>
                )}
            </div>
            <div className={`sidebar-icon ${active === 2 ? "active" : ""}`} onClick={() => iconClick(2)}>
                {active === 2 ? (
                    <RiTeamFill className='icon'/>
                ) : (
                    <RiTeamLine className='icon'/>
                )}
            </div>
        </div>
    )
}

export default SidebarAdmin
