
import React from 'react';
import { NavLink } from 'react-router-dom';

const navLinks = [
  { to: '/', text: 'لوحة التحكم', icon: <HomeIcon /> },
  { to: '/employees', text: 'الموظفين', icon: <UsersIcon /> },
  { to: '/withdrawals', text: 'السحوبات', icon: <CashIcon /> },
  { to: '/reports', text: 'التقارير', icon: <ChartBarIcon /> },
  { to: '/ai-assistant', text: 'المساعد الذكي', icon: <SparklesIcon /> },
];

interface SidebarProps {
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setSidebarOpen }) => {
  const baseLinkClasses = "flex items-center px-4 py-3 text-gray-600 transition-transform duration-200 transform hover:scale-105";
  const activeLinkClasses = "bg-gray-200 text-gray-800 rounded-lg shadow-[inset_4px_4px_8px_#cbced1,inset_-4px_-4px_8px_#ffffff]";

  const sidebarContent = (
    <div className="flex flex-col h-full p-4">
      <h2 className="text-2xl font-bold text-center text-gray-700 mb-10">
        نظام المحاسبة
      </h2>
      <nav>
        <ul>
          {navLinks.map((link) => (
            <li key={link.to} className="mb-4">
              <NavLink
                to={link.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `${baseLinkClasses} ${isActive ? activeLinkClasses : 'hover:bg-gray-100/50'}`}
              >
                <span className="text-gray-500">{link.icon}</span>
                <span className="mr-3 font-semibold">{link.text}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-30 transition-opacity duration-300 ease-in-out lg:hidden ${isSidebarOpen ? 'bg-black bg-opacity-50' : 'pointer-events-none opacity-0'}`} onClick={() => setSidebarOpen(false)}></div>
      <div className={`fixed top-0 right-0 h-full w-64 bg-gray-100 shadow-2xl transform transition-transform duration-300 ease-in-out z-40 lg:hidden ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {sidebarContent}
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
        <div className="flex flex-col h-full bg-gray-100 border-l border-gray-200">
          {sidebarContent}
        </div>
      </div>
    </>
  );
};


// Icons
function HomeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
  );
}
function UsersIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 21a6 6 0 006-6v-1a6 6 0 00-9-5.197" /></svg>
  );
}
function CashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
  );
}
function ChartBarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
  );
}
function SparklesIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L10 16l-4 4 4-4 5.293 5.293a1 1 0 010 1.414L15 21l-4-4 4 4" /></svg>
  );
}


export default Sidebar;
