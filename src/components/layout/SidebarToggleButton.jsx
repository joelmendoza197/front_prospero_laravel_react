import { PanelLeft, PanelRight } from 'lucide-react';

export const SidebarToggleButton = ({ isCollapsed, onToggle }) => {
    return (
        <button
            onClick={onToggle}
            title={isCollapsed ? 'Expandir menú' : 'Colapsar menú'}
            className="p-2 rounded-xl bg-brand-primary hover:opacity-90 text-white shadow-md transition-all duration-200"
        >
            {isCollapsed ? <PanelRight size={20} /> : <PanelLeft size={20} />}
        </button>
    );
};