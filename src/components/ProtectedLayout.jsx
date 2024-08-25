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
          { label: "Groups/Roles", path: "groupsroles" },
          { label: "Users", path: "users" },
          { label: "Access", path: "access" }
        ]}
      />
      {outlet}
    </div>
  );
};
