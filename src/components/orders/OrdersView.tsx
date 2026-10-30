import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useApp } from '../../context/AppContext.tsx';
import { Order, OrderStatus } from '../../types/index.ts';
import {
  FileText,
  Truck,
  CheckCircle2,
  Clock,
  DollarSign,
  Receipt,
  Download,
  AlertCircle,
  Building,
  Phone,
  ShieldCheck,
  CreditCard,
  X,
} from 'lucide-react';

export const OrdersView: React.FC = () => {
  const { t } = useLanguage();
  const { orders, updateOrderStatus, payCommission, role } = useApp();

  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);

  // Commission Metrics
  const totalGmvRwf = orders.reduce((acc, o) => acc + (Number(o.totalAmountRwf) || 0), 0);
  const totalCommissionDueRwf = orders
    .filter((o) => o.commissionStatus === 'due')
    .reduce((acc, o) => acc + (Number(o.commissionAmountRwf) || 0), 0);
  const totalCommissionPaidRwf = orders
    .filter((o) => o.commissionStatus === 'paid')
    .reduce((acc, o) => acc + (Number(o.commissionAmountRwf) || 0), 0);

  const getOrderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending_dispatch':
        return 'text-amber-800 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900';
      case 'in_transit':
        return 'text-blue-800 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900';
      case 'delivered_at_aggregation':
        return 'text-purple-800 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900';
      case 'completed':
        return 'text-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900';
      case 'disputed':
        return 'text-rose-800 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900';
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
          {t('orders.title')}
        </h1>
        <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
          {t('orders.subtitle')}
        </p>
      </div>

      {/* Financial Commission Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-semibold">Total Order Value (GMV)</span>
            <FileText className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-stone-900 dark:text-white">
            {totalGmvRwf.toLocaleString()} <span className="text-sm font-normal text-stone-500">RWF</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">Across {orders.length} contracted purchase orders</div>
        </div>

        <div className="p-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-semibold">Platform Fee Accrued (2.5%)</span>
            <DollarSign className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-800 dark:text-emerald-400">
            {(totalCommissionDueRwf + totalCommissionPaidRwf).toLocaleString()}{' '}
            <span className="text-sm font-normal text-stone-500">RWF</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">Calculated platform commission on sales</div>
        </div>

        <div className="p-4 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-semibold">Commission Due (Unpaid)</span>
            <CreditCard className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-amber-600 dark:text-amber-400">
            {totalCommissionDueRwf.toLocaleString()}{' '}
            <span className="text-sm font-normal text-stone-500">RWF</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            {totalCommissionPaidRwf.toLocaleString()} RWF settled via MoMo
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-stone-900 rounded-xl border border-dashed border-stone-300 dark:border-stone-700">
            <Receipt className="w-10 h-10 text-stone-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-800 dark:text-stone-200">
              No formal orders generated yet
            </h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              When a farmer accepts a buyer's offer in the marketplace, an official contract, delivery note, and commission entry will be created here.
            </p>
          </div>
        ) : (
          orders.map((order) => {
            return (
              <div
                key={order.id}
                className="p-5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs space-y-4"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-bold text-sm text-stone-900 dark:text-stone-100">
                        {order.orderNumber}
                      </span>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded border capitalize ${getOrderStatusBadge(
                          order.status
                        )}`}
                      >
                        {order.status.replace(/_/g, ' ')}
                      </span>
                      {order.isDemo ? (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                          DEMO
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                          REAL CONTRACT
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-stone-600 dark:text-stone-300 mt-1 font-medium">
                      {order.cropName} ({order.variety}) · {order.quantityKg.toLocaleString()} kg @{' '}
                      {order.unitPriceRwf} RWF/kg
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <span className="text-xl font-bold font-mono tabular-nums text-emerald-800 dark:text-emerald-400 block">
                      {order.totalAmountRwf.toLocaleString()} RWF
                    </span>
                    <span className="text-xs text-stone-500">Contract Total Value</span>
                  </div>
                </div>

                {/* Logistics & Commission Box */}
                <div className="p-3 bg-stone-50 dark:bg-stone-800/50 rounded-lg border border-stone-200 dark:border-stone-700/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-stone-400 block">
                      Farmer Origin
                    </span>
                    <span className="font-semibold text-stone-800 dark:text-stone-200 block truncate">
                      {order.farmerName}
                    </span>
                    <span className="text-[11px] text-stone-500">{order.sector} Sector</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-semibold text-stone-400 block">
                      Buyer Aggregator
                    </span>
                    <span className="font-semibold text-stone-800 dark:text-stone-200 block truncate">
                      {order.buyerName}
                    </span>
                    <span className="text-[11px] text-stone-500">{order.buyerCompany || 'Commercial Buyer'}</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-semibold text-stone-400 block">
                      Platform Fee ({order.commissionRatePercent}%)
                    </span>
                    <span className="font-mono font-bold text-stone-800 dark:text-stone-200 block">
                      {order.commissionAmountRwf.toLocaleString()} RWF
                    </span>
                    <span
                      className={`text-[10px] font-semibold uppercase ${
                        order.commissionStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'
                      }`}
                    >
                      Status: {order.commissionStatus}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-semibold text-stone-400 block">
                      Pickup / Delivery
                    </span>
                    <span className="font-medium text-stone-700 dark:text-stone-300 block truncate">
                      {order.deliveryOption}
                    </span>
                    <span className="text-[11px] text-stone-500">Target: {order.dispatchDate}</span>
                  </div>
                </div>

                {/* Action Stepper & Receipt */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100 dark:border-stone-800 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-stone-500">Update Progression:</span>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                      className="px-2 py-1 bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded text-stone-800 dark:text-stone-200 font-medium"
                    >
                      <option value="pending_dispatch">Pending Dispatch</option>
                      <option value="in_transit">In Transit</option>
                      <option value="delivered_at_aggregation">Delivered at Center</option>
                      <option value="completed">Completed & Settled</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    {order.commissionStatus === 'due' && (
                      <button
                        onClick={() => payCommission(order.id)}
                        className="px-3 py-1.5 font-semibold text-xs rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-2xs transition-colors flex items-center gap-1.5"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Pay 2.5% Fee via MoMo</span>
                      </button>
                    )}

                    <button
                      onClick={() => setReceiptOrder(order)}
                      className="px-3 py-1.5 font-semibold text-xs rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700 border border-stone-300 dark:border-stone-700 transition-colors flex items-center gap-1.5"
                    >
                      <Receipt className="w-3.5 h-3.5 text-emerald-700" />
                      <span>View Receipt & Dispatch Note</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* RECEIPT MODAL */}
      {receiptOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-800" />
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-50">
                  Aggregation Center Dispatch Receipt
                </h3>
              </div>
              <button
                onClick={() => setReceiptOrder(null)}
                className="p-1 rounded text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-stone-50 dark:bg-stone-800/80 rounded-xl border border-dashed border-stone-300 dark:border-stone-700 font-mono text-xs space-y-3">
              <div className="text-center pb-2 border-b border-stone-300 dark:border-stone-700">
                <div className="font-bold text-sm">AGRIBRIDGE RWANDA — NYAGATARE</div>
                <div className="text-[11px] text-stone-500">Official Produce Dispatch & Waybill</div>
                <div className="text-[11px] font-bold mt-1">RECEIPT: {receiptOrder.receiptCode}</div>
              </div>

              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>Order Number:</span>
                  <span className="font-bold">{receiptOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Commodity:</span>
                  <span>{receiptOrder.cropName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Gross Quantity:</span>
                  <span className="font-bold">{receiptOrder.quantityKg.toLocaleString()} kg</span>
                </div>
                <div className="flex justify-between">
                  <span>Unit Farmgate Price:</span>
                  <span>{receiptOrder.unitPriceRwf} RWF / kg</span>
                </div>
                <div className="flex justify-between text-xs pt-1 border-t border-stone-300 dark:border-stone-700 font-bold">
                  <span>Total Order Settlement:</span>
                  <span>{receiptOrder.totalAmountRwf.toLocaleString()} RWF</span>
                </div>
                <div className="flex justify-between text-[11px] text-emerald-800 dark:text-emerald-400">
                  <span>Platform Commission (2.5%):</span>
                  <span>{receiptOrder.commissionAmountRwf.toLocaleString()} RWF ({receiptOrder.commissionStatus})</span>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-300 dark:border-stone-700 text-[10px] text-stone-500 space-y-0.5">
                <div>Farmer: {receiptOrder.farmerName} (Tel: {receiptOrder.farmerPhone})</div>
                <div>Buyer: {receiptOrder.buyerName} · {receiptOrder.buyerCompany}</div>
                <div>Collection Point: {receiptOrder.deliveryOption}</div>
                <div>Payment Channel: {receiptOrder.paymentMethod}</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setReceiptOrder(null)}
                className="px-4 py-2 text-xs font-semibold bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
