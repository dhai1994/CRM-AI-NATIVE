// src/components/AgentCard.jsx
const AgentCard = ({ title, content }) => {
  return (
    <div className="rounded-2xl bg-[#05060a] border border-[#262730] shadow-[0_22px_70px_rgba(0,0,0,0.85)] p-4 sm:p-5 mt-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#111318] border border-[#262730] text-[11px]">
            ✅
          </span>
          <h2 className="text-sm font-semibold text-[#e5e7eb]">
            {title}
          </h2>
        </div>
        <span className="text-[10px] rounded-full bg-[#111318] border border-[#262730] px-2 py-0.5 text-[#9ca3af]">
          Agent Output
        </span>
      </div>

      {/* Content */}
      <pre className="mt-2 flex-1 whitespace-pre-wrap text-[11px] leading-relaxed text-[#e5e7eb] bg-[#0b0d13] rounded-xl p-3 border border-[#262730] max-h-64 overflow-y-auto">
        {content}
      </pre>
    </div>
  );
};

export default AgentCard;