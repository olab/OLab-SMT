import { BasicPage } from "../components/BasicPage";
import Person from "@mui/icons-material/Person";

export const UserPage = () => {
  return <BasicPage title="User Management" icon={<Person />} />;
};

/*
// import MDAlert from "@/components/MDAlert";

export const UserPage = () => {
  return (
    <MDAlert color="primary" dismissible>
      {"hello"}
    </MDAlert>
  );
};
*/
