// IMPORT LIBRARY
import React from 'react'
// IMPORT CSS STYLINGS
import './Button.css'

/**
 * A Button component that renders a customizable button element.
 *
 * @param {Object} props - Component props.
 * @param {string} props.btn_name - The name or label of the button.
 * @param {string} props.btn_type - The type attribute for the button, e.g., 'button', 'submit'.
 * @param {Function} props.onClick - The function to call when the button is clicked.
 * @returns {React.ReactElement} A button element with specified attributes and callback.
 */
const Button = ({btn_name, btn_type, onClick}) => {
  return (
    <button className='btnType1' type={btn_type} onClick={onClick}>{btn_name}</button>
  )
}

export default Button