import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const navLinkClass = (isActive) =>
    `w-full flex items-center gap-3 text-left px-3 py-2 rounded transition ${
      isActive
        ? 'bg-indigo-500 text-white font-medium'   // Classy indigo for active
        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
    }`;

  const usedStorage = 2.95;
  const totalStorage = 15;
  const usedPercentage = (usedStorage / totalStorage) * 100;

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-700 h-screen flex flex-col">
      {/* Logo */}
      <div className="p-4 text-xl font-bold flex items-center gap-2 text-white">
        <span className="text-2xl">☁️</span>
        <span>DriveBox</span>
      </div>

      <nav className="flex-1 px-2 mt-4 space-y-2 overflow-y-auto">
        <NavLink to="/dashboard" className={({ isActive }) => navLinkClass(isActive)}>
          <span className="text-lg">📁</span>
          <span>My Drive</span>
        </NavLink>

        <NavLink to="/recent" className={({ isActive }) => navLinkClass(isActive)}>
          <span className="text-lg">🕒</span>
          <span>Recent</span>
        </NavLink>

        <NavLink to="/starred" className={({ isActive }) => navLinkClass(isActive)}>
          <span className="text-lg">⭐</span>
          <span>Starred</span>
        </NavLink>

        <NavLink to="/trash" className={({ isActive }) => navLinkClass(isActive)}>
          <span className="text-lg">🗑</span>
          <span>Trash</span>
        </NavLink>
      </nav>

      {/* Storage */}
      <div className="p-4 border-t border-gray-700">
        <div className="text-sm mb-1 text-gray-400">Storage</div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${usedPercentage}%` }}
          ></div>
        </div>
        <p className="text-xs mt-1 text-gray-400">
          {usedStorage} GB of {totalStorage} GB used
        </p>
      </div>
    </div>
  );
}
