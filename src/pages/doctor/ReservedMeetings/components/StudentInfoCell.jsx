// src/pages/doctor/ReservedMeetings/components/StudentInfoCell.jsx
import { User } from "lucide-react";

const StudentInfoCell = ({ student }) => {
  return (
    <div className="flex items-center gap-3">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
        {student.avatar ? (
          <img
            src={student.avatar}
            alt={student.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        <div
          className={`w-full h-full items-center justify-center bg-primary/10 ${
            student.avatar ? "hidden" : "flex"
          }`}
        >
          <User className="w-5 h-5 text-primary" />
        </div>
      </div>

      {/* Info */}
      <div className="min-w-0">
        <p className="font-medium text-gray-900 truncate">{student.name}</p>
        {student.nickname && (
          <p className="text-xs text-gray-500 truncate">@{student.nickname}</p>
        )}
      </div>
    </div>
  );
};

export default StudentInfoCell;
