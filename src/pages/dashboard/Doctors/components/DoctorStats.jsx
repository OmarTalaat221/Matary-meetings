import { Users, UserCheck, UserX, BookOpen, CalendarDays } from "lucide-react";

const DoctorStats = ({ stats }) => {
  const statsData = [
    {
      title: "Total Doctors",
      value: stats.totalDoctors,
      icon: Users,
      color: "bg-blue-500",
      bgLight: "bg-blue-50",
    },
    {
      title: "Active Doctors",
      value: stats.activeDoctors,
      icon: UserCheck,
      color: "bg-green-500",
      bgLight: "bg-green-50",
    },
    {
      title: "Inactive Doctors",
      value: stats.inactiveDoctors,
      icon: UserX,
      color: "bg-red-500",
      bgLight: "bg-red-50",
    },
    {
      title: "Total Lectures",
      value: stats.totalLectures,
      icon: BookOpen,
      color: "bg-purple-500",
      bgLight: "bg-purple-50",
    },
    {
      title: "Upcoming Lectures",
      value: stats.upcomingLectures,
      icon: CalendarDays,
      color: "bg-orange-500",
      bgLight: "bg-orange-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div
                className={`${stat.bgLight} ${stat.color} bg-opacity-10 p-3 rounded-lg`}
              >
                <Icon className={`w-6 h-6 text-white`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DoctorStats;
