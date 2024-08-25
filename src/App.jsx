import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  defer
} from "react-router-dom";

import { LoginPage } from "./pages/Login";
import { UserPage } from "./pages/Users/Users";
import { AclPage } from "./pages/Acls/Acls";
import { HomePage } from "./pages/Home";
import { GroupsRolesPage } from "./pages/GroupsRoles";
import { SettingsPage } from "./pages/Settings";
import { ProtectedLayout } from "./components/ProtectedLayout";
import { HomeLayout } from "./components/HomeLayout";
import "./styles.css";
import { AuthLayout } from "./components/AuthLayout";
import { config } from "./config";

// ideally this would be an API call to server to get logged in user data

const getUserData = () =>
  new Promise((resolve) =>
    setTimeout(() => {
      const user = window.localStorage.getItem("user");
      resolve(user);
    }, 3000)
  );

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      element={<AuthLayout />}
      loader={() => defer({ userPromise: getUserData() })}
    >
      <Route element={<HomeLayout />}>
        <Route path={`${config.APP_BASEPATH}`} element={<LoginPage />} />
      </Route>

      <Route path={`${config.APP_BASEPATH}/dashboard`} element={<ProtectedLayout />}>
        <Route path="users" element={<UserPage />} />
        <Route path="access" element={<AclPage />} />
        <Route path="home" element={<HomePage />} />
        <Route path="groupsroles" element={<GroupsRolesPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Route>
  )
);
