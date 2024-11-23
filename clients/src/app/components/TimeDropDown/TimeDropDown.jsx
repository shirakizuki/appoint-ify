// IMPORT LIBRARY
import React from 'react'
// IMPORT HOOKS
import { useState, useEffect } from 'react';
// IMPORT CSS STYLINGS
import './TimeStyleDown.css'

const TimeDropDown = ({value, onChange, valueName}) => {
    const [intervals, setIntervals] = useState([]);
    const generateTimeIntervals = () => {
        const intervals = []
        for (let hour = 6; hour <= 20; hour++) {
            for(let minute = 0; minute < 60; minute += 15) {
                const formatedHour = String(hour).padStart(2, '0');
                const formatedMinute = String(minute).padStart(2, '0');
                intervals.push(`${formatedHour}:${formatedMinute}`);
            }
        }
        return intervals;
    };

    useEffect(() => {
        setIntervals(generateTimeIntervals());
    }, []);

    return (
        <select value={value} onChange={(e) => onChange(e.target.value)} className='timeDropDown'>
            <option value=''>{valueName}</option>
            {intervals.map((time) => (
                <option key={time} value={time}>{time}</option>
            ))}
        </select>
    )
}

export default TimeDropDown