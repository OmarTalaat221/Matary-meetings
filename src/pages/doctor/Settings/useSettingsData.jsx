import { useState, useCallback, useMemo, useEffect } from "react";
import { message } from "antd";
import api from "../../../api/axios";

const defaultSettings = {
  fixed_meeting_url: "",
  description: "",
};

export const useSettingsData = () => {
  const [savedSettings, setSavedSettings] = useState(defaultSettings);
  const [formValues, setFormValues] = useState(defaultSettings);

  const [loadingFetch, setLoadingFetch] = useState(true); // State للتحميل المبدئي
  const [saving, setSaving] = useState(false); // State لحفظ التعديلات

  // 1️⃣ جلب البيانات عند فتح الصفحة
  const fetchProfileSettings = async () => {
    setLoadingFetch(true);
    try {
      const response = await api.get("/auth/profile");

      if (response.data.status === "success") {
        const profileData = response.data.data;

        // تجهيز الداتا اللي محتاجينها للفورم
        const initialData = {
          fixed_meeting_url: profileData.fixed_meeting_url || "",
          description: profileData.description || "",
        };

        setSavedSettings(initialData);
        setFormValues(initialData);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      message.error("Failed to load settings data");
    } finally {
      setLoadingFetch(false);
    }
  };

  useEffect(() => {
    fetchProfileSettings();
  }, []);

  // التحقق من وجود تغييرات لم يتم حفظها
  const hasChanges = useMemo(() => {
    return JSON.stringify(savedSettings) !== JSON.stringify(formValues);
  }, [savedSettings, formValues]);

  // تحديث الحقول في الـ Form
  const updateField = useCallback((key, value) => {
    setFormValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // 2️⃣ حفظ التعديلات
  const saveChanges = async () => {
    setSaving(true);
    try {
      const payload = {
        description: formValues.description,
        fixed_meeting_url: formValues.fixed_meeting_url,
      };

      const response = await api.patch("/settings/update", payload);

      if (response.data.status === "success") {
        message.success(
          response.data.message || "Settings updated successfully!"
        );
        setSavedSettings(formValues);
      } else {
        message.error("Failed to update settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      message.error("Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  };

  // تجاهل التعديلات
  const discardChanges = useCallback(() => {
    setFormValues(savedSettings);
    message.info("Changes discarded");
  }, [savedSettings]);

  return {
    settings: formValues,
    savedSettings,
    hasChanges,
    saving,
    loadingFetch, // تصدير حالة التحميل
    updateField,
    saveChanges,
    discardChanges,
  };
};

export default useSettingsData;
