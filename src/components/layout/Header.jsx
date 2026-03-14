// src/components/layout/Header.jsx
import { useState } from "react";
import { Input } from "antd";
import { Search, Plus } from "lucide-react";
import Button from "../common/Button";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
      <div className="flex items-center justify-between gap-4">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <Input
            placeholder="Search for a meeting..."
            prefix={<Search className="w-5 h-5 text-gray-400" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="large"
            allowClear
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* New Meeting Button */}
          <Button variant="primary" className="hidden sm:flex">
            <Plus className="w-5 h-5" />
            <span>New Meeting</span>
          </Button>

          {/* Mobile New Meeting */}
          {/* <Button variant="primary" className="sm:hidden !p-2.5">
            <Plus className="w-5 h-5" />
          </Button> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
