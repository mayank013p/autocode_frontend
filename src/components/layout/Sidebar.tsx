import React from 'react';
import { LayoutDashboard, FileText, BarChart3, LogOut, Code2, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'insights', label: 'Insights', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 h-screen bg-[var(--sidebar-bg)] border-r border-[var(--border)] flex flex-col p-6 fixed left-0 top-0 z-50">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center">
          <Code2 size={20} className="text-black" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight">AutoCode</h1>
          <p className="text-tiny text-primary font-mono tracking-widest font-bold">NOTES.IO</p>
        </div>
      </div>

      <div className="flex-1">
        <p className="text-[10px] text-[var(--text-dim)] font-bold tracking-widest uppercase mb-4 px-2">// MENU</p>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === item.id
                  ? 'bg-primary-10 text-primary border-l-4 border-t-0 border-r-0 border-b-0 border-primary'
                  : 'text-dim hover:text-white hover:bg-white-5'
                }`}
            >
              <item.icon size={18} />
              <span className="font-medium text-sm">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="pt-6 border-t border-[var(--border)]">
        {user && (
          <div className="flex items-center gap-3 px-4 mb-4">
            <div className="w-8 h-8 rounded-full bg-indigo-500-10 flex items-center justify-center border border-indigo-500-20">
              <User size={14} className="text-indigo-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user.name}</p>
              <p className="text-tiny text-dim truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-dim hover:text-white transition-colors group"
        >
          <LogOut size={18} className="group-hover:text-red-400 transition-colors" />
          <span className="font-medium text-sm">Sign out</span>
        </button>
        <div className="mt-6 px-2">
          <p className="text-tiny text-dim font-mono">v1.1.0 · active session</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
