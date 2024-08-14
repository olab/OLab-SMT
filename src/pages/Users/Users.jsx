/**
=========================================================
* Material Dashboard 2 PRO React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";

// Material Dashboard 2 PRO React components
import MDBox from "@/components/MDBox";
import MDTypography from "@/components/MDTypography";
import TextField from "@mui/material/TextField";

// Material Dashboard 2 PRO React examples
import DashboardLayout from "./DashboardLayout";
import DataTable from "./DataTable";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid"
import { useState, useEffect } from "react";

// Data
import dataTableData from "./dataTableData";
import defaultUser from "./defaultUser";
import log from "loglevel";
import { getUsers } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

export const UserPage = () => {
  const { user } = useAuth();
  const [tableData, setTableData] = useState(dataTableData);
  const [loading, setLoading] = useState(true);
  const [formUser, setFormUser] = useState({
    ...defaultUser,
    verifypassword: defaultUser.password,
  });

  useEffect(() => {
    getUsers(user.authInfo.token).then((response) => {
      const users = { ...dataTableData, rows: response.data };
      setTableData(users);
      setLoading(false);
    });
  }, []);

  const onFieldChange = (ev) => {
    setFormUser((user) => ({
      ...user,
      [ev.target.id]: ev.target.value,
    }));
  };

  const onAddClicked = () => {
    setFormUser(defaultUser);
  };

  const onClickRow = (a, b, c, d) => {
    log.debug(`rowindex: ${a.currentTarget.rowIndex}`);
    const dataIndex = tableData.rows.findIndex(
      (x) => x.id === Number(a.currentTarget.attributes["name"].value)
    );
    setFormUser({
      ...tableData.rows[dataIndex],
      password: "*******",
      verifypassword: "*******",
    });
    log.debug(JSON.stringify(formUser));
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
          <Grid item xs={8}>
            <Card>
              <MDBox p={3} lineHeight={0}>
                <MDTypography variant="h6" fontWeight="medium">
                  Users
                </MDTypography>
              </MDBox>
              <DataTable onClickRow={onClickRow} table={tableData} canSearch />
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card>
              <MDBox p={3} lineHeight={0}>
                <MDTypography variant="h6" fontWeight="medium">
                  User
                </MDTypography>
              </MDBox>
              <MDBox
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                p={3}
              >
                <form onSubmit={onSubmit}>
                  <TextField
                    required
                    id="username"
                    label="User Id"
                    variant="filled"
                    value={formUser.userName}
                    onChange={(e) => onFieldChange(e)}
                  />
                  <TextField
                    required
                    id="nickname"
                    label="Name"
                    variant="filled"
                    value={formUser.nickName}
                    onChange={(e) => onFieldChange(e)}
                  />
                  <TextField
                    id="password"
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    variant="filled"
                    value={formUser.password}
                    onChange={(e) => onFieldChange(e)}
                  />
                  <TextField
                    id="verifypassword"
                    label="Verify Password"
                    type="password"
                    autoComplete="current-password"
                    variant="filled"
                    value={formUser.verifypassword}
                    onChange={(e) => onFieldChange(e)}
                  />
                </form>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      &nbsp;
      <Card>
        <MDBox p={3} lineHeight={0}>
          <Button onClick={onAddClicked}>Add</Button>
        </MDBox>
      </Card>
    </DashboardLayout>
  );
};
