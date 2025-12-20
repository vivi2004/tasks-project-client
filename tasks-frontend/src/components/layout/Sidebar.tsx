import { NavLink } from "react-router-dom";
import { useEffect } from "react";
import { 
  HomeIcon, 
  FolderIcon, 
  BriefcaseIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon 
} from "@heroicons/react/24/outline";

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: (isCollapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggleCollapse }) => {
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isCollapsed) {
        onToggleCollapse(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isCollapsed, onToggleCollapse]);

  const toggleSidebar = () => {
    onToggleCollapse(!isCollapsed);
  };

  const linkClass = (isActive: boolean) =>
    `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm transition-colors ${
      isActive 
        ? 'bg-indigo-700 text-white' 
        : 'text-gray-300 hover:bg-gray-800'
    }`;

  return (
    <aside 
      className={`${isCollapsed ? 'w-16' : 'w-64'} bg-gray-900 text-white h-screen fixed left-0 top-0 transition-all duration-300 z-20`}
    >
      <div className={`h-full flex flex-col ${isCollapsed ? 'items-center' : ''}`}>
        {/* Logo */}
        <div className={`p-4 text-lg font-semibold border-b border-gray-800 flex items-center justify-between ${isCollapsed ? 'flex-col space-y-2' : ''}`}>
          {!isCollapsed && <span>TaskFlow</span>}
          {isCollapsed && <span className="text-2xl">TF</span>}
          <button
            onClick={toggleSidebar}
            className="text-gray-400 hover:text-white focus:outline-none"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRightIcon className="h-5 w-5" />
            ) : (
              <ChevronLeftIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => linkClass(isActive)}
          >
            <HomeIcon className="h-5 w-5" />
            {!isCollapsed && <span>Dashboard</span>}
          </NavLink>
          <NavLink 
            to="/projects" 
            className={({ isActive }) => linkClass(isActive)}
          >
            <FolderIcon className="h-5 w-5" />
            {!isCollapsed && <span>Projects</span>}
          </NavLink>
          <NavLink 
            to="/jobs" 
            className={({ isActive }) => linkClass(isActive)}
          >
            <BriefcaseIcon className="h-5 w-5" />
            {!isCollapsed && <span>Jobs</span>}
          </NavLink>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;