// src/layout/AdminLayout.jsx
import { Navigate, Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { getToken, logout } from "../api";

const navItems = [
  { label: "Dashboard", path: "/" },
  { label: "Properties", path: "/properties" },
  { label: "Site Settings", path: "/settings" },
  { label: "Property Types", path: "/property-types" },
  { label: "Featured", path: "/featured" },
  { label: "Videos", path: "/videos" },
  { label: "Reviews", path: "/reviews" },
];


export default function AdminLayout() {
  const token = getToken();
  const location = useLocation();
  const navigate = useNavigate();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen flex bg-[#050815] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0F172A] border-r border-white/5 flex flex-col">
        <div className="px-6 py-5 border-b border-white/10">
          <div className="text-lg font-bold tracking-wide">
            VPF <span className="text-yellow-400">Admin</span>
          </div>
          <p className="text-xs text-white/50 mt-1">
            Manage properties & content
          </p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-xl text-sm transition ${
                  active
                    ? "bg-yellow-400/10 text-yellow-300"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="px-4 py-4 border-t border-white/10 text-xs text-white/50">
          <button
            onClick={handleLogout}
            className="w-full text-left text-red-300 hover:text-red-200"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-[#020617]/80 backdrop-blur">
        <div className="text-sm text-white/60">
  {location.pathname === "/"
    ? "Dashboard"
    : location.pathname.startsWith("/properties")
    ? "Properties"
    : location.pathname.startsWith("/settings")
    ? "Site Settings"
    : location.pathname.startsWith("/property-types")
    ? "Property Types"
    : location.pathname.startsWith("/featured")
    ? "Featured"
    : location.pathname.startsWith("/videos")
    ? "Videos"
    : location.pathname.startsWith("/reviews")
    ? "Reviews"
    : ""}
</div>

          <div className="text-xs text-white/60">
            Signed in as <span className="font-semibold">admin</span>
          </div>
        </header>
        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
