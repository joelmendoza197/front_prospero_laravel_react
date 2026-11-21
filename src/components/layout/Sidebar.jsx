import { SidebarHeader } from './SidebarHeader';
import { NavItem } from './NavItem';
import { UserMenu } from './UserMenu';
import { 
    Home, Wallet, CreditCard, PieChart, 
    ArrowLeftRight, PiggyBank, Target,
    PanelLeft, PanelRight 
} from 'lucide-react';

export const Sidebar = ({ isCollapsed }) => {
    return (
        <aside className={`sticky top-0 h-screen transition-all duration-300 ease-in-out bg-brand-panel p-4 flex flex-col justify-between border-r border-brand-soft shadow-xl
            ${isCollapsed ? 'w-20' : 'w-64'}`}
        >
            <div className="flex flex-col gap-2">
                {/* Pasamos onToggle para que el botón interno funcione */}
                <SidebarHeader isCollapsed={isCollapsed} />
                
                <hr className="border-brand-soft mb-6" />

                <div className={isCollapsed ? 'px-0' : 'px-2'}>
                    {!isCollapsed && (
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                            Menu Principal
                        </p>
                    )}
                    <nav className="flex flex-col gap-2">
                        <NavItem icon={Home} label="Inicio" to="/dashboard" isCollapsed={isCollapsed} />
                        <NavItem icon={Wallet} label="Registro de Ingresos" to="/ingresos" isCollapsed={isCollapsed} />
                        <NavItem icon={CreditCard} label="Deudas" to="/deudas" isCollapsed={isCollapsed} />
                        <NavItem icon={PieChart} label="Presupuestos" to="/presupuestos" isCollapsed={isCollapsed} />
                        <NavItem icon={ArrowLeftRight} label="Gastos" to="/transacciones" isCollapsed={isCollapsed} />
                        <NavItem icon={PiggyBank} label="Ahorros" to="/ahorros" isCollapsed={isCollapsed} />
                        <NavItem icon={Target} label="Metas" to="/metas" isCollapsed={isCollapsed} />
                    </nav>
                </div>
            </div>
            <UserMenu isCollapsed={isCollapsed} />
        </aside>
    );
};