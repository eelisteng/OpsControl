import React, { useState } from 'react';
import { Server, Search, Filter, Warehouse, TrendingDown, AlertTriangle } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { useSystem } from '../../contexts/SystemContext';

export function InventoryView() {
  const { inventory } = useSystem();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredInventory = inventory.filter(item => 
    item.sku.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-full w-full relative animate-in fade-in duration-500 overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0 p-container space-y-container">
        
        {/* Header */}
        <div>
          <h2 className="text-h2 font-h2">Global Inventory</h2>
          <p className="text-body-sm text-outline mt-1">Real-time stock levels across all fulfillment zones.</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-container">
          <div className="bg-surface-container-lowest border border-outline-variant rounded p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
              <Warehouse size={20} />
            </div>
            <div>
              <p className="text-label-caps text-outline">Total SKUs</p>
              <p className="font-serif text-2xl text-on-surface">1,482</p>
            </div>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant rounded p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[var(--color-status-warning-bg)] flex items-center justify-center text-[var(--color-status-warning-text)]">
              <TrendingDown size={20} />
            </div>
            <div>
              <p className="text-label-caps text-outline">Low Stock Alerts</p>
              <p className="font-serif text-2xl text-on-surface">45</p>
            </div>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant rounded p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-error-container/20 border border-error/20 flex items-center justify-center text-error">
              <AlertTriangle size={20} />
            </div>
            <div>
              <p className="text-label-caps text-outline">Out of Stock</p>
              <p className="font-serif text-2xl text-on-surface">12</p>
            </div>
          </div>
        </div>

        {/* Table Area */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded overflow-hidden shadow-sm flex-1 flex flex-col min-h-0">
          
          {/* Table Toolbar */}
          <div className="p-4 border-b border-outline-variant flex items-center justify-between bg-surface-container-low/30">
            <div className="relative w-72">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
              <input 
                type="text" 
                placeholder="Search SKU or product name..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-surface border border-outline-variant rounded text-body-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 border border-outline-variant rounded text-body-sm text-on-surface hover:bg-surface-container transition-colors">
              <Filter size={14} />
              Filter
            </button>
          </div>

          {/* Table */}
          <div className="overflow-y-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-surface-container z-10 border-b border-outline-variant">
                <tr>
                  <th className="px-4 py-3 text-label-caps text-outline">SKU</th>
                  <th className="px-4 py-3 text-label-caps text-outline">Product Name</th>
                  <th className="px-4 py-3 text-label-caps text-outline">Location</th>
                  <th className="px-4 py-3 text-label-caps text-outline text-right">Available Stock</th>
                  <th className="px-4 py-3 text-label-caps text-outline">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                {filteredInventory.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-outline">
                      No stock found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredInventory.map((item) => {
                    let badgeStatus: any = 'COMPLETED';
                    if (item.status === 'LOW_STOCK') badgeStatus = 'PENDING';
                    if (item.status === 'OUT_OF_STOCK') badgeStatus = 'FAILED';

                    return (
                      <tr key={item.sku} className="h-12 hover:bg-surface-container-low transition-colors group cursor-pointer">
                        <td className="px-4 py-2 font-mono-data text-on-surface opacity-80">{item.sku}</td>
                        <td className="px-4 py-2 text-body-sm font-medium">{item.name}</td>
                        <td className="px-4 py-2 text-body-sm text-outline">{item.location}</td>
                        <td className="px-4 py-2 font-mono-data text-right">{item.stock}</td>
                        <td className="px-4 py-2">
                          <Badge status={badgeStatus} />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
