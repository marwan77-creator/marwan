import React, { useState, useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Withdrawal } from '../types';
import Modal from './Modal';
import NeumorphicCard from './NeumorphicCard';
import ConfirmationModal from './ConfirmationModal';

const WithdrawalForm: React.FC<{ withdrawal?: Withdrawal; onSave: (withdrawal: Omit<Withdrawal, 'id'> | Withdrawal) => void; onCancel: () => void; }> = ({ withdrawal, onSave, onCancel }) => {
  const { employees } = useAppContext();
  const [employeeId, setEmployeeId] = useState(withdrawal?.employeeId || (employees.length > 0 ? employees[0].id : ''));
  const [amount, setAmount] = useState(withdrawal?.amount || '');
  const [date, setDate] = useState(withdrawal?.date || new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState(withdrawal?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedAmount = String(amount).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString());
    const amountValue = parseFloat(normalizedAmount);
    if (!employeeId || isNaN(amountValue) || amountValue <= 0 || !date) {
      alert('الرجاء اختيار الموظف وإدخال مبلغ وتاريخ صالحين (المبلغ أكبر من صفر).');
      return;
    }
    const data = { employeeId, amount: amountValue, date, notes: notes.trim() };
    if (withdrawal) {
      onSave({ ...data, id: withdrawal.id });
    } else {
      onSave(data);
    }
  };
  
  const inputClass = "w-full px-4 py-3 bg-gray-100 rounded-xl border-none focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-[inset_5px_5px_10px_#bebebe,inset_-5px_-5px_10px_#ffffff]";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700 mb-2">الموظف</label>
        <select id="employeeId" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} required className={inputClass}>
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">المبلغ</label>
        <input type="text" inputMode="decimal" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} required className={inputClass} />
      </div>
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">التاريخ</label>
        <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required className={inputClass} />
      </div>
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">ملاحظات (اختياري)</label>
        <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className={inputClass}></textarea>
      </div>
      <div className="flex justify-end gap-4 pt-4">
        <button type="button" onClick={onCancel} className="px-6 py-2 rounded-xl text-gray-700 font-semibold bg-gray-100 shadow-[5px_5px_10px_#bebebe,_-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#bebebe,inset_-5px_-5px_10px_#ffffff] transition-shadow">إلغاء</button>
        <button type="submit" className="px-6 py-2 rounded-xl text-white font-semibold bg-blue-500 shadow-[5px_5px_10px_#bebebe,_-5px_-5px_10px_#ffffff] hover:bg-blue-600 transition-colors">حفظ</button>
      </div>
    </form>
  );
};


const Withdrawals: React.FC = () => {
  const { withdrawals, employees, addWithdrawal, updateWithdrawal, deleteWithdrawal } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWithdrawal, setEditingWithdrawal] = useState<Withdrawal | undefined>(undefined);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [withdrawalToDelete, setWithdrawalToDelete] = useState<string | null>(null);
  const [selectedEmployeeFilter, setSelectedEmployeeFilter] = useState<string>('all');

  const employeeMap = new Map(employees.map(e => [e.id, e.name]));
  
  const handleOpenModal = (withdrawal?: Withdrawal) => {
    setEditingWithdrawal(withdrawal);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingWithdrawal(undefined);
  };

  const handleSave = (withdrawal: Omit<Withdrawal, 'id'> | Withdrawal) => {
    if ('id' in withdrawal) {
      updateWithdrawal(withdrawal);
    } else {
      addWithdrawal(withdrawal);
    }
    handleCloseModal();
  };

  const handleDeleteClick = (id: string) => {
    setWithdrawalToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (withdrawalToDelete) {
      deleteWithdrawal(withdrawalToDelete);
    }
    setIsConfirmModalOpen(false);
    setWithdrawalToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsConfirmModalOpen(false);
    setWithdrawalToDelete(null);
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(amount);
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('ar-EG');
  
  const filteredAndSortedWithdrawals = useMemo(() => {
    return [...withdrawals]
      .filter(w => selectedEmployeeFilter === 'all' || w.employeeId === selectedEmployeeFilter)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [withdrawals, selectedEmployeeFilter]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">إدارة السحوبات</h1>
        <button 
          onClick={() => handleOpenModal()} 
          disabled={employees.length === 0} 
          title={employees.length === 0 ? "الرجاء إضافة موظفين أولاً" : "إضافة سحب جديد"}
          className="px-6 py-3 rounded-xl text-white font-semibold bg-teal-500 shadow-[5px_5px_10px_#bebebe,_-5px_-5px_10px_#ffffff] hover:bg-teal-600 transition-colors flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <PlusIcon /> إضافة سحب
        </button>
      </div>

      {employees.length > 0 && (
        <NeumorphicCard className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <label htmlFor="employee-filter" className="font-semibold text-gray-600">تصفية حسب الموظف:</label>
            <select
              id="employee-filter"
              value={selectedEmployeeFilter}
              onChange={(e) => setSelectedEmployeeFilter(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 bg-gray-100 rounded-xl border-none focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-[inset_5px_5px_10px_#bebebe,inset_-5px_-5px_10px_#ffffff]"
            >
              <option value="all">كل الموظفين</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>
        </NeumorphicCard>
      )}

      <NeumorphicCard>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="border-b-2 border-gray-200">
              <tr>
                <th className="p-4 text-sm font-semibold text-gray-600 tracking-wider">الموظف</th>
                <th className="p-4 text-sm font-semibold text-gray-600 tracking-wider">المبلغ</th>
                <th className="p-4 text-sm font-semibold text-gray-600 tracking-wider">التاريخ</th>
                <th className="p-4 text-sm font-semibold text-gray-600 tracking-wider">ملاحظات</th>
                <th className="p-4 text-sm font-semibold text-gray-600 tracking-wider">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedWithdrawals.length > 0 ? filteredAndSortedWithdrawals.map(w => (
                <tr key={w.id} className="border-b border-gray-200 last:border-b-0">
                  <td className="p-4 whitespace-nowrap">{employeeMap.get(w.employeeId) || 'غير معروف'}</td>
                  <td className="p-4 whitespace-nowrap">{formatCurrency(w.amount)}</td>
                  <td className="p-4 whitespace-nowrap">{formatDate(w.date)}</td>
                  <td className="p-4 whitespace-nowrap max-w-xs truncate">{w.notes || '-'}</td>
                  <td className="p-4 whitespace-nowrap">
                    <button onClick={() => handleOpenModal(w)} className="text-blue-500 hover:text-blue-700 ml-4"><PencilIcon /></button>
                    <button onClick={() => handleDeleteClick(w.id)} className="text-red-500 hover:text-red-700"><TrashIcon /></button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="text-center p-6 text-gray-500">
                    {withdrawals.length > 0 ? 'لا توجد سحوبات مطابقة لهذه التصفية.' : 'لا يوجد سحوبات حالياً.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </NeumorphicCard>

      {isModalOpen && (
        <Modal onClose={handleCloseModal} title={editingWithdrawal ? 'تعديل السحب' : 'إضافة سحب جديد'}>
          <WithdrawalForm withdrawal={editingWithdrawal} onSave={handleSave} onCancel={handleCloseModal} />
        </Modal>
      )}

      {isConfirmModalOpen && (
        <ConfirmationModal
          title="تأكيد الحذف"
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        >
          <p>هل أنت متأكد من رغبتك في حذف هذا السحب؟</p>
        </ConfirmationModal>
      )}
    </div>
  );
};

// Icons
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>;
const PencilIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;

export default Withdrawals;