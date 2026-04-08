// src/pages/doctor/ReservedMeetings/useReservedMeetingsData.jsx
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { message } from "antd";
import api from "../../../api/axios";

const DEFAULT_LIMIT = 10;

const useReservedMeetingsData = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [meetings, setMeetings] = useState([]);
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

  // ============ Fetch Meetings ============
  const fetchMeetings = useCallback(
    async (page = currentPage, pageLimit = limit, searchKeyword = keyword) => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: pageLimit,
        };

        if (searchKeyword && searchKeyword.trim()) {
          params.keyword = searchKeyword.trim();
        }

        const response = await api.get("/meetings/list", { params });

        if (response.data.status === "success") {
          // Transform data to match the expected format
          const transformedData = (response.data.data || []).map((meeting) => ({
            ...meeting,
            meeting_id: meeting.meeting_id || meeting.id,
            student_name: meeting.student_data?.student_name || "",
            student_email: meeting.student_data?.student_email || "",
            student_phone: meeting.student_data?.phone || "",
            student_nickname: meeting.student_data?.student_nickname || "",
            student_avatar: meeting.student_data?.student_avater_url || "",
            student_notes: meeting.sudent_notes || meeting.student_notes || "",
            doctor_notes: meeting.doctor_notes || "",
            // Calculate status based on is_started and is_ended
            status: meeting.is_ended
              ? "ended"
              : meeting.is_started
                ? "ongoing"
                : "pending",
          }));

          setMeetings(transformedData);
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
        console.error("Error fetching meetings:", error);
        message.error("Failed to load meetings");
        setMeetings([]);
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
        page: 1,
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

  // ============ Refresh ============
  const refresh = useCallback(() => {
    fetchMeetings(currentPage, limit, keyword);
  }, [fetchMeetings, currentPage, limit, keyword]);

  // ============ Meeting Action (Single Endpoint) ============
  const meetingAction = async (meetingId, action, data = {}) => {
    setActionLoading(true);
    try {
      const payload = {
        meeting_id: meetingId,
        action: action,
        notes: data.notes || "",
        meeting_url: data.meeting_url || "",
      };

      const response = await api.patch("/meetings/action", payload);

      if (response.data.status === "success") {
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  // ============ Start Meeting ============
  const startMeeting = async (meetingId) => {
    try {
      const success = await meetingAction(meetingId, "start");

      if (success) {
        setMeetings((prev) =>
          prev.map((m) =>
            m.meeting_id === meetingId
              ? { ...m, is_started: 1, status: "ongoing" }
              : m
          )
        );
        message.success("Meeting started successfully");
        return true;
      }
      return false;
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to start meeting");
      return false;
    }
  };

  // ============ End Meeting ============
  const endMeeting = async (meetingId) => {
    try {
      const success = await meetingAction(meetingId, "end");

      if (success) {
        setMeetings((prev) =>
          prev.map((m) =>
            m.meeting_id === meetingId
              ? { ...m, is_ended: 1, status: "ended" }
              : m
          )
        );
        message.success("Meeting ended successfully");
        return true;
      }
      return false;
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to end meeting");
      return false;
    }
  };

  // ============ Update Meeting Link ============
  const updateMeetingLink = async (meetingId, meetingUrl) => {
    try {
      const success = await meetingAction(meetingId, "update_link", {
        meeting_url: meetingUrl,
      });

      if (success) {
        setMeetings((prev) =>
          prev.map((m) =>
            m.meeting_id === meetingId ? { ...m, meeting_url: meetingUrl } : m
          )
        );
        message.success("Meeting link updated successfully");
        return true;
      }
      return false;
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to update meeting link"
      );
      return false;
    }
  };

  // ============ Update Doctor Notes ============
  const updateMeetingNotes = async (meetingId, notes) => {
    try {
      const success = await meetingAction(meetingId, "update_notes", {
        notes: notes,
      });

      if (success) {
        setMeetings((prev) =>
          prev.map((m) =>
            m.meeting_id === meetingId ? { ...m, doctor_notes: notes } : m
          )
        );
        message.success("Notes updated successfully");
        return true;
      }
      return false;
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to update notes");
      return false;
    }
  };

  // ============ Cancel Meeting ============
  const cancelMeeting = async (meetingId) => {
    setActionLoading(true);
    try {
      const response = await api.delete("/meetings/cancel", {
        data: { meeting_id: meetingId },
      });

      if (response.data.status === "success") {
        // Refresh to get correct pagination
        await fetchMeetings(currentPage, limit, keyword);
        message.success("Meeting cancelled successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error cancelling meeting:", error);
      message.error(
        error.response?.data?.message || "Failed to cancel meeting"
      );
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  // ============ Fetch on params change ============
  useEffect(() => {
    fetchMeetings(currentPage, limit, keyword);
  }, [currentPage, limit, keyword]);

  return {
    meetings,
    loading,
    actionLoading,
    pagination,
    currentPage,
    limit,
    keyword,
    fetchMeetings,
    startMeeting,
    endMeeting,
    updateMeetingLink,
    updateMeetingNotes,
    cancelMeeting,
    handlePageChange,
    handleSearch,
    clearSearch,
    refresh,
  };
};

export default useReservedMeetingsData;
