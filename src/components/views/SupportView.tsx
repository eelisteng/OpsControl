import React from 'react';
import { HelpCircle, Book, LifeBuoy, MessageSquare, ExternalLink, FileText } from 'lucide-react';

export function SupportView() {
  return (
    <div className="flex flex-col h-full w-full relative animate-in fade-in duration-500 overflow-hidden p-container space-y-container">
      {/* Header */}
      <div>
        <h2 className="text-h2 font-h2 flex items-center gap-2">
          <HelpCircle size={24} className="text-primary" />
          Help & Support
        </h2>
        <p className="text-body-sm text-outline mt-1">Access documentation, request technical assistance, and find troubleshooting guides.</p>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-container mt-4">
        
        {/* Doc Card */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded p-6 shadow-sm hover:border-primary/50 transition-colors cursor-pointer group flex flex-col gap-4">
          <div className="w-12 h-12 rounded bg-primary-container/20 border border-[var(--color-primary)]/20 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
            <Book size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-on-surface mb-2">Platform Documentation</h3>
            <p className="text-body-sm text-outline leading-relaxed">Comprehensive guides on setting up the API Gateway, managing Saga chains, and scaling RabbitMQ consumers.</p>
          </div>
          <div className="mt-auto pt-4 flex items-center text-primary text-sm font-medium">
            Read Docs <ExternalLink size={14} className="ml-1" />
          </div>
        </div>

        {/* Support Ticket Card */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded p-6 shadow-sm hover:border-emerald-500/50 transition-colors cursor-pointer group flex flex-col gap-4">
          <div className="w-12 h-12 rounded bg-[var(--color-status-success-bg)] flex items-center justify-center text-[var(--color-status-success-text)] group-hover:scale-110 transition-transform">
            <LifeBuoy size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-on-surface mb-2">Submit a Ticket</h3>
            <p className="text-body-sm text-outline leading-relaxed">Facing a critical incident or infrastructure outage? Open a priority ticket with our SRE layer 2 team.</p>
          </div>
          <div className="mt-auto pt-4 flex items-center text-[var(--color-status-success-text)] text-sm font-medium">
            Create Ticket <ExternalLink size={14} className="ml-1" />
          </div>
        </div>

        {/* Community Card */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded p-6 shadow-sm hover:border-blue-500/50 transition-colors cursor-pointer group flex flex-col gap-4">
          <div className="w-12 h-12 rounded bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
            <MessageSquare size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-on-surface mb-2">Internal SME Chat</h3>
            <p className="text-body-sm text-outline leading-relaxed">Connect with Subject Matter Experts in the internal Slack channel for quick queries about the event schemas.</p>
          </div>
          <div className="mt-auto pt-4 flex items-center text-blue-500 text-sm font-medium">
            Open Slack <ExternalLink size={14} className="ml-1" />
          </div>
        </div>

        {/* Runbooks Card */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded p-6 shadow-sm hover:border-[var(--color-status-warning-text)]/50 transition-colors cursor-pointer group flex flex-col gap-4">
          <div className="w-12 h-12 rounded bg-[var(--color-status-warning-bg)] flex items-center justify-center text-[var(--color-status-warning-text)] group-hover:scale-110 transition-transform">
            <FileText size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-on-surface mb-2">Incident Runbooks</h3>
            <p className="text-body-sm text-outline leading-relaxed">Step-by-step Standard Operating Procedures for handling DLQ overflows, Redis memory evictions, and circuit breaker trips.</p>
          </div>
          <div className="mt-auto pt-4 flex items-center text-[var(--color-status-warning-text)] text-sm font-medium">
            Browse Runbooks <ExternalLink size={14} className="ml-1" />
          </div>
        </div>

      </div>
    </div>
  );
}
