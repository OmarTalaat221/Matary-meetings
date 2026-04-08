import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const location = useLocation();

  // تتبع حجم الشاشة
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) setIsSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // قفل الـ Sidebar لما تغير الصفحة في الموبايل
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Overlay - خلفية سوداء تظهر في الموبايل لما القائمة تفتح */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - تم تمرير الـ Props زي ما انت كنت مجهزها */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isMobile={isMobile}
      />

      {/* Main Content - هنا الـ lg:ml-64 عشان مياخدش مساحة في الموبايل */}
      <div className="transition-all duration-300 lg:ml-64">
        <Header
          onMenuClick={() => setIsSidebarOpen(true)}
          isMobile={isMobile}
        />
        <main className="p-4 sm:p-6 landscape:p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
