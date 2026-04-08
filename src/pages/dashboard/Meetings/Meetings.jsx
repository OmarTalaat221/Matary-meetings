// src/pages/dashboard/Meetings/Meetings.jsx
import { Tag, Tooltip, Dropdown } from "antd";
import {
  Video,
  Edit,
  Trash2,
  Calendar,
  Users,
  Clock,
  MoreHorizontal,
  Eye,
  Copy,
  Link,
  CheckCircle,
  XCircle,
  Play,
} from "lucide-react";
import DataTable, {
  getColumnSearchProps,
  getColumnDateRangeProps,
  getColumnSelectFilterProps,
  getColumnNumberRangeProps,
} from "../../../components/common/DataTable";
import Button from "../../../components/common/Button";
import MeetingModal from "./components/MeetingModal";
import ViewMeetingModal from "./components/ViewMeetingModal";
import DeleteMeetingModal from "./components/DeleteMeetingModal";
import useMeetingsData from "./useMeetingsData";

const Meetings = () => {
  const {
    meetings,
    selectedRows,
    setSelectedRows,
    loading,
    modalState,
    currentMeeting,
    openModal,
    closeModal,
    addMeeting,
    editMeeting,
    deleteMeeting,
    bulkDeleteMeetings,
    copyMeetingLink,
    duplicateMeeting,
    changeStatus,
    statusConfig,
    statusFilters,
    statusOptions,
    typeOptions,
  } = useMeetingsData();

  // Action Menu
  const getActionItems = (record) => [
    {
      key: "view",
      label: "View Details",
      icon: <Eye className="w-4 h-4" />,
      onClick: ({ domEvent }) => {
        domEvent.stopPropagation();
        openModal("view", record);
      },
    },
    // {
    //   key: "edit",
    //   label: "Edit",
    //   icon: <Edit className="w-4 h-4" />,
    //   onClick: ({ domEvent }) => {
    //     domEvent.stopPropagation();
    //     openModal("edit", record);
    //   },
    // },
    {
      key: "copy",
      label: "Copy Link",
      icon: <Link className="w-4 h-4" />,
      onClick: ({ domEvent }) => {
        domEvent.stopPropagation();
        copyMeetingLink(record);
      },
    },
    // {
    //   key: "duplicate",
    //   label: "Duplicate",
    //   icon: <Copy className="w-4 h-4" />,
    //   onClick: ({ domEvent }) => {
    //     domEvent.stopPropagation();
    //     duplicateMeeting(record);
    //   },
    // },
    { type: "divider" },
    // ...(record.status !== "ongoing"
    //   ? [
    //       {
    //         key: "ongoing",
    //         label: "Mark as Ongoing",
    //         icon: <Play className="w-4 h-4" />,
    //         onClick: ({ domEvent }) => {
    //           domEvent.stopPropagation();
    //           changeStatus(record, "ongoing");
    //         },
    //       },
    //     ]
    //   : []),
    // ...(record.status !== "completed"
    //   ? [
    //       {
    //         key: "complete",
    //         label: "Mark as Completed",
    //         icon: <CheckCircle className="w-4 h-4" />,
    //         onClick: ({ domEvent }) => {
    //           domEvent.stopPropagation();
    //           changeStatus(record, "completed");
    //         },
    //       },
    //     ]
    //   : []),
    ...(record.status !== "cancelled"
      ? [
          {
            key: "cancel",
            label: "Cancel Meeting",
            icon: <XCircle className="w-4 h-4" />,
            onClick: ({ domEvent }) => {
              domEvent.stopPropagation();
              changeStatus(record, "cancelled");
            },
          },
        ]
      : []),
  ];

  // Table Columns
  const columns = [
    {
      title: "Meeting",
      dataIndex: "title",
      key: "title",
      width: 280,
      ...getColumnSearchProps("title", "Search by title..."),
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Video className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-gray-800 truncate">{text}</p>
            {record.description && (
              <p className="text-sm text-gray-500 truncate">
                {record.description}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Organizer",
      dataIndex: "organizer",
      key: "organizer",
      width: 150,
      ...getColumnSearchProps("organizer", "Search by organizer..."),
      render: (text) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium">
            {text?.charAt(0)}
          </div>
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 130,
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      ...getColumnDateRangeProps("date"),
      render: (text) => (
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      width: 100,
      render: (text) => (
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      width: 100,
      sorter: (a, b) => a.duration - b.duration,
      ...getColumnNumberRangeProps("duration"),
      render: (value) => <span>{value} min</span>,
    },
    {
      title: "Participants",
      dataIndex: "participants",
      key: "participants",
      width: 120,
      align: "center",
      sorter: (a, b) => a.participants - b.participants,
      render: (value) => (
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <Users className="w-4 h-4" />
          <span>{value}</span>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center",
      ...getColumnSelectFilterProps("status", statusFilters),
      render: (status) => (
        <Tag color={statusConfig[status]?.color}>
          {statusConfig[status]?.label}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      align: "center",
      onCell: () => ({
        onClick: (e) => e.stopPropagation(),
      }),
      render: (_, record) => (
        <div className="flex items-center justify-center gap-1">
          {/* <Tooltip title="Edit">
            <button
              onClick={() => openModal("edit", record)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <Edit className="w-4 h-4 text-gray-600" />
            </button>
          </Tooltip> */}
          <Dropdown
            menu={{ items: getActionItems(record) }}
            trigger={["click"]}
            placement="bottomRight"
          >
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
              <MoreHorizontal className="w-4 h-4 text-gray-600" />
            </button>
          </Dropdown>
        </div>
      ),
    },
  ];

  // Row Selection
  const rowSelection = {
    selectedRowKeys: selectedRows,
    onChange: (keys) => setSelectedRows(keys),
    onSelect: (record, selected, selectedRows, e) => {
      e?.stopPropagation?.();
    },
    onSelectAll: (selected, selectedRows, changeRows, e) => {
      e?.stopPropagation?.();
    },
  };

  // Row ClassName
  const getRowClassName = (record) => {
    if (record.status === "cancelled") return "row-error";
    if (record.status === "ongoing") return "row-warning";
    return "";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Meetings</h1>
          <p className="text-gray-600 mt-1">Manage all your meetings</p>
        </div>

        {selectedRows.length > 0 && (
          <div className="flex items-center gap-3 bg-primary/5 px-4 py-2 rounded-lg">
            <span className="text-primary font-medium">
              {selectedRows.length} selected
            </span>
            <Button
              variant="accent"
              className="!py-1.5 !px-3 text-sm"
              onClick={() => openModal("bulkDelete")}
            >
              <Trash2 className="w-4 h-4" />
              Delete Selected
            </Button>
          </div>
        )}
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={meetings}
        rowKey="id"
        searchable
        searchPlaceholder="Search meetings..."
        addButton={false}
        onAddClick={() => openModal("add")}
        rowSelection={rowSelection}
        rowClassName={getRowClassName}
        onRowClick={(record) => openModal("view", record)}
        emptyText="No meetings found"
        emptyIcon={Video}
      />

      {/* Add/Edit Modal */}
      <MeetingModal
        open={modalState.add || modalState.edit}
        onClose={() => closeModal(modalState.add ? "add" : "edit")}
        onSubmit={modalState.add ? addMeeting : editMeeting}
        initialData={modalState.edit ? currentMeeting : null}
        loading={loading}
        statusOptions={statusOptions}
        typeOptions={typeOptions}
      />

      {/* View Modal */}
      <ViewMeetingModal
        open={modalState.view}
        onClose={() => closeModal("view")}
        meeting={currentMeeting}
        statusConfig={statusConfig}
      />

      {/* Delete Modal */}
      <DeleteMeetingModal
        open={modalState.delete}
        onClose={() => closeModal("delete")}
        onConfirm={deleteMeeting}
        loading={loading}
        meetingTitle={currentMeeting?.title}
      />

      {/* Bulk Delete Modal */}
      <DeleteMeetingModal
        open={modalState.bulkDelete}
        onClose={() => closeModal("bulkDelete")}
        onConfirm={bulkDeleteMeetings}
        loading={loading}
        isBulk
        bulkCount={selectedRows.length}
      />
    </div>
  );
};

export default Meetings;
