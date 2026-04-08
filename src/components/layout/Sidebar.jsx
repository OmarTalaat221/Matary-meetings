// src/components/layout/Sidebar.jsx
import { NavLink, useLocation } from "react-router-dom";
import { LogOut, ChevronDown, ChevronRight, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getSidebarItems } from "../../routes/routes-data";

const Sidebar = ({ isOpen, onClose, isMobile }) => {
  const { logout, user, getDoctorType } = useAuth();
  const location = useLocation();

  // ✅ استخدام getDoctorType() من الـ context
  const doctorType = getDoctorType();
  const sidebarItems = getSidebarItems("doctor", doctorType);

  const [expandedGroups, setExpandedGroups] = useState([]);

  // Auto-expand group if current path is in children
  useEffect(() => {
    sidebarItems.forEach((item) => {
      if (item.isGroup && item.children) {
        const isChildActive = item.children.some(
          (child) => location.pathname === child.path
        );
        if (isChildActive && !expandedGroups.includes(item.key)) {
          setExpandedGroups((prev) => [...prev, item.key]);
        }
      }
    });
  }, [location.pathname, sidebarItems]);

  const toggleGroup = (key) => {
    setExpandedGroups((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const hasActiveChild = (children) => {
    return children?.some((child) => location.pathname === child.path);
  };

  // ✅ Badge حسب doctor_type
  const getDoctorTypeBadge = () => {
    switch (doctorType) {
      case "private":
        return { label: "Private Doctor", color: "bg-emerald-600" };
      case "group":
        return { label: "Group Doctor", color: "bg-blue-600" };
      case "sessions":
        return { label: "Sessions Doctor", color: "bg-purple-600" };
      default:
        return { label: "Doctor Portal", color: "bg-emerald-600" };
    }
  };

  const doctorBadge = getDoctorTypeBadge();

  const handleLogout = () => {
    logout();
  };

  // Render nav item
  const renderNavItem = (item, isChild = false) => {
    const Icon = item.icon;

    return (
      <li key={item.path}>
        <NavLink
          to={item.path}
          onClick={() => isMobile && onClose?.()}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-300 ${
              isChild ? "ml-4 text-sm" : ""
            } ${
              isActive
                ? "bg-white text-primary font-semibold shadow-lg"
                : "text-white/80 hover:bg-white/10"
            }`
          }
        >
          <Icon
            className={`${isChild ? "w-4 h-4" : "w-5 h-5"} flex-shrink-0`}
          />
          <span className="truncate">{item.label}</span>
        </NavLink>
      </li>
    );
  };

  // Render group with children
  const renderGroup = (item) => {
    const Icon = item.icon;
    const isExpanded = expandedGroups.includes(item.key);
    const isActive = hasActiveChild(item.children);

    return (
      <li key={item.key}>
        <button
          onClick={() => toggleGroup(item.key)}
          className={`flex items-center justify-between w-full px-4 py-2.5 rounded-lg transition-all duration-300 ${
            isActive
              ? "bg-white/20 text-white font-semibold"
              : "text-white/80 hover:bg-white/10"
          }`}
        >
          <div className="flex items-center gap-3">
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span className="truncate">{item.label}</span>
          </div>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 flex-shrink-0" />
          ) : (
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
          )}
        </button>

        <ul
          className={`mt-1 space-y-1 overflow-hidden transition-all duration-300 ${
            isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          {item.children?.map((child) => renderNavItem(child, true))}
        </ul>
      </li>
    );
  };

  // Sidebar classes
  const sidebarClasses = `
    bg-primary h-screen text-white flex flex-col fixed left-0 top-0 z-50
    transition-transform duration-300 ease-in-out
    w-64 sm:w-72 lg:w-64
    ${isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"}
  `;

  return (
    <aside className={sidebarClasses}>
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-white/10 flex-shrink-0">
        {/* Close button - Mobile only */}
        {isMobile && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Logo */}
        <img
          className="w-full h-[50px] sm:h-[60px] lg:h-[70px] landscape:h-[40px] object-contain"
          src="https://res.cloudinary.com/dp7jfs375/image/upload/v1773481084/Matary_basic_media_20250220_213011_0000.cdaa37d3f760260f3bda29df14569fe8_eblvca.svg"
          alt="Matary Logo"
        />

        {/* Role Badge */}
        <div className="mt-3 text-center">
          <span
            className={`text-xs px-3 py-1 rounded-full ${doctorBadge.color}`}
          >
            {doctorBadge.label}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-hidden">
        <nav className="h-full p-3 sm:p-4 overflow-y-auto">
          <ul className="space-y-1 sm:space-y-2">
            {sidebarItems.map((item) => {
              if (item.isGroup) {
                return renderGroup(item);
              }
              return renderNavItem(item);
            })}
          </ul>
        </nav>
      </div>

      {/* User Info & Logout */}
      <div className="flex-shrink-0 border-t border-white/10">
        {/* User Info */}
        <div className="p-3 sm:p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
              {user?.full_name?.charAt(0).toUpperCase() || "D"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate text-sm">
                {user?.full_name || "Doctor"}
              </p>
              <p className="text-xs text-white/60 truncate">
                {user?.specialization || user?.email || ""}
              </p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-3 sm:p-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 sm:py-3 rounded-lg text-white/80 hover:bg-red-500 hover:text-white transition-all duration-300 cursor-pointer"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
