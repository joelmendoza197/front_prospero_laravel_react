// src/pages/Deudas/DeudaModal.jsx
import { useState, useEffect } from 'react';
import { deudaService } from '../../services/deudaService';
import { X } from 'lucide-react';

export const DeudaModal = ({ deuda, onClose, onSaved }) => {
    const isEditing = !!deuda;
    const [form, setForm] = useState({
        nombre: '', valor_total: '', fecha_inicio: new Date().toISOString().split('T')[0],
        meses: '', tipo: 'sin_interes', tasa_anual: '', metodo: 'frances',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => { if (deuda) setForm(deuda); }, [deuda]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: null });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            isEditing
                ? await deudaService.update(deuda.id, form)
                : await deudaService.create(form);
            onSaved();
        } catch (err) {
            if (err.response?.status === 422) setErrors(err.response.data.errors || {});
        } finally {
            setLoading(false);
        }
    };

    const input = "w-full px-4 py-2.5 rounded-xl border border-brand-soft bg-brand-bg text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm";
    const label = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-brand-panel rounded-2xl shadow-2xl w-full max-w-md p-6 border border-brand-soft">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-brand-text">
                        {isEditing ? 'Editar Deuda' : 'Nueva Deuda'}
                    </h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-brand-soft text-gray-400">
                        <X size={18}/>
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    <div>
                        <label className={label}>Nombre</label>
                        <input name="nombre" value={form.nombre} onChange={handleChange}
                            className={input} placeholder="Ej: Préstamo banco"/>
                        {errors.nombre && <p className="text-red-400 text-xs mt-1">{errors.nombre[0]}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={label}>Valor total ($)</label>
                            <input name="valor_total" type="number" min="0.01" step="0.01"
                                value={form.valor_total} onChange={handleChange} className={input}/>
                            {errors.valor_total && <p className="text-red-400 text-xs mt-1">{errors.valor_total[0]}</p>}
                        </div>
                        <div>
                            <label className={label}>Meses</label>
                            <input name="meses" type="number" min="1"
                                value={form.meses} onChange={handleChange} className={input}/>
                            {errors.meses && <p className="text-red-400 text-xs mt-1">{errors.meses[0]}</p>}
                        </div>
                    </div>

                    <div>
                        <label className={label}>Fecha de inicio</label>
                        <input name="fecha_inicio" type="date" value={form.fecha_inicio}
                            onChange={handleChange} className={input}/>
                    </div>

                    <div>
                        <label className={label}>Tipo de deuda</label>
                        <select name="tipo" value={form.tipo} onChange={handleChange} className={input}>
                            <option value="sin_interes">Sin interés</option>
                            <option value="con_interes">Con interés</option>
                        </select>
                    </div>

                    {form.tipo === 'con_interes' && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={label}>Tasa anual (%)</label>
                                <input name="tasa_anual" type="number" min="0.01" step="0.01"
                                    value={form.tasa_anual} onChange={handleChange} className={input}
                                    placeholder="Ej: 12"/>
                                {errors.tasa_anual && <p className="text-red-400 text-xs mt-1">{errors.tasa_anual[0]}</p>}
                            </div>
                            <div>
                                <label className={label}>Método</label>
                                <select name="metodo" value={form.metodo} onChange={handleChange} className={input}>
                                    <option value="frances">Francés (cuota fija)</option>
                                    <option value="aleman">Alemán (capital fijo)</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm text-gray-500 hover:bg-brand-soft transition">
                        Cancelar
                    </button>
                    <button onClick={handleSubmit} disabled={loading}
                        className="px-5 py-2 rounded-xl bg-brand-primary text-white text-sm hover:opacity-90 transition disabled:opacity-50">
                        {loading ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear deuda'}
                    </button>
                </div>
            </div>
        </div>
    );
};