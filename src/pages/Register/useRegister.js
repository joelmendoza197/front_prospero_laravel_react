import { useState } from 'react';
import api from '../../services/api';

export const useRegister = (navigate) => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [errors, setErrors] = useState({});

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrors({});
        try {
            await api.post('/register', formData);
            return { success: true };
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            }
            return { success: false };
        }
    };

    return { formData, setFormData, errors, handleRegister };
};