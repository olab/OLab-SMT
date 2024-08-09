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

// Data
import dataTableData from "./dataTableData";

export const UserPage = () => {
  return (
    <DashboardLayout>
      <MDBox pt={0} pb={0}>
        <Card>
          <MDBox p={3} lineHeight={0}>
            <MDTypography variant="h6" fontWeight="medium">
              Users
            </MDTypography>
          </MDBox>
          <DataTable table={dataTableData} canSearch />
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
              id="filled-required"
              label="User Id"
              defaultValue="Hello World"
              variant="filled"
            />
            <TextField
              required
              id="filled-required"
              label="Name"
              defaultValue="Hello World"
              variant="filled"
            />
            <TextField
              id="filled-password-input1"
              label="Password"
              type="password"
              autoComplete="current-password"
              variant="filled"
            />
            <TextField
              id="filled-password-input2"
              label="Verify Password"
              type="password"
              autoComplete="current-password"
              variant="filled"
            />
          </MDBox>
        </Card>
      </MDBox>
    </DashboardLayout>
  );
};
