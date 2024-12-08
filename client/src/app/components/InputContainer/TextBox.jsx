import React from 'react'

import './InputContainer.css'

const TextBox = ({type, change, value, placeholder, name, identifier, disabled}) => {
    return (
        <input className='textbox' type={type} onChange={change} value={value} placeholder={placeholder} name={name} id={identifier} disabled={disabled}/>
    )
}

export default TextBox