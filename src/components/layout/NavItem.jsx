import { Link, useLocation } from 'react-router-dom';

export const NavItem = ({ icon: Icon, label, to, isCollapsed }) => {
    const location = useLocation();

    const isActive = location.pathname === to;

    return (
        <Link to={to} className={`flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 group
            ${isActive ? 'bg-brand-soft text-brand-text' : 'text-gray-500 hover:bg-brand-soft/50'}
            ${isCollapsed ? 'justify-center' : ''}`}
        >
            <Icon size={22} className="shrink-0" />
            {!isCollapsed && <span className="text-[15px] truncate">{label}</span>}
        </Link>
    );
};