// src/pages/Presupuestos/Presupuestos.jsx
import { useState, useEffect } from 'react';
import { presupuestoService } from '../../services/presupuestoService';
import { PresupuestoPlanilla } from './PresupuestoPlanilla';
import { PresupuestoModal } from './PresupuestoModal';
import { SidebarToggleButton } from '../../components/layout/SidebarToggleButton';
import { useSidebar } from '../../components/layout/SidebarContext';
import { Plus, ChevronLeft, ChevronRight, Pencil, Trash2 } from 'lucide-react';

const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
               'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

const Presupuestos = () => {
    const { isCollapsed, onToggle } = useSidebar();
    const hoy = new Date();
    const [mes, setMes] = useState(`${hoy.getFullYear()}-${String(hoy.getMonth()+1).padStart(2,'0')}`);
    const [data, setData] = useState({
        presupuestos: [],
        total_ingresos: 0,
        total_asignado: 0,
        disponible: 0,
    });
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editando, setEditando] = useState(null);
    const [saldosReales, setSaldosReales] = useState({});
    useEffect(() => {
        const inicial = {};
        data.presupuestos.forEach(p => {
            const realItems = (p.items || []).reduce((s, i) => s + parseFloat(i.monto_real || 0), 0);
            inicial[p.id] = realItems + parseFloat(p.sobrante_real || 0);
        });
        setSaldosReales(inicial);
    }, [data.presupuestos]);
    const fetchData = async () => {
        setLoading(true);
        try {
            const { data: res } = await presupuestoService.getByMes(mes);
            setData(res);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, [mes]);

    const navegarMes = (dir) => {
        const [y, m] = mes.split('-').map(Number);
        const fecha = new Date(y, m - 1 + dir);
        setMes(`${fecha.getFullYear()}-${String(fecha.getMonth()+1).padStart(2,'0')}`);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Eliminar este presupuesto?')) return;
        await presupuestoService.delete(id);
        fetchData();
    };

    const totalPresupuestado = data.presupuestos.reduce((s, p) =>
        s + p.items.reduce((si, i) => si + parseFloat(i.monto_presupuestado), 0), 0);
    const totalReal = data.presupuestos.reduce((s, p) =>
        s + p.items.reduce((si, i) => si + parseFloat(i.monto_real), 0), 0);

    const fmt = (n) => parseFloat(n || 0).toLocaleString('es-EC', { minimumFractionDigits: 2 });
    const [anio, mesNum] = mes.split('-');
    const nombreMes = `${MESES[parseInt(mesNum) - 1]} ${anio}`;
    
    const totalSaldo = Object.values(saldosReales).reduce((s, v) => s + v, 0);
    const handleSaldoChange = (presupuestoId, nuevoSaldo) => {
        setSaldosReales(prev => ({ ...prev, [presupuestoId]: nuevoSaldo }));
    };
    return (
        <div className="flex-1 p-8 bg-brand-bg transition-colors duration-500">
            {/* Header */}
            <header className="mb-6 flex justify-between items-start">
                <div className="flex items-center gap-4">
                    <SidebarToggleButton isCollapsed={isCollapsed} onToggle={onToggle} />
                    <div>
                        <h1 className="text-2xl font-bold text-brand-text">Presupuestos</h1>
                        <p className="text-gray-500 text-sm">Planificación mensual de gastos</p>
                    </div>
                </div>
                <button onClick={() => { setEditando(null); setModalOpen(true); }}
                    className="flex items-center gap-2 bg-brand-primary text-white px-4 py-2 rounded-xl hover:opacity-90 transition">
                    <Plus size={18}/> Nuevo Plan
                </button>
            </header>

            {/* Navegador de mes */}
            <div className="flex items-center justify-between bg-brand-panel border border-brand-soft rounded-2xl px-6 py-4 mb-6 shadow">
                <button onClick={() => navegarMes(-1)} className="p-2 rounded-lg hover:bg-brand-soft transition text-gray-400">
                    <ChevronLeft size={20}/>
                </button>
                <div className="text-center">
                    <p className="text-lg font-bold text-brand-text capitalize">{nombreMes}</p>
                    <p className="text-xs text-gray-400">Total ingresos del mes:
                        <span className="text-green-500 font-semibold ml-1">${fmt(data.total_ingresos)}</span>
                    </p>
                </div>
                <button onClick={() => navegarMes(1)} className="p-2 rounded-lg hover:bg-brand-soft transition text-gray-400">
                    <ChevronRight size={20}/>
                </button>
            </div>

            {/* Resumen general */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                    {
                        label: 'Total Ingresos del Mes',
                        valor: data.total_ingresos,
                        color: 'text-green-500'
                    },
                    {
                        label: 'Total Presupuestado',
                        valor: data.total_asignado,
                        color: 'text-blue-400'
                    },
                    {
                        label: 'Disponible para Presupuestar',
                        valor: data.disponible,
                        color: data.disponible >= 0 ? 'text-emerald-400' : 'text-red-500'
                    },
                    {
                        label: 'Saldo Real Gastado',
                        valor: totalSaldo,
                        color: 'text-orange-400'
                    },
                ].map(({ label, valor, color }) => (
                    <div key={label} className="bg-brand-panel border border-brand-soft rounded-2xl p-4 shadow">
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">{label}</p>
                        <p className={`text-xl font-bold ${color}`}>${fmt(valor)}</p>
                    </div>
                ))}
            </div>

            {/* Planillas */}
            {loading ? <p className="text-gray-400">Cargando...</p> : data.presupuestos.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                    <p className="text-lg">No hay presupuestos para este mes</p>
                    <p className="text-sm mt-1">Crea un nuevo plan para comenzar</p>
                </div>
            ) : (
                <div className="flex flex-col gap-6">
                    {data.presupuestos.map(presupuesto => (
                        <div key={presupuesto.id} className="bg-brand-panel border border-brand-soft rounded-2xl shadow overflow-hidden">
                            {/* Cabecera del plan */}
                            <div className="flex justify-between items-center px-6 py-4 border-b border-brand-soft">
                                <div>
                                    <p className="font-bold text-brand-text text-lg">{presupuesto.nombre}</p>
                                    <p className="text-xs text-gray-400">
                                        Total del plan: <span className="text-green-400 font-semibold">${fmt(presupuesto.monto_asignado)}</span>
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => { setEditando(presupuesto); setModalOpen(true); }}
                                        className="p-2 rounded-lg hover:bg-brand-soft text-gray-400 hover:text-brand-primary transition">
                                        <Pencil size={16}/>
                                    </button>
                                    <button onClick={() => handleDelete(presupuesto.id)}
                                        className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition">
                                        <Trash2 size={16}/>
                                    </button>
                                </div>
                            </div>
                            <PresupuestoPlanilla
                                presupuesto={presupuesto}
                                totalIngresos={presupuesto.total_ingresos}
                                onActualizado={fetchData}
                                onSaldoChange={handleSaldoChange}
                            />
                        </div>
                    ))}
                </div>
            )}

            {modalOpen && (
                <PresupuestoModal
                    presupuesto={editando}
                    mesActual={mes}
                    disponible={data.disponible}
                    onClose={() => setModalOpen(false)}
                    onSaved={() => { setModalOpen(false); fetchData(); }}
                />
            )}
        </div>
    );
};

export default Presupuestos;