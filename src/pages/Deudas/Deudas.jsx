// src/pages/Deudas/Deudas.jsx
import { useState, useEffect } from 'react';
import { deudaService } from '../../services/deudaService';
import { DeudaModal } from './DeudaModal';
import { DeudaDetalle } from './DeudaDetalle';
import { SidebarToggleButton } from '../../components/layout/SidebarToggleButton';
import { useSidebar } from '../../components/layout/SidebarContext';
import { Plus, ChevronDown, ChevronUp, Pencil, Trash2 } from 'lucide-react';

const Deudas = () => {
    const { isCollapsed, onToggle } = useSidebar();
    const [deudas, setDeudas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const [expandida, setExpandida] = useState(null); // ID de deuda expandida

    const fetchDeudas = async () => {
        try {
            const { data } = await deudaService.getAll();
            setDeudas(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchDeudas(); }, []);

    const totalPendiente = deudas.reduce((s, d) => {
        const pagado = (d.pagos || []).reduce((sp, p) => sp + parseFloat(p.monto_pagado), 0);
        return s + (parseFloat(d.valor_total) - pagado);
    }, 0);

    const handleDelete = async (id) => {
        if (!window.confirm('¿Eliminar esta deuda?')) return;
        await deudaService.delete(id);
        fetchDeudas();
    };

    return (
        <div className="flex-1 p-8 bg-brand-bg transition-colors duration-500">
            <header className="mb-8 flex justify-between items-start">
                <div className="flex items-center gap-4">
                    <SidebarToggleButton isCollapsed={isCollapsed} onToggle={onToggle} />
                    <div>
                        <h1 className="text-2xl font-bold text-brand-text">Deudas</h1>
                        <p className="text-gray-500 text-sm">Gestiona y amortiza tus deudas</p>
                    </div>
                </div>
                <button onClick={() => { setSelected(null); setModalOpen(true); }}
                    className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-xl hover:opacity-90 transition">
                    <Plus size={18} /> Nueva Deuda
                </button>
            </header>

            {/* Resumen total */}
            <div className="bg-brand-panel border border-brand-soft rounded-2xl p-5 mb-6 flex justify-between items-center shadow">
                <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Total en Deudas</p>
                <p className="text-2xl font-bold text-red-500">
                    ${totalPendiente.toLocaleString('es-EC', { minimumFractionDigits: 2 })}
                </p>
            </div>

            {/* Lista de deudas */}
            {loading ? <p className="text-gray-400">Cargando...</p> : (
                <div className="flex flex-col gap-4">
                    {deudas.map(deuda => (
                        <div key={deuda.id} className="bg-brand-panel border border-brand-soft rounded-2xl shadow overflow-hidden">
                            {/* Cabecera de cada deuda */}
                            <div className="flex items-center justify-between px-6 py-4">
                                <div className="flex items-center gap-4">
                                    <button onClick={() => setExpandida(expandida === deuda.id ? null : deuda.id)}
                                        className="p-1.5 rounded-lg hover:bg-brand-soft transition text-gray-400">
                                        {expandida === deuda.id ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                                    </button>
                                    <div>
                                        <p className="font-semibold text-brand-text">{deuda.nombre}</p>
                                        <p className="text-xs text-gray-400">
                                            {deuda.meses} meses · {deuda.tipo === 'con_interes'
                                                ? `${deuda.tasa_anual}% anual · ${deuda.metodo}`
                                                : 'Sin interés'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <p className="font-bold text-red-400 text-lg">
                                        ${parseFloat(deuda.valor_total).toLocaleString('es-EC', { minimumFractionDigits: 2 })}
                                    </p>
                                    <button onClick={() => { setSelected(deuda); setModalOpen(true); }}
                                        className="p-2 rounded-lg hover:bg-brand-soft text-gray-400 hover:text-brand-primary transition">
                                        <Pencil size={16}/>
                                    </button>
                                    <button onClick={() => handleDelete(deuda.id)}
                                        className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition">
                                        <Trash2 size={16}/>
                                    </button>
                                </div>
                            </div>

                            {/* Tabla de amortización expandible */}
                            {expandida === deuda.id && (
                                <DeudaDetalle deuda={deuda} onPagoActualizado={fetchDeudas} />
                            )}
                        </div>
                    ))}
                </div>
            )}

            {modalOpen && (
                <DeudaModal
                    deuda={selected}
                    onClose={() => setModalOpen(false)}
                    onSaved={() => { setModalOpen(false); fetchDeudas(); }}
                />
            )}
        </div>
    );
};

export default Deudas;