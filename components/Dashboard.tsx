import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

const NeumorphicCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-6 rounded-2xl bg-gray-100 shadow-[7px_7px_15px_#bebebe,_-7px_-7px_15px_#ffffff] transition-all duration-300 ease-in-out ${className}`}>
    {children}
  </div>
);

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; className?: string }> = ({ title, value, icon, className = '' }) => (
  <NeumorphicCard className={`flex flex-col items-center justify-center text-center ${className}`}>
    <div className="p-4 bg-gray-100 rounded-full shadow-[inset_5px_5px_10px_#bebebe,inset_-5px_-5px_10px_#ffffff] mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-gray-500">{title}</h3>
    <p className="text-3xl font-bold text-gray-800">{value}</p>
  </NeumorphicCard>
);

const ProgressBar: React.FC<{ percentage: number }> = ({ percentage }) => (
  <div className="w-full bg-gray-200 rounded-full h-4 shadow-[inset_2px_2px_4px_#bebebe,inset_-2px_-2px_4px_#ffffff]">
    <div
      className="bg-gradient-to-r from-teal-400 to-blue-500 h-4 rounded-full transition-all duration-500 ease-out"
      style={{ width: `${percentage}%` }}
    ></div>
  </div>
);

const Dashboard: React.FC = () => {
  const { employees, withdrawals } = useAppContext();

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const prevMonthDate = new Date();
  prevMonthDate.setMonth(currentDate.getMonth() - 1);
  const previousMonth = prevMonthDate.getMonth();
  const previousYear = prevMonthDate.getFullYear();
  

  const currentMonthWithdrawals = useMemo(() => withdrawals.filter(w => {
    const wDate = new Date(w.date);
    return wDate.getMonth() === currentMonth && wDate.getFullYear() === currentYear;
  }), [withdrawals, currentMonth, currentYear]);

  const previousMonthWithdrawals = useMemo(() => withdrawals.filter(w => {
    const wDate = new Date(w.date);
    return wDate.getMonth() === previousMonth && wDate.getFullYear() === previousYear;
  }), [withdrawals, previousMonth, previousYear]);

  const totalSalaries = useMemo(() => employees.reduce((acc, emp) => acc + emp.baseSalary, 0), [employees]);
  const totalCurrentMonthWithdrawals = useMemo(() => currentMonthWithdrawals.reduce((acc, w) => acc + w.amount, 0), [currentMonthWithdrawals]);
  const totalPreviousMonthWithdrawals = useMemo(() => previousMonthWithdrawals.reduce((acc, w) => acc + w.amount, 0), [previousMonthWithdrawals]);
  const totalRemaining = totalSalaries - totalCurrentMonthWithdrawals;
  
  const percentageChange = useMemo(() => {
    if (totalPreviousMonthWithdrawals === 0) {
      return totalCurrentMonthWithdrawals > 0 ? 100 : 0;
    }
    return ((totalCurrentMonthWithdrawals - totalPreviousMonthWithdrawals) / totalPreviousMonthWithdrawals) * 100;
  }, [totalCurrentMonthWithdrawals, totalPreviousMonthWithdrawals]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(amount);
  };

  const employeeData = useMemo(() => {
    return employees.map(emp => {
      const empWithdrawals = currentMonthWithdrawals
        .filter(w => w.employeeId === emp.id)
        .reduce((sum, w) => sum + w.amount, 0);
      const remaining = emp.baseSalary - empWithdrawals;
      const percentage = emp.baseSalary > 0 ? (empWithdrawals / emp.baseSalary) * 100 : 0;
      return { ...emp, empWithdrawals, remaining, percentage };
    });
  }, [employees, currentMonthWithdrawals]);

  const ChangeIndicator = () => {
    if (totalPreviousMonthWithdrawals === 0 && totalCurrentMonthWithdrawals === 0) {
      return <span className="text-gray-500">لا يوجد تغيير</span>;
    }
     if (totalPreviousMonthWithdrawals === 0 && totalCurrentMonthWithdrawals > 0) {
      return <span className="flex items-center text-sm font-bold text-gray-500">لا توجد بيانات سابقة للمقارنة</span>;
    }

    const isIncrease = percentageChange > 0;
    const changeColor = isIncrease ? 'text-red-500' : 'text-green-500';
    
    return (
      <div className={`flex items-center gap-1 font-bold ${changeColor}`}>
        {isIncrease ? <ArrowUpIcon /> : <ArrowDownIcon />}
        <span>{Math.abs(percentageChange).toFixed(1)}%</span>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">لوحة التحكم</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="إجمالي الرواتب" value={formatCurrency(totalSalaries)} icon={<UsersIcon />} />
        <Link to="/withdrawals">
          <StatCard title="إجمالي السحوبات (الشهر الحالي)" value={formatCurrency(totalCurrentMonthWithdrawals)} icon={<CashIcon />} className="hover:-translate-y-1"/>
        </Link>
        <StatCard title="إجمالي المتبقي" value={formatCurrency(totalRemaining)} icon={<BalanceIcon />} />
        <NeumorphicCard className="flex flex-col justify-center">
            <h3 className="text-lg font-semibold text-gray-500 mb-2 text-center">مقارنة السحوبات الشهرية</h3>
            <div className="flex justify-around items-center mt-2">
              <div className="text-center">
                  <p className="text-sm text-gray-500">الشهر السابق</p>
                  <p className="text-xl font-bold text-gray-700">{formatCurrency(totalPreviousMonthWithdrawals)}</p>
              </div>
              <div className="text-center">
                  <p className="text-sm text-gray-500">الشهر الحالي</p>
                  <p className="text-xl font-bold text-gray-800">{formatCurrency(totalCurrentMonthWithdrawals)}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <ChangeIndicator />
            </div>
        </NeumorphicCard>
      </div>

      <NeumorphicCard>
        <h2 className="text-xl font-bold text-gray-700 mb-6">ملخص الموظفين للشهر الحالي</h2>
        <div className="space-y-6">
          {employeeData.length > 0 ? employeeData.map(emp => (
            <div key={emp.id}>
              <div className="flex justify-between items-center mb-2 text-sm font-semibold">
                <span className="text-gray-700">{emp.name}</span>
                <span className="text-gray-500">{formatCurrency(emp.empWithdrawals)} / {formatCurrency(emp.baseSalary)}</span>
              </div>
              <ProgressBar percentage={emp.percentage} />
            </div>
          )) : <p className="text-center text-gray-500">لا يوجد موظفين لعرضهم.</p>}
        </div>
      </NeumorphicCard>
    </div>
  );
};

// Icons
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.124-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.124-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const CashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>;
const BalanceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>;
const ArrowUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>;
const ArrowDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>;

export default Dashboard;