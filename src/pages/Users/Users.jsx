// @mui material components
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";

// Material Dashboard 2 PRO React components
import MDBox from "@/components/MDBox";
import MDTypography from "@/components/MDTypography";

import { DataGrid } from "@mui/x-data-grid";

// Material Dashboard 2 PRO React examples
import DashboardLayout from "./DashboardLayout";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { useState, useEffect } from "react";

// Data
import userTableLayout from "./userTableLayout";
import defaultUser from "./defaultUser";
import { getUsers, getGroups, getRoles } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import { Log, LogInfo, LogError, LogEnable } from "../../utils/Logger";
import { UserDetail } from "./UserDetail";

export const UserPage = () => {
  const [selectedUser, setSelectedUser] = useState({
    ...defaultUser,
    verifypassword: defaultUser.password,
  });
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [tableData, setTableData] = useState(userTableLayout);
  const { user } = useAuth();

  LogEnable();

  useEffect(() => {
    getUsers(user.authInfo.token).then((response) => {
      const users = { ...userTableLayout, rows: response.data };
      setTableData(users);

      getGroups(user.authInfo.token).then((response) => {
        setGroups(response.data);

        getRoles(user.authInfo.token).then((response) => {
          setRoles(response.data);
          setLoading(false);
        });
      });
    });
  }, []);

  const onFieldChange = (ev) => {
    setSelectedUser({
      ...selectedUser,
      [ev.target.id]: ev.target.value,
    });
  };

  const handleGroupChange = (ev) => {
    setGroupId(ev.target.value);
  };

  const handleRoleChange = (ev) => {
    setRoleId(ev.target.value);
  };

  const onAddClicked = () => {
    setSelectedUser(defaultUser);
  };

  const onRowClick = (table) => {
    setSelectedUser({
      ...table.row,
      password: "*******",
      verifypassword: "*******",
    });
  };

  const onSubmit = (data) => {
    alert(JSON.stringify(data));
  };

  if (loading) {
    return (
      <DashboardLayout>
        <center>
          <CircularProgress color="inherit" />
        </center>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <MDBox pt={0} pb={0}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Card>
              <MDBox p={3} lineHeight={0}>
                <MDTypography variant="h6" fontWeight="medium">
                  Users
                </MDTypography>
                <DataGrid
                  rows={tableData.rows}
                  columns={tableData.columns}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 15,
                      },
                    },
                  }}
                  onRowClick={onRowClick}
                  pageSizeOptions={[5, 10, 15, 20]}
                  checkboxSelection
                  disableRowSelectionOnClick
                  rowHeight={30}
                  columnHeaderHeight={30}
                  autoHeight
                />
              </MDBox>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card>
              <MDBox p={3} lineHeight={0}>
                <MDTypography variant="h6" fontWeight="medium">
                  User Detail
                </MDTypography>

                <UserDetail
                  selectedUser={selectedUser}
                  groups={groups}
                  roles={roles}
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      &nbsp;
      <Card>
        <Grid container spacing={2}>
          <Grid item xs={1}>
            <MDBox p={3} lineHeight={0}>
              <Button onClick={onAddClicked}>Add</Button>
            </MDBox>
          </Grid>
          <Grid item xs={1}>
            <MDBox p={3} lineHeight={0}>
              <Button onClick={onAddClicked}>Import</Button>
            </MDBox>
          </Grid>
          <Grid item xs={1}>
            <MDBox p={3} lineHeight={0}>
              <Button onClick={onAddClicked}>Export</Button>
            </MDBox>
          </Grid>
        </Grid>
      </Card>
    </DashboardLayout>
  );
};
