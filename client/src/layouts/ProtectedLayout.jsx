import { Navigate, useOutlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Navbar } from "../components/Navbar";

export function ProtectedLayout() {
  const { user } = useAuth();
  const outlet = useOutlet();

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <main className="min-h-screen mx-auto">
      <Navbar
        pages={[
          { label: "Books", path: "allbooks" },
          { label: "List", path: "books" },
          { label: "Profile", path: "profile" },
        ]}
      />
      {outlet}
    </main>
  );
}
