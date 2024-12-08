import React from 'react'

import NavbarClassic from '../../../components/Navbar/NavbarClassic'
import Footer from '../../../components/Footer/Footer'

import './LandingPage.css'

const LandingPage = () => {
    return (
        <>
            <NavbarClassic />
            <div className='landing-page-container'>
                <div className="first-banner">
                    <h1>Handling dates made easy</h1>
                    <h3>Appointments catered for you</h3>
                </div>
                <div className='second-banner'>
                    <div className="second-banner-title-container">
                        <h2>HOW IT WORKS</h2>
                        <h1>This is the future of booking appointments.</h1>
                    </div>
                    <div className="card-container">
                        <div className="card">
                            <h3 className="card-title">Tailored for Your Needs</h3>
                            <p className='card-description'>Select the perfect date and time for your appointments. No hassle, no conflicts—just convenience.</p>
                        </div>
                        <div className="card">
                            <h3 className="card-title">Never Miss an Appointment</h3>
                            <p className='card-description'>Stay on top of your schedule with timely reminders sent directly to your email or phone.</p>
                        </div>
                        <div className="card">
                            <h3 className="card-title">Works with Your Calendar</h3>
                            <p className='card-description'>Sync your appointments effortlessly with Google Calendar, Outlook, or iCal.</p>
                        </div>
                        <div className="card">
                            <h3 className="card-title">Data You Can Trust</h3>
                            <p className='card-description'>Your information is safe with our advanced security protocols, ensuring your privacy and peace of mind.</p>
                        </div>
                    </div>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className='separator-svg'>
                    <path fill="#308dbf" fillOpacity="1" d="M0,64L24,58.7C48,53,96,43,144,85.3C192,128,240,224,288,256C336,288,384,256,432,229.3C480,203,528,181,576,186.7C624,192,672,224,720,245.3C768,267,816,277,864,277.3C912,277,960,267,1008,261.3C1056,256,1104,256,1152,224C1200,192,1248,128,1296,122.7C1344,117,1392,171,1416,197.3L1440,224L1440,320L1416,320C1392,320,1344,320,1296,320C1248,320,1200,320,1152,320C1104,320,1056,320,1008,320C960,320,912,320,864,320C816,320,768,320,720,320C672,320,624,320,576,320C528,320,480,320,432,320C384,320,336,320,288,320C240,320,192,320,144,320C96,320,48,320,24,320L0,320Z"></path>
                </svg>
                <div className="third-banner">
                    <div className="third-banner-title-container">
                        <h1>Alignable Scheduling, Trust Us!</h1>
                        <p>With over 48,000 ratings from different students and teachers, we can help you.</p>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    )
}

export default LandingPage
