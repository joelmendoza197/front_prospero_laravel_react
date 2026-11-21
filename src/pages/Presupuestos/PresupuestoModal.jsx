// src/pages/Presupuestos/PresupuestoModal.jsx
import { useState, useEffect } from 'react';
import { presupuestoService } from '../../services/presupuestoService';
import { X } from 'lucide-react';

export const PresupuestoModal = ({ presupuesto, mesActual, disponible, onClose, onSaved }) => {
    const isEditing = !!presupuesto;
    const maxDisponible = isEditing
        ? disponible + parseFloat(presupuesto?.monto_asignado || 0)
        : disponible;
    const [form, setForm] = useState({
        nombre: '',
        mes: mesActual,
        monto_asignado: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        if (presupuesto) setForm({
            nombre: presupuesto.nombre,
            mes: presupuesto.mes,
            monto_asignado: presupuesto.monto_asignado,
        });
    }, [presupuesto]);

    const handleSubmit = async () => {
        setError('');
        if (parseFloat(form.monto_asignado) > maxDisponible + 0.01) {
            setError(`El monto máximo disponible es $${fmt(maxDisponible)}`);
            return;
        }
        setLoading(true);
        try {
            isEditing
                ? await presupuestoService.update(presupuesto.id, form)
                : await presupuestoService.create(form);
            onSaved();
        } catch (e) {
            setError(e.response?.data?.message || 'Error al guardar');
        } finally { setLoading(false); }
    };

    const fmt = (n) => parseFloat(n || 0).toLocaleString('es-EC', { minimumFractionDigits: 2 });
    const input = "w-full px-4 py-2.5 rounded-xl border border-brand-soft bg-brand-bg text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm";
    const label = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-brand-panel rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-brand-soft">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-brand-text">
                        {isEditing ? 'Editar Plan' : 'Nuevo Plan'}
                    </h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-brand-soft text-gray-400">
                        <X size={18}/>
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    <div>
                        <label className={label}>Nombre del plan</label>
                        <input value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})}
                            className={input} placeholder="Ej: Gastos del hogar"/>
                    </div>
                    <div>
                        <label className={label}>Mes</label>
                        <input type="month" value={form.mes}
                            onChange={e => setForm({...form, mes: e.target.value})}
                            className={input}/>
                    </div>
                    <div>
                        <label className={label}>
                            Monto asignado ($)
                            <span className="ml-2 text-emerald-400 normal-case font-normal">
                                Disponible: ${fmt(maxDisponible)}
                            </span>
                        </label>
                        <input type="number" step="0.01" min="0"
                            max={maxDisponible}
                            value={form.monto_asignado}
                            onChange={e => setForm({...form, monto_asignado: e.target.value})}
                            className={input} placeholder="0.00"/>
                        {/* Barra de progreso del disponible */}
                        {maxDisponible > 0 && (
                            <div className="mt-2 h-1.5 bg-brand-soft rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-brand-primary rounded-full transition-all"
                                    style={{ width: `${Math.min((parseFloat(form.monto_asignado || 0) / maxDisponible) * 100, 100)}%` }}
                                />
                            </div>
                        )}
                        {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onClose}
                        className="px-4 py-2 rounded-xl text-sm text-gray-500 hover:bg-brand-soft transition">
                        Cancelar
                    </button>
                    <button onClick={handleSubmit} disabled={loading}
                        className="px-5 py-2 rounded-xl bg-brand-primary text-white text-sm hover:opacity-90 disabled:opacity-50 transition">
                        {loading ? 'Guardando...' : isEditing ? 'Guardar' : 'Crear'}
                    </button>
                </div>
            </div>
        </div>
    );
};