// src/pages/Presupuestos/PresupuestoPlanilla.jsx
import { useState, useEffect } from 'react';
import { presupuestoService } from '../../services/presupuestoService';
import { Plus, Trash2, Check, X } from 'lucide-react';

export const PresupuestoPlanilla = ({ presupuesto, totalIngresos, onActualizado, onSaldoChange }) => {
    const [items, setItems] = useState(presupuesto.items || []);
    const [nuevoNombre, setNuevoNombre] = useState('');
    const [guardando, setGuardando] = useState(null); // id del item guardando
    const sobrante = parseFloat(presupuesto.monto_asignado || 0) -
    items.reduce((s, i) => s + parseFloat(i.monto_presupuestado || 0), 0);
    const sobrantePct = parseFloat(presupuesto.monto_asignado) > 0
        ? (sobrante / parseFloat(presupuesto.monto_asignado)) * 100
        : 0;
    const total = parseFloat(presupuesto.monto_asignado) || 0;
    const fmt = (n) => parseFloat(n || 0).toLocaleString('es-EC', { minimumFractionDigits: 2 });

    // Actualización local optimista
    const actualizarLocal = (id, campo, valor) => {
        setItems(prev => prev.map(item => {
            if (item.id !== id) return item;
            const updated = { ...item, [campo]: valor };
            // Si se edita %, calcular monto
            if (campo === 'porcentaje' && total > 0) {
                updated.monto_presupuestado = ((parseFloat(valor) || 0) / 100) * total;
                updated._editadoPor = 'porcentaje';
            }
            // Si se edita monto, calcular %
            if (campo === 'monto_presupuestado' && total > 0) {
                updated.porcentaje = ((parseFloat(valor) || 0) / total) * 100;
                updated._editadoPor = 'monto';
            }
            return updated;
        }));
    };

    const guardarItem = async (item) => {
        setGuardando(item.id);
        try {
            await presupuestoService.updateItem(presupuesto.id, item.id, {
                nombre:               item.nombre,
                porcentaje:           item.porcentaje,
                monto_presupuestado:  item.monto_presupuestado,
                monto_real:           item.monto_real,
                completado:           item.completado,
                orden:                item.orden,
            });
            // ✅ NO llama onActualizado() — solo actualiza el estado local
        } catch (e) {
            console.error('Error al guardar:', e);
            // Opcional: revertir cambio si falla
        } finally {
            setGuardando(null);
        }
    };

    const toggleCompletado = async (item) => {
        const updated = { ...item, completado: !item.completado };
        // Actualiza local inmediatamente
        setItems(prev => prev.map(i => i.id === item.id ? updated : i));
        // Guarda en background sin recargar
        setGuardando(item.id);
        try {
            await presupuestoService.updateItem(presupuesto.id, item.id, {
                nombre:               updated.nombre,
                porcentaje:           updated.porcentaje,
                monto_presupuestado:  updated.monto_presupuestado,
                monto_real:           updated.monto_real,
                completado:           updated.completado,
                orden:                updated.orden,
            });
        } catch (e) {
            // Revertir si falla
            setItems(prev => prev.map(i => i.id === item.id ? item : i));
        } finally {
            setGuardando(null);
        }
    };

    const agregarItem = async () => {
        if (!nuevoNombre.trim()) return;
        try {
            const { data: nuevoItem } = await presupuestoService.createItem(presupuesto.id, {
                nombre:              nuevoNombre,
                porcentaje:          0,
                monto_presupuestado: 0,
                monto_real:          0,
                completado:          false,
            });
            setItems(prev => [...prev, nuevoItem]);
            setNuevoNombre('');
            //onActualizado();
        } catch (e) { console.error(e); }
    };

    const eliminarItem = async (itemId) => {
        setItems(prev => prev.filter(i => i.id !== itemId));
        try {
            await presupuestoService.deleteItem(presupuesto.id, itemId);
            //onActualizado(); // Sincroniza con padre
        } catch (e) {
            // Revertir si falla
            onActualizado();
        }
    };

    const totalPresupuestado = items.reduce((s, i) => s + parseFloat(i.monto_presupuestado || 0), 0);
    
    
    const [sobranteReal, setSobranteReal] = useState(
        parseFloat(presupuesto.sobrante_real || 0)
    );
    const [guardandoSobrante, setGuardandoSobrante] = useState(false);

    const guardarSobranteReal = async (valor) => {
        setGuardandoSobrante(true);
        try {
            await presupuestoService.update(presupuesto.id, {
                nombre:          presupuesto.nombre,
                mes:             presupuesto.mes,
                monto_asignado:  presupuesto.monto_asignado,
                sobrante_real:   parseFloat(valor) || 0,
            });
        } catch (e) {
            console.error(e);
        } finally {
            setGuardandoSobrante(false);
        }
    };
    const totalReal = items.reduce((s, i) => s + parseFloat(i.monto_real || 0), 0)+ sobranteReal;
    
    useEffect(() => {
        const total = items.reduce((s, i) => s + parseFloat(i.monto_real || 0), 0) + sobranteReal;
        onSaldoChange?.(presupuesto.id, total);
    }, [items, sobranteReal]);
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="bg-brand-soft/40 text-gray-500 uppercase text-xs tracking-wider">
                    <tr>
                        <th className="px-4 py-3 text-right w-20">%</th>
                        <th className="px-4 py-3 text-right w-32">Presupuestado</th>
                        <th className="px-4 py-3 text-right w-32">Real</th>
                        <th className="px-4 py-3 text-left">Categoría</th>
                        <th className="px-4 py-3 text-center w-20">✓</th>
                        <th className="px-4 py-3 w-10"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-brand-soft">
                    {items.map(item => (
                        <tr key={item.id}
                            className={`transition-colors ${item.completado ? 'opacity-60' : 'hover:bg-brand-soft/20'}
                            ${guardando === item.id ? 'opacity-70' : ''}`}>

                            <td className="px-4 py-2 text-right">
                                <input
                                    type="number" step="0.01"
                                    value={parseFloat(item.porcentaje || 0).toFixed(2)}
                                    onChange={e => actualizarLocal(item.id, 'porcentaje', e.target.value)}
                                    onBlur={() => guardarItem(item)}
                                    disabled={item.completado}
                                    className="w-16 text-right px-2 py-1 text-xs rounded-lg border border-brand-soft bg-brand-bg text-brand-text disabled:opacity-40 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                                />
                                <span className="text-gray-400 ml-1 text-xs">%</span>
                            </td>

                            {/* Monto presupuestado */}
                            <td className="px-4 py-2 text-right">
                                <input
                                    type="number" step="0.01"
                                    value={parseFloat(item.monto_presupuestado || 0).toFixed(2)}
                                    onChange={e => actualizarLocal(item.id, 'monto_presupuestado', e.target.value)}
                                    onBlur={() => guardarItem(item)}
                                    disabled={item.completado}
                                    className="w-24 text-right px-2 py-1 text-xs rounded-lg border border-brand-soft bg-brand-bg text-brand-text disabled:opacity-40 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                                />
                            </td>

                            {/* Monto real */}
                            <td className="px-4 py-2 text-right">
                                <input
                                    type="number" step="0.01"
                                    value={parseFloat(item.monto_real || 0).toFixed(2)}
                                    onChange={e => actualizarLocal(item.id, 'monto_real', e.target.value)}
                                    onBlur={() => guardarItem(item)}
                                    className="w-24 text-right px-2 py-1 text-xs rounded-lg border border-brand-soft bg-brand-bg text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-primary"
                                />
                            </td>

                            {/* Nombre */}
                            <td className="px-4 py-2 text-brand-text font-medium">
                                <div className="flex items-center gap-2">
                                    {item.nombre}
                                    {guardando === item.id && (
                                        <span className="text-xs text-gray-400 animate-pulse">guardando...</span>
                                    )}
                                </div>
                            </td>

                            {/* Checkbox */}
                            <td className="px-4 py-2 text-center">
                                <button onClick={() => toggleCompletado(item)}
                                    className={`w-6 h-6 rounded border-2 flex items-center justify-center mx-auto transition
                                        ${item.completado
                                            ? 'bg-brand-primary border-brand-primary text-white'
                                            : 'border-gray-400 hover:border-brand-primary'}`}>
                                    {item.completado && <Check size={12}/>}
                                </button>
                            </td>

                            {/* Eliminar */}
                            <td className="px-4 py-2 text-center">
                                <button onClick={() => eliminarItem(item.id)}
                                    className="p-1 rounded hover:bg-red-50 text-gray-300 hover:text-red-500 transition">
                                    <Trash2 size={14}/>
                                </button>
                            </td>
                        </tr>
                    ))}

                    {/* Fila para agregar nueva categoría */}
                    <tr className="bg-brand-soft/10">
                        <td colSpan={3}></td>
                        <td className="px-4 py-2" colSpan={3}>
                            <div className="flex gap-2">
                                <input value={nuevoNombre} onChange={e => setNuevoNombre(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && agregarItem()}
                                    className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-dashed border-brand-soft bg-brand-bg text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-primary"
                                    placeholder="+ Nueva categoría..."/>
                                <button onClick={agregarItem}
                                    className="p-1.5 rounded-lg bg-brand-primary text-white hover:opacity-90 transition">
                                    <Plus size={14}/>
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr className="bg-brand-primary/10 border-t-2 border-brand-primary/30">
                        <td className="px-4 py-3 text-right">
                            <span className={`text-xs font-bold ${sobrantePct >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {sobrantePct.toFixed(2)}%
                            </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                            <span className={`text-sm font-bold ${sobrante >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                ${fmt(sobrante)}
                            </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                            <input
                                type="number"
                                step="0.01"
                                value={sobranteReal}
                                onChange={e => setSobranteReal(parseFloat(e.target.value) || 0)}
                                onBlur={e => guardarSobranteReal(e.target.value)}
                                className={`w-24 text-right px-2 py-1 text-xs rounded-lg border border-brand-soft 
                                    bg-brand-bg text-brand-text focus:outline-none focus:ring-1 focus:ring-brand-primary
                                    ${guardandoSobrante ? 'opacity-50' : ''}`}
                            />
                        </td>

                        <td className="px-4 py-3 text-left">
                            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                                Sobrante
                            </span>
                            {sobrante < 0 && (
                                <span className="ml-2 text-xs text-red-400">⚠ Excede el presupuesto asignado</span>
                            )}
                        </td>
                        <td colSpan={2}></td>
                    </tr>
                </tbody>

                {/* Totales */}
                <tfoot className="bg-brand-soft/40 font-bold text-brand-text text-sm">
                    <tr>
                        <td className="px-4 py-3 text-right text-gray-400">
                            {parseFloat(presupuesto.monto_asignado) > 0
                                ? `${((totalPresupuestado / parseFloat(presupuesto.monto_asignado)) * 100).toFixed(1)}%`
                                : '—'}
                        </td>
                        <td className="px-4 py-3 text-right text-blue-400">${fmt(totalPresupuestado)}</td>
                        <td className="px-4 py-3 text-right text-orange-400">${fmt(totalReal)}</td>
                        <td className="px-4 py-3 text-left text-gray-400">
                            Asignado: <span className="text-brand-text">${fmt(presupuesto.monto_asignado)}</span>
                        </td>
                        <td colSpan={2}></td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};