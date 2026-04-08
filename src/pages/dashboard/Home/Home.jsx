// src/pages/dashboard/Home.jsx
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Video,
  Plus,
  Users,
  BarChart3,
  ArrowRight,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import Button from "../../../components/common/Button";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const stats = [
    {
      label: "Total Meetings",
      value: "24",
      icon: Calendar,
      color: "bg-primary",
      trend: "+12%",
      trendUp: true,
    },
    {
      label: "Upcoming",
      value: "8",
      icon: Clock,
      color: "bg-blue-500",
      trend: "+5%",
      trendUp: true,
    },
    {
      label: "Completed",
      value: "16",
      icon: CheckCircle,
      color: "bg-green-500",
      trend: "+18%",
      trendUp: true,
    },
    {
      label: "Cancelled",
      value: "2",
      icon: XCircle,
      color: "bg-red-500",
      trend: "-3%",
      trendUp: false,
    },
  ];

  const upcomingMeetings = [
    {
      id: 1,
      title: "Daily Team Standup",
      time: "10:00 AM",
      duration: "30 min",
      participants: 5,
      status: "starting",
    },
    {
      id: 2,
      title: "Project Review",
      time: "2:00 PM",
      duration: "1 hour",
      participants: 8,
      status: "upcoming",
    },
    {
      id: 3,
      title: "Client Call",
      time: "4:30 PM",
      duration: "45 min",
      participants: 3,
      status: "upcoming",
    },
  ];

  const quickActions = [
    { icon: Plus, label: "New Meeting", color: "bg-primary" },
  ];

  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back! Here's an overview of your meetings
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    {stat.value}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.trendUp ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        stat.trendUp ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {stat.trend}
                    </span>
                    <span className="text-sm text-gray-400">vs last week</span>
                  </div>
                </div>
                <div
                  className={`${stat.color} w-14 h-14 rounded-xl flex items-center justify-center shadow-lg`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Meetings */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              Today's Meetings
            </h2>
            <Button
              onClick={() => navigate("/meetings")}
              variant="ghost"
              className="!py-2 !px-3 text-sm gap-1"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="p-6 space-y-4">
            {upcomingMeetings.map((meeting) => (
              <div
                key={meeting.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Video className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {meeting.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {meeting.time}
                      </span>
                      <span className="text-sm text-gray-400">•</span>
                      <span className="text-sm text-gray-500">
                        {meeting.duration}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {meeting.participants}
                    </span>
                  </div>
                  {/* <Button
                    variant={
                      meeting.status === "starting" ? "accent" : "primary"
                    }
                    className="!py-2 !px-4 text-sm"
                  >
                    {meeting.status === "starting" ? "Join Now" : "View"}
                  </Button> */}
                </div>
              </div>
            ))}

            {upcomingMeetings.length === 0 && (
              <div className="text-center py-8">
                <Video className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No meetings scheduled for today</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {/* <h2 className="text-lg font-semibold text-gray-800 mb-6">
            Quick Actions
          </h2>
          <div className="space-y-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors text-left cursor-pointer group"
                >
                  <div
                    className={`${action.color} w-12 h-12 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-medium text-gray-700">
                    {action.label}
                  </span>
                </button>
              );
            })}
          </div> */}

          {/* Additional Info */}
          <div className="">
            <h3 className="text-lg font-medium text-black font-bold mb-3">
              This Week Summary
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Meetings Held</span>
                <span className="font-medium text-gray-800">12</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total Duration</span>
                <span className="font-medium text-gray-800">8.5 hours</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Participants</span>
                <span className="font-medium text-gray-800">45</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
