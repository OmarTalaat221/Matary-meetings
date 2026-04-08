// src/components/common/DataTable.jsx
import { useState, useMemo } from "react";
import { Table, Input, Button, Space, DatePicker, ConfigProvider } from "antd";
import { Search, Plus, RotateCcw, Filter } from "lucide-react";
import enUS from "antd/locale/en_US";

const { RangePicker } = DatePicker;

// ============ Filter Helpers ============

// Text Search Filter
export const getColumnSearchProps = (dataIndex, placeholder = "Search...") => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
  }) => (
    <div className="p-3 min-w-[200px]" style={{ direction: "ltr" }}>
      <Input
        placeholder={placeholder}
        value={selectedKeys[0]}
        onChange={(e) =>
          setSelectedKeys(e.target.value ? [e.target.value] : [])
        }
        onPressEnter={() => confirm()}
        className="mb-2"
        size="middle"
      />
      <Space className="flex justify-end mt-2 gap-2">
        <Button
          onClick={() => {
            clearFilters?.();
            confirm();
          }}
          size="small"
          icon={<RotateCcw className="w-4 h-4" />}
        >
          Reset
        </Button>
        <Button
          type="primary"
          onClick={() => confirm()}
          icon={<Search className="w-4 h-4" />}
          size="small"
        >
          Search
        </Button>
      </Space>
    </div>
  ),
  filterIcon: (filtered) => (
    <Search
      className={`w-4 h-4 ${filtered ? "text-primary" : "text-gray-400"}`}
    />
  ),
  onFilter: (value, record) => {
    const fieldValue = record[dataIndex];
    if (fieldValue == null) return false;
    return fieldValue.toString().toLowerCase().includes(value.toLowerCase());
  },
});

// Number Range Filter
export const getColumnNumberRangeProps = (dataIndex) => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
  }) => (
    <div className="p-3 min-w-[200px]" style={{ direction: "ltr" }}>
      <div className="flex gap-2 mb-2">
        <Input
          placeholder="Min"
          type="number"
          value={selectedKeys[0]?.min}
          onChange={(e) => {
            const min = e.target.value ? parseFloat(e.target.value) : undefined;
            const max = selectedKeys[0]?.max;
            setSelectedKeys(
              min !== undefined || max !== undefined ? [{ min, max }] : []
            );
          }}
          size="middle"
        />
        <Input
          placeholder="Max"
          type="number"
          value={selectedKeys[0]?.max}
          onChange={(e) => {
            const min = selectedKeys[0]?.min;
            const max = e.target.value ? parseFloat(e.target.value) : undefined;
            setSelectedKeys(
              min !== undefined || max !== undefined ? [{ min, max }] : []
            );
          }}
          size="middle"
        />
      </div>
      <Space className="flex justify-end mt-2 gap-2">
        <Button
          onClick={() => {
            clearFilters?.();
            confirm();
          }}
          size="small"
          icon={<RotateCcw className="w-4 h-4" />}
        >
          Reset
        </Button>
        <Button
          type="primary"
          onClick={() => confirm()}
          icon={<Search className="w-4 h-4" />}
          size="small"
        >
          Search
        </Button>
      </Space>
    </div>
  ),
  filterIcon: (filtered) => (
    <Filter
      className={`w-4 h-4 ${filtered ? "text-primary" : "text-gray-400"}`}
    />
  ),
  onFilter: (value, record) => {
    const num = parseFloat(record[dataIndex]);
    if (isNaN(num)) return false;
    const min = value?.min ?? -Infinity;
    const max = value?.max ?? Infinity;
    return num >= min && num <= max;
  },
});

// Date Range Filter
export const getColumnDateRangeProps = (dataIndex) => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
  }) => (
    <div className="p-3" style={{ direction: "ltr" }}>
      <RangePicker
        onChange={(dates, dateStrings) => {
          if (dateStrings && dateStrings[0] && dateStrings[1]) {
            setSelectedKeys([dateStrings]);
          } else {
            setSelectedKeys([]);
          }
        }}
        className="mb-2 w-full"
        placeholder={["Start date", "End date"]}
      />
      <Space className="flex justify-end mt-2 gap-2">
        <Button
          onClick={() => {
            clearFilters?.();
            confirm();
          }}
          size="small"
        >
          Reset
        </Button>
        <Button type="primary" onClick={() => confirm()} size="small">
          Apply
        </Button>
      </Space>
    </div>
  ),
  filterIcon: (filtered) => (
    <Filter
      className={`w-4 h-4 ${filtered ? "text-primary" : "text-gray-400"}`}
    />
  ),
  onFilter: (value, record) => {
    if (!value || value.length !== 2) return true;
    const [startDate, endDate] = value;
    const recordDate = new Date(record[dataIndex]);
    return recordDate >= new Date(startDate) && recordDate <= new Date(endDate);
  },
});

