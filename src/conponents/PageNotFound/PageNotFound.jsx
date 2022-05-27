import React, {useEffect} from 'react';
import './index.css'
import {useNavigate} from "react-router-dom";

const PageNotFound = () => {
    const navigate = useNavigate()
    useEffect(() => {

        const id = setTimeout(() => {
            navigate('/converter')
        }, 2000)

        return () => clearTimeout(id)
    }, [])

    return (
        <div className='error'>
            <h2>Тут ничего нету!</h2>
        </div>
    );
};

export default PageNotFound;