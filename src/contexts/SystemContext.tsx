import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Transaction, SagaTrace, QueueStat, DeadLetter, InventoryItem, InfraStats, SystemAlert } from '../types';
import { mockTransactions, mockSagaData } from '../data/mock';

interface SystemState {
  transactions: Transaction[];
  sagas: Record<string, SagaTrace>;
  queues: QueueStat[];
  deadLetters: DeadLetter[];
  inventory: InventoryItem[];
  infra: InfraStats;
  syncData: () => void;
  simulateOrder: () => void;
  replayDeadLetter: (id: string) => void;
  deleteDeadLetter: (id: string) => void;
  triggerLoadSpike: () => void;
  restartService: (name: string) => void;
  cancelSaga: (traceId: string) => void;
  retrySaga: (traceId: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  alerts: SystemAlert[];
  markAlertsRead: () => void;
  clearAlerts: () => void;
}

const SystemContext = createContext<SystemState | undefined>(undefined);

export function useSystem() {
  const context = useContext(SystemContext);
  if (!context) {
    throw new Error('useSystem must be used within a SystemProvider');
  }
  return context;
}

const initialQueues: QueueStat[] = [
  { name: 'order-processing-queue', messages: 1240, status: 'HEALTHY', dlq: 0 },
  { name: 'payment-gateway-queue', messages: 45, status: 'HEALTHY', dlq: 2 },
  { name: 'inventory-update-queue', messages: 8900, status: 'WARNING', dlq: 150 },
  { name: 'email-notification-queue', messages: 12, status: 'HEALTHY', dlq: 0 },
];

const initialDeadLetters: DeadLetter[] = [
  { id: 'msg-8819a', queue: 'inventory-update-dlq', reason: 'Timeout Exceeded', timestamp: '10:45:12 AM' },
  { id: 'msg-992bc', queue: 'inventory-update-dlq', reason: 'Connection Refused', timestamp: '10:44:05 AM' },
  { id: 'msg-110cd', queue: 'payment-gateway-dlq', reason: 'Invalid Payload', timestamp: '09:12:33 AM' },
];

const initialInventory: InventoryItem[] = [
  { sku: 'ITM-001', name: 'Quantum Processor Unit', stock: 124, status: 'IN_STOCK', location: 'ZONE-A' },
  { sku: 'ITM-002', name: 'Neural Link Interface', stock: 0, status: 'OUT_OF_STOCK', location: 'ZONE-B' },
  { sku: 'ITM-003', name: 'Plasma Injector Array', stock: 12, status: 'LOW_STOCK', location: 'ZONE-A' },
  { sku: 'ITM-004', name: 'Cryogenic Cooling Core', stock: 450, status: 'IN_STOCK', location: 'ZONE-C' },
  { sku: 'ITM-005', name: 'Tachyon Emitter', stock: 5, status: 'LOW_STOCK', location: 'ZONE-B' },
];

const initialInfra: InfraStats = {
  apiReqRate: '1.2k/s',
  redisHitRatio: 94.2,
  redisMemoryGb: 2.4,
  clusterCpu: 42,
  cpuHistory: [30, 45, 20, 60, 42, 35, 25, 40, 55, 30],
  services: [
    { name: 'Order Svc', icon: 'cart', lat: '42ms', status: 'ok' },
    { name: 'Payment Svc', icon: 'card', lat: '840ms', status: 'warn' },
    { name: 'Inventory Svc', icon: 'box', lat: '18ms', status: 'ok' },
  ]
};

export const SystemProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [sagas, setSagas] = useState<Record<string, SagaTrace>>(mockSagaData);
  const [queues, setQueues] = useState<QueueStat[]>(initialQueues);
  const [deadLetters, setDeadLetters] = useState<DeadLetter[]>(initialDeadLetters);
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [infra, setInfra] = useState<InfraStats>(initialInfra);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [alerts, setAlerts] = useState<SystemAlert[]>([
    { id: 'al-1', message: 'System startup completed', timestamp: new Date(Date.now() - 3600000).toLocaleTimeString('en-US', { hour12: false }), type: 'info', read: true },
    { id: 'al-2', message: 'Inventory update DLQ received messages', timestamp: new Date(Date.now() - 1800000).toLocaleTimeString('en-US', { hour12: false }), type: 'warning', read: false }
  ]);

