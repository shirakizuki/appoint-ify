import React from 'react'

import { images } from '../../../../assets/assets';

import NavbarClassic from '../../../components/Navbar/NavbarClassic'
import Footer from '../../../components/Footer/Footer'

import './AboutUsPage.css'

const AboutUsPage = () => {
    return (
        <>
            <NavbarClassic />
            <div className="aboutus-page-container">
                <div className="text-section">
                    <div className="first-section">
                        <div className="first-section-title">
                            <h2>ABOUT US</h2>
                            <h1>Making Lives Easier</h1>
                        </div>
                        <div className="first-section-descriptor">
                            <p>
                                At our core, we are dedicated to simplifying the way people schedule and manage appointments. Our platform is designed with you in mind, offering a seamless and intuitive experience for students, teachers, professionals, and organizations alike. <br /><br />
                                Gone are the days of missed meetings and scheduling conflicts. With our innovative tools, we aim to save you time, reduce stress, and enhance productivity. Whether you're managing a busy academic calendar or organizing personal commitments, our solution empowers you to take control of your schedule with ease and efficiency. <br /><br />
                                With a commitment to reliability, security, and user satisfaction, we strive to make every step of the appointment process effortless—because your time is valuable, and your life should be simpler.
                            </p>
                        </div>
                    </div>
                    <div className="second-section">
                        <h2>HORIZON</h2>
                        <h1>We are unicorns; blending innovation, creativity, and practicality to transform the mundane into the extraordinary.</h1>
                    </div>
                </div>
                <div className="image-container">
                    <img src={images.image_one} alt="team_image" className="team-image" />
                </div>
            </div>
            <Footer />
        </>
    )
}

export default AboutUsPage
