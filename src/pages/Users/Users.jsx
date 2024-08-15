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

import { DataGrid } from "@mui/x-data-grid";

// Material Dashboard 2 PRO React examples
import DashboardLayout from "./DashboardLayout";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import { useState, useEffect } from "react";

// Data
import dataTableData from "./dataTableData";
import defaultUser from "./defaultUser";
import { getUsers, getGroups, getRoles } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import { Log, LogInfo, LogError, LogEnable } from "../../utils/Logger";

export const UserPage = () => {
  const { user } = useAuth();
  const [tableData, setTableData] = useState(dataTableData);
  const [groups, setGroups] = useState([]);
  const [groupId, setGroupId] = useState(0);
  const [roles, setRoles] = useState([]);
  const [roleId, setRoleId] = useState(0);
  const [loading, setLoading] = useState(true);
  const [formUser, setFormUser] = useState({
    ...defaultUser,
    verifypassword: defaultUser.password,
  });

  LogEnable();

  useEffect(() => {
    getUsers(user.authInfo.token).then((response) => {
      const users = { ...dataTableData, rows: response.data };
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
    setFormUser((user) => ({
      ...user,
      [ev.target.id]: ev.target.value,
    }));
  };

  const handleGroupChange = (ev) => {
    setGroupId(ev.target.value);
  };

  const handleRoleChange = (ev) => {
    setRoleId(ev.target.value);
  };

  const onAddClicked = () => {
    setFormUser(defaultUser);
  };

  const onRowClick = (table) => {
    setFormUser({
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
                  User
                </MDTypography>

                <form onSubmit={onSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        required
                        id="username"
                        label="User Id"
                        variant="filled"
                        value={formUser.userName}
                        onChange={(e) => onFieldChange(e)}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        required
                        id="nickname"
                        label="Name"
                        variant="filled"
                        value={formUser.nickName}
                        onChange={(e) => onFieldChange(e)}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        id="password"
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        variant="filled"
                        value={formUser.password}
                        onChange={(e) => onFieldChange(e)}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        id="verifypassword"
                        label="Verify Password"
                        type="password"
                        autoComplete="current-password"
                        variant="filled"
                        value={formUser.verifypassword}
                        onChange={(e) => onFieldChange(e)}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <FormControl variant="filled">
                        <InputLabel id="group-label">Group</InputLabel>
                        <Select
                          labelId="group-label"
                          id="group-select-filled"
                          value={groupId}
                          onChange={handleGroupChange}
                        >
                          <MenuItem value="0">
                            <em>None</em>
                          </MenuItem>
                          {groups.map((item) => {
                            return (
                              <MenuItem key={item.id} value={item.id}>
                                {item.name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                      <FormControl variant="filled">
                        <InputLabel id="role-label">Role</InputLabel>
                        <Select
                        height={`75px`}
                          labelId="role-label"
                          id="role-select-filled"
                          value={roleId}
                          onChange={handleRoleChange}
                        >
                          <MenuItem value="0">
                            <em>None</em>
                          </MenuItem>
                          {roles.map((item) => {
                            return (
                              <MenuItem key={item.id} value={item.id}>
                                {item.name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
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
