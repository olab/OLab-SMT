// @mui material components

// Material Dashboard 2 PRO React components

import { DataGrid } from "@mui/x-data-grid";

// Material Dashboard 2 PRO React examples
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";

import MDButton from "@/components/MDButton";

// Data
import groupRoleTableLayout from "./groupRoleTableLayout";
import defaultUser from "./defaultUser";
import { useAuth } from "../../hooks/useAuth";
import { Log, LogInfo, LogError, LogEnable } from "../../utils/Logger";

export const UserDetail = ({selectedUser, groups, roles}) => {
  const [formUser, setFormUser] = useState({
    ...defaultUser,
    verifypassword: defaultUser.password,
  });
  const [originalUser, setOriginalUser] = useState(formUser);
  const [groupId, setGroupId] = useState(0);
  const [roleId, setRoleId] = useState(0);
  const [isChanged, setIsChanged] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    for (const role of selectedUser.roles) {
      role.group = groups.find(
        (element) => element.id == role.groupId
      )?.name;
      role.role = roles.find(
        (element) => element.id == role.roleId
      )?.name;
    }
    setFormUser(selectedUser);
    setOriginalUser(selectedUser);
  }, [selectedUser]);

  const updateIsChanged = () => {
    setIsChanged(JSON.stringify(formUser) === JSON.stringify(originalUser));
  };

  const onFieldChange = (ev) => {
    setFormUser({
      ...formUser,
      [ev.target.id]: ev.target.value,
    });
    updateIsChanged();
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
    setOriginalUser({
      ...defaultUser,
      verifypassword: defaultUser.password,
    });
    setIsChanged(false);
  };

  const onRevertClicked = () => {
    setFormUser(originalUser);
    updateIsChanged();
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
            rows={formUser.roles}
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
        <Grid item xs={2}>
          {groupId > 0 && roleId > 0 && (
            <MDButton
              onClick={onAddClicked}
              color="secondary"
              variant="contained"
              size="small"
            >
              Add
            </MDButton>
          )}
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
              {isChanged && (
                <>
                  <Button onClick={onRevertClicked}>Save</Button>
                  <Button onClick={onRevertClicked}>Revert</Button>
                  <Button onClick={onClearClicked}>Clear</Button>
                </>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};
