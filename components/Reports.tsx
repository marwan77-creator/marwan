
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
  
  const handleExportCSV = () => {
    if (reportData.length === 0) {
      alert('لا توجد بيانات لتصديرها.');
      return;
    }

    const headers = ['الموظف', 'الراتب الأساسي', 'المسحوب', 'المتبقي'];
    const csvRows = [
      headers.join(','),
      ...reportData.map(item =>
        [item.name, item.baseSalary, item.withdrawn, item.remaining].join(',')
      )
    ];

    // Add BOM for UTF-8 Excel compatibility with Arabic characters
    const csvContent = '\uFEFF' + csvRows.join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const monthString = (selectedMonth + 1).toString().padStart(2, '0');
    link.setAttribute('download', `report-${selectedYear}-${monthString}.csv`);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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
        <div className="flex flex-col sm:flex-row gap-4 items-center flex-wrap">
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
          <button
            onClick={handleExportCSV}
            disabled={reportData.length === 0}
            className="sm:mr-auto px-4 py-2 rounded-xl text-gray-700 font-semibold bg-gray-100 shadow-[5px_5px_10px_#bebebe,_-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#bebebe,inset_-5px_-5px_10px_#ffffff] transition-shadow flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            title={reportData.length === 0 ? "لا توجد بيانات للتصدير" : "تصدير إلى CSV"}
          >
            <DownloadIcon />
            تصدير CSV
          </button>
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
                  <td className="p-4 whitespace-nowrap font-bold text-green-700">{formatCurrency(totals.remaining)}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </NeumorphicCard>
    </div>
  );
};

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);


export default Reports;