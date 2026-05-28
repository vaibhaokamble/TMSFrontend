import { CheckSquare, ChevronRight, LayoutDashboard, UserCheck, Users } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

const Sidebar = ({ activeTab, onTabChange, isMobileMenuOpen }) => {
  const { currentUser } = useUser();

  // Define navigation items based on role
  const allNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null, role: 'team-lead' },
    { id: 'employees', label: 'Employees', icon: UserCheck, badge: null, role: 'team-lead' },
    { id: 'teams', label: 'My Team', icon: Users, badge: null, role: 'all' },
    { id: 'my-tasks', label: 'All Tasks', icon: CheckSquare, badge: null, role: 'all' },
  ];

  // Filter navigation items based on user role
  const navItems = allNavItems.filter(
    (item) => item.role === 'all' || item.role === currentUser?.role
  );

  return (
    <>
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => {}}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-[68px] h-[calc(100vh-68px)] w-60 sm:w-64 bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-dark-700 overflow-y-auto transition-transform duration-300 ease-out z-30 lg:relative lg:top-0 lg:h-[calc(100vh-68px)] lg:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0 shadow-lg' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <nav className="p-3 sm:p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700'
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <Icon size={18} className="flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="ml-2 flex-shrink-0 px-2 py-0.5 text-xs font-semibold bg-danger text-white rounded-full">
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight size={16} className="ml-2 flex-shrink-0" />}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