// Select Filter (for status, category, etc.)
export const getColumnSelectFilterProps = (dataIndex, filters) => ({
  filters: filters,
  filterIcon: (filtered) => (
    <Filter
      className={`w-4 h-4 ${filtered ? "text-primary" : "text-gray-400"}`}
    />
  ),
  onFilter: (value, record) => record[dataIndex] === value,
});

// ============ Main DataTable Component ============

const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  searchable = true,
  searchPlaceholder = "Search in table...",
  onSearch,
  addButton = false,
  addButtonText = "Add",
  onAddClick,
  rowKey = "id",
  pageSize = 10,
  showPagination = true,
  rowClassName,
  onRowClick,
  emptyText = "No data available",
  emptyIcon: EmptyIcon,
  headerExtra,
  ...rest
}) => {
  const [searchText, setSearchText] = useState("");

  // Global search filter
  const filteredData = useMemo(() => {
    if (!searchText || !searchable) return data;

    return data.filter((item) =>
      Object.values(item).some((value) => {
        if (value == null) return false;
        return value
          .toString()
          .toLowerCase()
          .includes(searchText.toLowerCase());
      })
    );
  }, [searchText, data, searchable]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    onSearch?.(value);
  };

  // Default row class for zebra striping
  const defaultRowClassName = (record, index) => {
    let className = index % 2 === 0 ? "table-row-light" : "table-row-dark";

    if (rowClassName) {
      const customClass = rowClassName(record, index);
      if (customClass) {
        className += ` ${customClass}`;
      }
    }

    if (onRowClick) {
      className += " cursor-pointer";
    }

    return className;
  };

  return (
    <ConfigProvider locale={enUS} direction="ltr">
      <div className="data-table-wrapper" style={{ direction: "ltr" }}>
        {/* Header Section */}
        {(searchable || addButton || headerExtra) && (
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center mb-4">
            {/* Search Input */}
            {searchable && (
              <div className="flex-1 w-full sm:max-w-md">
                <Input
                  placeholder={searchPlaceholder}
                  value={searchText}
                  onChange={handleSearchChange}
                  prefix={<Search className="w-5 h-5 text-gray-400" />}
                  allowClear
                  size="large"
                  style={{ direction: "ltr", textAlign: "left" }}
                />
              </div>
            )}

            {/* Header Extra & Add Button */}
            <div className="flex items-center gap-3">
              {headerExtra}

              {addButton && (
                <Button
                  type="primary"
                  onClick={onAddClick}
                  icon={<Plus className="w-5 h-5" />}
                  size="large"
                  className="flex items-center gap-2"
                >
                  {addButtonText}
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <Table
            columns={columns}
            dataSource={filteredData}
            loading={loading}
            rowKey={rowKey}
            rowHoverable={false}
            scroll={{ x: "max-content" }}
            pagination={
              showPagination
                ? {
                    pageSize: pageSize,
                    showSizeChanger: true,
                    showTotal: (total, range) =>
                      `${range[0]}-${range[1]} of ${total} items`,
                    pageSizeOptions: ["10", "20", "50", "100"],
                    locale: { items_per_page: "/ page" },
                  }
                : false
            }
            rowClassName={defaultRowClassName}
            onRow={(record, index) => ({
              onClick: () => onRowClick?.(record, index),
            })}
            locale={{
              emptyText: (
                <div className="py-12 text-center">
                  {EmptyIcon && (
                    <EmptyIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  )}
                  <p className="text-gray-500">{emptyText}</p>
                </div>
              ),
            }}
            {...rest}
          />
        </div>
      </div>
    </ConfigProvider>
  );
};

export default DataTable;
