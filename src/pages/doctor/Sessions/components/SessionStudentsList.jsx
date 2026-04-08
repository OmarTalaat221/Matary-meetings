// src/pages/doctor/Sessions/components/SessionStudentsList.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Avatar, Tag, Tooltip, Input, Spin, Dropdown, Menu } from "antd";
import {
  ArrowLeft,
  RefreshCw,
  Users,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  Download,
  Search,
  X,
  Loader2,
  FileText,
  FileSpreadsheet,
  ChevronDown,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import useSessionStudents from "./useSessionStudents";
import useDebounce from "../../../../hooks/useDebounce";
import DataTable from "../../../../components/common/DataTable";

const DEBOUNCE_DELAY = 500; // 500ms debounce delay

const SessionStudentsList = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const {
    students,
    sessionInfo,
    loading,
    pagination,
    currentPage,
    limit,
    keyword,
    handlePageChange,
    handleSearch,
    clearSearch,
    refresh,
  } = useSessionStudents(sessionId);

  // Local state for input value (immediate UI feedback)
  const [searchInput, setSearchInput] = useState(keyword);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search value
  const debouncedSearchValue = useDebounce(searchInput, DEBOUNCE_DELAY);

  // Sync local input with URL keyword when URL changes (e.g., browser back/forward)
  useEffect(() => {
    setSearchInput(keyword);
  }, [keyword]);

  // Trigger search when debounced value changes
  useEffect(() => {
    // Only search if debounced value is different from current keyword
    if (debouncedSearchValue !== keyword) {
      handleSearch(debouncedSearchValue);
    }
    setIsSearching(false);
  }, [debouncedSearchValue, handleSearch, keyword]);

  // Handle input change
  const onSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    setIsSearching(true);
  };

  // Handle clear search
  const onClearSearch = () => {
    setSearchInput("");
    setIsSearching(false);
    clearSearch();
  };

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Table columns
  const columns = [
    {
      title: "#",
      key: "index",
      width: 60,
      align: "center",
      render: (_, __, index) => (
        <span className="text-gray-500 font-medium">
          {index + 1}
        </span>
      ),
    },
    {
      title: "Student",
      key: "student",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={record.student_avater_url}
            size={44}
            className="flex-shrink-0 border-2 border-gray-100"
          >
            {record.student_name?.charAt(0)?.toUpperCase()}
          </Avatar>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 truncate">
              {record.student_name}
            </p>
            {record.student_nickname && (
              <p className="text-sm text-gray-500 truncate">
                @{record.student_nickname}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "student_email",
      key: "email",
      render: (email) => (
        <Tooltip title={email}>
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
          >
            <Mail className="w-4 h-4 flex-shrink-0" />
            <span className="truncate max-w-[200px]">{email}</span>
          </a>
        </Tooltip>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (phone) => (
        <a
          href={`tel:+2${phone}`}
          className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
        >
          <Phone className="w-4 h-4 flex-shrink-0" />
          <span dir="ltr">{phone}</span>
        </a>
      ),
    },
    {
      title: "Status",
      key: "status",
      align: "center",
      width: 100,
      render: () => (
        <Tag color="green" className="m-0">
          Booked
        </Tag>
      ),
    },
  ];

  // Handle back navigation
  const handleBack = () => {
    navigate("/doctor/sessions");
  };

  // Export functions
  const handleExportExcel = () => {
    if (students.length === 0) return;
    const headers = ["#", "Name", "Nickname", "Email", "Phone"];
    const rows = students.map((s, index) => [
      index + 1,
      s.student_name,
      s.student_nickname || "",
      s.student_email,
      s.phone,
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    XLSX.writeFile(workbook, `session_${sessionId}_students.xlsx`);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text(`Students List - ${sessionInfo?.title || sessionId}`, 14, 15);
    const tableColumn = ["#", "Name", "Nickname", "Email", "Phone"];
    const tableRows = students.map((s, index) => [
      index + 1,
      s.student_name,
      s.student_nickname || "",
      s.student_email,
      s.phone,
    ]);
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      didDrawCell: (data) => {
        // Index 4 is the Phone column
        if (data.section === "body" && data.column.index === 4) {
          const phone = data.cell.raw;
          if (phone) {
            doc.link(
              data.cell.x,
              data.cell.y,
              data.cell.width,
              data.cell.height,
              { url: `tel:${phone}` }
            );
          }
        }
      },
    });
    doc.save(`session_${sessionId}_students.pdf`);
  };

  const handleExportWord = () => {
    const headers = ["#", "Name", "Nickname", "Email", "Phone"];
    const rows = students.map((s, index) => [
      index + 1,
      s.student_name,
      s.student_nickname || "",
      s.student_email,
      s.phone,
    ]);

    let html = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'><title>Students List</title>
        <style>
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid black; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
        </style>
        </head>
        <body>
            <h2>Students List - ${sessionInfo?.title || sessionId}</h2>
            <table>
                <thead>
                    <tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr>
                </thead>
                <tbody>
                    ${rows
                      .map(
                        (row) =>
                          `<tr>${row
                            .map((cell) => `<td>${cell}</td>`)
                            .join("")}</tr>`
                      )
                      .join("")}
                </tbody>
            </table>
        </body>
        </html>
    `;

    const blob = new Blob(["\ufeff", html], {
      type: "application/msword",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `session_${sessionId}_students.doc`;
    link.click();
  };

  const exportMenuItems = [
    {
      key: "excel",
      label: "Export to Excel",
      icon: <FileSpreadsheet className="w-4 h-4" />,
      onClick: handleExportExcel,
    },
    {
      key: "pdf",
      label: "Export to PDF",
      icon: <FileText className="w-4 h-4" />,
      onClick: handleExportPDF,
    },
    {
      key: "word",
      label: "Export to Word",
      icon: <FileText className="w-4 h-4" />,
      onClick: handleExportWord,
    },
  ];

  // Determine if we should show searching indicator
  const showSearchingIndicator = isSearching && searchInput !== keyword;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Session Students
            </h1>
            {sessionInfo && (
              <p className="text-gray-500 mt-1 flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                {sessionInfo.title}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Export Dropdown */}
          <Dropdown
            menu={{ items: exportMenuItems }}
            disabled={students.length === 0}
            trigger={["click"]}
            placement="bottomRight"
          >
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <Download className="w-5 h-5 text-gray-600" />
              <span className="hidden sm:inline text-gray-700">Export</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
          </Dropdown>

          {/* Refresh Button */}
          <button
            onClick={refresh}
            disabled={loading}
            className="p-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`w-5 h-5 text-gray-600 ${loading ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Students</p>
              <p className="text-xl font-bold text-gray-900">
                {students.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Session</p>
              <p className="text-xl font-bold text-gray-900 truncate max-w-[150px]">
                {sessionInfo?.title || `#${sessionId}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex-1 w-full relative">
            <Input
              placeholder="Search by name, email, or phone..."
              value={searchInput}
              onChange={onSearchChange}
              prefix={
                showSearchingIndicator ? (
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
                ) : (
                  <Search className="w-4 h-4 text-gray-400" />
                )
              }
              suffix={
                searchInput ? (
                  <button
                    onClick={onClearSearch}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    type="button"
                  >
                    <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                ) : null
              }
              className="w-full"
              size="large"
              allowClear={false}
            />
          </div>

          {/* Search Status */}
          <div className="flex items-center gap-2 text-sm text-gray-500 whitespace-nowrap">
            {showSearchingIndicator ? (
              <span className="flex items-center gap-2 text-primary">
                <span>Searching...</span>
              </span>
            ) : keyword ? (
              <span>
                Found <strong>{students.length}</strong> result
                {students.length !== 1 ? "s" : ""} for "
                <strong>{keyword}</strong>"
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Students DataTable */}
      <DataTable
        columns={columns}
        data={students}
        loading={loading}
        rowKey="student_id"
        searchable={false}
        pageSize={students.length || 10}
        showPagination={false}
        emptyText={
          keyword
            ? `No students found matching "${keyword}"`
            : "No students have booked this session yet"
        }
        emptyIcon={Users}
      />
    </div>
  );
};

export default SessionStudentsList;
