"use client";

export default function MetricsCard({
  title,
  value,
  icon,
  iconColor = "text-slate-500",
  trend = null,
  trendColor = "text-slate-500",
  animated = false,
}) {
  return (
    <div className={`gaming-card p-6 ${animated ? "animate-glow" : ""}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {value}
          </p>
          {trend && <p className={`text-xs ${trendColor} mt-1`}>{trend}</p>}
        </div>

        <div className={`text-2xl ${iconColor}`}>
          <i className={icon}></i>
        </div>
      </div>
    </div>
  );
}
