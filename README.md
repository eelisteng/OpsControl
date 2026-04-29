# OmniVortex / OpsControl Dashboard 
**Event-Driven Microservices Monitoring System | 事件驱动微服务监控系统**

## 📖 Description | 项目简介

### English
This project is a sophisticated, dark-themed frontend dashboard designed to monitor and manage an event-driven microservices architecture. It provides real-time visibility into infrastructure health, distributed transaction tracing (Saga pattern), message queues (RabbitMQ), and global inventory status.

### 中文
本项目是一个采用精致暗黑主题的前端监控仪表盘，专为监控和管理事件驱动的微服务架构而设计。它提供了对基础设施健康状况、分布式事务链路追踪（Saga模式）、消息队列（RabbitMQ）以及全局库存状态的实时可视化监控功能。

## 🏗 Architecture | 系统架构

### English
The system simulates the monitoring layer of a complex backend infrastructure:
- **API Gateway**: Entry point for all client requests.
- **Microservices**: 
  - **Order Service**: Manages order creation and lifecycle.
  - **Payment Service**: Handles payment processing and settlement.
  - **Inventory Service**: Manages stock reservation and updates.
- **Message Broker (RabbitMQ)**: Facilitates asynchronous event-driven communication between services. Handles dead-letter queues (DLQ) for failed messages.
- **Caching Layer (Redis)**: Speeds up data retrieval and provides high-performance data storage.
- **Deployment**: containerized services orchestrated via Docker Compose.

### 中文
系统模拟了复杂后端基础设施的监控层：
- **API Gateway (API网关)**: 所有客户端请求的入口点。
- **Microservices (微服务)**:
  - **Order Service (订单服务)**: 管理订单创建和生命周期。
  - **Payment Service (支付服务)**: 处理支付和结算。
  - **Inventory Service (库存服务)**: 管理库存预留和更新。
- **Message Broker (消息中间件 - RabbitMQ)**: 促进服务之间异步的事件驱动通信，并处理失败消息的死信队列 (DLQ)。
- **Caching Layer (缓存层 - Redis)**: 加速数据检索并提供高性能的数据存储。
- **Deployment (部署)**: 通过 Docker Compose 进行容器化服务编排。

## 🌟 Key Features | 核心功能

1. **Infrastructure Monitoring (基础设施监控)**: Real-time telemetry for CPU, Memory, Redis hit ratio, and API request rates. (实时遥测CPU、内存、Redis命中率和API请求率)
2. **Transaction Tracing (事务追踪 - Saga Pattern)**: Deep insight into distributed transactions, tracing events across multiple microservices to resolve failures. (深入洞察分布式事务，追踪跨多个微服务的事件以解决故障)
3. **Queue & DLQ Management (队列与死信管理)**: Monitor RabbitMQ queues and manage dead letters for message replay and troubleshooting. (监控RabbitMQ队列并管理死信，用于消息重放和故障排除)
4. **Inventory Visualization (库存可视化)**: Global view of stock levels across different warehouse zones. (不同仓库区域库存水平的全局视图)

## 🛠 Tech Stack | 技术栈

### English
- **Frontend Dashboard**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Motion (Framer)
- **Target Backend Architecture (Simulated)**: 
  - .NET Web API
  - RabbitMQ
  - Redis
  - Docker Compose

### 中文
- **前端仪表盘**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Motion (Framer)
- **目标后端架构 (模拟)**: 
  - .NET Web API
  - RabbitMQ
  - Redis
  - Docker Compose

## 🎨 UI Design | 界面设计

### English
The UI implements a "Sophisticated Dark" aesthetic, utilizing:
- Monospaced typography for telemetry data to enhance readability.
- High-contrast status indicators (Emerald for Healthy, Rose/Red for Errors, Amber/Gold for Warnings).
- Dense, data-rich layouts suitable for NOC (Network Operations Center) environments.

### 中文
UI 采用了“精致暗黑” (Sophisticated Dark) 美学设计，使用了：
- 用于遥测数据的等宽字体，以提高数据可读性。
- 高对比度的状态指示器（翠绿色表示健康，玫瑰红/红色表示错误，琥珀色/金色表示警告）。
- 适用于 NOC（网络运行中心）环境的数据密集型布局。
