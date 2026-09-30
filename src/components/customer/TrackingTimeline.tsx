import React from 'react';
import { Check, Clock, Package, Truck, CheckCircle2, XCircle, Home } from 'lucide-react';
import { OrderStatus, TrackingEvent } from '../../types';

interface TrackingTimelineProps {
  events: TrackingEvent[];
  currentStatus: OrderStatus;
}

export const TrackingTimeline: React.FC<TrackingTimelineProps> = ({ events, currentStatus }) => {
  const steps: { status: OrderStatus; label: string; icon: React.ElementType }[] = [
    { status: 'PLACED', label: 'Order Placed', icon: Package },
    { status: 'CONFIRMED', label: 'Order Confirmed', icon: Check },
    { status: 'PROCESSING', label: 'Processing', icon: Clock },
    { status: 'DISPATCHED', label: 'Dispatched', icon: Truck },
    { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Truck },
    { status: 'DELIVERED', label: 'Delivered', icon: Home },
  ];

  if (currentStatus === 'CANCELLED') {
    const cancelEvt = events.find((e) => e.status === 'CANCELLED');
    return (
      <div className="p-6 bg-rose-50 border border-rose-200 rounded-xl text-center space-y-2">
        <XCircle className="w-10 h-10 text-rose-600 mx-auto" />
        <h4 className="font-bold text-rose-900 text-base">Order Cancelled</h4>
        <p className="text-xs text-rose-700 max-w-md mx-auto">
          {cancelEvt?.description || 'This order was cancelled. Please contact customer care for details.'}
        </p>
        {cancelEvt?.date && (
          <p className="text-[11px] text-rose-600 font-medium">
            Cancelled on {cancelEvt.date} at {cancelEvt.time}
          </p>
        )}
      </div>
    );
  }

  const currentIdx = steps.findIndex((s) => s.status === currentStatus);

  return (
    <div className="space-y-6">
      {/* Horizontal Step Bar (Desktop) */}
      <div className="hidden md:flex items-center justify-between relative px-2">
        <div className="absolute top-4 left-6 right-6 h-1 bg-stone-200 -z-0">
          <div
            className="h-full bg-emerald-700 transition-all duration-500"
            style={{
              width: `${(Math.max(0, currentIdx) / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {steps.map((step, idx) => {
          const isCompleted = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          const Icon = step.icon;

          return (
            <div key={step.status} className="flex flex-col items-center relative z-10">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors shadow-sm ${
                  isCompleted
                    ? 'bg-emerald-700 text-white'
                    : isCurrent
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                    : 'bg-white border-2 border-stone-300 text-stone-400'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : <Icon className="w-4 h-4" />}
              </div>
              <span
                className={`mt-2 text-xs font-semibold ${
                  isCurrent ? 'text-emerald-900 font-bold' : isCompleted ? 'text-stone-700' : 'text-stone-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Detailed Event Log Cards (Vertical for All Screens) */}
      <div className="space-y-4 pt-4 border-t border-stone-200">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">Tracking History</h4>
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
          {events.map((evt) => (
            <div key={evt.id} className="relative group">
              <div
                className={`absolute -left-[27px] top-0.5 w-4 h-4 rounded-full border-2 bg-white ${
                  evt.completed ? 'border-emerald-600 bg-emerald-600' : 'border-stone-300'
                }`}
              />
              <div className="bg-stone-50 hover:bg-stone-100/70 border border-stone-200/80 rounded-lg p-3 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-stone-900">{evt.title}</span>
                  <span className="text-[11px] text-stone-500 font-medium">
                    {evt.date} · {evt.time}
                  </span>
                </div>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">{evt.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
