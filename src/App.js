import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register'; // Importa el nuevo componente
import Dashboard from './pages/Dashboard/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { DashboardLayout } from './components/layout/DashboardLayout';
import Ingresos from './pages/Ingresos/Ingresos';
import Deudas from './pages/Deudas/Deudas';
import Presupuestos from './pages/Presupuestos/Presupuestos';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardLayout>   
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />
        <Route
          path="/ingresos"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Ingresos />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route path="/deudas" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Deudas />
            </DashboardLayout>
          </ProtectedRoute>
        }/>
        <Route path="/presupuestos" element={
          <ProtectedRoute>
            <DashboardLayout>
              <Presupuestos />
            </DashboardLayout>
          </ProtectedRoute>
        }/>
      </Routes>
    </Router>
  );
}

export default App;