// src/pages/Ingresos/Ingresos.jsx
import { useState, useEffect } from 'react';
import { ingresoService } from '../../services/ingresoService';
import { IngresoModal } from './IngresoModal';
import { SidebarToggleButton } from '../../components/layout/SidebarToggleButton';
import { useSidebar } from '../../components/layout/SidebarContext';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const Ingresos = () => {
    const { isCollapsed, onToggle } = useSidebar();
    const [ingresos, setIngresos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selected, setSelected] = useState(null); // Para editar

    const fetchIngresos = async () => {
        try {
            const { data } = await ingresoService.getAll();
            setIngresos(data);
        } catch (error) {
            console.error('Error al cargar ingresos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchIngresos(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('¿Eliminar este ingreso?')) return;
        await ingresoService.delete(id);
        fetchIngresos();
    };

    const handleEdit = (ingreso) => {
        setSelected(ingreso);
        setModalOpen(true);
    };

    const handleNew = () => {
        setSelected(null);
        setModalOpen(true);
    };

    const recurrenciaLabel = {
        ninguna: '—',
        semanal: 'Semanal',
        mensual: 'Mensual',
    };

    return (
        <div className="flex-1 p-8 bg-brand-bg transition-colors duration-500">

            {/* Header */}
            <header className="mb-8 flex justify-between items-start">
                <div className="flex items-center gap-4">
                    <SidebarToggleButton isCollapsed={isCollapsed} onToggle={onToggle} />
                    <div>
                        <h1 className="text-2xl font-bold text-brand-text">Registro de Ingresos</h1>
                        <p className="text-gray-500 text-sm">Gestiona tus fuentes de ingreso</p>
                    </div>
                </div>
                <button
                    onClick={handleNew}
                    className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-xl hover:opacity-90 transition"
                >
                    <Plus size={18} /> Nuevo Ingreso
                </button>
            </header>

            {/* Tabla */}
            {loading ? (
                <p className="text-gray-400">Cargando...</p>
            ) : ingresos.length === 0 ? (
                <p className="text-gray-400">No hay ingresos registrados.</p>
            ) : (
                <div className="bg-brand-panel rounded-2xl shadow border border-brand-soft overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-brand-soft text-gray-500 uppercase text-xs tracking-wider">
                            <tr>
                                <th className="px-6 py-3 text-left">Descripción</th>
                                <th className="px-6 py-3 text-left">Monto</th>
                                <th className="px-6 py-3 text-left">Recurrencia</th>
                                <th className="px-6 py-3 text-left">Fecha</th>
                                <th className="px-6 py-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-soft">
                            {ingresos.map((ing) => (
                                <tr key={ing.id} className="hover:bg-brand-soft/50 transition-colors">
                                    <td className="px-6 py-4 text-brand-text">{ing.descripcion}</td>
                                    <td className="px-6 py-4 text-green-500 font-semibold">
                                        ${parseFloat(ing.monto).toLocaleString('es-EC', { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-6 py-4 text-brand-text">
                                        {recurrenciaLabel[ing.recurrencia]}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{ing.fecha}</td>
                                    <td className="px-6 py-4 flex justify-end gap-2">
                                        <button
                                            onClick={() => handleEdit(ing)}
                                            className="p-2 rounded-lg hover:bg-brand-soft text-gray-400 hover:text-brand-primary transition"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(ing.id)}
                                            className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {modalOpen && (
                <IngresoModal
                    ingreso={selected}
                    onClose={() => setModalOpen(false)}
                    onSaved={() => { setModalOpen(false); fetchIngresos(); }}
                />
            )}
        </div>
    );
};

export default Ingresos;