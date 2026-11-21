// src/pages/Ingresos/IngresoModal.jsx
import { useState, useEffect } from 'react';
import { ingresoService } from '../../services/ingresoService';
import { X } from 'lucide-react';

export const IngresoModal = ({ ingreso, onClose, onSaved }) => {
    const isEditing = !!ingreso;

    const [form, setForm] = useState({
        descripcion: '',
        monto: '',
        recurrencia: 'ninguna',
        fecha: new Date().toISOString().split('T')[0],
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (ingreso) setForm(ingreso);
    }, [ingreso]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: null });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            if (isEditing) {
                await ingresoService.update(ingreso.id, form);
            } else {
                await ingresoService.create(form);
            }
            onSaved();
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {});
            }
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full px-4 py-2.5 rounded-xl border border-brand-soft bg-brand-bg text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm";
    const labelClass = "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-brand-panel rounded-2xl shadow-2xl w-full max-w-md p-6 border border-brand-soft">

                {/* Header modal */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-brand-text">
                        {isEditing ? 'Editar Ingreso' : 'Nuevo Ingreso'}
                    </h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-brand-soft text-gray-400 transition">
                        <X size={18} />
                    </button>
                </div>

                {/* Formulario */}
                <div className="flex flex-col gap-4">
                    <div>
                        <label className={labelClass}>Descripción</label>
                        <input name="descripcion" value={form.descripcion} onChange={handleChange}
                            className={inputClass} placeholder="Ej: Salario mensual" />
                        {errors.descripcion && <p className="text-red-400 text-xs mt-1">{errors.descripcion[0]}</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Monto ($)</label>
                        <input name="monto" type="number" min="0.01" step="0.01"
                            value={form.monto} onChange={handleChange}
                            className={inputClass} placeholder="0.00" />
                        {errors.monto && <p className="text-red-400 text-xs mt-1">{errors.monto[0]}</p>}
                    </div>

                    <div>
                        <label className={labelClass}>Recurrencia</label>
                        <select name="recurrencia" value={form.recurrencia} onChange={handleChange} className={inputClass}>
                            <option value="ninguna">Sin recurrencia</option>
                            <option value="semanal">Semanal</option>
                            <option value="mensual">Mensual</option>
                        </select>
                    </div>

                    <div>
                        <label className={labelClass}>Fecha</label>
                        <input name="fecha" type="date" value={form.fecha} onChange={handleChange}
                            className={inputClass} />
                        {errors.fecha && <p className="text-red-400 text-xs mt-1">{errors.fecha[0]}</p>}
                    </div>
                </div>

                {/* Botones */}
                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onClose}
                        className="px-4 py-2 rounded-xl text-sm text-gray-500 hover:bg-brand-soft transition">
                        Cancelar
                    </button>
                    <button onClick={handleSubmit} disabled={loading}
                        className="px-5 py-2 rounded-xl bg-brand-primary text-white text-sm hover:opacity-90 transition disabled:opacity-50">
                        {loading ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear ingreso'}
                    </button>
                </div>
            </div>
        </div>
    );
};