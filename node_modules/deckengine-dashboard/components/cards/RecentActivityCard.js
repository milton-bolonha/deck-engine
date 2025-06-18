"use client";

export default function RecentActivityCard({ activities = [] }) {
  return (
    <div className="gaming-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          <i className="fas fa-history text-blue-500 mr-2"></i>
          Recent Activity
        </h2>
        <button className="text-sm text-primary-500 hover:text-primary-700">
          View All
        </button>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-8">
          <i className="fas fa-clock text-4xl text-slate-300 dark:text-slate-600 mb-3"></i>
          <p className="text-slate-500 dark:text-slate-400">
            No recent activity
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start space-x-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                  activity.type === "pipeline_created"
                    ? "bg-blue-500"
                    : activity.type === "match_started"
                    ? "bg-green-500"
                    : activity.type === "match_completed"
                    ? "bg-purple-500"
                    : activity.type === "user_created"
                    ? "bg-indigo-500"
                    : "bg-slate-500"
                }`}
              >
                <i className={activity.icon}></i>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-900 dark:text-slate-100">
                  {activity.title}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {formatTimestamp(activity.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatTimestamp(timestamp) {
  const now = new Date();
  const diff = now - new Date(timestamp);

  if (diff < 60000) {
    // Less than 1 minute
    return "just now";
  } else if (diff < 3600000) {
    // Less than 1 hour
    return `${Math.floor(diff / 60000)} min ago`;
  } else if (diff < 86400000) {
    // Less than 1 day
    return `${Math.floor(diff / 3600000)} hours ago`;
  } else {
    return new Date(timestamp).toLocaleDateString();
  }
}
