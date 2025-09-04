
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';
import NeumorphicCard from './NeumorphicCard';

const Reports: React.FC = () => {
  const { employees, withdrawals } = useAppContext();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const reportData = useMemo(() => {
    return employees.map(emp => {
      const empWithdrawals = withdrawals
        .filter(w => {
          const wDate = new Date(w.date);
          return w.employeeId === emp.id && wDate.getMonth() === selectedMonth && wDate.getFullYear() === selectedYear;
        })
        .reduce((sum, w) => sum + w.amount, 0);
      const remaining = emp.baseSalary - empWithdrawals;
      return { ...emp, withdrawn: empWithdrawals, remaining };
    });
  }, [employees, withdrawals, selectedMonth, selectedYear]);

  const totals = useMemo(() => {
    return reportData.reduce((acc, item) => {
      acc.baseSalary += item.baseSalary;
      acc.withdrawn += item.withdrawn;
      acc.remaining += item.remaining;
      return acc;
    }, { baseSalary: 0, withdrawn: 0, remaining: 0 });
  }, [reportData]);

  const formatCurrency = (amount: number) => new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(amount);

  const months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
  // FIX: Explicitly cast arguments to Number to resolve TypeScript error during sort.
  const years = Array.from(new Set(withdrawals.map(w => new Date(w.date).getFullYear()))).sort((a, b) => Number(b) - Number(a));
  if (!years.includes(new Date().getFullYear())) {
    years.unshift(new Date().getFullYear());
  }

  const selectClass = "px-4 py-2 bg-gray-100 rounded-xl border-none focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-[inset_5px_5px_10px_#bebebe,inset_-5px_-5px_10px_#ffffff]";

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">التقارير الشهرية</h1>
      
      <NeumorphicCard className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <label htmlFor="month-select" className="font-semibold text-gray-600">اختر الشهر:</label>
          <select id="month-select" value={selectedMonth} onChange={e => setSelectedMonth(Number(e.target.value))} className={selectClass}>
            {months.map((month, index) => (
              <option key={index} value={index}>{month}</option>
            ))}
          </select>
          <label htmlFor="year-select" className="font-semibold text-gray-600">اختر السنة:</label>
          <select id="year-select" value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))} className={selectClass}>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </NeumorphicCard>

      <NeumorphicCard>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="border-b-2 border-gray-200">
              <tr>
                <th className="p-4 text-sm font-semibold text-gray-600 tracking-wider">الموظف</th>
                <th className="p-4 text-sm font-semibold text-gray-600 tracking-wider">الراتب الأساسي</th>
                <th className="p-4 text-sm font-semibold text-gray-600 tracking-wider">المسحوب</th>
                <th className="p-4 text-sm font-semibold text-gray-600 tracking-wider">المتبقي</th>
              </tr>
            </thead>
            <tbody>
              {reportData.length > 0 ? reportData.map(item => (
                <tr key={item.id} className="border-b border-gray-200 last:border-b-0">
                  <td className="p-4 whitespace-nowrap">{item.name}</td>
                  <td className="p-4 whitespace-nowrap">{formatCurrency(item.baseSalary)}</td>
                  <td className="p-4 whitespace-nowrap text-red-600">{formatCurrency(item.withdrawn)}</td>
                  <td className="p-4 whitespace-nowrap text-green-600 font-bold">{formatCurrency(item.remaining)}</td>
                </tr>
              )) : (
                 <tr>
                  <td colSpan={4} className="text-center p-6 text-gray-500">لا توجد بيانات لعرضها.</td>
                </tr>
              )}
            </tbody>
            {reportData.length > 0 && (
              <tfoot className="border-t-2 border-gray-300 bg-gray-50">
                <tr>
                  <th scope="row" className="p-4 text-right font-bold text-gray-700">الإجمالي</th>
                  <td className="p-4 whitespace-nowrap font-bold text-gray-800">{formatCurrency(totals.baseSalary)}</td>
                  <td className="p-4 whitespace-nowrap font-bold text-red-700">{formatCurrency(totals.withdrawn)}</td>
                  <td className="p-4 whitespace-noweap font-bold text-green-700">{formatCurrency(totals.remaining)}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </NeumorphicCard>
    </div>
  );
};

export default Reports;
