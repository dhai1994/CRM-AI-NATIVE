// src/components/Navbar.jsx
const Navbar = () => {
  return (
    <header className="h-14 border-b border-[#262730] bg-[#05060a]/95 backdrop-blur-xl flex items-center justify-between px-4 sm:px-6 lg:px-8">
      {/* Left: page title placeholder (you can make this dynamic later) */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-[#e5e7eb]">
          AI Native CRM
        </span>
      </div>

      {/* Right: simple profile pill */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col items-end leading-tight">
          <span className="text-[11px] font-medium text-[#e5e7eb]">
            DHAIRYA RATHORE
          </span>
          <span className="text-[10px] text-[#6b7280]">
            Admin
          </span>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#111318] border border-[#262730] text-[11px] font-semibold text-[#e5e7eb]">
          DR
        </div>
      </div>
    </header>
  );
};

export default Navbar;