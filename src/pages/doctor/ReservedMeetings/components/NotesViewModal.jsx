// src/pages/doctor/ReservedMeetings/components/NotesViewModal.jsx
import { Modal } from "antd";
import {
  X,
  Stethoscope,
  MessageSquare,
  Calendar,
  Clock,
  User,
  FileText,
} from "lucide-react";

const NotesViewModal = ({ open, onClose, meeting, onEdit }) => {
  if (!meeting) return null;

  const hasStudentNotes = meeting.student_notes?.trim();
  const hasDoctorNotes = meeting.doctor_notes?.trim();
  const hasAnyNotes = hasStudentNotes || hasDoctorNotes;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={650}
      closeIcon={<X className="w-5 h-5" />}
      title={
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <span>Meeting Notes</span>
        </div>
      }
      destroyOnClose
    >
      <div className="pt-4 space-y-4">
        {/* Meeting Info Header */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {meeting.student_name}
              </p>
              {meeting.student_nickname && (
                <p className="text-sm text-gray-500">
                  @{meeting.student_nickname}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>{meeting.slot_date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>
                {meeting.start_time?.slice(0, 5)} -{" "}
                {meeting.end_time?.slice(0, 5)}
              </span>
            </div>
          </div>
        </div>

        {/* Notes Content */}
        {hasAnyNotes ? (
          <div className="space-y-4">
            {/* Student Notes */}
            {hasStudentNotes && (
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center gap-2 text-blue-700 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="font-medium">Student Notes</span>
                </div>
                <div className="text-blue-900 text-sm leading-relaxed pl-10">
                  {meeting.student_notes}
                </div>
              </div>
            )}

            {/* Doctor Notes */}
            {hasDoctorNotes && (
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-purple-700">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Stethoscope className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="font-medium">Doctor Notes</span>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onEdit(meeting);
                    }}
                    className="text-xs text-purple-600 hover:text-purple-800 font-medium transition-colors"
                  >
                    Edit
                  </button>
                </div>
                {/* Render HTML content */}
                <div
                  className="text-purple-900 text-sm leading-relaxed pl-10 prose prose-sm prose-purple max-w-none"
                  dangerouslySetInnerHTML={{ __html: meeting.doctor_notes }}
                />
              </div>
            )}
          </div>
        ) : (
          /* No Notes */
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-1">No notes for this meeting</p>
            <p className="text-sm text-gray-400">
              Add doctor notes to keep track of important information
            </p>
            <button
              onClick={() => {
                onClose();
                onEdit(meeting);
              }}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              <Stethoscope className="w-4 h-4" />
              Add Notes
            </button>
          </div>
        )}

        {/* Footer Actions */}
        {hasAnyNotes && (
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onEdit(meeting);
              }}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <Stethoscope className="w-4 h-4" />
              {hasDoctorNotes ? "Edit Doctor Notes" : "Add Doctor Notes"}
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default NotesViewModal;
