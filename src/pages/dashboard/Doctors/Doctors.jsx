import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Tag, Dropdown, Space, Tooltip } from "antd";
import {
  UserPlus,
  Eye,
  Edit,
  Trash2,
  Calendar,
  MoreVertical,
  Users,
  UserCheck,
  UserX,
  BookOpen,
  CalendarDays,
} from "lucide-react";
import { useDoctorsData } from "./useDoctorsData";
import DataTable from "../../../components/common/DataTable";
import DoctorModal from "./components/DoctorModal";
import ViewDoctorModal from "./components/ViewDoctorModal";
import DeleteDoctorModal from "./components/DeleteDoctorModal";
import DoctorStats from "./components/DoctorStats";

const Doctors = () => {
  const navigate = useNavigate();
  const {
    doctors,
    stats,
    statusConfig,
    addDoctor,
    updateDoctor,
    deleteDoctor,
  } = useDoctorsData();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // Handle row click
  const handleRowClick = (record) => {
    setSelectedDoctor(record);
    setIsViewModalOpen(true);
  };

  // Handle edit
  const handleEdit = (doctor, e) => {
    e.stopPropagation();
    setSelectedDoctor(doctor);
    setIsEditModalOpen(true);
  };

  // Handle delete
  const handleDelete = (doctor, e) => {
    e.stopPropagation();
    setSelectedDoctor(doctor);
    setIsDeleteModalOpen(true);
  };

  // Handle view calendar
  const handleViewCalendar = (doctor, e) => {
    e.stopPropagation();
    navigate(`/doctors/${doctor.id}/calendar`);
  };

  // Action menu items
  const getActionMenu = (record) => ({
    items: [
      {
        key: "view",
        label: "View Details",
        icon: <Eye className="w-4 h-4" />,
        onClick: (e) => {
          e.domEvent.stopPropagation();
          setSelectedDoctor(record);
          setIsViewModalOpen(true);
        },
      },
      {
        key: "calendar",
        label: "View Calendar",
        icon: <Calendar className="w-4 h-4" />,
        onClick: (e) => {
          e.domEvent.stopPropagation();
          handleViewCalendar(record, e.domEvent);
        },
      },
      // {
      //   key: "edit",
      //   label: "Edit",
      //   icon: <Edit className="w-4 h-4" />,
      //   onClick: (e) => {
      //     e.domEvent.stopPropagation();
      //     handleEdit(record, e.domEvent);
      //   },
      // },
      // {
      //   type: "divider",
      // },
      // {
      //   key: "delete",
      //   label: "Delete",
      //   icon: <Trash2 className="w-4 h-4" />,
      //   danger: true,
      //   onClick: (e) => {
      //     e.domEvent.stopPropagation();
      //     handleDelete(record, e.domEvent);
      //   },
      // },
    ],
  });

  // Table columns
  const columns = [
    {
      title: "Doctor",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name, record) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-semibold">
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </span>
          </div>
          <div>
            <div className="font-medium text-gray-900">{name}</div>
            <div className="text-sm text-gray-500">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Specialization",
      dataIndex: "specialization",
      key: "specialization",
      sorter: (a, b) => a.specialization.localeCompare(b.specialization),
      filters: [
        { text: "Cardiology", value: "Cardiology" },
        { text: "Neurology", value: "Neurology" },
        { text: "Orthopedics", value: "Orthopedics" },
        { text: "Pediatrics", value: "Pediatrics" },
        { text: "General Surgery", value: "General Surgery" },
      ],
      onFilter: (value, record) => record.specialization === value,
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      sorter: (a, b) => a.department.localeCompare(b.department),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Active", value: "active" },
        { text: "Inactive", value: "inactive" },
        { text: "On Leave", value: "onLeave" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        const config = statusConfig[status] || statusConfig.active;
        return (
          <Tag color={config.color} className="rounded-full px-3">
            {config.label}
          </Tag>
        );
      },
    },
    {
      title: "Lectures",
      dataIndex: "lectures",
      key: "lecturesCount",
      sorter: (a, b) => a.lectures.length - b.lectures.length,
      render: (lectures) => (
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-gray-400" />
          <span className="font-medium">{lectures.length}</span>
        </div>
      ),
    },
    {
      title: "Join Date",
      dataIndex: "joinDate",
      key: "joinDate",
      sorter: (a, b) => new Date(a.joinDate) - new Date(b.joinDate),
      render: (date) =>
        new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      width: 100,
      render: (_, record) => (
        <div
          className="flex items-center justify-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <Tooltip title="View Calendar">
            <Button
              type="text"
              size="small"
              icon={<Calendar className="w-4 h-4" />}
              onClick={(e) => handleViewCalendar(record, e)}
            />
          </Tooltip>
          <Dropdown menu={getActionMenu(record)} trigger={["click"]}>
            <Button
              type="text"
              size="small"
              icon={<MoreVertical className="w-4 h-4" />}
              onClick={(e) => e.stopPropagation()}
            />
          </Dropdown>
        </div>
      ),
    },
  ];

  // Bulk actions
  const bulkActions =
    selectedRowKeys.length > 0 ? (
      <Space>
        <span className="text-sm text-gray-600">
          {selectedRowKeys.length} selected
        </span>
        <Button
          danger
          icon={<Trash2 className="w-4 h-4" />}
          onClick={() => {
            // Handle bulk delete
            console.log("Bulk delete:", selectedRowKeys);
          }}
        >
          Delete Selected
        </Button>
      </Space>
    ) : null;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Doctors</h1>
          <p className="text-gray-600 mt-1">
            Manage doctors and their schedules
          </p>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<UserPlus className="w-5 h-5" />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add New Doctor
        </Button>
      </div>

      {/* Statistics */}
      <DoctorStats stats={stats} />

      {/* Table */}
      <DataTable
        columns={columns}
        dataSource={doctors}
        rowKey="id"
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
          className: "cursor-pointer hover:bg-gray-50",
        })}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        extraActions={bulkActions}
      />

      {/* Modals */}
      <DoctorModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={(data) => {
          addDoctor(data);
          setIsAddModalOpen(false);
        }}
      />

      <DoctorModal
        open={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedDoctor(null);
        }}
        doctor={selectedDoctor}
        onSubmit={(data) => {
          updateDoctor(selectedDoctor.id, data);
          setIsEditModalOpen(false);
          setSelectedDoctor(null);
        }}
      />

      <ViewDoctorModal
        open={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedDoctor(null);
        }}
        doctor={selectedDoctor}
        onEdit={(doctor) => {
          setIsViewModalOpen(false);
          setSelectedDoctor(doctor);
          setIsEditModalOpen(true);
        }}
        onDelete={(doctor) => {
          setIsViewModalOpen(false);
          setSelectedDoctor(doctor);
          setIsDeleteModalOpen(true);
        }}
        onViewCalendar={(doctor) => {
          setIsViewModalOpen(false);
          navigate(`/doctors/${doctor.id}/calendar`);
        }}
      />

      <DeleteDoctorModal
        open={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedDoctor(null);
        }}
        doctor={selectedDoctor}
        onConfirm={() => {
          deleteDoctor(selectedDoctor.id);
          setIsDeleteModalOpen(false);
          setSelectedDoctor(null);
        }}
      />
    </div>
  );
};

export default Doctors;
