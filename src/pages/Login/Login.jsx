
import { AuthLayout } from '../../components/layout/AuthLayout';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useLogin } from './useLogin';
import { Link } from 'react-router-dom';

const Login = () => {
    const { values, errors, handleChange, handleLogin } = useLogin();
    return (
        <AuthLayout title="Bienvenido de nuevo" subtitle="...">
            {/* 2. Añadir el onSubmit al formulario */}
            <form onSubmit={handleLogin} className="space-y-6">
                <Input 
                    label="Correo electrónico" 
                    name="email" // Importante: el name debe coincidir con el estado
                    type="email" 
                    value={values.email}
                    onChange={handleChange}
                    error={errors.email}
                />
                <Input 
                    label="Contraseña" 
                    type="password" 
                    name="password"
                    showForgotPassword={false} // Activado para el Login
                    onChange={handleChange}
                />
                <div className="flex justify-end mt-2">
                    <Link 
                    to="/forgot-password" 
                    /* CAMBIO: text-[#4a7c59] -> text-brand-primary */
                    className="text-xs font-bold text-brand-primary hover:underline"
                    >
                        ¿Olvidaste tu contraseña?
                    </Link>
                </div>

                <Button type="submit">
                    Iniciar sesión →
                </Button>

                <p className="text-center text-sm text-gray-500 mt-8 font-medium">
                    ¿No tienes una cuenta? 
                    {/* CAMBIO: text-green-700 -> text-brand-primary */}
                    <Link to="/register" className="text-brand-primary font-bold hover:underline"> Regístrate gratis</Link>
                </p>
            </form>
        </AuthLayout>
    );
};

export default Login;