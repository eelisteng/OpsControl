import React from 'react';
import { Activity, Server, HardDrive, Cpu, AlertTriangle, RefreshCw, Zap, RotateCcw } from 'lucide-react';
import { useSystem } from '../../contexts/SystemContext';

export function InfrastructureMonitor() {
  const { infra, transactions, syncData, triggerLoadSpike, restartService } = useSystem();

  return (
    <div className="flex flex-col gap-container animate-in fade-in duration-500 max-w-[1400px] mx-auto p-container pb-8 overflow-y-auto">
      
      {/* Header */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-h2 font-h2">Infrastructure Health</h2>
          <p className="text-body-sm text-outline mt-1">Real-time telemetry and cluster overview.</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2 text-mono-data font-mono-data text-outline">
             {infra.clusterCpu > 90 ? (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                  High Load Detected
                </>
             ) : (
                <>
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                  All Systems Operational
                </>
             )}
          </span>
          <button onClick={triggerLoadSpike} className="flex items-center gap-2 px-3 py-2 border border-error text-error bg-error-container/10 rounded text-body-sm font-medium hover:bg-error-container/20 transition-colors">
            <Zap size={16} />
            Stress Test
          </button>
          <button onClick={syncData} className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded text-body-sm font-medium hover:bg-primary/90 transition-colors">
            <RefreshCw size={16} />
            Sync
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-container">
        
        {/* Service Mesh Topology Card */}
        <div className="col-span-1 md:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-lg p-card shadow-sm flex flex-col">
           <div className="flex justify-between items-center mb-6">
            <h3 className="text-h3 font-h3 text-primary flex items-center gap-2">
              <Server size={20} className="text-outline" />
              Service Mesh Topology
            </h3>
          </div>

          {/* Abstract Topology Map */}
          <div className="flex-1 min-h-[350px] bg-surface border border-outline-variant rounded p-6 relative flex flex-col items-center justify-center overflow-hidden">
            
            {/* API Gateway */}
            <div className="z-10 relative flex flex-col items-center mb-16">
              <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 w-48 text-center shadow-sm relative group cursor-default tracking-wide font-medium">
                <div className="mx-auto w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                  <Activity size={20} className="text-blue-700" />
                </div>
                <div className="text-label-caps text-on-surface">API Gateway</div>
                <div className="text-[10px] font-mono-data text-outline mt-1 tracking-wider">req: <span className={`${Number(infra.apiReqRate.split('k')[0]) > 4 ? 'text-red-500 animate-pulse' : ''}`}>{infra.apiReqRate}</span></div>
              </div>
              {/* Vertical line down */}
              <div className="absolute top-full left-1/2 w-px h-16 border-l-2 border-dashed border-outline-variant -translate-x-1/2"></div>
            </div>

            {/* Horizontal Line connecting services */}
            <div className="absolute top-[60%] w-3/4 max-w-2xl h-px border-t-2 border-dashed border-outline-variant -z-10 mt-1"></div>

            {/* Microservices */}
            <div className="z-10 flex flex-wrap gap-6 sm:gap-12 w-full justify-center">
              {infra.services.map((svc) => (
                <div key={svc.name} className={`group bg-surface-container-lowest border rounded-lg p-4 w-36 text-center shadow-sm relative transition-all duration-300
                  ${svc.status === 'warn' ? 'border-amber-400/50 ring-1 ring-amber-500/20' : ''}
                  ${svc.status === 'error' ? 'border-red-500 ring-1 ring-red-500/40 opacity-70' : ''}
                  ${svc.status === 'restarting' ? 'border-blue-400 rotate-1 opacity-80' : 'border-outline-variant'}
                  `}>
                  
                  {/* Status Indicator Dot */}
                  {svc.status === 'warn' && (
                    <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-amber-500 rounded-full border-2 border-surface-container-lowest cursor-help" title="High Latency"></div>
                  )}
                  {svc.status === 'error' && (
                    <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-red-500 rounded-full border-2 border-surface-container-lowest animate-pulse cursor-help" title="Unresponsive"></div>
                  )}
                  {svc.status === 'restarting' && (
                    <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-blue-500 rounded-full border-2 border-surface-container-lowest animate-ping"></div>
                  )}
                  {svc.status === 'ok' && (
                    <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-green-500 rounded-full border-2 border-surface-container-lowest"></div>
                  )}
                  
                  {/* Restart Overlay Button on Hover */}
                  <div className="absolute inset-0 bg-surface-container-lowest/80 backdrop-blur-[1px] hidden group-hover:flex items-center justify-center rounded-lg z-20">
                     <button
                        onClick={() => restartService(svc.name)}
                        disabled={svc.status === 'restarting'}
                        className="px-3 py-1.5 bg-surface text-on-surface border border-outline-variant rounded flex items-center gap-2 hover:bg-surface-container-low transition-colors shadow-sm text-xs"
                     >
                       <RotateCcw size={14} className={svc.status === 'restarting' ? 'animate-spin' : ''} />
                       {svc.status === 'restarting' ? 'Booting...' : 'Restart'}
                     </button>
                  </div>
                  
                  <div className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center mb-2 
                    ${svc.status === 'warn' ? 'bg-amber-100 text-amber-600' : ''}
                    ${svc.status === 'error' ? 'bg-red-100 text-red-600' : ''}
                    ${svc.status === 'restarting' ? 'bg-blue-100 text-blue-600' : ''}
                    ${svc.status === 'ok' ? 'bg-surface-container text-on-surface-variant' : ''}
                  `}>
                    <Server size={16} />
                  </div>
                  <div className="text-label-caps text-on-surface truncate font-semibold">{svc.name}</div>
                  <div className={`text-[10px] font-mono-data mt-1 tracking-wider transition-colors 
                    ${svc.status === 'warn' ? 'text-amber-600' : ''}
                    ${svc.status === 'error' ? 'text-red-500 font-bold' : ''}
                    ${svc.status === 'restarting' ? 'text-blue-500' : ''}
                    ${svc.status === 'ok' ? 'text-outline' : ''}
                  `}>
                    {svc.status === 'restarting' ? 'pending' : `lat: ${svc.lat}`}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Redis & Resource Utilization Column */}
        <div className="col-span-1 md:col-span-4 flex flex-col gap-container">
          
          {/* Redis Cache */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-card shadow-sm flex-1">
             <div className="flex items-center gap-2 mb-6">
              <HardDrive size={20} className="text-outline" />
              <h3 className="text-h3 font-h3 text-primary">Redis Cache</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-label-caps text-outline">Hit/Miss Ratio</span>
                  <span className={`text-mono-data text-lg font-bold ${infra.redisHitRatio < 90 ? 'text-amber-500' : ''}`}>{infra.redisHitRatio}%</span>
                </div>
                <div className="h-2 w-full bg-surface-container rounded-full flex overflow-hidden">
                  <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${infra.redisHitRatio}%` }}></div>
                  <div className="h-full bg-rose-400 transition-all duration-500" style={{ width: `${100 - infra.redisHitRatio}%` }}></div>
                </div>
                <div className="flex justify-between mt-2 text-[10px] font-mono-data">
                  <span className="text-emerald-600">Hits: 842k</span>
                  <span className="text-rose-500">Misses: 51k</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-label-caps text-outline">Memory Usage</span>
                  <span className="text-mono-data text-lg font-bold">{infra.redisMemoryGb} GB</span>
                </div>
                <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-500 ${infra.redisMemoryGb > 3.5 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${(infra.redisMemoryGb / 4) * 100}%` }}></div>
                </div>
                <div className="mt-2 text-[10px] font-mono-data text-outline text-right">
                  Limit: 4.0 GB
                </div>
              </div>
            </div>
          </div>

          {/* Docker Cluster */}
          <div className={`bg-inverse-surface border ${infra.clusterCpu > 90 ? 'border-red-500/50' : 'border-outline-variant'} rounded-lg p-card shadow-sm flex-1 text-inverse-on-surface transition-colors duration-500`}>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Cpu size={20} className={infra.clusterCpu > 90 ? 'text-red-400' : 'text-outline-variant'} />
                <h3 className="text-h3 font-h3 text-inverse-on-surface">Cluster CPU</h3>
              </div>
              <span className="px-2 py-0.5 border border-outline-variant rounded text-[10px] font-mono-data text-outline-variant uppercase">Production</span>
            </div>

            <div className="flex items-end gap-3 mb-4">
               <span className={`text-3xl font-mono-data font-light ${infra.clusterCpu > 90 ? 'text-red-400' : 'text-inverse-on-surface'}`}>{infra.clusterCpu}%</span>
               <span className="text-body-sm text-outline-variant mb-1">Utilization</span>
            </div>

            {/* Bar Chart Simulation */}
            <div className="flex items-end gap-1 h-12 w-full">
              {infra.cpuHistory.map((val, i) => (
                <div key={i} className={`flex-1 rounded-t-sm transition-all duration-500 ${val > 90 ? 'bg-red-500/80' : 'bg-surface/20'}`} style={{ height: `${val}%` }}></div>
              ))}
            </div>
            {/* Time range labels */}
            <div className="flex justify-between mt-2 text-[9px] text-outline-variant font-mono-data uppercase tracking-widest">
              <span>-10m</span>
              <span>Now</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
