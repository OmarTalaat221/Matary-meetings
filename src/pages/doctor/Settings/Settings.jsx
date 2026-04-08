import { Card, Input, Alert, Spin } from "antd"; // ⬅️ إضافة Spin
import {
  Link,
  FileText,
  Video,
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
    loadingFetch, // ⬅️ استقبال حالة التحميل
    updateField,
    saveChanges,
    discardChanges,
  } = useSettingsData();

  const editorRef = useRef(null);

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

  // ⬅️ إذا كان بيحمل الداتا، نعرض شاشة تحميل
  if (loadingFetch) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Spin size="large" />
        <p className="text-gray-500 font-medium animate-pulse">
          Loading settings...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 landscape:gap-4 max-w-4xl pb-20 landscape:pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row landscape:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl landscape:text-xl font-bold text-gray-900">
            Settings
          </h1>
          <p className="text-gray-600 text-sm landscape:text-xs">
            Manage your meeting preferences and instructions
          </p>
        </div>
      </div>

      {/* Unsaved Changes Alert */}
      {hasChanges && (
        <Alert
          type="warning"
          showIcon
          icon={
            <AlertCircle size={18} className="landscape:w-4 landscape:h-4" />
          }
          message={
            <span className="landscape:text-sm">You have unsaved changes</span>
          }
          description={
            <span className="landscape:text-xs">
              Don't forget to save your changes before leaving this page.
            </span>
          }
          className="!border-amber-200 !bg-amber-50"
        />
      )}

      {/* Meeting Settings Card */}
      <Card className="!shadow-sm">
        <div className="flex items-center gap-3 mb-6 landscape:mb-4">
          <div className="w-10 h-10 landscape:w-8 landscape:h-8 bg-emerald-100 rounded-xl flex items-center justify-center">
            <Video
              size={20}
              className="text-emerald-600 landscape:w-4 landscape:h-4"
            />
          </div>
          <div>
            <h2 className="text-lg landscape:text-base font-semibold text-gray-900">
              Meeting Configuration
            </h2>
            <p className="text-sm landscape:text-xs text-gray-500">
              Set up your meeting preferences
            </p>
          </div>
        </div>

        {/* Static Meeting Link */}
        <div className="p-4 landscape:p-3 bg-gray-50 rounded-xl">
          <div className="flex items-start gap-4 mb-4 landscape:mb-2">
            <div className="w-10 h-10 landscape:w-8 landscape:h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Link
                size={18}
                className="text-purple-600 landscape:w-4 landscape:h-4"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 landscape:text-sm">
                Static Meeting Link
              </h3>
              <p className="text-sm landscape:text-xs text-gray-500 mt-1">
                Your permanent meeting room link. This will be shared with
                students when they book appointments.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Input
              size="large"
              placeholder="https://meet.google.com/xxx-xxxx-xxx"
              value={settings.fixed_meeting_url}
              onChange={(e) => updateField("fixed_meeting_url", e.target.value)}
              prefix={<Video size={16} className="text-gray-400" />}
              className="flex-1 landscape:text-sm"
            />
            {settings.fixed_meeting_url && (
              <Button
                variant="ghost"
                onClick={() =>
                  window.open(settings.fixed_meeting_url, "_blank")
                }
                className="!px-3 landscape:h-auto"
              >
                <ExternalLink
                  size={18}
                  className="landscape:w-4 landscape:h-4"
                />
              </Button>
            )}
          </div>

          {/* Link Status */}
          {settings.fixed_meeting_url && (
            <div className="mt-3 flex items-center gap-2 text-sm landscape:text-xs text-green-600">
              <CheckCircle size={14} />
              <span>Meeting link is set</span>
            </div>
          )}
        </div>
      </Card>

      {/* Instructions Card */}
      <Card className="!shadow-sm">
        <div className="flex items-center gap-3 mb-6 landscape:mb-4">
          <div className="w-10 h-10 landscape:w-8 landscape:h-8 bg-amber-100 rounded-xl flex items-center justify-center">
            <FileText
              size={20}
              className="text-amber-600 landscape:w-4 landscape:h-4"
            />
          </div>
          <div>
            <h2 className="text-lg landscape:text-base font-semibold text-gray-900">
              Meeting Instructions
            </h2>
            <p className="text-sm landscape:text-xs text-gray-500">
              Guidelines shown to students before meetings
            </p>
          </div>
        </div>

        {/* Tip Info */}
        <div className="p-4 landscape:p-3 bg-amber-50 rounded-xl border border-amber-100 mb-4 landscape:mb-3">
          <p className="text-sm landscape:text-xs text-amber-700">
            <strong>💡 Tip:</strong> These instructions will be shown to
            students when they book a meeting. Include any preparation
            requirements or rules.
          </p>
        </div>

        {/* Jodit Editor */}
        <div className="border rounded-xl overflow-hidden">
          <JoditEditor
            ref={editorRef}
            value={settings.description}
            config={editorConfig}
            tabIndex={1}
            onBlur={(newContent) => updateField("description", newContent)}
          />
        </div>
      </Card>

      {/* Save Actions - Sticky Footer */}
      <div
        className={`fixed bottom-0 right-0 lg:left-64 left-0 px-6 py-4 landscape:py-2 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40 transition-all duration-300 ${
          hasChanges
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm landscape:text-xs text-gray-600 hidden sm:block">
            <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
            You have unsaved changes
          </p>
          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              variant="ghost"
              onClick={discardChanges}
              disabled={saving}
              className="flex-1 sm:flex-none justify-center landscape:h-8 landscape:text-xs"
            >
              <X size={16} className="mr-2 landscape:w-3 landscape:h-3" />
              Discard
            </Button>
            <Button
              variant="primary"
              onClick={saveChanges}
              loading={saving}
              disabled={saving}
              className="flex-1 sm:flex-none justify-center landscape:h-8 landscape:text-xs"
            >
              <Save size={16} className="mr-2 landscape:w-3 landscape:h-3" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
