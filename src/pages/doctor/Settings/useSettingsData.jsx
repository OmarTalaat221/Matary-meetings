// src/pages/doctor/Settings/useSettingsData.jsx
import { useState, useEffect, useCallback, useMemo } from "react";
import { message } from "antd";

const STORAGE_KEY = "doctor_settings";

// Default settings
const defaultSettings = {
  maxMeetingsPerDay: 8,
  meetingLink: "",
  instructions: "",
};

// Load settings from localStorage
const loadSettings = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...defaultSettings, ...JSON.parse(saved) };
    }
    return defaultSettings;
  } catch (error) {
    console.error("Error loading settings:", error);
    return defaultSettings;
  }
};

export const useSettingsData = () => {
  // Saved settings (from localStorage)
  const [savedSettings, setSavedSettings] = useState(() => loadSettings());

  // Current form values (may have unsaved changes)
  const [formValues, setFormValues] = useState(() => loadSettings());

  // Loading state
  const [saving, setSaving] = useState(false);

  // Check if there are unsaved changes
  const hasChanges = useMemo(() => {
    return JSON.stringify(savedSettings) !== JSON.stringify(formValues);
  }, [savedSettings, formValues]);

  // Update form field
  const updateField = useCallback((key, value) => {
    setFormValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // Save all changes
  const saveChanges = useCallback(async () => {
    setSaving(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formValues));

      // Update saved settings
      setSavedSettings(formValues);

      message.success("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      message.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  }, [formValues]);

  // Discard changes
  const discardChanges = useCallback(() => {
    setFormValues(savedSettings);
    message.info("Changes discarded");
  }, [savedSettings]);

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    setFormValues(defaultSettings);
    setSavedSettings(defaultSettings);
    localStorage.removeItem(STORAGE_KEY);
    message.success("Settings reset to defaults");
  }, []);

  return {
    settings: formValues,
    savedSettings,
    hasChanges,
    saving,
    updateField,
    saveChanges,
    discardChanges,
    resetToDefaults,
  };
};

export default useSettingsData;
