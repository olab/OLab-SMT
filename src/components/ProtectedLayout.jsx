import { Navigate, useOutlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { AppBar } from "./AppBar";

export const ProtectedLayout = () => {
  const { user } = useAuth();
  const outlet = useOutlet();

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <AppBar
        pages={[
          { label: "Home", path: "home" },
          { label: "Users", path: "users" },
          { label: "Groups", path: "profile" },
          { label: "Roles", path: "profile" },
          { label: "Access", path: "profile" }
        ]}
      />
      {outlet}
    </div>
  );
};
