
import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Employee, Withdrawal } from '../types';

interface AppContextType {
  employees: Employee[];
  setEmployees: (employees: Employee[]) => void;
  withdrawals: Withdrawal[];
  setWithdrawals: (withdrawals: Withdrawal[]) => void;
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (employee: Employee) => void;
  deleteEmployee: (id: string) => void;
  addWithdrawal: (withdrawal: Omit<Withdrawal, 'id'>) => void;
  updateWithdrawal: (withdrawal: Withdrawal) => void;
  deleteWithdrawal: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useLocalStorage<Employee[]>('employees', []);
  const [withdrawals, setWithdrawals] = useLocalStorage<Withdrawal[]>('withdrawals', []);

  const addEmployee = (employee: Omit<Employee, 'id'>) => {
    setEmployees([...employees, { ...employee, id: new Date().toISOString() }]);
  };

  const updateEmployee = (updatedEmployee: Employee) => {
    setEmployees(employees.map(e => e.id === updatedEmployee.id ? updatedEmployee : e));
  };

  const deleteEmployee = (id: string) => {
    setEmployees(employees.filter(e => e.id !== id));
    setWithdrawals(withdrawals.filter(w => w.employeeId !== id));
  };

  const addWithdrawal = (withdrawal: Omit<Withdrawal, 'id'>) => {
    setWithdrawals([...withdrawals, { ...withdrawal, id: new Date().toISOString() }]);
  };

  const updateWithdrawal = (updatedWithdrawal: Withdrawal) => {
    setWithdrawals(withdrawals.map(w => w.id === updatedWithdrawal.id ? updatedWithdrawal : w));
  };

  const deleteWithdrawal = (id: string) => {
    setWithdrawals(withdrawals.filter(w => w.id !== id));
  };

  return (
    <AppContext.Provider value={{
      employees, setEmployees,
      withdrawals, setWithdrawals,
      addEmployee, updateEmployee, deleteEmployee,
      addWithdrawal, updateWithdrawal, deleteWithdrawal
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
