import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
import { loginUserAsync } from "../services/api";
import { config } from "../config";
import { Log } from "../utils/Logger";

const AuthContext = createContext();

export const AuthProvider = ({ children, userData }) => {
  const [user, setUser] = useLocalStorage("user", userData);
  const navigate = useNavigate();

  const login = async (data) => {

    const loginResult = await loginUserAsync({
      username: data.email,
      password: data.password,
    });

    if (loginResult.error_code == 401) {
      throw new Error("Invalid userid/password");
    }

    if (loginResult.error_code != 200) {
      throw new Error("Unable to login");
    }

    setUser(loginResult.data);

    const url = `${config.APP_BASEPATH}/dashboard/home`;
    Log(`url: ${url}`);

    navigate(url, { replace: true });
  };

  const logout = () => {
    setUser(null);

    const url = `${config.APP_BASEPATH}/`;
    Log(`url: ${url}`);

    navigate(url, { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
