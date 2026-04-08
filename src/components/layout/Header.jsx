import { Menu, Bell, Search, User } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { Badge, Dropdown } from "antd";

const Header = ({ onMenuClick, isMobile }) => {
  const { user, logout } = useAuth();

  const userMenuItems = {
    items: [
      {
        key: "profile",
        label: "Profile",
        icon: <User className="w-4 h-4" />,
      },
      {
        type: "divider",
      },
      {
        key: "logout",
        label: "Logout",
        danger: true,
        onClick: logout,
      },
    ],
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between h-14 sm:h-16 landscape:h-12 px-4 sm:px-6">
        {/* Left Side */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Mobile Menu Button */}
          {isMobile && (
            <button
              onClick={onMenuClick}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
            </button>
          )}

          {/* Search - Hidden on small mobile */}
          <div className="hidden sm:flex items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 w-48 md:w-64 lg:w-80 bg-gray-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile Search Icon */}
          <button className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Search className="w-5 h-5 text-gray-600" />
          </button>

          {/* Notifications */}
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
            <Badge count={3} size="small">
              <Bell className="w-5 h-5 text-gray-600" />
            </Badge>
          </button>

          {/* User Menu */}
          <Dropdown
            menu={userMenuItems}
            trigger={["click"]}
            placement="bottomRight"
          >
            <button className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-medium text-sm">
                {user?.full_name?.charAt(0).toUpperCase() || "D"}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-700 truncate max-w-[120px]">
                  {user?.full_name || "Doctor"}
                </p>
                <p className="text-xs text-gray-500 truncate max-w-[120px]">
                  {user?.doctor_type || "Doctor"}
                </p>
              </div>
            </button>
          </Dropdown>
        </div>
      </div>
    </header>
  );
};

export default Header;
