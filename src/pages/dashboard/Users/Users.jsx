// src/pages/dashboard/Users/Users.jsx
import { useNavigate } from "react-router-dom";
import { Tag, Avatar, Dropdown, Space, Card } from "antd";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Calendar,
  UserPlus,
  Users as UsersIcon,
  BookOpen,
} from "lucide-react";
import dayjs from "dayjs";

import DataTable from "../../../components/common/DataTable";
import Button from "../../../components/common/Button";
import useUsersData, { levels, statuses } from "./useUsersData";
import UserModal from "./components/UserModal";
import ViewUserModal from "./components/ViewUserModal";
import DeleteUserModal from "./components/DeleteUserModal";

const Users = () => {
  const navigate = useNavigate();

  const {
    users,
    currentUser,
    selectedRows,
    statistics,
    modalState,
    loading,
    openModal,
    closeModal,
    addUser,
    editUser,
    deleteUser,
    rowSelection,
    setSelectedRows,
  } = useUsersData();

  const getStatusInfo = (status) => statuses.find((s) => s.value === status);

  const getActionItems = (record) => [
    {
      key: "view",
      label: "View",
      icon: <Eye size={16} />,
      onClick: () => openModal("view", record),
    },
    // {
    //   key: "edit",
    //   label: "Edit",
    //   icon: <Edit size={16} />,
    //   onClick: () => openModal("edit", record),
    // },
    {
      key: "calendar",
      label: "View Schedule",
      icon: <Calendar size={16} />,
      onClick: () => navigate(`/users/${record.id}/calendar`),
    },
    // { type: "divider" },
    // {
    //   key: "delete",
    //   label: "Delete",
    //   icon: <Trash2 size={16} />,
    //   danger: true,
    //   onClick: () => openModal("delete", record),
    // },
  ];

  const columns = [
    {
      title: "Student",
      dataIndex: "name",
      key: "name",
      render: (name, record) => (
        <div className="flex items-center gap-3">
          <Avatar style={{ backgroundColor: "#1890ff" }}>
            {name.charAt(0)}
          </Avatar>
          <div>
            <div className="font-medium">{name}</div>
            <div className="text-sm text-gray-500">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
      width: 120,
      filters: levels.map((l) => ({ text: l.label, value: l.value })),
      onFilter: (value, record) => record.level === value,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      filters: statuses.map((s) => ({ text: s.label, value: s.value })),
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        const info = getStatusInfo(status);
        return <Tag color={info?.color}>{info?.label}</Tag>;
      },
    },
    {
      title: "Lectures",
      dataIndex: "meetings",
      key: "meetings",
      width: 120,
      align: "center",
      sorter: (a, b) => a.meetings.length - b.meetings.length,
      render: (meetings, record) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/users/${record.id}/calendar`);
          }}
        >
          <Calendar size={14} />
          {meetings.length}
        </Button>
      ),
    },
    {
      title: "Join Date",
      dataIndex: "joinDate",
      key: "joinDate",
      width: 120,
      render: (date) => dayjs(date).format("MM/DD/YYYY"),
    },
    {
      title: "",
      key: "actions",
      width: 50,
      align: "center",
      render: (_, record) => (
        <Dropdown
          menu={{ items: getActionItems(record) }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <button
            className="p-2 hover:bg-gray-100 rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal size={18} className="text-gray-500" />
          </button>
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-500">Manage student accounts</p>
        </div>
        {/* <Button onClick={() => openModal("add")}>
          <UserPlus size={18} />
          Add Student
        </Button> */}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card bodyStyle={{ padding: 16 }} className="text-center">
          <UsersIcon className="mx-auto mb-2 text-primary" size={24} />
          <div className="text-2xl font-bold">{statistics.total}</div>
          <div className="text-gray-500 text-sm">Total Students</div>
        </Card>
        <Card bodyStyle={{ padding: 16 }} className="text-center">
          <div className="w-6 h-6 mx-auto mb-2 rounded-full bg-green-500" />
          <div className="text-2xl font-bold text-green-600">
            {statistics.active}
          </div>
          <div className="text-gray-500 text-sm">Active</div>
        </Card>
        <Card bodyStyle={{ padding: 16 }} className="text-center">
          <div className="w-6 h-6 mx-auto mb-2 rounded-full bg-gray-300" />
          <div className="text-2xl font-bold text-gray-500">
            {statistics.inactive}
          </div>
          <div className="text-gray-500 text-sm">Inactive</div>
        </Card>
        <Card bodyStyle={{ padding: 16 }} className="text-center">
          <BookOpen className="mx-auto mb-2 text-blue-500" size={24} />
          <div className="text-2xl font-bold text-blue-600">
            {statistics.totalMeetings}
          </div>
          <div className="text-gray-500 text-sm">Total Lectures</div>
        </Card>
      </div>

      {/* Bulk Actions */}
      {selectedRows.length > 0 && (
        <div className="bg-primary/5 rounded-lg p-4 flex items-center justify-between">
          <span>{selectedRows.length} students selected</span>
          <Space>
            <Button
              variant="outline"
              size="sm"
              onClick={() => openModal("delete")}
            >
              <Trash2 size={16} /> Delete
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedRows([])}
            >
              Cancel
            </Button>
          </Space>
        </div>
      )}

      {/* Table */}
      <DataTable
        columns={columns}
        data={users}
        rowKey="id"
        loading={loading}
        searchable
        searchPlaceholder="Search by name or email..."
        rowSelection={rowSelection}
        onRowClick={(record) => openModal("view", record)}
      />

      {/* Modals */}
      <UserModal
        open={modalState.add}
        onCancel={() => closeModal("add")}
        onSubmit={addUser}
        loading={loading}
        mode="add"
      />

      <UserModal
        open={modalState.edit}
        onCancel={() => closeModal("edit")}
        onSubmit={editUser}
        loading={loading}
        mode="edit"
        initialData={currentUser}
      />

      <ViewUserModal
        open={modalState.view}
        onCancel={() => closeModal("view")}
        user={currentUser}
        onEdit={() => {
          closeModal("view");
          openModal("edit", currentUser);
        }}
        onViewCalendar={() => {
          closeModal("view");
          navigate(`/users/${currentUser?.id}/calendar`);
        }}
      />

      <DeleteUserModal
        open={modalState.delete}
        onCancel={() => closeModal("delete")}
        onConfirm={deleteUser}
        loading={loading}
        user={currentUser}
        count={selectedRows.length}
      />
    </div>
  );
};

export default Users;
