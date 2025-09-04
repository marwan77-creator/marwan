import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Employee } from '../types';
import Modal from './Modal';
import NeumorphicCard from './NeumorphicCard';
import ConfirmationModal from './ConfirmationModal';

const EmployeeForm: React.FC<{ employee?: Employee; onSave: (employee: Omit<Employee, 'id'> | Employee) => void; onCancel: () => void; }> = ({ employee, onSave, onCancel }) => {
  const [name, setName] = useState(employee?.name || '');
  const [baseSalary, setBaseSalary] = useState(employee?.baseSalary || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedSalary = String(baseSalary).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString());
    const salaryValue = parseFloat(normalizedSalary);
    if (!name.trim() || isNaN(salaryValue) || salaryValue <= 0) {
      alert('الرجاء إدخال اسم الموظف وراتب أساسي صالح (أكبر من صفر).');
      return;
    }
    const data = { name: name.trim(), baseSalary: salaryValue };
    if (employee) {
      onSave({ ...data, id: employee.id });
    } else {
      onSave(data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">اسم الموظف</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required
          className="w-full px-4 py-3 bg-gray-100 rounded-xl border-none focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-[inset_5px_5px_10px_#bebebe,inset_-5px_-5px_10px_#ffffff]" />
      </div>
      <div>
        <label htmlFor="baseSalary" className="block text-sm font-medium text-gray-700 mb-2">الراتب الأساسي</label>
        <input type="text" inputMode="decimal" id="baseSalary" value={baseSalary} onChange={(e) => setBaseSalary(e.target.value)} required
          className="w-full px-4 py-3 bg-gray-100 rounded-xl border-none focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-[inset_5px_5px_10px_#bebebe,inset_-5px_-5px_10px_#ffffff]" />
      </div>
      <div className="flex justify-end gap-4 pt-4">
        <button type="button" onClick={onCancel} className="px-6 py-2 rounded-xl text-gray-700 font-semibold bg-gray-100 shadow-[5px_5px_10px_#bebebe,_-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#bebebe,inset_-5px_-5px_10px_#ffffff] transition-shadow">
          إلغاء
        </button>
        <button type="submit" className="px-6 py-2 rounded-xl text-white font-semibold bg-blue-500 shadow-[5px_5px_10px_#bebebe,_-5px_-5px_10px_#ffffff] hover:bg-blue-600 transition-colors">
          حفظ
        </button>
      </div>
    </form>
  );
};


const Employees: React.FC = () => {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | undefined>(undefined);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);

  const handleOpenModal = (employee?: Employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(undefined);
  };

  const handleSave = (employee: Omit<Employee, 'id'> | Employee) => {
    if ('id' in employee) {
      updateEmployee(employee);
    } else {
      addEmployee(employee);
    }
    handleCloseModal();
  };

  const handleDeleteClick = (id: string) => {
    setEmployeeToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (employeeToDelete) {
      deleteEmployee(employeeToDelete);
    }
    setIsConfirmModalOpen(false);
    setEmployeeToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsConfirmModalOpen(false);
    setEmployeeToDelete(null);
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0 }).format(amount);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">إدارة الموظفين</h1>
        <button onClick={() => handleOpenModal()} className="px-6 py-3 rounded-xl text-white font-semibold bg-teal-500 shadow-[5px_5px_10px_#bebebe,_-5px_-5px_10px_#ffffff] hover:bg-teal-600 transition-colors flex items-center gap-2">
          <PlusIcon /> إضافة موظف
        </button>
      </div>

      <NeumorphicCard>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="border-b-2 border-gray-200">
              <tr>
                <th className="p-4 text-sm font-semibold text-gray-600 tracking-wider">الاسم</th>
                <th className="p-4 text-sm font-semibold text-gray-600 tracking-wider">الراتب الأساسي</th>
                <th className="p-4 text-sm font-semibold text-gray-600 tracking-wider">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {employees.length > 0 ? employees.map(emp => (
                <tr key={emp.id} className="border-b border-gray-200 last:border-b-0">
                  <td className="p-4 whitespace-nowrap">{emp.name}</td>
                  <td className="p-4 whitespace-nowrap">{formatCurrency(emp.baseSalary)}</td>
                  <td className="p-4 whitespace-nowrap">
                    <button onClick={() => handleOpenModal(emp)} className="text-blue-500 hover:text-blue-700 ml-4"><PencilIcon /></button>
                    <button onClick={() => handleDeleteClick(emp.id)} className="text-red-500 hover:text-red-700"><TrashIcon /></button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={3} className="text-center p-6 text-gray-500">لا يوجد موظفين حالياً.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </NeumorphicCard>

      {isModalOpen && (
        <Modal onClose={handleCloseModal} title={editingEmployee ? 'تعديل بيانات الموظف' : 'إضافة موظف جديد'}>
          <EmployeeForm employee={editingEmployee} onSave={handleSave} onCancel={handleCloseModal} />
        </Modal>
      )}

      {isConfirmModalOpen && (
        <ConfirmationModal
          title="تأكيد الحذف"
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        >
          <p>هل أنت متأكد من رغبتك في حذف هذا الموظف؟</p>
          <p className="mt-2 text-sm text-red-600">سيتم حذف جميع السحوبات المتعلقة بهذا الموظف بشكل دائم.</p>
        </ConfirmationModal>
      )}
    </div>
  );
};

// Icons
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>;
const PencilIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;

export default Employees;