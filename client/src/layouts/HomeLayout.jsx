import { Navigate, useOutlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Navbar } from "../components/Navbar";

export function HomeLayout() {
  const { user } = useAuth();
  const outlet = useOutlet();

  if (user) {
    return <Navigate to="/protected/profile" replace />;
  }

  return (
    <main className="min-h-screen mx-auto">
      <Navbar
        pages={[
          { label: "Books", path: "allbooks" },
          { label: "Login", path: "login" },
        ]}
      />
      {outlet}
    </main>
  );
}
