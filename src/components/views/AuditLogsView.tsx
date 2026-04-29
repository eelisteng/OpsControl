import React, { useMemo, useState } from 'react';
import { TerminalSquare, Search, Filter, Download } from 'lucide-react';
import { useSystem } from '../../contexts/SystemContext';
import { Badge } from '../ui/Badge';

export function AuditLogsView() {
  const { sagas } = useSystem();
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState('ALL');

  // Extract and sort all events from all sagas
  const allEvents = useMemo(() => {
    const events = (Object.values(sagas) as import('../../types').SagaTrace[]).flatMap(saga => 
      saga.events.map(event => ({
        ...event,
        sagaId: saga.id,
      }))
    );
    
    // Convert timestamp to a sortable format for comparison, or just sort by id as it uses Date.now()
    return events.sort((a, b) => b.id.localeCompare(a.id));
  }, [sagas]);

  const filteredEvents = allEvents.filter(event => {
    const matchesSearch = event.service.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          event.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.sagaId.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (serviceFilter === 'ALL') return matchesSearch;
    return matchesSearch && event.service === serviceFilter;
  });

  const exportCsv = () => {
    const headers = ['Timestamp', 'Status', 'Service', 'Event Name', 'Message', 'Trace ID'];
    const rows = filteredEvents.map(evt => [
      evt.timestamp,
      evt.status,
      `"${evt.service}"`,
      `"${evt.event}"`,
      `"${evt.message}"`,
      evt.sagaId
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `audit_logs_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex h-full w-full relative animate-in fade-in duration-500 overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0 p-container space-y-container">
        
        {/* Header */}
        <div>
          <h2 className="text-h2 font-h2 flex items-center gap-2">
            <TerminalSquare size={24} className="text-primary" />
            Audit Logs
          </h2>
          <p className="text-body-sm text-outline mt-1">Global audit trail of system events, security logs, and operations.</p>
        </div>

        {/* Filters and Controls */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded p-card shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="relative w-72">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
              <input 
                type="text" 
                placeholder="Search logs by keyword or trace ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-surface border border-outline-variant rounded text-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
            <div className="flex items-center gap-2 border border-outline-variant rounded px-3 py-1 bg-surface">
              <Filter size={14} className="text-outline" />
              <select 
                className="bg-transparent text-body-sm outline-none text-on-surface"
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
              >
                <option value="ALL">All Services</option>
                <option value="API Gateway">API Gateway</option>
                <option value="Order Svc">Order Svc</option>
                <option value="Payment Svc">Payment Svc</option>
                <option value="Inventory Svc">Inventory Svc</option>
              </select>
            </div>
          </div>
          <button 
            onClick={exportCsv}
            className="flex items-center gap-2 px-4 py-1.5 bg-surface border border-outline-variant rounded text-body-sm font-medium hover:bg-surface-container-low transition-colors text-on-surface"
          >
            <Download size={14} />
            Export Logs
          </button>
        </div>

        {/* Logs Table */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded overflow-hidden shadow-sm flex-1 flex flex-col min-h-0">
          <div className="overflow-y-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-surface-container z-10 border-b border-outline-variant">
                <tr>
                  <th className="px-4 py-3 text-label-caps text-outline w-40">Timestamp</th>
                  <th className="px-4 py-3 text-label-caps text-outline w-32">Status</th>
                  <th className="px-4 py-3 text-label-caps text-outline w-40">Service</th>
                  <th className="px-4 py-3 text-label-caps text-outline w-48">Event Name</th>
                  <th className="px-4 py-3 text-label-caps text-outline">Message</th>
                  <th className="px-4 py-3 text-label-caps text-outline w-48 text-right">Trace ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container text-body-sm font-mono-data">
                {filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-outline">
                      No logs found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map((event) => (
                    <tr 
                      key={`${event.sagaId}-${event.id}`} 
                      className={`h-12 border-l-4 transition-colors hover:bg-surface-container-low
                        ${event.status === 'FAILED' ? 'border-error bg-error-container/10' : 'border-transparent'}
                        ${event.status === 'SUCCESS' ? 'border-transparent' : ''}
                      `}
                    >
                      <td className="px-4 py-2 text-outline text-[12px] whitespace-nowrap">{event.timestamp}</td>
                      <td className="px-4 py-2">
                         <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider
                          ${event.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-500' : ''}
                          ${event.status === 'FAILED' ? 'bg-error text-on-error' : ''}
                          ${event.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' : ''}
                        `}>
                          {event.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-[#9ca3af] font-semibold">{event.service}</td>
                      <td className="px-4 py-2 text-primary">{event.event}</td>
                      <td className="px-4 py-2 text-on-surface truncate max-w-md" title={event.message}>
                        {event.message}
                      </td>
                      <td className="px-4 py-2 text-right text-outline whitespace-nowrap font-sans text-xs">
                        {event.sagaId}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="bg-surface-container p-3 border-t border-outline-variant flex justify-between items-center text-xs text-outline">
            <div>Showing {filteredEvents.length} logs</div>
            <div className="flex items-center gap-2">
              <button className="px-2 py-1 hover:text-on-surface">Prev</button>
              <button className="px-2 py-1 hover:text-on-surface">Next</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
