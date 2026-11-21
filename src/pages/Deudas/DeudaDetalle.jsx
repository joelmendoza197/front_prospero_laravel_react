// src/pages/Deudas/DeudaDetalle.jsx
import { useState } from 'react';
import { calcularTabla } from '../../hooks/useAmortizacion';
import { deudaService } from '../../services/deudaService';
import { Check, X } from 'lucide-react';

export const DeudaDetalle = ({ deuda, onPagoActualizado }) => {
    const tabla = calcularTabla(deuda);
    const pagosMap = {};
    (deuda.pagos || []).forEach(p => { pagosMap[p.numero_cuota] = p; });

    const [editando, setEditando] = useState(null); // numero_cuota en edición
    const [formPago, setFormPago] = useState({ monto_pagado: '', fecha_pago: '' });

    const totalPagado = Object.values(pagosMap).reduce((s, p) => s + parseFloat(p.monto_pagado), 0);
    const totalPendiente = parseFloat(deuda.valor_total) - totalPagado;

    const iniciarPago = (cuota) => {
        setEditando(cuota.numero);
        const pagoExistente = pagosMap[cuota.numero];
        setFormPago({
            monto_pagado: pagoExistente?.monto_pagado ?? cuota.cuota.toFixed(2),
            fecha_pago: pagoExistente?.fecha_pago ?? cuota.fecha,
        });
    };

    const guardarPago = async (numeroCuota) => {
        await deudaService.registrarPago(deuda.id, {
            numero_cuota: numeroCuota,
            ...formPago,
        });
        setEditando(null);
        onPagoActualizado();
    };

    const eliminarPago = async (numeroCuota) => {
        await deudaService.eliminarPago(deuda.id, numeroCuota);
        onPagoActualizado();
    };

    const fmt = (n) => parseFloat(n).toLocaleString('es-EC', { minimumFractionDigits: 2 });

    return (
        <div className="border-t border-brand-soft">
            {/* Resumen de la deuda */}
            <div className="grid grid-cols-3 gap-4 px-6 py-4 bg-brand-soft/30 text-sm">
                <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider">Total deuda</p>
                    <p className="font-bold text-brand-text">${fmt(deuda.valor_total)}</p>
                </div>
                <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider">Total pagado</p>
                    <p className="font-bold text-green-500">${fmt(totalPagado)}</p>
                </div>
                <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider">Pendiente</p>
                    <p className="font-bold text-red-400">${fmt(totalPendiente)}</p>
                </div>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-brand-soft/50 text-gray-500 uppercase text-xs tracking-wider">
                        <tr>
                            <th className="px-4 py-3 text-center">N°</th>
                            <th className="px-4 py-3 text-right">Cuota</th>
                            <th className="px-4 py-3 text-right">Capital</th>
                            <th className="px-4 py-3 text-right">Interés</th>
                            <th className="px-4 py-3 text-right">Saldo</th>
                            <th className="px-4 py-3 text-center">Fecha esperada</th>
                            <th className="px-4 py-3 text-center">Estado / Pago</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-soft">
                        {tabla.map(cuota => {
                            const pago = pagosMap[cuota.numero];
                            const pagada = !!pago;

                            return (
                                <tr key={cuota.numero}
                                    className={`transition-colors ${pagada ? 'bg-green-50/5' : 'hover:bg-brand-soft/30'}`}>
                                    <td className="px-4 py-3 text-center text-gray-400">{cuota.numero}</td>
                                    <td className="px-4 py-3 text-right font-semibold text-brand-text">${fmt(cuota.cuota)}</td>
                                    <td className="px-4 py-3 text-right text-gray-400">${fmt(cuota.capital)}</td>
                                    <td className="px-4 py-3 text-right text-gray-400">${fmt(cuota.interes)}</td>
                                    <td className="px-4 py-3 text-right text-gray-400">${fmt(cuota.saldo)}</td>
                                    <td className="px-4 py-3 text-center text-gray-400">{cuota.fecha}</td>
                                    <td className="px-4 py-3 text-center">
                                        {editando === cuota.numero ? (
                                            <div className="flex items-center gap-2 justify-center">
                                                <input type="number"
                                                    value={formPago.monto_pagado}
                                                    onChange={e => setFormPago({...formPago, monto_pagado: e.target.value})}
                                                    className="w-24 px-2 py-1 text-xs rounded-lg border border-brand-soft bg-brand-bg text-brand-text"/>
                                                <input type="date"
                                                    value={formPago.fecha_pago}
                                                    onChange={e => setFormPago({...formPago, fecha_pago: e.target.value})}
                                                    className="w-32 px-2 py-1 text-xs rounded-lg border border-brand-soft bg-brand-bg text-brand-text"/>
                                                <button onClick={() => guardarPago(cuota.numero)}
                                                    className="p-1.5 rounded-lg bg-green-500 text-white hover:bg-green-600 transition">
                                                    <Check size={14}/>
                                                </button>
                                                <button onClick={() => setEditando(null)}
                                                    className="p-1.5 rounded-lg bg-gray-200 text-gray-600 hover:bg-gray-300 transition">
                                                    <X size={14}/>
                                                </button>
                                            </div>
                                        ) : pagada ? (
                                            <div className="flex items-center gap-2 justify-center">
                                                <span className="text-xs text-green-500 font-medium">
                                                    ✓ ${fmt(pago.monto_pagado)} · {pago.fecha_pago}
                                                </span>
                                                <button onClick={() => iniciarPago(cuota)}
                                                    className="text-xs text-gray-400 hover:text-brand-primary underline">
                                                    editar
                                                </button>
                                                <button onClick={() => eliminarPago(cuota.numero)}
                                                    className="text-xs text-gray-400 hover:text-red-500 underline">
                                                    quitar
                                                </button>
                                            </div>
                                        ) : (
                                            <button onClick={() => iniciarPago(cuota)}
                                                className="text-xs px-3 py-1 rounded-lg bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-white transition">
                                                Registrar pago
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};