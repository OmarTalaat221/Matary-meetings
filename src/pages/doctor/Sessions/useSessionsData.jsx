// src/pages/doctor/Sessions/useSessionsData.jsx
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { message } from "antd";
import api from "../../../api/axios";
import { SESSIONS_ENDPOINTS } from "../../../api/endpoints";

const DEFAULT_LIMIT = 9;

const useSessionsData = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    limit: DEFAULT_LIMIT,
    total_pages: 1,
    total_records: 0,
    has_next: false,
    has_prev: false,
  });

  // Get params from URL
  const currentPage = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || DEFAULT_LIMIT;
  const keyword = searchParams.get("keyword") || "";

  // ============ Update URL Params ============
  const updateParams = useCallback(
    (updates) => {
      const newParams = new URLSearchParams(searchParams);

      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          newParams.set(key, value.toString());
        } else {
          newParams.delete(key);
        }
      });

      setSearchParams(newParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  // ============ Fetch Sessions ============
  const fetchSessions = useCallback(
    async (page = currentPage, pageLimit = limit, searchKeyword = keyword) => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: pageLimit,
        };

        // Only add keyword if it exists
        if (searchKeyword && searchKeyword.trim()) {
          params.keyword = searchKeyword.trim();
        }

        const response = await api.get(SESSIONS_ENDPOINTS.LIST, { params });

        if (response.data.status === "success") {
          setSessions(response.data.data || []);
          setPagination(
            response.data.pagination || {
              current_page: page,
              limit: pageLimit,
              total_pages: 1,
              total_records: 0,
              has_next: false,
              has_prev: false,
            }
          );
        }
      } catch (error) {
        console.error("Error fetching sessions:", error);
        message.error("Failed to load sessions");
        setSessions([]);
      } finally {
        setLoading(false);
      }
    },
    [currentPage, limit, keyword]
  );

  // ============ Handle Page Change ============
  const handlePageChange = useCallback(
    (page, pageSize) => {
      updateParams({
        page: page,
        limit: pageSize || limit,
      });
    },
    [updateParams, limit]
  );

  // ============ Handle Search ============
  const handleSearch = useCallback(
    (value) => {
      updateParams({
        keyword: value || "",
        page: 1, // Reset to first page on search
      });
    },
    [updateParams]
  );

  // ============ Clear Search ============
  const clearSearch = useCallback(() => {
    updateParams({
      keyword: "",
      page: 1,
    });
  }, [updateParams]);

  // ============ Create Session ============
  const createSession = async (sessionData) => {
    setActionLoading(true);
    try {
      const response = await api.post(SESSIONS_ENDPOINTS.CREATE, sessionData);

      if (response.data.status === "success") {
        message.success("Session created successfully");
        await fetchSessions(1, limit, keyword); // Refresh list from page 1
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error creating session:", error);
      message.error(
        error.response?.data?.message || "Failed to create session"
      );
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // ============ Update Session ============
  const updateSession = async (session_id, sessionData) => {
    setActionLoading(true);
    try {
      const response = await api.patch(SESSIONS_ENDPOINTS.UPDATE, {
        session_id,
        ...sessionData,
      });

      if (response.data.status === "success") {
        // Update local state
        setSessions((prev) =>
          prev.map((session) =>
            session.id === session_id ? { ...session, ...sessionData } : session
          )
        );
        message.success("Session updated successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating session:", error);
      message.error(
        error.response?.data?.message || "Failed to update session"
      );
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // ============ Delete Session ============
  const deleteSession = async (session_id) => {
    setActionLoading(true);
    try {
      const response = await api.delete(`${SESSIONS_ENDPOINTS.DELETE}`, {
        data: { session_id: session_id },
      });

      if (response.data.status === "success") {
        // Refresh the list to get correct pagination
        await fetchSessions(currentPage, limit, keyword);
        message.success("Session deleted successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting session:", error);
      message.error(
        error.response?.data?.message || "Failed to delete session"
      );
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // ============ Refresh ============
  const refresh = useCallback(() => {
    fetchSessions(currentPage, limit, keyword);
  }, [fetchSessions, currentPage, limit, keyword]);

  // ============ Fetch on params change ============
  useEffect(() => {
    fetchSessions(currentPage, limit, keyword);
  }, [currentPage, limit, keyword]);

  return {
    sessions,
    loading,
    actionLoading,
    pagination,
    currentPage,
    limit,
    keyword,
    fetchSessions,
    createSession,
    updateSession,
    deleteSession,
    handlePageChange,
    handleSearch,
    clearSearch,
    refresh,
  };
};

export default useSessionsData;
