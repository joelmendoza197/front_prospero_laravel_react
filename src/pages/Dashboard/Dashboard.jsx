import { StatCard } from '../../components/ui/StatCard';
import { IdleTimer } from '../../components/auth/IdleTimer';
import { ThemeToggle } from '../../components/ui/ThemeTooggle';
import { SidebarToggleButton } from '../../components/layout/SidebarToggleButton';
import { useSidebar } from '../../components/layout/SidebarContext';

const Dashboard = () => {
    const { isCollapsed, onToggle } = useSidebar();

    return (
        <div className="flex-1 p-8 transition-colors duration-500">
            <IdleTimer timeoutInMinutes={60} />

            <header className="mb-8 flex justify-between items-start">
                <SidebarToggleButton isCollapsed={isCollapsed} onToggle={onToggle} />
                <div>
                    <h1 className="text-2xl font-bold text-brand-text transition-colors">
                        Resumen del Hogar
                    </h1>
                    <p className="text-gray-500 text-sm">Bienvenido de nuevo a Próspero.</p>
                </div>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Ingresos Mensuales" amount="4,250" trend="+12%" type="income" />
                <StatCard title="Gastos Totales" amount="1,820" trend="-5%" type="expense" />
                <StatCard title="Balance Neto" amount="2,430" type="neutral" />
            </div>
        </div>
    );
};

export default Dashboard;