  // Effect to apply theme class
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Simulation effect
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Update Infra metrics slightly
      setInfra(prev => {
        const newCpu = Math.max(10, Math.min(95, prev.clusterCpu + (Math.random() * 20 - 10)));
        const newHist = [...prev.cpuHistory.slice(1), newCpu];
        const newHitRatio = Math.max(90, Math.min(99.9, prev.redisHitRatio + (Math.random() * 2 - 1)));
        
        // Randomize latencies
        const newServices = prev.services.map(svc => {
          let baseLat = svc.name === 'Payment Svc' ? 800 : 30;
          let newLat = Math.max(10, baseLat + (Math.random() * 100 - 50));
          let status: 'ok' | 'warn' | 'error' = newLat > 600 ? 'warn' : 'ok';
          return { ...svc, lat: `${Math.round(newLat)}ms`, status };
        });

        const newReq = (1.0 + Math.random() * 0.5).toFixed(1);

        return {
          ...prev,
          clusterCpu: Math.round(newCpu),
          cpuHistory: newHist.map(Math.round),
          redisHitRatio: Number(newHitRatio.toFixed(1)),
          services: newServices,
          apiReqRate: `${newReq}k/s`
        };
      });

      // 2. Simulate Queue Fluctuations
      setQueues(prev => prev.map(q => {
        let change = Math.floor(Math.random() * 100 - 50);
        if (q.name === 'inventory-update-queue') change = Math.floor(Math.random() * 500 - 200); // More volatile
        const newMessages = Math.max(0, q.messages + change);
        const status = newMessages > 5000 ? 'WARNING' : 'HEALTHY';
        return { ...q, messages: newMessages, status };
      }));

      // 3. Progress Active Sagas
      setSagas(prev => {
        let changed = false;
        const newSagas = { ...prev };
        
        for (const [key, rawSaga] of Object.entries(newSagas)) {
          const saga = rawSaga as SagaTrace;
          if (saga.status === 'ACTIVE') {
            changed = true;
            // Add a new event based on last event
            const lastEvent = saga.events[saga.events.length - 1];
            
            if (lastEvent.event === 'OrderCreatedEvent') {
              newSagas[key] = {
                ...saga,
                duration: '1s (Active)',
                events: [...saga.events, {
                  id: `evt-${crypto.randomUUID()}`,
                  service: 'Inventory Svc',
                  event: 'StockReservedEvent',
                  timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
                  status: 'SUCCESS',
                  message: 'Inventory successfully locked.'
                }]
              };
            } else if (lastEvent.event === 'StockReservedEvent') {
              // Finish it
              newSagas[key] = {
                ...saga,
                status: 'COMPLETED',
                duration: '2.5s',
                events: [...saga.events, {
                  id: `evt-${crypto.randomUUID()}`,
                  service: 'Payment Svc',
                  event: 'PaymentProcessed',
                  timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
                  status: 'SUCCESS',
                  message: 'Payment settled.'
                }]
              };
              
              // Also update tx status
              setTransactions(txs => txs.map(tx => tx.sagaTraceId === key ? { ...tx, status: 'COMPLETED' } : tx));
            }
          }
        }
        return changed ? newSagas : prev;
      });

    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Sync data manually when user presses sync button
  const syncData = () => {
    setInfra(prev => ({ ...prev, apiReqRate: (Number(prev.apiReqRate.split('k')[0]) + 0.1).toFixed(1) + 'k/s' }));
  };

  const simulateOrder = () => {
    const id = `ORD-${Math.floor(Math.random() * 1000000).toString(16).toUpperCase()}`;
    const trcId = `trc-${Date.now()}`;
    
    const newTx: Transaction = {
      id,
      customer: ['Cyberdyne Sys', 'Umbrella Corp', 'Stark Ind', 'Wayne Ent'][Math.floor(Math.random() * 4)],
      amount: Math.round(Math.random() * 5000 * 100) / 100,
      status: 'PENDING',
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      sagaTraceId: trcId
    };

    const newSaga: SagaTrace = {
      id: `TRC-${id}`,
      rootEntityId: id,
      status: 'ACTIVE',
      startTime: newTx.timestamp,
      duration: '45ms (Active)',
      events: [
        {
          id: `evt-${crypto.randomUUID()}`,
          service: 'API Gateway',
          event: 'HttpRequestReceived',
          timestamp: newTx.timestamp,
          status: 'SUCCESS',
          message: 'Received order payload.'
        },
        {
          id: `evt-${crypto.randomUUID()}`,
          service: 'Order Svc',
          event: 'OrderCreatedEvent',
          timestamp: newTx.timestamp,
          status: 'SUCCESS',
          message: 'Order Created successfully published to exchange.',
          payload: { orderId: id, total: newTx.amount }
        }
      ]
    };

    setTransactions(prev => [newTx, ...prev.slice(0, 49)]); // Keep last 50
    setSagas(prev => ({ ...prev, [trcId]: newSaga }));
    setQueues(prev => prev.map(q => q.name === 'order-processing-queue' ? { ...q, messages: q.messages + 1 } : q));
  };

