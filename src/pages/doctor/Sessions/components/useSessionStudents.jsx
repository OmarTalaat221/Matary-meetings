// src/pages/doctor/Sessions/components/useSessionStudents.js
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { message } from "antd";
import api from "../../../../api/axios";

const DEFAULT_LIMIT = 1000000;

const useSessionStudents = (sessionId) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [students, setStudents] = useState([]);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    limit: DEFAULT_LIMIT,
    total_pages: 1,
    total_records: 0,
    has_next: false,
    has_prev: false,
  });

  // Get params from URL
  const keyword = searchParams.get("keyword") || "";
  const currentPage = 1;
  const limit = DEFAULT_LIMIT;

  // Fetch students
  const fetchStudents = useCallback(
    async (page = currentPage, pageLimit = limit, searchKeyword = keyword) => {
      if (!sessionId) return;

      setLoading(true);
      try {
        const params = {
          session_id: sessionId,
          page,
          limit: pageLimit,
        };

        // Only add keyword if it exists
        if (searchKeyword && searchKeyword.trim()) {
          params.keyword = searchKeyword.trim();
        }

        const response = await api.get("/sessions/students/list", { params });

        if (response.data.status === "success") {
          setStudents(response.data.data || []);
          setSessionInfo(response.data.session_info || null);
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
        console.error("Error fetching students:", error);
        message.error("Failed to load students");
        setStudents([]);
      } finally {
        setLoading(false);
      }
    },
    [sessionId, currentPage, limit, keyword]
  );

  // Update URL params
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

  // Handle page change
  const handlePageChange = useCallback(
    (page, pageSize) => {
      updateParams({
        page: page,
        limit: pageSize || limit,
      });
    },
    [updateParams, limit]
  );

  // Handle search (keyword for name, email, phone)
  const handleSearch = useCallback(
    (value) => {
      updateParams({
        keyword: value || "",
      });
    },
    [updateParams]
  );

  // Clear search
  const clearSearch = useCallback(() => {
    updateParams({
      keyword: "",
    });
  }, [updateParams]);

  // Refresh data
  const refresh = useCallback(() => {
    fetchStudents(currentPage, limit, keyword);
  }, [fetchStudents, currentPage, limit, keyword]);

  // Fetch on params change
  useEffect(() => {
    fetchStudents(currentPage, limit, keyword);
  }, [sessionId, currentPage, limit, keyword]);

  return {
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
  };
};

export default useSessionStudents;
