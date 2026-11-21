// src/pages/Register/Register.jsx
import { useState } from 'react';
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { User, Home as HomeIcon, Mail, Lock, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Register = () => {
    const navigate = useNavigate();

    // Estado inicial limpio
    const initialFormState = {
        name: '',
        household_name: '',
        email: '',
        password: '',
        password_confirmation: ''
    };
    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState({});
    
    
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        try {
            // Petición a tu API de Laravel
            await api.post('/register', formData);

            // 1. Limpiar el formulario
            setFormData(initialFormState);

            // 2. Notificación opcional de éxito
            alert("¡Registro exitoso! Ahora puedes iniciar sesión.");

            // 3. Redirección automática al Login
            navigate('/'); 

        } catch (err) {
            // Manejo de errores de validación desde Laravel/PostgreSQL
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors);
            }
        }
    };

    return (
        <AuthLayout isRegister title="Crea tu cuenta" subtitle="Comienza a administrar las finanzas de tu hogar hoy">
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Grid para Nombres */}
                <div className="grid grid-cols-2 gap-4">
                    <Input label="Nombre completo" name="name" placeholder="Juan Pérez" icon={<User size={18}/>} onChange={handleChange} error={errors.name} />
                    <Input label="Nombre del hogar" name="household_name" placeholder="Familia Pérez" icon={<HomeIcon size={18}/>} onChange={handleChange} error={errors.household_name} />
                </div>

                <Input label="Correo electrónico" name="email" type="email" placeholder="tu@email.com" icon={<Mail size={18}/>} onChange={handleChange} error={errors.email} />
                
                <Input label="Contraseña" name="password" type="password" placeholder="••••••••" icon={<Lock size={18}/>} onChange={handleChange} error={errors.password} />
                
                <Input label="Confirmar contraseña" name="password_confirmation" type="password" placeholder="••••••••" icon={<Lock size={18}/>} onChange={handleChange} />

                <div className="flex items-center gap-2">
                    <input type="checkbox" required className="w-4 h-4 rounded border-gray-300 accent-brand-primary" />
                    <label className="text-sm text-gray-600 dark:text-gray-400">
                        Acepto los <span className="text-brand-primary font-bold cursor-pointer">Términos de Servicio</span> y la <span className="text-brand-primary font-bold cursor-pointer">Política de Privacidad</span>
                    </label>
                </div>

                <Button type="submit">
                    Crear cuenta →
                </Button>

                <div className="relative my-8 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <hr className="border-gray-200 dark:border-gray-700" />
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-bg px-4 transition-colors">
                        O regístrate con
                    </span>
                </div>

                <p className="text-center text-sm text-gray-500 mt-6">
                    ¿Ya tienes una cuenta? 
                    <Link to="/" className="text-brand-primary font-bold hover:underline">Inicia sesión</Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default Register;