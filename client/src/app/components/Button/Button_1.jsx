import React from 'react'

import './ButtonStyling.css'

const Button_1 = ({text, onClick, identifier, disabled}) => {
    return (
        <button className='button1' onClick={onClick} id={identifier} disabled={disabled}>{text}</button>
    )
}

export default Button_1
