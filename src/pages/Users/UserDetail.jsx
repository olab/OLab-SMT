// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 PRO React components
import MDBox from "@/components/MDBox";
import MDTypography from "@/components/MDTypography";
import TextField from "@mui/material/TextField";

import { DataGrid } from "@mui/x-data-grid";

// Material Dashboard 2 PRO React examples
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { useState, useEffect } from "react";

// Data
import groupRoleTableLayout from "./groupRoleTableLayout";
import defaultUser from "./defaultUser";
import { useAuth } from "../../hooks/useAuth";
import { Log, LogInfo, LogError, LogEnable } from "../../utils/Logger";

export const UserDetail = (props) => {
  const [formUser, setFormUser] = useState({
    ...defaultUser,
    verifypassword: defaultUser.password,
  });
  const [originalUser, setOriginalUser] = useState(formUser);
  const [groupId, setGroupId] = useState(0);
  const [roleId, setRoleId] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    for (const role of props.selectedUser.roles) {
      role.group = props.groups.find(
        (element) => (element.id = role.groupId)
      )?.name;
      role.role = props.roles.find(
        (element) => (element.id = role.roleId)
      )?.name;
    }
    setFormUser(props.selectedUser);
    setOriginalUser(props.selectedUser);
  }, [props]);

  const onFieldChange = (ev) => {
    setFormUser({
      ...formUser,
      [ev.target.id]: ev.target.value,
    });
  };

  const handleGroupChange = (ev) => {
    setGroupId(ev.target.value);
  };

  const handleRoleChange = (ev) => {
    setRoleId(ev.target.value);
  };

  const onSubmit = (data) => {
    alert(JSON.stringify(data));
  };

  const onAddClicked = () => {
    Log("Add clicked");
  };

  const onClearClicked = () => {
    setFormUser({
      ...defaultUser,
      verifypassword: defaultUser.password,
    });
  };

  const onRevertClicked = () => {
    setFormUser(originalUser);
  };

  return (
    <form onSubmit={onSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            sx={{ width: "100%" }}
            required
            id="userName"
            label="User Id"
            variant="filled"
            value={formUser.userName}
            onChange={(e) => onFieldChange(e)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            sx={{ width: "100%" }}
            required
            id="nickName"
            label="Name"
            variant="filled"
            value={formUser.nickName}
            onChange={(e) => onFieldChange(e)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            sx={{ width: "100%" }}
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
            sx={{ width: "100%" }}
            id="verifypassword"
            label="Verify Password"
            type="password"
            autoComplete="current-password"
            variant="filled"
            value={formUser.verifypassword}
            onChange={(e) => onFieldChange(e)}
          />
        </Grid>
        <Grid item xs={12}>
          <DataGrid
            rows={groupRoleTableLayout.rows}
            columns={groupRoleTableLayout.columns}
            rowHeight={30}
            columnHeaderHeight={30}
            autoHeight
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
          />
        </Grid>
        <Grid item xs={5}>
          <FormControl variant="filled" sx={{ width: "100%" }}>
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
              {props.groups.map((item) => {
                return (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={5}>
          <FormControl sx={{ width: "100%" }} variant="filled">
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              id="role-select-filled"
              value={roleId}
              onChange={handleRoleChange}
            >
              <MenuItem value="0">
                <em>None</em>
              </MenuItem>
              {props.roles.map((item) => {
                return (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={2}>
          <Button onClick={onAddClicked}>Add</Button>
        </Grid>
        <Grid item xs={12}>
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={12}>
              <Button onClick={onRevertClicked}>Save</Button>
              <Button onClick={onRevertClicked}>Revert</Button>
              <Button onClick={onClearClicked}>Clear</Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};