  const replayDeadLetter = (id: string) => {
    setDeadLetters(prev => prev.filter(dl => dl.id !== id));
    // Simulate re-queueing by adding to random queue
    setQueues(prev => prev.map((q, i) => i === 0 ? { ...q, messages: q.messages + 1 } : q));
  };

  const deleteDeadLetter = (id: string) => {
    setDeadLetters(prev => prev.filter(dl => dl.id !== id));
  };

  const triggerLoadSpike = () => {
    setInfra(prev => ({
      ...prev,
      clusterCpu: 98,
      cpuHistory: [...prev.cpuHistory.slice(1), 98],
      apiReqRate: '8.4k/s',
      services: prev.services.map(svc => ({
        ...svc,
        lat: svc.name === 'Payment Svc' ? '2400ms' : '230ms',
        status: 'error'
      }))
    }));
    
    // Also flood queues
    setQueues(prev => prev.map(q => ({
      ...q,
      messages: q.messages + Math.floor(Math.random() * 10000),
      status: 'CRITICAL'
    })));

    setAlerts(prev => [
      { id: `al-${Date.now()}`, message: 'CRITICAL: Global Load Spike Detected. Services impacted.', timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }), type: 'error', read: false },
      ...prev
    ]);
  };

  const restartService = (name: string) => {
    setInfra(prev => ({
      ...prev,
      services: prev.services.map(svc => svc.name === name ? { ...svc, status: 'restarting', lat: '0ms' } : svc)
    }));

    setTimeout(() => {
      setInfra(prev => ({
        ...prev,
        services: prev.services.map(svc => svc.name === name ? { ...svc, status: 'ok', lat: '25ms' } : svc)
      }));
    }, 4000);
  };

  const cancelSaga = (traceId: string) => {
    setSagas(prev => {
      const saga = prev[traceId];
      if (!saga || saga.status !== 'ACTIVE') return prev;
      return {
        ...prev,
        [traceId]: {
          ...saga,
          status: 'FAILED',
          duration: 'Cancelled',
          events: [
            ...saga.events,
            {
              id: `evt-${crypto.randomUUID()}`,
              service: 'Saga Orchestrator',
              event: 'SagaCancelledEvent',
              timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
              status: 'FAILED',
              message: 'Saga execution forcefully cancelled by operator.'
            }
          ]
        }
      };
    });
    setTransactions(prev => prev.map(tx => tx.sagaTraceId === traceId ? { ...tx, status: 'FAILED' } : tx));
  };

  const retrySaga = (traceId: string) => {
    setSagas(prev => {
      const saga = prev[traceId];
      if (!saga || saga.status !== 'FAILED') return prev;
      return {
        ...prev,
        [traceId]: {
          ...saga,
          status: 'ACTIVE',
          duration: 'Retrying...',
          events: [
            ...saga.events,
            {
              id: `evt-${crypto.randomUUID()}`,
              service: 'Saga Orchestrator',
              event: 'SagaRetryStartedEvent',
              timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
              status: 'SUCCESS',
              message: 'Operator initiated retry from last failed step.'
            }
          ]
        }
      };
    });
    setTransactions(prev => prev.map(tx => tx.sagaTraceId === traceId ? { ...tx, status: 'PENDING' } : tx));
  };

  const markAlertsRead = () => {
    setAlerts(prev => prev.map(al => ({ ...al, read: true })));
  };

  const clearAlerts = () => {
    setAlerts([]);
  };

  return (
    <SystemContext.Provider value={{
      transactions, sagas, queues, deadLetters, inventory, infra, syncData, simulateOrder, replayDeadLetter, deleteDeadLetter, triggerLoadSpike, restartService, cancelSaga, retrySaga, theme, toggleTheme, alerts, markAlertsRead, clearAlerts
    }}>
      {children}
    </SystemContext.Provider>
  );
};
