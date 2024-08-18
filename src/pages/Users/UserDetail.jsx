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
import { useState, useEffect } from "react";

import MDButton from "@/components/MDButton";
import MDTypography from "@/components/MDTypography";
import OLabAlert from "@/components/OLabAlert";

// Data
import groupRoleTableLayout from "./groupRoleTableLayout";
import defaultUser from "./defaultUser";
import { useAuth } from "../../hooks/useAuth";
import { Log, LogInfo, LogError, LogEnable } from "../../utils/Logger";

export const UserDetail = ({ selectedUser, groups, roles }) => {
  const [formUser, setFormUser] = useState({
    ...defaultUser,
    verifypassword: defaultUser.password,
  });
  const [alertMessage, setAlertMessage] = useState(null);
  const [originalUser, setOriginalUser] = useState(formUser);
  const [groupId, setGroupId] = useState(0);
  const [nextIndex, setNextIndex] = useState(-1);
  const [roleId, setRoleId] = useState(0);
  const [isChanged, setIsChanged] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // enhance group role object with group/role names
    for (const role of selectedUser.roles) {
      enhanceGroupRole(role);
    }

    setFormUser(selectedUser);
    setOriginalUser(selectedUser);
  }, [selectedUser]);

  const updateIsChanged = () => {
    const isChanged = JSON.stringify(formUser) === JSON.stringify(originalUser);
    setIsChanged(true);
  };

  const enhanceGroupRole = (groupRole) => {
    groupRole.group = groups.find(
      (element) => element.id == groupRole.groupId
    )?.name;
    groupRole.role = roles.find(
      (element) => element.id == groupRole.roleId
    )?.name;
    return groupRole;
  };

  const onFieldChange = (ev) => {
    setFormUser({
      ...formUser,
      [ev.target.id]: ev.target.value,
    });
    updateIsChanged();
  };

  const onGroupChanged = (ev) => {
    setGroupId(ev.target.value);
  };

  const onRoleChanged = (ev) => {
    setRoleId(ev.target.value);
  };

  const onSubmit = (data) => {
    alert(JSON.stringify(data));
  };

  const onAddGroupRoleClicked = () => {
    const newRole = enhanceGroupRole({
      id: nextIndex,
      roleId: roleId,
      groupId: groupId,
    });

    const existingRole = formUser.roles.filter(
      (role) => role.roleId == newRole.roleId && role.groupId == newRole.groupId
    );

    if (existingRole.length > 0) {
      setAlertMessage("Group/Role already exists");
      return;
    }

    let newRoles = [...formUser.roles];
    newRoles.push(newRole);

    const newFormUser = {
      ...formUser,
      roles: newRoles,
    };

    setNextIndex(nextIndex - 1);
    setFormUser(newFormUser);
    setGroupId(0);
    setRoleId(0);

    setIsChanged(true);
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
    setGroupId(0);
    setRoleId(0);
    setIsChanged(false);
  };

  const onRevertClicked = () => {
    setFormUser(originalUser);
    setGroupId(0);
    setRoleId(0);
    setIsChanged(false);
  };

  const onCellClick = (cell) => {
    if (cell.field !== "delete") {
      return;
    }

    const newRoles = formUser.roles.filter((role) => role.id != cell.row.id);
    const newTableData = {
      ...formUser,
      roles: newRoles,
    };

    setFormUser(newTableData);
    setIsChanged(true);
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
            error={formUser.password !== formUser.verifypassword}
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
            onCellClick={onCellClick}
            rows={formUser.roles}
            columns={groupRoleTableLayout.columns}
            rowHeight={30}
            columnHeaderHeight={30}
            disableRowSelectionOnClick
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
        <Grid item xs={12}>
          <MDTypography variant="h6" fontWeight="medium">
            Add Group/Role
          </MDTypography>
        </Grid>
        <Grid item xs={5}>
          <FormControl variant="filled" sx={{ width: "100%" }}>
            <InputLabel id="group-label">Group</InputLabel>
            <Select
              labelId="group-label"
              id="group-select-filled"
              value={groupId}
              onChange={onGroupChanged}
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
              onChange={onRoleChanged}
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
              onClick={onAddGroupRoleClicked}
              color="secondary"
              variant="contained"
              size="small"
            >
              Add
            </MDButton>
          )}
        </Grid>

        <Grid item xs={12}>
          <OLabAlert color="info">{alertMessage}</OLabAlert>
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
                  <MDButton
                    color="secondary"
                    variant="contained"
                    size="small"
                    onClick={onRevertClicked}
                  >
                    Save
                  </MDButton>
                  &nbsp;
                  <MDButton
                    color="secondary"
                    variant="contained"
                    size="small"
                    onClick={onRevertClicked}
                  >
                    Revert
                  </MDButton>
                </>
              )}
              <>
                &nbsp;
                <MDButton
                  color="secondary"
                  variant="contained"
                  size="small"
                  onClick={onClearClicked}
                >
                  Clear
                </MDButton>
              </>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};
