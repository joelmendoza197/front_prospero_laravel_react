import React from 'react';
import { CheckCircle2, ShoppingCart, Zap, DollarSign } from 'lucide-react';

export const PreviewCard = () => {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Tarjeta Principal */}
      <div className="bg-brand-bg rounded-[2rem] p-8 shadow-2xl border border-gray-100">
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-brand-soft rounded-full flex items-center justify-center text-brand-primary font-bold">
                FM
            </div>
            <div>
              <p className="text-gray-400 text-xs font-medium">Familia Martínez</p>
              <h4 className="text-gray-900 font-bold">Balance Total</h4>
            </div>
          </div>
          <div className="text-right">
            <h3 className="text-3xl font-black text-gray-900">$24,850</h3>
            <p className="text-green-500 text-xs font-bold flex items-center justify-end gap-1">
              ↑ +12.5%
            </p>
          </div>
        </div>

        {/* Gráfico de Barras Simulado */}
        <div className="flex items-end justify-between gap-2 h-32 mb-8 px-2">
          {[40, 70, 45, 90, 65, 80, 55, 95, 75, 100].map((height, i) => (
            <div 
              key={i} 
              className={`w-full rounded-t-md transition-all duration-500 ${i === 9 ? 'bg-brand-primary' : 'bg-brand-soft'}`}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>

        {/* Mini Tarjetas Inferiores */}
        <div className="grid grid-cols-2 gap-4 w-full">
            <div className="bg-brand-cream p-4 rounded-2xl border border-gray-50 min-w-0">
              <ShoppingCart size={16} />
              <p className="text-gray-400 text-[10px] font-bold uppercase truncate">Supermercado</p>
              <p className="text-lg font-bold text-gray-900 truncate">$1,250</p>
            </div>
            <div className="bg-brand-soft p-4 rounded-2xl border border-gray-50 min-w-0">
              <Zap size={16} />
            <p className="text-gray-400 text-[10px] font-bold uppercase truncate">Servicios</p>
        <p className="text-lg font-bold text-gray-900 truncate">$485</p>
            </div>
        </div>
      </div>

      {/* Floating Badge: Pago Recibido (Arriba Derecha) */}
      <div className="absolute -top-6 -right-6 bg-white py-3 px-5 rounded-2xl shadow-xl border border-gray-50 flex items-center gap-3 animate-bounce-slow">
        <div className="bg-brand-soft p-2 rounded-full text-brand-primary">
          <CheckCircle2 size={20} />
        </div>
        <div>
          <p className="text-[10px] text-gray-400 font-bold leading-none">Pago recibido</p>
          <p className="text-sm font-black text-brand-primary">+$2,500</p>
        </div>
      </div>

      {/* Floating Badge: Meta de Ahorro (Abajo Izquierda) */}
      <div className="absolute -bottom-10 -left-10 bg-white p-5 rounded-2xl shadow-2xl border border-gray-50 flex items-center gap-4 w-56">
        <div className="bg-brand-primary p-3 rounded-2xl text-white">
          <DollarSign size={24} />
        </div>
        <div className="flex-1">
          <p className="text-[10px] text-gray-400 font-bold leading-none mb-1">Meta de ahorro</p>
          <p className="text-xl font-black text-gray-900">$5,000</p>
          <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-brand-primary h-full w-[65%] rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};