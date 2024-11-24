import React from 'react'

import { ani_assets } from '../../../../assets/assets'

import StudentNavbar from '../../../components/Navbar/StudentNavbar/StudentNavbar'

import './SuccessPage.css'
import { useLocation } from 'react-router-dom'

const SuccessPage = () => {
    const referenceCode = useLocation().state?.referenceCode;
    return (
        <>
            <StudentNavbar />
            <section className='successPage'>
                <div className="content">
                    <div className="title">
                        <img src={ani_assets.formSubmitted} alt="submitted_appointment.gif" />
                        <h1>Success</h1>
                    </div>
                    <div className="body">
                        <p>
                            We have received your appointment.
                            <br /><br />
                            Please check your email from time to time for any updates regarding your appointment.
                            You can use your reference code to check for any status <a>here</a>.
                        </p>
                        <div className="refCodeBlock">
                            <div className="refCodeCont">
                                <h1>{referenceCode}</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default SuccessPage
