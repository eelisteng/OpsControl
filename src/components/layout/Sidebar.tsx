import React from 'react';
import { ViewState } from '../../types';
import { 
  LayoutDashboard, 
  Activity, 
  Layers, 
  Server, 
  TerminalSquare, 
  Settings, 
  HelpCircle,
  Hexagon
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const navItems = [
    { id: 'infrastructure', label: 'Monitor', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: Activity },
    { id: 'dlq', label: 'Queues & DLQ', icon: Layers },
    { id: 'inventory', label: 'Inventory', icon: Server },
  ] as const;

  return (
    <aside className="bg-surface-container-lowest border-r border-outline-variant h-screen w-64 hidden flex-col sticky left-0 top-0 z-40 md:flex">
      {/* Header */}
      <div className="p-6 border-b border-outline-variant flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-primary shadow-[0_0_8px_var(--color-primary)] text-on-primary flex items-center justify-center">
          <Hexagon size={20} className="fill-current" />
        </div>
        <div>
          <h1 className="text-h2 font-serif tracking-wide text-white">OpsControl</h1>
          <p className="text-[10px] uppercase tracking-wider text-outline">v2.4.0-stable</p>
        </div>
      </div>

      {/* Nav Links */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as ViewState)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded text-left transition-all ${
                isActive 
                  ? 'bg-outline/10 text-on-surface font-medium' 
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-on-surface' : 'text-outline'} />
              <span className="text-body-sm font-medium">{item.label}</span>
            </button>
          );
        })}
        
        <div className="pt-4 mt-4 border-t border-outline-variant">
          <button 
            onClick={() => onViewChange('audit' as ViewState)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded text-left transition-all ${
              currentView === 'audit'
                ? 'bg-outline/10 text-on-surface font-medium' 
                : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
            }`}
          >
            <TerminalSquare size={18} className={currentView === 'audit' ? 'text-on-surface' : 'text-outline'} />
            <span className="text-body-sm font-medium">Audit Logs</span>
          </button>
        </div>
      </div>

      {/* Footer Nav */}
      <div className="p-4 border-t border-outline-variant flex flex-col gap-1">
         <button 
           onClick={() => onViewChange('settings' as ViewState)}
           className={`w-full flex items-center gap-3 px-3 py-2 rounded text-left transition-all ${
             currentView === 'settings'
               ? 'bg-outline/10 text-on-surface font-medium' 
               : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
           }`}
         >
            <Settings size={18} className={currentView === 'settings' ? 'text-on-surface' : 'text-outline'} />
            <span className="text-body-sm font-medium">Settings</span>
          </button>
          <button 
            onClick={() => onViewChange('support' as ViewState)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded text-left transition-all ${
              currentView === 'support'
                ? 'bg-outline/10 text-on-surface font-medium' 
                : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
            }`}
          >
            <HelpCircle size={18} className={currentView === 'support' ? 'text-on-surface' : 'text-outline'} />
            <span className="text-body-sm font-medium">Support</span>
          </button>
      </div>
    </aside>
  );
}
