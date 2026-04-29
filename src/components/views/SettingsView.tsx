import React from 'react';
import { Settings, Save, Shield, Database, Globe } from 'lucide-react';

export function SettingsView() {
  return (
    <div className="flex flex-col h-full w-full relative animate-in fade-in duration-500 overflow-hidden p-container space-y-container">
      {/* Header */}
      <div>
        <h2 className="text-h2 font-h2 flex items-center gap-2">
          <Settings size={24} className="text-primary" />
          System Settings
        </h2>
        <p className="text-body-sm text-outline mt-1">Configure OmniVortex platform preferences and backend connection parameters.</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto min-h-0 bg-surface-container-lowest border border-outline-variant rounded shadow-sm p-6 space-y-8">
        
        {/* Connection Settings */}
        <section>
          <h3 className="text-h3 font-h3 mb-4 flex items-center gap-2 border-b border-outline-variant pb-2">
            <Globe size={18} className="text-outline" />
            API & Endpoint Configuration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-label-caps text-outline block">API Gateway URL</label>
              <input type="text" defaultValue="https://api.gateway.omnivortex.internal" className="w-full px-3 py-2 bg-surface border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none text-body-sm text-on-surface" />
            </div>
            <div className="space-y-2">
              <label className="text-label-caps text-outline block">GraphQL Endpoint</label>
              <input type="text" defaultValue="wss://graphql.omnivortex.internal/subscriptions" className="w-full px-3 py-2 bg-surface border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none text-body-sm text-on-surface" />
            </div>
          </div>
        </section>

        {/* Database & Broker */}
        <section>
          <h3 className="text-h3 font-h3 mb-4 flex items-center gap-2 border-b border-outline-variant pb-2">
            <Database size={18} className="text-outline" />
            Message Broker & Caching
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-label-caps text-outline block">RabbitMQ Host</label>
              <input type="text" defaultValue="amqp://rabbitmq-cluster:5672" className="w-full px-3 py-2 bg-surface text-on-surface border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none text-body-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-label-caps text-outline block">Redis Connection String</label>
              <input type="password" defaultValue="redis://cluster:6379" className="w-full px-3 py-2 bg-surface text-on-surface border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary outline-none text-body-sm" />
            </div>
          </div>
        </section>

        {/* Security & Access */}
        <section>
          <h3 className="text-h3 font-h3 mb-4 flex items-center gap-2 border-b border-outline-variant pb-2">
            <Shield size={18} className="text-outline" />
            Security
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-surface-container rounded border border-outline-variant">
              <div>
                <div className="font-medium text-body-sm text-on-surface">Require MFA for destructive actions</div>
                <div className="text-xs text-outline mt-1">Prompt for two-factor authentication before manual queue purges or DLQ replays.</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-9 h-5 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </section>

      </div>
      
      {/* Footer / Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <button className="px-4 py-2 border border-outline-variant text-on-surface rounded hover:bg-surface-container transition-colors text-body-sm font-medium">
          Cancel
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded hover:bg-primary/90 transition-colors text-body-sm font-medium">
          <Save size={16} />
          Save Configurations
        </button>
      </div>
    </div>
  );
}
