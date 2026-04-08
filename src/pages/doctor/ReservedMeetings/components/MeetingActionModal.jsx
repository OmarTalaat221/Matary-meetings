// src/pages/doctor/ReservedMeetings/components/MeetingActionModal.jsx
import { useState, useEffect, useRef, useMemo } from "react";
import { Modal, Input, Button } from "antd";
import { Link, Stethoscope, X, MessageSquare, FileText } from "lucide-react";
import JoditEditor from "jodit-react";

const MeetingActionModal = ({
  open,
  onClose,
  type, // 'link' | 'notes'
  meeting,
  onSave,
  loading,
}) => {
  const [value, setValue] = useState("");
  const editorRef = useRef(null);

  // Jodit Editor Config
  const editorConfig = useMemo(
    () => ({
      readonly: false,
      placeholder: "Write your notes here...",
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
      ],
      removeButtons: ["about", "image", "source"],
      showCharsCounter: true,
      showWordsCounter: true,
      showXPathInStatusbar: false,
      askBeforePasteHTML: false,
      askBeforePasteFromWord: false,
      defaultActionOnPaste: "insert_clear_html",
    }),
    []
  );

  useEffect(() => {
    if (open && meeting) {
      if (type === "link") {
        setValue(meeting.meeting_url || "");
      } else {
        setValue(meeting.doctor_notes || "");
      }
    }
  }, [open, meeting, type]);

  const handleSave = () => {
    onSave(value);
  };

  const handleClose = () => {
    setValue("");
    onClose();
  };

  const isLink = type === "link";

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      footer={null}
      centered
      width={isLink ? 500 : 700}
      closeIcon={<X className="w-5 h-5" />}
      title={
        <div className="flex items-center gap-2">
          {isLink ? (
            <>
              <Link className="w-5 h-5 text-blue-600" />
              <span>Update Meeting Link</span>
            </>
          ) : (
            <>
              <Stethoscope className="w-5 h-5 text-purple-600" />
              <span>Doctor Notes</span>
            </>
          )}
        </div>
      }
      destroyOnHidden
    >
      <div className="pt-4 space-y-4">
        {/* Student Info */}
        {meeting && (
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-500">Student</p>
            <p className="font-medium text-gray-900">{meeting.student_name}</p>
            <p className="text-sm text-gray-500">
              {meeting.slot_date} • {meeting.start_time?.slice(0, 5)} -{" "}
              {meeting.end_time?.slice(0, 5)}
            </p>
          </div>
        )}

        {/* Show student notes if updating doctor notes */}
        {!isLink && meeting?.student_notes && (
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
            <div className="flex items-center gap-2 text-blue-700 mb-1">
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm font-medium">Student Notes</span>
            </div>
            <p className="text-sm text-blue-800">{meeting.student_notes}</p>
          </div>
        )}

        {/* Input Field */}
        {isLink ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meeting URL
            </label>
            <Input
              placeholder="https://meet.google.com/xxx-xxxx-xxx"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              prefix={<Link className="w-4 h-4 text-gray-400" />}
              size="large"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the meeting link (Zoom, Google Meet, etc.)
            </p>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Notes
            </label>
            {/* Rich Text Editor */}
            <div className="border rounded-xl overflow-hidden">
              <JoditEditor
                ref={editorRef}
                value={value}
                config={editorConfig}
                tabIndex={1}
                onBlur={(newContent) => setValue(newContent)}
                onChange={(newContent) => setValue(newContent)}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              💡 These notes can include meeting instructions, feedback, or any
              important information for this session.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button onClick={handleClose} size="large">
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleSave}
            loading={loading}
            size="large"
            disabled={isLink && !value.trim()}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default MeetingActionModal;
