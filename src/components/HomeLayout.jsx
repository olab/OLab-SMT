import { Navigate, useOutlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { AppBar } from "./AppBar";
import { config } from "../config";

export const HomeLayout = () => {
  const { user } = useAuth();
  const outlet = useOutlet();

  if (user) {
    return <Navigate to={`${config.APP_BASEPATH}/dashboard/home`} replace />;
  }

  return (
    <div>
      <AppBar
        pages={[]}
      />
      {outlet}
    </div>
  );
};
