import { Sidebar } from './Sidebar';
import { SidebarProvider, useSidebar } from './SidebarContext';

const Layout = ({ children }) => {
    const { isCollapsed } = useSidebar();

    return (
        <div className="flex min-h-screen bg-brand-bg transition-colors duration-500">
            <Sidebar isCollapsed={isCollapsed} />
            <div className="flex-1 min-h-screen bg-brand-bg transition-colors duration-500">
                {children}
            </div>
        </div>
    );
};

export const DashboardLayout = ({ children }) => (
    <SidebarProvider>
        <Layout>{children}</Layout>
    </SidebarProvider>
);