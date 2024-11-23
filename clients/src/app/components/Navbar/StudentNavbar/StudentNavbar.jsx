// IMPORT LIBRARY
import React from 'react'
// IMPORT HOOKS
import { def_assets } from '../../../../assets/assets'
import { useNavigate } from 'react-router-dom'
// IMPORT CSS STYLINGS
import './StudentNabvar.css'

/**
 * The StudentNavbar component renders a navigation bar for the student home page.
 *
 * This component includes a title section with an image and a main title,
 * as well as navigation links for 'Home', 'About Us', and a 'Teachers' button.
 * The navigation links trigger different navigation functions when clicked.
 *
 * @returns {React.ReactElement} The rendered navigation bar component.
 */
const StudentNavbar = () => {
  const navigate = useNavigate();

  const handleLinkClick = (route) => () => navigate(route);

  return (
    <div className='studentNavbar'>
      <div className="titleContainer">
        <img src={def_assets.appointify_logo} alt='appointment_logo'/>
      </div>
      <div className="navigators">
        <ul>
          <li><a onClick={handleLinkClick('/')}>Home</a></li>
          <li><a onClick={handleLinkClick('/aboutus')}>About Us</a></li>
        </ul>
      </div>
    </div>
  )
}

export default StudentNavbar