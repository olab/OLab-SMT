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

// Material Dashboard 2 PRO React components
import MDBox from "@/components/MDBox";
import MDTypography from "@/components/MDTypography";
import TextField from "@mui/material/TextField";

// Material Dashboard 2 PRO React examples
import DashboardLayout from "./DashboardLayout";
import DataTable from "./DataTable";
import Button from "@mui/material/Button";
import { useState } from "react";

// Data
import dataTableData from "./dataTableData";
import defaultUser from "./defaultUser";
import log from "loglevel";

export const UserPage = () => {
  const [user, setUser] = useState({...defaultUser, verifypassword: defaultUser.password});

  const onFieldChange = (ev) => {
    setUser(user => ({
      ...user,
      [ev.target.id] : ev.target.value,
    }))
  }

  const onAddClicked = () => {
    setUser(defaultUser);
  }

  const onClickRow = (a, b, c, d) => {
    log.debug(`rowindex: ${a.currentTarget.rowIndex}`);
    setUser({ 
      ...dataTableData.rows[a.currentTarget.rowIndex - 1], 
      password: "*******", 
      verifypassword: "*******" });
    log.debug(JSON.stringify(user));
  };

  return (
    <DashboardLayout>
      <MDBox pt={0} pb={0}>
        <Card>
          <MDBox p={3} lineHeight={0}>
            <MDTypography variant="h6" fontWeight="medium">
              Users
            </MDTypography>
          </MDBox>
          <DataTable 
            onClickRow={onClickRow} 
            table={dataTableData} canSearch 
          />
        </Card>
        &nbsp;
        <Card>
          <MDBox p={3} lineHeight={0}>
            <Button onClick={onAddClicked}>Add</Button>
          </MDBox>
        </Card>
        &nbsp;
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
            <TextField
              required
              id="username"
              label="User Id"
              variant="filled"
              value={user.username}
              onChange={e => onFieldChange(e)}
            />
            <TextField
              required
              id="nickname"
              label="Name"
              variant="filled"
              value={user.nickname}
              onChange={e => onFieldChange(e)}
            />
            <TextField
              id="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              variant="filled"
              value={user.password}
              onChange={e => onFieldChange(e)}
            />
            <TextField
              id="verifypassword"
              label="Verify Password"
              type="password"
              autoComplete="current-password"
              variant="filled"
              value={user.verifypassword}
              onChange={e => onFieldChange(e)}
            />
          </MDBox>
        </Card>
      </MDBox>
    </DashboardLayout>
  );
};
