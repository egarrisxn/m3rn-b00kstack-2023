import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";

const AuthContext = createContext();

export const AuthProvider = ({ children, userData }) => {
  const [user, setUser] = useLocalStorage("user", userData);
  console.log("Initial user data:", userData);
  const navigate = useNavigate();

  const value = useMemo(() => {
    const login = async (data) => {
      setUser(data);
      navigate("/protected/profile", { replace: true });
    };

    const logout = () => {
      setUser(null);
      navigate("/", { replace: true });
    };

    return {
      user,
      login,
      logout,
    };
  }, [user, setUser, navigate]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
