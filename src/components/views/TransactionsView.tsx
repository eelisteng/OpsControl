import React, { useState } from 'react';
import { Badge } from '../ui/Badge';
import { Search, ChevronRight, X, Route, TerminalSquare, AlertCircle, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSystem } from '../../contexts/SystemContext';

export function TransactionsView() {
  const { transactions, sagas, cancelSaga, retrySaga } = useSystem();
  const [selectedTraceId, setSelectedTraceId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showRawLogs, setShowRawLogs] = useState(false);

  const selectedSaga = selectedTraceId ? sagas[selectedTraceId] : null;

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tx.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (tx.sagaTraceId && tx.sagaTraceId.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (statusFilter === 'ALL') return matchesSearch;
    if (statusFilter === 'FAILED_DLQ') return matchesSearch && (tx.status === 'FAILED' || tx.status === 'DLQ');
    return matchesSearch && tx.status === statusFilter;
  });

  const exportCsv = () => {
    const headers = ['Order ID', 'Customer', 'Amount', 'Status', 'Timestamp', 'Trace ID'];
    const rows = filteredTransactions.map(tx => [
      tx.id,
      `"${tx.customer}"`,
      tx.amount.toString(),
      tx.status,
      tx.timestamp,
      tx.sagaTraceId || ''
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `transactions_export_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex h-full w-full relative animate-in fade-in duration-500 overflow-hidden">
      
      {/* Main Table Area */}
      <div className={`flex-1 flex flex-col min-w-0 p-container space-y-container transition-all duration-300 ${selectedTraceId ? 'pr-[400px] lg:pr-[450px]' : ''}`}>
        
        {/* Header */}
        <div>
          <h2 className="text-h2 font-h2">Recent Transactions</h2>
          <p className="text-body-sm text-outline mt-1">Audit log of order requests and saga executions.</p>
        </div>

        {/* Filters */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded p-card shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="relative w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
              <input 
                type="text" 
                placeholder="Search trace, order ID, customer..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-surface border border-outline-variant rounded text-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
            <select 
              className="bg-surface border border-outline-variant rounded px-3 py-1.5 text-body-sm outline-none w-36"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="COMPLETED">Completed</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED_DLQ">Failed / DLQ</option>
            </select>
          </div>
          <button 
            onClick={exportCsv}
            className="flex items-center gap-2 px-4 py-1.5 bg-surface border border-outline-variant rounded text-body-sm font-medium hover:bg-surface-container-low transition-colors"
          >
            <Download size={14} />
            Export CSV
          </button>
        </div>

        {/* Table */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded overflow-hidden shadow-sm flex-1 flex flex-col min-h-0">
          <div className="overflow-y-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-surface-container z-10 border-b border-outline-variant">
                <tr>
                  <th className="px-4 py-3 text-label-caps text-outline">Order ID</th>
                  <th className="px-4 py-3 text-label-caps text-outline">Customer</th>
                  <th className="px-4 py-3 text-label-caps text-outline text-right">Amount</th>
                  <th className="px-4 py-3 text-label-caps text-outline">Status</th>
                  <th className="px-4 py-3 text-label-caps text-outline">Timestamp</th>
                  <th className="px-4 py-3 text-label-caps text-outline text-right">Trace</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-outline">
                      No transactions found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => (
                    <tr 
                      key={tx.id} 
                      className={`h-12 border-l-4 transition-colors cursor-pointer hover:bg-surface-container-low
                        ${selectedTraceId === tx.sagaTraceId ? 'bg-surface-container-low border-primary' : 'border-transparent'}
                        ${tx.status === 'DLQ' || tx.status === 'FAILED' ? 'bg-error-container/20 hover:bg-error-container/40' : ''}
                      `}
                      onClick={() => setSelectedTraceId(tx.sagaTraceId || null)}
                    >
                      <td className="px-4 py-2 font-mono-data text-on-surface">{tx.id}</td>
                      <td className="px-4 py-2 text-body-sm">{tx.customer}</td>
                      <td className="px-4 py-2 font-mono-data text-right">${tx.amount.toFixed(2)}</td>
                      <td className="px-4 py-2"><Badge status={tx.status} /></td>
                      <td className="px-4 py-2 font-mono-data text-outline text-[12px]">{tx.timestamp}</td>
                      <td className="px-4 py-2 text-right">
                         <button className="p-1 rounded text-outline hover:text-on-surface hover:bg-surface-container">
                           <ChevronRight size={18} />
                         </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Slide-over Panel for Saga Trace */}
      <AnimatePresence>
        {selectedSaga && (
          <motion.div 
            initial={{ opacity: 0, x: 400 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 400 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute right-0 top-0 bottom-0 w-[400px] lg:w-[450px] bg-surface-container-lowest border-l border-outline-variant shadow-2xl flex flex-col z-20"
          >
            {/* Panel Header */}
            <div className="p-5 border-b border-outline-variant flex justify-between items-start bg-surface-container-low/50">
              <div>
                <h3 className="text-h3 font-h3 flex items-center gap-2">
                  <Route size={20} className="text-outline" />
                  Saga Trace
                </h3>
                <p className="font-mono-data text-outline text-[12px] mt-1 tracking-widest">{selectedSaga.id}</p>
              </div>
              <button 
                onClick={() => setSelectedTraceId(null)}
                className="p-1 text-outline hover:text-on-surface hover:bg-surface-container rounded transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Panel Content Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              <div className="flex justify-between items-end border-b border-outline-variant pb-4">
                <div>
                  <div className="text-label-caps text-outline mb-1">Status</div>
                  <Badge status={selectedSaga.status} />
                </div>
                <div className="text-right">
                  <div className="text-label-caps text-outline mb-1">Duration</div>
                  <div className="font-mono-data text-on-surface">{selectedSaga.duration}</div>
                </div>
              </div>

              {/* Vertical Stepper */}
              <div className="relative pl-3 space-y-6">
                {selectedSaga.events.map((event, index) => {
                  const isLast = index === selectedSaga.events.length - 1;
                  const isError = event.status === 'FAILED';
                  const isPending = event.status === 'PENDING';
                  
                  let dotColor = 'bg-primary';
                  if (isError) dotColor = 'bg-error';
                  if (isPending) dotColor = 'bg-yellow-500 animate-pulse';

                  return (
                     <div key={`${selectedSaga.id}-${event.id}-${index}`} className="relative">
                        {/* Node */}
                        <div className={`absolute -left-[14px] top-1.5 w-2.5 h-2.5 rounded-full ${dotColor} border-2 border-surface-container-lowest box-content z-10`}></div>
                        
                        {/* Connecting Line */}
                        {!isLast && (
                          <div className={`absolute -left-[9px] top-[14px] w-[2px] h-[calc(100%+16px)] border-l-2 border-dashed ${isError ? 'border-error/50' : 'border-outline-variant'}`}></div>
                        )}

                        <div className="pl-4 pb-2">
                          <div className="flex justify-between items-baseline mb-1">
                            <span className={`text-body-sm font-semibold ${isError ? 'text-error' : 'text-on-surface'}`}>{event.service}</span>
                            <span className="font-mono-data text-[10px] text-outline">{event.timestamp}</span>
                          </div>
                          <p className="text-body-sm text-on-surface-variant leading-snug">{event.message}</p>
                          
                          {/* Optional Payload Dropdown (static for mock) */}
                          {event.payload && (
                             <div className="mt-3 bg-inverse-surface border border-outline rounded p-3 overflow-x-auto">
                                <pre className="font-mono-data text-[10px] text-inverse-primary leading-relaxed">
                                  {JSON.stringify(event.payload, null, 2)}
                                </pre>
                             </div>
                          )}
                        </div>
                     </div>
                  );
                })}
              </div>

              {/* Action Area if failed/pending */}
              {(selectedSaga.status === 'FAILED' || selectedSaga.status === 'ACTIVE') && (
                <div className="mt-8 bg-error-container/20 border border-error/20 p-4 rounded-lg flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-error font-medium text-body-sm">
                    <AlertCircle size={16} />
                    Requires Intervention
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setShowRawLogs(true)}
                      className="flex-1 px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded text-body-sm hover:bg-surface-container-low transition-colors text-center font-medium"
                    >
                      View Raw Logs
                    </button>
                    {selectedSaga.status === 'ACTIVE' && (
                       <button 
                         onClick={() => {
                           if (selectedTraceId) cancelSaga(selectedTraceId);
                         }}
                         className="flex-1 px-3 py-2 bg-error text-on-error rounded text-body-sm hover:bg-error/90 transition-colors text-center font-medium"
                       >
                        Force Cancel
                      </button>
                    )}
                     {selectedSaga.status === 'FAILED' && (
                       <button 
                         onClick={() => {
                           if (selectedTraceId) retrySaga(selectedTraceId);
                         }}
                         className="flex-1 px-3 py-2 bg-primary text-on-primary rounded text-body-sm hover:bg-primary/90 transition-colors text-center font-medium"
                       >
                        Retry Event
                      </button>
                    )}
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Raw Logs Modal */}
      <AnimatePresence>
        {showRawLogs && selectedSaga && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowRawLogs(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-inverse-surface border border-slate-700 w-full max-w-3xl max-h-[80vh] rounded-lg shadow-xl flex flex-col overflow-hidden"
            >
              <div className="flex justify-between items-center p-4 border-b border-outline-variant bg-surface-container">
                <h3 className="text-on-primary font-medium flex items-center gap-2">
                  <TerminalSquare size={18} />
                  Raw Logs: {selectedSaga.id}
                </h3>
                <button 
                  onClick={() => setShowRawLogs(false)}
                  className="text-outline-variant hover:text-on-surface p-1 rounded transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 bg-surface-container-lowest">
                <pre className="font-mono-data text-xs text-green-500 dark:text-green-400 leading-relaxed whitespace-pre-wrap">
                  {JSON.stringify(selectedSaga, null, 2)}
                </pre>
              </div>
              <div className="p-3 border-t border-outline-variant bg-surface-container flex justify-end">
                <button 
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(selectedSaga, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `saga_trace_${selectedSaga.id}.json`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="px-4 py-1.5 bg-surface hover:bg-surface-container-high text-on-surface border border-outline-variant rounded text-sm transition-colors flex items-center gap-2"
                >
                  <Download size={14} />
                  Download JSON
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
