import { Transaction, SagaTrace } from '../types';

export const mockTransactions: Transaction[] = [
  { id: 'ORD-89C4F1', customer: 'Acme Corp', amount: 4250.00, status: 'COMPLETED', timestamp: '10:42:01 AM', sagaTraceId: 'trc-101' },
  { id: 'ORD-77A9B2', customer: 'Stark Industries', amount: 12800.50, status: 'PENDING', timestamp: '10:38:14 AM', sagaTraceId: 'trc-102' },
  { id: 'ORD-92D1E5', customer: 'Wayne Enterprises', amount: 850.00, status: 'FAILED', timestamp: '10:15:22 AM', sagaTraceId: 'trc-103' },
  { id: 'ORD-11B3C9', customer: 'Globex Corp', amount: 3100.25, status: 'COMPLETED', timestamp: '09:55:08 AM', sagaTraceId: 'trc-104' },
  { id: 'ORD-55X9P0', customer: 'Initech', amount: 95.00, status: 'DLQ', timestamp: '08:12:45 AM', sagaTraceId: 'trc-105' },
];

export const mockSagaData: Record<string, SagaTrace> = {
  'trc-101': {
    id: 'TRC-101',
    rootEntityId: 'ORD-89C4F1',
    status: 'COMPLETED',
    startTime: '10:42:01 AM',
    duration: '2.1s',
    events: [
      {
        id: 'evt-101-1',
        service: 'Order Svc',
        event: 'OrderCreatedEvent',
        timestamp: '10:42:01.050 AM',
        status: 'SUCCESS',
        message: 'Order Created successfully.',
      },
      {
        id: 'evt-101-2',
        service: 'Inventory Svc',
        event: 'StockReservedEvent',
        timestamp: '10:42:01.850 AM',
        status: 'SUCCESS',
        message: 'Inventory Locked for items.',
      },
      {
        id: 'evt-101-3',
        service: 'Payment Svc',
        event: 'PaymentProcessed',
        timestamp: '10:42:03.150 AM',
        status: 'SUCCESS',
        message: 'Payment settled.',
      }
    ]
  },
  'trc-102': {
    id: 'TRC-89C4F1',
    rootEntityId: 'ORD-77A9B2',
    status: 'ACTIVE',
    startTime: '10:38:14 AM',
    duration: '1m 24s (Active)',
    events: [
      {
        id: 'evt-1',
        service: 'Order Svc',
        event: 'OrderCreatedEvent',
        timestamp: '10:38:14.002 AM',
        status: 'SUCCESS',
        message: 'Order Created successfully published to exchange.',
        payload: { service: "order-api", event: "OrderCreatedEvent", orderId: "ORD-77A9B2" }
      },
      {
        id: 'evt-2',
        service: 'Inventory Svc',
        event: 'StockReservedEvent',
        timestamp: '10:38:14.450 AM',
        status: 'SUCCESS',
        message: 'Inventory Locked for items.',
      },
      {
        id: 'evt-3',
        service: 'Payment Svc',
        event: 'PaymentProcessing',
        timestamp: '10:38:15.100 AM',
        status: 'PENDING',
        message: 'Awaiting gateway callback from Stripe. Timeout in 3m 36s.',
      }
    ]
  },
  'trc-103': {
    id: 'TRC-92D1E5',
    rootEntityId: 'ORD-92D1E5',
    status: 'FAILED',
    startTime: '10:15:22 AM',
    duration: '850ms',
    events: [
      {
        id: 'evt-1',
        service: 'Order Svc',
        event: 'OrderCreatedEvent',
        timestamp: '10:15:22.000 AM',
        status: 'SUCCESS',
        message: 'Order Created',
      },
      {
        id: 'evt-2',
        service: 'Inventory Svc',
        event: 'StockFailedEvent',
        timestamp: '10:15:22.850 AM',
        status: 'FAILED',
        message: 'Insufficient stock to fulfill order. Compensating transactions initiated.',
      }
    ]
  },
  'trc-104': {
    id: 'TRC-104',
    rootEntityId: 'ORD-11B3C9',
    status: 'COMPLETED',
    startTime: '09:55:08 AM',
    duration: '1.4s',
    events: [
      {
        id: 'evt-104-1',
        service: 'Order Svc',
        event: 'OrderCreatedEvent',
        timestamp: '09:55:08.000 AM',
        status: 'SUCCESS',
        message: 'Order Created',
      },
      {
        id: 'evt-104-2',
        service: 'Payment Svc',
        event: 'PaymentProcessed',
        timestamp: '09:55:09.400 AM',
        status: 'SUCCESS',
        message: 'Payment verified successfully.',
      }
    ]
  },
  'trc-105': {
    id: 'TRC-105',
    rootEntityId: 'ORD-55X9P0',
    status: 'FAILED',
    startTime: '08:12:45 AM',
    duration: 'Timeout',
    events: [
      {
        id: 'evt-105-1',
        service: 'API Gateway',
        event: 'HttpRequestReceived',
        timestamp: '08:12:45.000 AM',
        status: 'SUCCESS',
        message: 'Received order payload.'
      },
      {
        id: 'evt-105-2',
        service: 'Order Svc',
        event: 'OrderCreatedEvent',
        timestamp: '08:12:45.050 AM',
        status: 'FAILED',
        message: 'Database constraint violation. Sent to DLQ.',
      }
    ]
  }
};
