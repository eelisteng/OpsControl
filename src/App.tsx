import React, { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { InfrastructureMonitor } from './components/views/InfrastructureMonitor';
import { TransactionsView } from './components/views/TransactionsView';
import { QueuesView } from './components/views/QueuesView';
import { InventoryView } from './components/views/InventoryView';
import { AuditLogsView } from './components/views/AuditLogsView';
import { SettingsView } from './components/views/SettingsView';
import { SupportView } from './components/views/SupportView';
import { ViewState } from './types';
import { SystemProvider } from './contexts/SystemContext';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('infrastructure');

  return (
    <SystemProvider>
      <div className="flex h-screen bg-background text-on-background font-sans overflow-hidden border-8 border-surface-container-high">
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />
        
        <div className="flex-1 flex flex-col min-w-0 h-full relative">
          <Header />
          
          <main className="flex-1 min-h-0 overflow-auto relative bg-surface-container-lowest">
            {currentView === 'infrastructure' && <InfrastructureMonitor />}
            {currentView === 'transactions' && <TransactionsView />}
            {currentView === 'dlq' && <QueuesView />}
            {currentView === 'inventory' && <InventoryView />}
            {currentView === 'audit' && <AuditLogsView />}
            {currentView === 'settings' && <SettingsView />}
            {currentView === 'support' && <SupportView />}
          </main>
        </div>
      </div>
    </SystemProvider>
  );
}

