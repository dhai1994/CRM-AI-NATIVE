// src/components/StatCard.jsx
const StatCard = ({ title, value, subtitle }) => {
  return (
    <div className="relative flex flex-col justify-between rounded-2xl bg-[#111318] border border-[#262730] px-4 py-3 sm:px-5 sm:py-4 shadow-[0_10px_30px_rgba(0,0,0,0.7)] hover:border-[#3f404c] hover:bg-[#14161d] transition-colors duration-150">
      {/* Top label row */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-medium text-[#9ca3af]">
          {title}
        </span>
      </div>

      {/* Value */}
      <div className="mt-2">
        <span className="text-xl sm:text-2xl font-semibold text-[#e5e7eb]">
          {value}
        </span>
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p className="mt-1 text-[11px] text-[#6b7280]">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default StatCard;