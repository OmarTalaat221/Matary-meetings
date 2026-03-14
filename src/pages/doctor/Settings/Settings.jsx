// src/pages/doctor/Settings/Settings.jsx
import { Card, InputNumber, Input, Divider, Alert } from "antd";
import {
  Hash,
  Link,
  FileText,
  RefreshCw,
  Video,
  Clock,
  CheckCircle,
  ExternalLink,
  Save,
  X,
  AlertCircle,
} from "lucide-react";
import { useRef, useMemo } from "react";
import JoditEditor from "jodit-react";

import Button from "../../../components/common/Button";
import useSettingsData from "./useSettingsData";

const Settings = () => {
  const {
    settings,
    hasChanges,
    saving,
    updateField,
    saveChanges,
    discardChanges,
    resetToDefaults,
  } = useSettingsData();

  const editorRef = useRef(null);

  // Jodit config
  const editorConfig = useMemo(
    () => ({
      readonly: false,
      placeholder: "Write your meeting instructions here...",
      height: 300,
      toolbarButtonSize: "medium",
      buttons: [
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "|",
        "ul",
        "ol",
        "|",
        "font",
        "fontsize",
        "brush",
        "|",
        "align",
        "outdent",
        "indent",
        "|",
        "link",
        "|",
        "hr",
        "table",
        "|",
        "undo",
        "redo",
        "|",
        "source",
      ],
      removeButtons: ["about", "image"],
      showCharsCounter: true,
      showWordsCounter: true,
      showXPathInStatusbar: false,
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      defaultActionOnPaste: "insert_clear_html",
    }),
    []
  );

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">
            Manage your meeting preferences and configurations
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={resetToDefaults}
          className="!text-gray-500"
        >
          <RefreshCw size={16} className="mr-2" />
          Reset to Defaults
        </Button>
      </div>

      {/* Unsaved Changes Alert */}
      {hasChanges && (
        <Alert
          type="warning"
          showIcon
          icon={<AlertCircle size={18} />}
          message="You have unsaved changes"
          description="Don't forget to save your changes before leaving this page."
          className="!border-amber-200 !bg-amber-50"
        />
      )}

      {/* Meeting Settings */}
      <Card className="!shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
            <Video size={20} className="text-emerald-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Meeting Configuration
            </h2>
            <p className="text-sm text-gray-500">
              Set up your meeting preferences
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Max Meetings Per Day */}
          <div className="flex items-start justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mt-1">
                <Hash size={18} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  Maximum Meetings Per Day
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Limit the number of meetings you can have in a single day.
                  This helps manage your workload.
                </p>
              </div>
            </div>
            <InputNumber
              min={1}
              max={20}
              value={settings.maxMeetingsPerDay}
              onChange={(value) => updateField("maxMeetingsPerDay", value)}
              size="large"
              className="!w-24"
              controls
            />
          </div>

          <Divider className="my-0" />

          {/* Static Meeting Link */}
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Link size={18} className="text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">
                  Static Meeting Link
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Your permanent meeting room link. This will be shared with
                  students when they book appointments.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Input
                size="large"
                placeholder="https://meet.google.com/xxx-xxxx-xxx or https://zoom.us/j/xxxxxxxxx"
                value={settings.meetingLink}
                onChange={(e) => updateField("meetingLink", e.target.value)}
                prefix={<Video size={16} className="text-gray-400" />}
                className="flex-1"
              />
              {settings.meetingLink && (
                <Button
                  variant="ghost"
                  onClick={() => window.open(settings.meetingLink, "_blank")}
                  className="!px-3"
                >
                  <ExternalLink size={18} />
                </Button>
              )}
            </div>

            {/* Link Status */}
            {settings.meetingLink && (
              <div className="mt-3 flex items-center gap-2 text-sm text-green-600">
                <CheckCircle size={14} />
                <span>Meeting link is set</span>
              </div>
            )}

            {/* Supported Platforms */}
            <div className="mt-4 flex flex-wrap gap-2">
              {["Google Meet", "Zoom", "Microsoft Teams", "Webex"].map(
                (platform) => (
                  <span
                    key={platform}
                    className="px-2 py-1 bg-white rounded-md text-xs text-gray-500 border"
                  >
                    {platform}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Instructions Card */}
      <Card className="!shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
            <FileText size={20} className="text-amber-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Meeting Instructions
            </h2>
            <p className="text-sm text-gray-500">
              Guidelines shown to students before meetings
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 mb-4">
          <p className="text-sm text-amber-700">
            <strong>💡 Tip:</strong> These instructions will be shown to
            students when they book a meeting with you. Include any preparation
            requirements, rules, or important information.
          </p>
        </div>

        {/* Jodit Editor */}
        <div className="border rounded-xl overflow-hidden">
          <JoditEditor
            ref={editorRef}
            value={settings.instructions}
            config={editorConfig}
            tabIndex={1}
            onBlur={(newContent) => updateField("instructions", newContent)}
          />
        </div>
      </Card>

      {/* Quick Stats */}
      <Card className="!shadow-sm !bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-100">
        <div className="flex items-center gap-3 mb-4">
          <Clock size={20} className="text-emerald-600" />
          <h3 className="font-semibold text-emerald-900">
            Current Configuration
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-white/60 rounded-xl text-center">
            <div className="text-2xl font-bold text-emerald-700">
              {settings.maxMeetingsPerDay}
            </div>
            <div className="text-xs text-emerald-600 mt-1">
              Max Daily Meetings
            </div>
          </div>
          <div className="p-4 bg-white/60 rounded-xl text-center">
            <div className="text-2xl font-bold text-emerald-700">
              {settings.meetingLink ? "✓" : "✗"}
            </div>
            <div className="text-xs text-emerald-600 mt-1">Meeting Link</div>
          </div>
          <div className="p-4 bg-white/60 rounded-xl text-center">
            <div className="text-2xl font-bold text-emerald-700">
              {settings.instructions ? "✓" : "✗"}
            </div>
            <div className="text-xs text-emerald-600 mt-1">Instructions</div>
          </div>
        </div>
      </Card>

      {/* Save Actions - Sticky Footer */}
      <div
        className={`sticky bottom-0 -mx-6 px-6 py-4 bg-white border-t shadow-lg transition-all duration-300 ${
          hasChanges
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <p className="text-sm text-gray-600">
            <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
            You have unsaved changes
          </p>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={discardChanges} disabled={saving}>
              <X size={16} className="mr-2" />
              Discard
            </Button>
            <Button
              variant="primary"
              onClick={saveChanges}
              loading={saving}
              disabled={saving}
            >
              <Save size={16} className="mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
