import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";

const apiUrl = import.meta.env.VITE_API_URL;

export function Dashboard() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.token) {
        setError("User not authenticated.");
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/users/me`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(`Failed to fetch user data: ${error.message}`);
      }
    };

    fetchData();
  }, [user?.token]);

  return (
    <div className="container text-center sm:text-justify mx-auto p-6 space-y-1">
      <h1 className="sm:text-xl font-bold text-gray-800">
        Welcome, {userData?.email || "Guest"}! {/* Display fetched email */}
      </h1>
      {error && <p className="text-red-500">{error}</p>}
      <p className="sm:text-lg text-blue-600 font-medium">
        Start adding to your list now!
      </p>
    </div>
  );
}
