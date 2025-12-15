import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const linkClass =
    "block px-4 py-2 rounded text-sm text-gray-300 hover:bg-gray-800";

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen fixed left-0 top-0">
      <div className="p-4 text-lg font-semibold border-b border-gray-800">
        TaskFlow
      </div>

      <nav className="p-4 space-y-2">
        <NavLink to="/dashboard" className={linkClass}>
          Dashboard
        </NavLink>
        <NavLink to="/projects" className={linkClass}>
          Projects
        </NavLink>
        <NavLink to="/jobs" className={linkClass}>
          Jobs
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;