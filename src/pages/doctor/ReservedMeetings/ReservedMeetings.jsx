// src/pages/doctor/ReservedMeetings/ReservedMeetings.jsx
import { useState, useEffect } from "react";
import {
  Button,
  Tag,
  Tooltip,
  Popconfirm,
  Dropdown,
  Input,
  Pagination,
} from "antd";
import {
  Calendar,
  Clock,
  Mail,
  Phone,
  Play,
  Square,
  Link,
  FileText,
  Trash2,
  MoreVertical,
  ExternalLink,
  RefreshCw,
  Video,
  Search,
  X,
  Loader2,
  MessageSquare,
  Stethoscope,
  Eye,
  Edit3,
} from "lucide-react";
import DataTable from "../../../components/common/DataTable";
import useReservedMeetingsData from "./useReservedMeetingsData";
import useDebounce from "../../../hooks/useDebounce";
import StudentInfoCell from "./components/StudentInfoCell";
import MeetingActionModal from "./components/MeetingActionModal";
import NotesViewModal from "./components/NotesViewModal";

const DEBOUNCE_DELAY = 500;

const ReservedMeetings = () => {
  const {
    meetings,
    loading,
    actionLoading,
    pagination,
    currentPage,
    limit,
    keyword,
    startMeeting,
    endMeeting,
    updateMeetingLink,
    updateMeetingNotes,
    cancelMeeting,
    handlePageChange,
    handleSearch,
    clearSearch,
    refresh,
  } = useReservedMeetingsData();

  // Local state for search input
  const [searchInput, setSearchInput] = useState(keyword);
  const [isSearching, setIsSearching] = useState(false);

  // Action Modal State
  const [actionModal, setActionModal] = useState({
    open: false,
    type: null,
    meeting: null,
  });

  // View Notes Modal State
  const [viewModal, setViewModal] = useState({
    open: false,
    meeting: null,
  });

  // Debounced search value
  const debouncedSearchValue = useDebounce(searchInput, DEBOUNCE_DELAY);

  // Sync local input with URL keyword
  useEffect(() => {
    setSearchInput(keyword);
  }, [keyword]);

  // Trigger search when debounced value changes
  useEffect(() => {
    if (debouncedSearchValue !== keyword) {
      handleSearch(debouncedSearchValue);
    }
    setIsSearching(false);
  }, [debouncedSearchValue, handleSearch, keyword]);

  // ============ Search Handlers ============
  const onSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    setIsSearching(true);
  };

  const onClearSearch = () => {
    setSearchInput("");
    setIsSearching(false);
    clearSearch();
  };

  // ============ Action Modal Handlers ============
  const openLinkModal = (meeting) => {
    setActionModal({ open: true, type: "link", meeting });
  };

  const openNotesModal = (meeting) => {
    setActionModal({ open: true, type: "notes", meeting });
  };

  const closeActionModal = () => {
    setActionModal({ open: false, type: null, meeting: null });
  };

  const handleActionModalSave = async (value) => {
    const { type, meeting } = actionModal;
    let success = false;

    if (type === "link") {
      success = await updateMeetingLink(meeting.meeting_id, value);
    } else {
      success = await updateMeetingNotes(meeting.meeting_id, value);
    }

    if (success) closeActionModal();
  };

  // ============ View Modal Handlers ============
  const openViewModal = (meeting) => {
    setViewModal({ open: true, meeting });
  };

  const closeViewModal = () => {
    setViewModal({ open: false, meeting: null });
  };

  // Show searching indicator
  const showSearchingIndicator = isSearching && searchInput !== keyword;

  // ============ Status Config ============
  const statusConfig = {
    pending: { color: "blue", label: "Pending" },
    ongoing: { color: "orange", label: "Ongoing" },
    ended: { color: "green", label: "Completed" },
  };

  // ============ Helper: Strip HTML for preview ============
  const stripHtml = (html) => {
    if (!html) return "";
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  // ============ Table Columns ============
  const columns = [
    {
      title: "#",
      key: "index",
      width: 60,
      align: "center",
      render: (_, __, index) => (
        <span className="text-gray-500 font-medium">
          {(currentPage - 1) * limit + index + 1}
        </span>
      ),
    },
    {
      title: "Student",
      key: "student",
      width: 220,
      render: (_, record) => (
        <StudentInfoCell
          student={{
            name: record.student_name,
            nickname: record.student_nickname,
            avatar: record.student_avatar,
          }}
        />
      ),
    },
    {
      title: "Contact",
      key: "contact",
      width: 220,
      render: (_, record) => (
        <div className="space-y-1.5">
          <Tooltip title={record.student_email}>
            <a
              href={`mailto:${record.student_email}`}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
            >
              <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="truncate max-w-[160px]">
                {record.student_email}
              </span>
            </a>
          </Tooltip>
          <a
            href={`tel:+2${record.student_phone}`}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors"
          >
            <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span dir="ltr">{record.student_phone}</span>
          </a>
        </div>
      ),
    },
    {
      title: "Date & Time",
      key: "datetime",
      width: 180,
      sorter: (a, b) => new Date(a.slot_date) - new Date(b.slot_date),
      render: (_, record) => (
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{record.slot_date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>
              {record.start_time?.slice(0, 5)} - {record.end_time?.slice(0, 5)}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      key: "status",
      width: 120,
      align: "center",
      // filters: [
      //   { text: "Pending", value: "pending" },
      //   { text: "Ongoing", value: "ongoing" },
      //   { text: "Completed", value: "ended" },
      // ],
      // onFilter: (value, record) => record.status === value,
      render: (_, record) => {
        const config = statusConfig[record.status] || statusConfig.pending;
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    {
      title: "Meeting Link",
      dataIndex: "meeting_url",
      key: "meeting_url",
      width: 140,
      align: "center",
      render: (url) =>
        url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 font-medium text-sm transition-colors"
          >
            <Video className="w-4 h-4" />
            Join
            <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <span className="text-gray-400 text-sm">Not set</span>
        ),
    },

    {
      title: "Student Notes",
      dataIndex: "student_notes",
      key: "student_notes",
      width: 200,
      render: (notes) =>
        notes ? (
          <Tooltip
            title={
              <div className="max-w-xs">
                <p className="font-medium mb-1 flex items-center gap-1">
                  Student Notes
                </p>
                <p className="text-gray-200">{notes}</p>
              </div>
            }
          >
            <div className="flex items-start gap-2">
              <span className="text-gray-600 line-clamp-2 text-sm">
                {notes}
              </span>
            </div>
          </Tooltip>
        ) : (
          <span className="text-gray-400 text-sm italic">No student notes</span>
        ),
    },
    {
      title: "Notes",
      key: "notes",
      width: 200,
      render: (_, record) => {
        const hasStudentNotes = record.student_notes?.trim();
        const hasDoctorNotes = record.doctor_notes?.trim();
        const doctorNotesPreview = stripHtml(record.doctor_notes);

        return (
          <div className="space-y-2">
            {/* Preview Text */}
            {hasDoctorNotes && (
              <p className="text-xs text-gray-500 line-clamp-1">
                {doctorNotesPreview}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => openViewModal(record)}
                className="text-xs text-gray-600 hover:text-primary flex items-center gap-1 transition-colors"
              >
                <Eye className="w-3 h-3" />
                View
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => openNotesModal(record)}
                className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
              >
                <Edit3 className="w-3 h-3" />
                {hasDoctorNotes ? "Edit" : "Add"}
              </button>
            </div>
          </div>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 90,
      align: "center",
      render: (_, record) => {
        const isPending = record.status === "pending";
        const isOngoing = record.status === "ongoing";
        const isEnded = record.status === "ended";

        const menuItems = [
          // View Notes
          {
            key: "view-notes",
            icon: <Eye className="w-4 h-4 text-gray-600" />,
            label: "View Notes",
            onClick: () => openViewModal(record),
          },
          { type: "divider" },
          // Start Meeting
          isPending && {
            key: "start",
            icon: <Play className="w-4 h-4 text-green-600" />,
            label: "Start Meeting",
            onClick: () => startMeeting(record.meeting_id),
          },
          // End Meeting
          isOngoing && {
            key: "end",
            icon: <Square className="w-4 h-4 text-orange-600" />,
            label: "End Meeting",
            onClick: () => endMeeting(record.meeting_id),
          },
          // Update Link
          !isEnded && {
            key: "link",
            icon: <Link className="w-4 h-4 text-blue-600" />,
            label: record.meeting_url ? "Update Link" : "Add Link",
            onClick: () => openLinkModal(record),
          },
          // Edit Notes
          {
            key: "notes",
            icon: <Stethoscope className="w-4 h-4 text-purple-600" />,
            label: record.doctor_notes
              ? "Edit Doctor Notes"
              : "Add Doctor Notes",
            onClick: () => openNotesModal(record),
          },
          // Cancel
          !isEnded && { type: "divider" },
          !isEnded && {
            key: "cancel",
            icon: <Trash2 className="w-4 h-4" />,
            label: (
              <Popconfirm
                title="Cancel this meeting?"
                description="This action cannot be undone."
                onConfirm={() => cancelMeeting(record.meeting_id)}
                okText="Yes, Cancel"
                cancelText="No"
                okButtonProps={{ danger: true }}
              >
                <span className="text-red-600">Cancel Meeting</span>
              </Popconfirm>
            ),
            danger: true,
          },
        ].filter(Boolean);

        return (
          <Dropdown
            menu={{ items: menuItems }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button
              type="text"
              icon={<MoreVertical className="w-5 h-5" />}
              className="hover:bg-gray-100"
            />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Reserved Meetings
          </h1>
          <p className="text-gray-500 mt-1">
            Manage and track all your scheduled appointments
          </p>
        </div>

        <Button
          icon={
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          }
          onClick={refresh}
          loading={loading}
          size="large"
        >
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Meetings</p>
              <p className="text-2xl font-bold text-gray-900">
                {pagination.total_records}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-blue-600">
                {meetings.filter((m) => m.status === "pending").length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Ongoing</p>
              <p className="text-2xl font-bold text-orange-600">
                {meetings.filter((m) => m.status === "ongoing").length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
              <Play className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {meetings.filter((m) => m.status === "ended").length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
              <Video className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex-1 w-full">
            <Input
              placeholder="Search by student name, email, or phone..."
              value={searchInput}
              onChange={onSearchChange}
              prefix={
                showSearchingIndicator ? (
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                ) : (
                  <Search className="w-5 h-5 text-gray-400" />
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
              size="large"
              allowClear={false}
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500 whitespace-nowrap">
            {showSearchingIndicator ? (
              <span className="flex items-center gap-2 text-primary">
                <span>Searching...</span>
              </span>
            ) : keyword ? (
              <span>
                Found <strong>{pagination.total_records}</strong> result
                {pagination.total_records !== 1 ? "s" : ""} for "
                <strong>{keyword}</strong>"
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={meetings}
        loading={loading}
        searchable={false}
        rowKey="meeting_id"
        pageSize={limit}
        showPagination={false}
        emptyText={
          keyword
            ? `No meetings found matching "${keyword}"`
            : "No reserved meetings found"
        }
        emptyIcon={Calendar}
        scroll={{ x: 1400 }}
        rowClassName={(record) => {
          switch (record.status) {
            case "ended":
              return "row-ended";
            case "ongoing":
              return "row-ongoing";
            case "pending":
              return "row-pending";
            default:
              return "";
          }
        }}
      />

      {/* Custom Pagination */}
      {pagination.total_pages > 0 && (
        <div className="flex justify-center pt-2">
          <Pagination
            current={currentPage}
            total={pagination.total_records}
            pageSize={limit}
            onChange={handlePageChange}
            showSizeChanger
            pageSizeOptions={["5", "10", "20", "50"]}
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} of ${total} meetings`
            }
            showQuickJumper
          />
        </div>
      )}

      {/* Action Modal - For Doctor Notes & Link */}
      <MeetingActionModal
        open={actionModal.open}
        onClose={closeActionModal}
        type={actionModal.type}
        meeting={actionModal.meeting}
        onSave={handleActionModalSave}
        loading={actionLoading}
      />

      {/* View Notes Modal */}
      <NotesViewModal
        open={viewModal.open}
        onClose={closeViewModal}
        meeting={viewModal.meeting}
        onEdit={openNotesModal}
      />
    </div>
  );
};

export default ReservedMeetings;
