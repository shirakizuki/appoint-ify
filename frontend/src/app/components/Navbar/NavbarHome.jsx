// IMPORT LIBRARY
import React from 'react'
// IMPORT HOOKS
import { def_assets } from '../../../assets/assets'
import { useNavigate } from 'react-router-dom'
// IMPORT COMPONENTS
import Button from '../../components/ButtonType1/Button'
// IMPORT CSS STYLINGS
import './NavbarHome.css'

/**
 * The NavbarHome component renders a navigation bar for the home page.
 *
 * This component includes a title section with an image and a main title,
 * as well as navigation links for 'Home', 'About Us', and a 'Teachers' button.
 * The navigation links trigger different navigation functions when clicked.
 *
 * @returns {React.ReactElement} The rendered navigation bar component.
 */
const NavbarHome = () => {
  const navigate = useNavigate();
  return (
    <div className='navbar-home'>
      <div className="title-container">
        <img src={def_assets.appointify_logo} alt='appointment_logo'/>
        <h1>Appointify</h1>
      </div>
      <div className="navigators">
        <ul>
          <li><a onClick={() => navigate('/')}>Home</a></li>
          <li><a onClick={() => navigate('/aboutus')}>About Us</a></li>
          <li><Button btn_name={'Teacher'} onClick={() => navigate('/teacher/login')}/></li>
          <li><Button btn_name={'Admin'} onClick={() => navigate('/admin/login')}/></li>
        </ul>
      </div>
    </div>
  )
}

export default NavbarHome