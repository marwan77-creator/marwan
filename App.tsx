
import React, { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Employees from './components/Employees';
import Withdrawals from './components/Withdrawals';
import Reports from './components/Reports';
import AiAssistant from './components/AiAssistant';
import { AppProvider } from './contexts/AppContext';

function App() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AppProvider>
      <HashRouter>
        <div className="flex h-screen bg-gray-100">
          <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <header className="lg:hidden flex justify-between items-center p-4 bg-gray-100 border-b border-gray-200">
              <h1 className="text-xl font-bold text-gray-700">المحاسبة</h1>
              <button onClick={() => setSidebarOpen(true)} className="text-gray-500 focus:outline-none">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </header>
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 sm:p-6 lg:p-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/employees" element={<Employees />} />
                <Route path="/withdrawals" element={<Withdrawals />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/ai-assistant" element={<AiAssistant />} />
              </Routes>
            </main>
          </div>
        </div>
      </HashRouter>
    </AppProvider>
  );
}

export default App;
