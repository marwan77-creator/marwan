
export interface Employee {
  id: string;
  name: string;
  baseSalary: number;
}

export interface Withdrawal {
  id: string;
  employeeId: string;
  amount: number;
  date: string; // ISO string format: YYYY-MM-DD
  notes?: string;
}
