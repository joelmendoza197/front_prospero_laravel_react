// src/pages/Login/useLogin.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

export const useLogin = () => {
    const [values, setValues] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrors({});
        try {
            const response = await api.post('/login', values);
            // Guardamos el token (si usas Sanctum/Tokens)
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user_data', JSON.stringify(response.data.user));
            navigate('/dashboard');
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            } else if (error.response?.status === 401) {
                setErrors({ email: ['Credenciales incorrectas'] });
            }
        }
    };

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    return { values, errors, handleChange, handleLogin };
};