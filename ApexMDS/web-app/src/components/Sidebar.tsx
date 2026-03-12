import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Brain,
  BarChart3,
  FileText,
  BookOpen,
  GraduationCap,
  User,
  Activity
} from "lucide-react";

export default function Sidebar() {

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "AI Tutor", path: "/ai-tutor", icon: Brain },
    { name: "Analytics", path: "/analytics", icon: BarChart3 },
    { name: "Daily Quiz", path: "/daily-quiz", icon: GraduationCap},
    { name: "Mock Test", path: "/mock-tests", icon: GraduationCap },
    { name: "Previous Papers", path: "/previous-papers", icon: FileText },
    { name: "Ebooks", path: "/ebooks", icon: BookOpen },
    { name: "Profile", path: "/profile", icon: User },
  ];

  return (
    <aside className="w-64 bg-blue-900 text-slate-200 flex flex-col">

      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-200">

  <div className="w-10 h-10 bg-blue-800 rounded-xl flex items-center justify-center">
    <Activity className="w-6 h-6 text-white" />
  </div>

  <div>
    <p className="font-bold text-white-900">
      ApexMDS
    </p>
    <p className="text-xs text-slate-400">
      Smart Exam Prep
    </p>
  </div>

</div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">

        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${
                  isActive
                    ? "bg-slate-950 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              {item.name}
            </NavLink>
          );
        })}

      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800 text-xs text-white">
        © {new Date().getFullYear()} ApexMDS
      </div>

    </aside>
  );
}