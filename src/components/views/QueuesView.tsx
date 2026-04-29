import React, { useState } from 'react';
import { Layers, AlertCircle, RefreshCw, Trash2, Search } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { useSystem } from '../../contexts/SystemContext';

export function QueuesView() {
  const { queues, deadLetters, replayDeadLetter, deleteDeadLetter } = useSystem();
  const [dlqSearch, setDlqSearch] = useState('');

  const filteredDeadLetters = deadLetters.filter(dl => 
    dl.id.toLowerCase().includes(dlqSearch.toLowerCase()) ||
    dl.reason.toLowerCase().includes(dlqSearch.toLowerCase()) ||
    dl.queue.toLowerCase().includes(dlqSearch.toLowerCase())
  );

  return (
    <div className="flex h-full w-full relative animate-in fade-in duration-500 overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0 p-container space-y-container">
        
        {/* Header */}
        <div>
          <h2 className="text-h2 font-h2">Message Queues & DLQ</h2>
          <p className="text-body-sm text-outline mt-1">Monitor RabbitMQ nodes, channel congestion, and dead letters.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-container mb-6">
          {/* Active Queues Panel */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded p-card shadow-sm flex flex-col">
            <h3 className="text-h3 font-h3 mb-4 flex items-center gap-2">
              <Layers size={20} className="text-outline" />
              Active Queues
            </h3>
            <div className="space-y-3">
              {queues.map(q => (
                <div key={q.name} className="flex justify-between items-center p-3 bg-surface-container-low rounded border border-outline-variant/50">
                  <div>
                    <div className="font-mono-data text-on-surface">{q.name}</div>
                    <div className="text-[10px] text-outline uppercase tracking-wider mt-1">{q.messages} Messages</div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge status={q.status === 'HEALTHY' ? 'COMPLETED' : 'PENDING'} />
                    {q.dlq > 0 && <span className="text-[10px] text-error font-mono-data">{q.dlq} in DLQ</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DLQ Panel */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded p-card shadow-sm flex flex-col">
            <h3 className="text-h3 font-h3 mb-4 flex items-center gap-2 text-error">
              <AlertCircle size={20} />
              Dead Letter Intervention
            </h3>
            <div className="flex items-center justify-between mb-4 gap-2">
               <div className="relative flex-1">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-outline" />
                <input 
                  type="text" 
                  placeholder="Search DLQ messages..." 
                  value={dlqSearch}
                  onChange={(e) => setDlqSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1 bg-surface border border-outline-variant rounded text-label-caps focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
              <button 
                onClick={() => setDlqSearch('')}
                className="p-1.5 border border-outline-variant rounded hover:bg-surface-container-low transition-colors text-outline"
                title="Clear Search"
              >
                <RefreshCw size={14} />
              </button>
            </div>
            
            <div className="space-y-2 flex-1 overflow-y-auto">
              {filteredDeadLetters.length === 0 ? (
                 <div className="p-4 text-center text-outline text-body-sm">
                   No dead letters found.
                 </div>
              ) : (
                filteredDeadLetters.map(dl => (
                  <div key={dl.id} className="p-3 bg-error-container/10 border-l-2 border-error text-body-sm group">
                    <div className="flex justify-between font-mono-data text-[11px] mb-1">
                      <span className="text-on-surface">{dl.id} ({dl.queue})</span>
                      <span className="text-outline">{dl.timestamp}</span>
                    </div>
                    <div className="text-error mb-2">{dl.reason}</div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => replayDeadLetter(dl.id)}
                        className="flex-1 py-1 bg-surface-container-low border border-outline-variant rounded text-[10px] hover:text-on-surface uppercase tracking-wider transition-colors"
                      >
                        Replay
                      </button>
                      <button 
                        onClick={() => deleteDeadLetter(dl.id)}
                        className="p-1 bg-error-container text-on-error-container rounded hover:bg-error hover:text-on-error transition-colors"
                        title="Delete Message"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
