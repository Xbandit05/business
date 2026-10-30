import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { useApp } from '../../context/AppContext.tsx';
import { FarmExpense, ExpenseCategory } from '../../types/index.ts';
import {
  Wallet,
  TrendingUp,
  ArrowDownRight,
  Plus,
  Trash2,
  Receipt,
  FileSpreadsheet,
  PieChart,
  Calendar,
  CheckCircle,
  X,
  Layers,
} from 'lucide-react';

export const FarmFinanceLedger: React.FC = () => {
  const { t } = useLanguage();
  const { expenses, orders, addExpense, deleteExpense, farms, plots } = useApp();

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [category, setCategory] = useState<ExpenseCategory>('fertilizer');
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState('Bag (50kg)');
  const [unitCostRwf, setUnitCostRwf] = useState('46500');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [expenseDate, setExpenseDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  // Financial Calculations
  const totalExpensesRwf = expenses.reduce((acc, e) => acc + (Number(e.totalCostRwf) || 0), 0);
  const totalSalesRevenueRwf = orders.reduce((acc, o) => acc + (Number(o.totalAmountRwf) || 0), 0);
  const netProfitRwf = totalSalesRevenueRwf - totalExpensesRwf;
  const roiPercent =
    totalExpensesRwf > 0 ? ((netProfitRwf / totalExpensesRwf) * 100).toFixed(1) : '0.0';

  // Category Aggregations
  const categoryTotals: Record<ExpenseCategory, number> = {
    seeds: 0,
    fertilizer: 0,
    pesticides: 0,
    hired_labor: 0,
    plowing_mechanization: 0,
    irrigation: 0,
    post_harvest_bags: 0,
    transport: 0,
  };

  expenses.forEach((e) => {
    if (categoryTotals[e.category] !== undefined) {
      categoryTotals[e.category] += Number(e.totalCostRwf) || 0;
    }
  });

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim()) return;

    const qty = parseFloat(quantity) || 1;
    const cost = parseInt(unitCostRwf, 10) || 0;
    const total = qty * cost;

    addExpense({
      farmId: farms[0]?.id || 'farm_default',
      farmerId: 'current_user',
      category,
      itemName: itemName.trim(),
      quantity: qty,
      unit,
      unitCostRwf: cost,
      totalCostRwf: total,
      date: expenseDate,
      receiptNumber: receiptNumber.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    setIsExpenseModalOpen(false);
    setItemName('');
    setReceiptNumber('');
    setNotes('');
  };

  return (
    <div className="space-y-8">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
            {t('finance.title')}
          </h1>
          <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
            {t('finance.subtitle')}
          </p>
        </div>

        <button
          onClick={() => setIsExpenseModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white shadow-2xs transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t('btn.addExpense')}</span>
        </button>
      </div>

      {/* P&L Performance Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Revenue */}
        <div className="p-5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">{t('finance.grossRevenue')}</span>
            <TrendingUp className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-800 dark:text-emerald-400">
            {totalSalesRevenueRwf.toLocaleString()} <span className="text-xs font-normal text-stone-500">RWF</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">From {orders.length} contracted buyer orders</div>
        </div>

        {/* Total Cost */}
        <div className="p-5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">{t('finance.totalCost')}</span>
            <ArrowDownRight className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-rose-700 dark:text-rose-400">
            {totalExpensesRwf.toLocaleString()} <span className="text-xs font-normal text-stone-500">RWF</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">Seeds, DAP/Urea, labor, plowing</div>
        </div>

        {/* Net Margin */}
        <div className="p-5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">{t('finance.netProfit')}</span>
            <Wallet className="w-4 h-4 text-emerald-700" />
          </div>
          <div
            className={`text-2xl font-bold font-mono tabular-nums ${
              netProfitRwf >= 0 ? 'text-emerald-800 dark:text-emerald-400' : 'text-rose-700'
            }`}
          >
            {netProfitRwf.toLocaleString()} <span className="text-xs font-normal text-stone-500">RWF</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            {netProfitRwf >= 0 ? 'Net Operational Surplus' : 'Operational Deficit'}
          </div>
        </div>

        {/* ROI */}
        <div className="p-5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">{t('finance.roi')}</span>
            <PieChart className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-stone-900 dark:text-white">
            {roiPercent}%
          </div>
          <div className="text-[11px] text-stone-500 mt-1">Per-season capital productivity</div>
        </div>
      </div>

      {/* Expense Category Breakdown Pills / Strips */}
      <div className="p-5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
          {t('finance.expenseBreakdown')}
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
            <span className="text-[10px] uppercase font-semibold text-stone-500 block">Fertilizers</span>
            <span className="font-bold font-mono tabular-nums text-stone-800 dark:text-stone-200 text-sm">
              {categoryTotals.fertilizer.toLocaleString()} RWF
            </span>
          </div>

          <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
            <span className="text-[10px] uppercase font-semibold text-stone-500 block">Tractor Mechanization</span>
            <span className="font-bold font-mono tabular-nums text-stone-800 dark:text-stone-200 text-sm">
              {categoryTotals.plowing_mechanization.toLocaleString()} RWF
            </span>
          </div>

          <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
            <span className="text-[10px] uppercase font-semibold text-stone-500 block">Certified Seeds</span>
            <span className="font-bold font-mono tabular-nums text-stone-800 dark:text-stone-200 text-sm">
              {categoryTotals.seeds.toLocaleString()} RWF
            </span>
          </div>

          <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
            <span className="text-[10px] uppercase font-semibold text-stone-500 block">Hired Farm Labor</span>
            <span className="font-bold font-mono tabular-nums text-stone-800 dark:text-stone-200 text-sm">
              {categoryTotals.hired_labor.toLocaleString()} RWF
            </span>
          </div>
        </div>
      </div>

      {/* Logged Expenses Ledger Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Receipt className="w-4 h-4 text-emerald-700" />
            <span>Farm Expenditure Ledger ({expenses.length} Entries)</span>
          </h2>
        </div>

        <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-50 dark:bg-stone-800/80 text-stone-500 font-semibold border-b border-stone-200 dark:border-stone-800 uppercase tracking-wide text-[10px]">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Item Description</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Quantity</th>
                  <th className="px-4 py-3 text-right">Unit Price</th>
                  <th className="px-4 py-3 text-right">Total (RWF)</th>
                  <th className="px-4 py-3 text-center">Receipt</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800 font-medium">
                {expenses.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-stone-500">
                      No farm expenses recorded yet. Click "+ Log Farm Expense" to begin tracking production costs.
                    </td>
                  </tr>
                ) : (
                  expenses.map((item) => (
                    <tr key={item.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors">
                      <td className="px-4 py-3 text-stone-500">{item.date}</td>
                      <td className="px-4 py-3 font-semibold text-stone-900 dark:text-stone-100">
                        {item.itemName}
                        {item.notes && <span className="block text-[11px] text-stone-400 font-normal italic">{item.notes}</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className="capitalize text-stone-600 dark:text-stone-300">
                          {item.category.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono tabular-nums">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="px-4 py-3 text-right font-mono tabular-nums text-stone-600 dark:text-stone-300">
                        {item.unitCostRwf.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right font-mono tabular-nums font-bold text-stone-900 dark:text-stone-100">
                        {item.totalCostRwf.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center text-[11px] text-stone-400">
                        {item.receiptNumber || 'None'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {!item.isDemo && (
                          <button
                            onClick={() => deleteExpense(item.id)}
                            className="p-1 rounded text-stone-400 hover:text-rose-600 transition-colors"
                            title="Delete entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ADD EXPENSE MODAL */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-800" />
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-50">
                  {t('btn.addExpense')}
                </h3>
              </div>
              <button
                onClick={() => setIsExpenseModalOpen(false)}
                className="p-1 rounded text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Expense Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
                >
                  <option value="fertilizer">Fertilizers (DAP / Urea / NPK)</option>
                  <option value="seeds">Certified Hybrid Seeds</option>
                  <option value="pesticides">Pesticides & Crop Protection</option>
                  <option value="hired_labor">Hired Manual Labor (Weeding/Planting)</option>
                  <option value="plowing_mechanization">Tractor / Plowing Mechanization</option>
                  <option value="irrigation">Irrigation & Fuel/Electricity</option>
                  <option value="transport">Transportation to Center</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Item Description *
                </label>
                <input
                  type="text"
                  required
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="e.g., Urea 46% Nitrogen (50kg Bag)"
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg text-stone-900 dark:text-stone-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg font-mono tabular-nums"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Unit Type
                  </label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="e.g., Bag / Person-days"
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Unit Cost (RWF) *
                  </label>
                  <input
                    type="number"
                    required
                    value={unitCostRwf}
                    onChange={(e) => setUnitCostRwf(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg font-mono tabular-nums"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Receipt / Invoice Number
                </label>
                <input
                  type="text"
                  value={receiptNumber}
                  onChange={(e) => setReceiptNumber(e.target.value)}
                  placeholder="e.g., REC-AGRO-7712"
                  className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg"
                />
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-lg flex justify-between font-semibold">
                <span>Calculated Total:</span>
                <span className="font-bold font-mono tabular-nums text-emerald-800 dark:text-emerald-400">
                  {((parseFloat(quantity) || 0) * (parseInt(unitCostRwf, 10) || 0)).toLocaleString()} RWF
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="px-3.5 py-2 text-stone-600 dark:text-stone-400"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg shadow-2xs"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
