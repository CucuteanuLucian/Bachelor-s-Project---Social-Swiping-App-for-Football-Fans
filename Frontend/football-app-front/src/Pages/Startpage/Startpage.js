import React from "react";
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

function StartpageApp() {
    const navigate = useNavigate();

    useEffect(() => {
        const refresh = localStorage.getItem("refresh");
        if (refresh) {
            api.post('api/token/refresh/', { refresh })
                .then(res => {
                    localStorage.setItem("access", res.data.access);
                    navigate('/dashboard');
                })
                .catch(err => {
                    console.log("Refresh token invalid sau expirat");
                });
        }
    }, [navigate]);

    return(
        <div>
            <p>Welcome!</p>
            <p>Chose your choice:</p>
            <button><Link to='/login'>Login</Link></button>
            <button><Link to='/signup'>Signup</Link></button>
        </div>
    )
}

export default StartpageApp;