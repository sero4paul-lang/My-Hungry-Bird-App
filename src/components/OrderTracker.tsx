import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Clock, CheckCircle2, RefreshCw, Phone, ArrowUpRight, ShieldCheck, ShoppingBag, HelpCircle } from 'lucide-react';
import { SimulatedOrder } from '../types';
import { WHATSAPP_NUMBER } from '../constants';

interface OrderTrackerProps {
  onReorder: (packageName: string, quantity: number, recName: string, recPhone: string, recLocation: string, note: string) => void;
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({ onReorder }) => {
  const [orders, setOrders] = useState<SimulatedOrder[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Load orders from localStorage
  const loadOrders = () => {
    try {
      const saved = localStorage.getItem('hungry_bird_orders');
      if (saved) {
        setOrders(JSON.parse(saved));
      } else {
        setOrders([]);
      }
    } catch (e) {
      console.error('Error loading orders', e);
    }
  };

  useEffect(() => {
    loadOrders();
    // Poll changes or listen to custom event to keep updated
    window.addEventListener('hb_order_created', loadOrders);
    return () => {
      window.removeEventListener('hb_order_created', loadOrders);
    };
  }, []);

  // Set default selected order if none of them are selected
  useEffect(() => {
    if (orders.length > 0 && !selectedOrderId) {
      setSelectedOrderId(orders[0].id);
    }
  }, [orders, selectedOrderId]);

  // Create a simulated demo order so users have immediate access to tracking
  const handleLoadDemo = () => {
    const demo: SimulatedOrder = {
      id: `HB-${Math.floor(1000 + Math.random() * 9000)}`,
      packageName: 'Breakfast Support Pack',
      quantity: 1,
      receiverName: 'Ada Lovelace',
      receiverPhone: '+234 812 345 6789',
      receiverLocation: 'Lekki Phase 1, Lagos',
      note: 'Stay energized and motivated! Happy lunch!',
      paymentMethod: 'verse',
      total: 4500,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'cooking',
      lastUpdated: Date.now()
    };
    const updated = [demo, ...orders];
    localStorage.setItem('hungry_bird_orders', JSON.stringify(updated));
    setOrders(updated);
    setSelectedOrderId(demo.id);
  };

  const handleSimulateStatus = () => {
    if (!selectedOrderId) return;
    const updated = orders.map(o => {
      if (o.id === selectedOrderId) {
        let nextStatus: SimulatedOrder['status'] = 'placed';
        if (o.status === 'placed') nextStatus = 'cooking';
        else if (o.status === 'cooking') nextStatus = 'dispatched';
        else if (o.status === 'dispatched') nextStatus = 'delivered';
        else nextStatus = 'placed'; // loop back for testing
        return { ...o, status: nextStatus, lastUpdated: Date.now() };
      }
      return o;
    });
    localStorage.setItem('hungry_bird_orders', JSON.stringify(updated));
    setOrders(updated);
  };

  const activeOrder = orders.find(o => o.id === selectedOrderId);

  // Build the timeline stages based on state
  const getTimelineSteps = (status: SimulatedOrder['status']) => {
    const steps = [
      { id: 'placed', label: 'Order Sent', desc: 'Securely dispatched to kitchen', time: 'Just now' },
      { id: 'cooking', label: 'Ingredients Curation', desc: 'Chefs hand-preparing gourmet pack', time: 'In progress' },
      { id: 'dispatched', label: 'Rider Dispatched', desc: 'On its way with express courier', time: 'En route' },
      { id: 'delivered', label: 'Order Delivered', desc: 'Safely arrived & handed over. Enjoy!', time: 'Completed' }
    ];

    const statusIndex = steps.findIndex(s => s.id === status);
    return steps.map((s, index) => ({
      ...s,
      isCompleted: index < statusIndex,
      isActive: index === statusIndex,
      isPending: index > statusIndex
    }));
  };

  return (
    <div className="bg-white/[0.06] backdrop-blur-[12px] mx-4 p-6 rounded-[20px] border border-white/10 shadow-[0_6px_20px_rgba(0,0,0,0.3)] text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="text-[#b084ff]" size={22} />
          <h3 className="text-xl font-black tracking-tight">Order Status Tracker</h3>
        </div>
        {orders.length > 0 && (
          <button
            type="button"
            onClick={loadOrders}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-all"
            title="Refresh order logs"
          >
            <RefreshCw size={14} className="text-gray-300" />
          </button>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="p-6 text-center border border-dashed border-white/20 rounded-xl">
          <ShoppingBag className="mx-auto text-gray-400 mb-3 grayscale opacity-65" size={32} />
          <h4 className="font-bold text-sm text-gray-200">No active orders found on this device</h4>
          <p className="text-[11px] text-gray-400 mt-2 mb-4 leading-relaxed max-w-sm mx-auto">
            Gifting checkouts are tracked using secure local sandboxing. Submit an order form or spawn a simulated demo order to experience the live timeline.
          </p>
          <button
            type="button"
            onClick={handleLoadDemo}
            className="px-4 py-2 bg-[#7b2ff7]/30 hover:bg-[#7b2ff7]/40 border border-[#7b2ff7]/50 rounded-lg text-xs font-semibold text-white tracking-wide active:scale-95 transition-all"
          >
            Spawn Interactive Demo Track
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Order drop down list */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1 font-mono">Select Order to Track</label>
            <select
              value={selectedOrderId || ''}
              onChange={(e) => setSelectedOrderId(e.target.value)}
              className="w-full p-2.5 rounded-lg border-none bg-white/10 text-white focus:ring-0 text-xs font-mono font-medium tracking-wide"
            >
              {orders.map(o => (
                <option key={o.id} value={o.id} className="bg-[#1a0f2c]">
                  [{o.id}] {o.packageName} • {o.timestamp}
                </option>
              ))}
            </select>
          </div>

          {activeOrder && (
            <div className="pt-2">
              {/* Order Info Cards */}
              <div className="p-4 bg-white/5 rounded-xl border border-white/10 mb-5 relative overflow-hidden">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold bg-[#7b2ff7]/30 text-[#d8c3ff] px-2 py-0.5 rounded">
                      {activeOrder.id}
                    </span>
                    <h4 className="font-black text-sm text-white mt-1.5">{activeOrder.packageName}</h4>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-[#b084ff]">₦{activeOrder.total.toLocaleString()}</p>
                    <p className="text-[9px] text-gray-400 font-mono mt-0.5">Qty: {activeOrder.quantity}</p>
                  </div>
                </div>

                <div className="text-[11px] text-gray-300 space-y-1 mt-3 pt-3 border-t border-white/5">
                  <p><b className="text-gray-400">Recipient:</b> {activeOrder.receiverName}</p>
                  <p><b className="text-gray-400">Phone:</b> {activeOrder.receiverPhone}</p>
                  <p><b className="text-gray-400">Location:</b> {activeOrder.receiverLocation}</p>
                  {activeOrder.note && <p className="italic text-gray-450 mt-1">"{activeOrder.note}"</p>}
                </div>

                {/* Simulate Button to allow testing */}
                <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                  <span className="text-[9px] text-gray-400 font-medium">Test other delivery steps:</span>
                  <button
                    type="button"
                    onClick={handleSimulateStatus}
                    className="px-2.5 py-1 bg-white/10 hover:bg-white/15 rounded text-[10px] font-bold tracking-tight active:scale-95 transition-all text-[#b084ff]"
                  >
                    Simulate Next Stage ⭐
                  </button>
                </div>
              </div>

              {/* High-Fidelity Interactive Timeline */}
              <div className="space-y-4 pl-3 relative border-l-2 border-dashed border-white/10 ml-2">
                {getTimelineSteps(activeOrder.status).map((step, idx) => (
                  <div key={step.id} className="relative pl-6">
                    {/* Circle Node indicator */}
                    <span className={`absolute -left-[11px] top-1.5 w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                      step.isCompleted 
                        ? 'bg-[#7b2ff7] border-[#7b2ff7] text-white shadow-[0_0_10px_rgba(123,47,247,0.6)]' 
                        : step.isActive 
                        ? 'bg-[#1a0f2c] border-[#b084ff] text-[#b084ff] animate-pulse' 
                        : 'bg-[#1a0f2c] border-white/25 text-gray-400'
                    }`}>
                      {step.isCompleted ? (
                        <CheckCircle2 size={11} className="stroke-[3]" />
                      ) : (
                        <span className={`w-1.5 h-1.5 rounded-full ${step.isActive ? 'bg-[#b084ff]' : 'bg-white/20'}`} />
                      )}
                    </span>

                    {/* Content information */}
                    <div className="min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h5 className={`text-xs font-black ${step.isActive ? 'text-[#b084ff]' : step.isCompleted ? 'text-white' : 'text-white/40'}`}>
                          {step.label}
                        </h5>
                        <span className="text-[9px] text-gray-500 font-mono font-bold uppercase">{step.time}</span>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5 leading-normal max-w-sm">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 1-Click Reorder Button */}
              <div className="mt-6 pt-4 border-t border-white/5 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => onReorder(
                    activeOrder.packageName,
                    activeOrder.quantity,
                    activeOrder.receiverName,
                    activeOrder.receiverPhone,
                    activeOrder.receiverLocation,
                    activeOrder.note
                  )}
                  className="flex-1 flex items-center justify-center gap-1 bg-white/10 hover:bg-white/15 text-white p-2.5 rounded-xl text-xs font-black active:scale-95 transition-all"
                >
                  <RefreshCw size={13} />
                  Repeat Gifting pack (1-Click Fill)
                </button>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Hungry%20Bird%2C%20I%20am%20enquiring%20about%20Order%20${activeOrder.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1 bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/50 text-white p-2.5 rounded-xl text-xs font-black active:scale-95 transition-all"
                >
                  Contact Kitchen
                  <ArrowUpRight size={13} />
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
