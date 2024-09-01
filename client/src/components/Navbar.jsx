import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const Navbar = ({ pages }) => {
  const { user, logout } = useAuth();

  return (
    <header className="mb-8 sm:pt-2">
      <nav className="p-2 border rounded-lg shadow-md container mx-auto flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4 sm:gap-0 sm:p-4">
        <NavLink to="/" aria-label="Home" className="flex">
          <img src="/book.png" alt="Logo" className="size-8" />
          <span className="text-xl font-extrabold text-slate-600">
            m3rnb00kstack
          </span>
        </NavLink>
        <div className="flex items-center gap-2">
          {pages?.map((page) => (
            <NavLink
              key={page.path}
              to={page.path}
              style={({ isActive }) => {
                return {
                  color: isActive ? "red" : "inherit",
                };
              }}
              className={({ isActive, isPending }) => {
                return isActive ? "active" : isPending ? "pending" : "";
              }}
            >
              {page.label}
            </NavLink>
          ))}
          {!!user && (
            <NavLink
              key={"logout"}
              onClick={logout}
              className="px-2 py-1 border border-transparent text-xs sm:text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-red-500"
              aria-label="logout"
            >
              Logout
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  );
};
