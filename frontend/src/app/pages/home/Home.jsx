// IMPORT LIBRARY
import React from 'react';
// IMPORT HOOKS
import { useNavigate } from 'react-router-dom';
// IMPORT COMPONENTS
import NavbarHome from '../../components/Navbar/NavbarHome'
import Button from '../../components/ButtonType1/Button'
// IMPOR CSS STYLINGS
import './Home.css'
const Home = () => {
  const navigate = useNavigate();
  return (
    <div className='home'>
      <NavbarHome />
      <main className='main'>
        <div className="bodyContent">
          <h1>Appoint<span>ify</span></h1>
          <h2>Where Teaching Schedules Meet Simplicity</h2>
          <Button onClick={() => navigate('/user/appointment')} btn_name={'Book Now'}/>
        </div>
      </main>
    </div>
  )
}

export default Home;