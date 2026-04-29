export type ViewState = 'infrastructure' | 'transactions' | 'dlq' | 'inventory' | 'audit' | 'settings' | 'support';

export interface Transaction {
  id: string;
  customer: string;
  amount: number;
  status: 'COMPLETED' | 'PENDING' | 'FAILED' | 'DLQ';
  timestamp: string;
  sagaTraceId?: string;
}

export interface TraceEvent {
  id: string;
  service: string;
  event: string;
  timestamp: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  message: string;
  payload?: any;
}

export interface SagaTrace {
  id: string;
  rootEntityId: string;
  status: 'COMPLETED' | 'ACTIVE' | 'FAILED';
  startTime: string;
  duration: string;
  events: TraceEvent[];
}

export interface QueueStat {
  name: string;
  messages: number;
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  dlq: number;
}

export interface DeadLetter {
  id: string;
  queue: string;
  reason: string;
  timestamp: string;
}

export interface InventoryItem {
  sku: string;
  name: string;
  stock: number;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  location: string;
}

export interface SystemAlert {
  id: string;
  message: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error';
  read: boolean;
}

export interface InfraStats {
  apiReqRate: string;
  redisHitRatio: number;
  redisMemoryGb: number;
  clusterCpu: number;
  cpuHistory: number[];
  services: {
    name: string;
    icon: any;
    lat: string;
    status: 'ok' | 'warn' | 'error' | 'restarting';
  }[];
}
