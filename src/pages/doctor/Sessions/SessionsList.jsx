// src/pages/doctor/Sessions/SessionsList.jsx
import { useState, useEffect } from "react";
import { Input, Pagination, Empty, Spin } from "antd";
import { Search, Plus, BookOpen, RefreshCw, X, Loader2 } from "lucide-react";
import useSessionsData from "./useSessionsData";
import useDebounce from "../../../hooks/useDebounce";
import SessionCard from "./components/SessionCard";
import SessionModal from "./components/SessionModal";

const DEBOUNCE_DELAY = 500;

const SessionsList = () => {
  const {
    sessions,
    loading,
    actionLoading,
    pagination,
    currentPage,
    limit,
    keyword,
    createSession,
    updateSession,
    deleteSession,
    handlePageChange,
    handleSearch,
    clearSearch,
    refresh,
  } = useSessionsData();

  // Local state for search input
  const [searchInput, setSearchInput] = useState(keyword);
  const [isSearching, setIsSearching] = useState(false);

  // Modal state
  const [modalState, setModalState] = useState({
    open: false,
    session: null,
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

  // ============ Handlers ============
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

  const openCreateModal = () => {
    setModalState({ open: true, session: null });
  };

  const openEditModal = (session) => {
    setModalState({ open: true, session });
  };

  const closeModal = () => {
    setModalState({ open: false, session: null });
  };

  const handleSave = async (sessionData, sessionId) => {
    if (sessionId) {
      return await updateSession(sessionId, sessionData);
    } else {
      return await createSession(sessionData);
    }
  };

  const handleDelete = async (sessionId) => {
    await deleteSession(sessionId);
  };

  // Show searching indicator
  const showSearchingIndicator = isSearching && searchInput !== keyword;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sessions</h1>
          <p className="text-gray-500 mt-1">
            Create and manage your group sessions
          </p>
        </div>

        <div className="flex items-center gap-3">
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

          {/* Create Button */}
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Create Session</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Total Sessions</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {pagination.total_records}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Active</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {sessions.filter((s) => s.status === "active").length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">This Week</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {
              sessions.filter((s) => {
                const sessionDate = new Date(s.session_date);
                const today = new Date();
                const weekFromNow = new Date(
                  today.getTime() + 7 * 24 * 60 * 60 * 1000
                );
                return sessionDate >= today && sessionDate <= weekFromNow;
              }).length
            }
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Total Capacity</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">
            {sessions.reduce((sum, s) => sum + (s.student_limit || 0), 0)}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex-1 w-full">
            <Input
              placeholder="Search sessions by title, topic, or location..."
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

          {/* Search Status */}
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

      {/* Sessions Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Spin size="large" />
        </div>
      ) : sessions.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onEdit={openEditModal}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.total_pages > 1 && (
            <div className="flex justify-center pt-4">
              <Pagination
                current={currentPage}
                total={pagination.total_records}
                pageSize={limit}
                onChange={handlePageChange}
                showSizeChanger
                pageSizeOptions={["6", "9", "12", "24"]}
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} of ${total} sessions`
                }
              />
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div className="text-center py-8">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 text-lg">
                  {keyword
                    ? `No sessions found matching "${keyword}"`
                    : "No sessions yet"}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  {keyword
                    ? "Try adjusting your search"
                    : "Create your first session to get started"}
                </p>
                {!keyword && (
                  <button
                    onClick={openCreateModal}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Create Session
                  </button>
                )}
              </div>
            }
          />
        </div>
      )}

      {/* Session Modal */}
      <SessionModal
        open={modalState.open}
        onClose={closeModal}
        onSave={handleSave}
        session={modalState.session}
        loading={actionLoading}
      />
    </div>
  );
};

export default SessionsList;
