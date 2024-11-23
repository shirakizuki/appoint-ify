// IMPORT LIBRARY
import React from 'react';
// IMPORT HOOKS
import { useNavigate } from 'react-router-dom';
// IMPORT COMPONENTS
import DefaultNavbar from '../../../components/Navbar/DefaultNavbar/DefaultNavbar'
// IMPOR CSS STYLINGS
import './Home.css'

const Home = () => {
  const navigate = useNavigate();
  return (
    <>
      <DefaultNavbar />
      <section className='heroSection'>
        <div className="sectionContent">
          <h1 className="title">Appointify</h1>
          <h2 className='subtitle'>Where Teaching Schedules Meet Simplicity</h2>
          <div>
            <button className='btn1' onClick={() => navigate('/appointment')}>Get Started</button>
          </div>
        </div>
      </section>
    </>
  )
}

export default Home;