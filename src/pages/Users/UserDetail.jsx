import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";

import MDButton from "@/components/MDButton";
import MDInput from "@/components/MDInput";
import MDTypography from "@/components/MDTypography";
import OLabAlert from "@/components/OLabAlert";

// Data
import groupRoleTableLayout from "./groupRoleTableLayout";
import defaultUser from "./defaultUser";
import { useAuth } from "../../hooks/useAuth";
import { Log, LogInfo, LogError, LogEnable } from "../../utils/Logger";
import { postUser } from "../../services/api";

export const UserDetail = ({ selectedUser, groups, roles, onUserChanged }) => {
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
  const [showPassword, setShowPassword] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // enhance group role object with group/role names
    for (const role of selectedUser.roles) {
      enhanceGroupRole(role);
    }

    setFormUser(selectedUser);    
    setOriginalUser(selectedUser);
    Log(JSON.stringify(selectedUser, null, 2));

    resetForm();

  }, [selectedUser]);

  const resetForm = () => {
    setGroupId(0);
    setRoleId(0);
    setIsChanged(false);
    setShowPassword(false);
    setAlertMessage(null);
  }

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
    setIsChanged(true);
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

    resetForm();
  };

  const onRevertClicked = () => {
    setFormUser(originalUser);
    resetForm();
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

  const onSaveClicked = () => {

    setAlertMessage(`Saving user...`);

    var apiUser = {
      Id: formUser.id,
      UserName: formUser.userName,
      Password: formUser.password,
      Email: formUser.email,
      NickName: formUser.nickName,
      GroupRoles: [],
    };

    var roleParts = [];
    for (const role of formUser.roles) {
      roleParts.push(`${role.group}:${role.role}`);
    }

    apiUser.GroupRoles = roleParts.join(',');

    Log(JSON.stringify(apiUser, null, 2));

    postUser(user.authInfo.token, apiUser).then((response) => {
      setOriginalUser(formUser);
      setIsChanged(false);
      setAlertMessage(`User '${formUser.nickName}' saved`);

      onUserChanged(formUser);
    });
  };

  const onGenerateClicked = () => {
    const newPassword = generatePassword();

    const newFormUser = {
      ...formUser,
      password: newPassword,
      verifypassword: newPassword,
    };

    setFormUser(newFormUser);
    setShowPassword(true);
    setIsChanged(true);
  };

  const generatePassword = () => {
    let length = 12,
      charset =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz",
      charsetArr = charset.split(" ");
    let retVal = "";
    charsetArr.forEach((chars) => {
      for (let i = 0, n = chars.length; i < length / charsetArr.length; ++i) {
        retVal += chars.charAt(Math.floor(Math.random() * n));
      }
    });
    return retVal;
  };

  return (
    <form onSubmit={onSubmit}>
      <MDTypography variant="h6" fontWeight="medium">
        User Detail
      </MDTypography>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <MDInput
            sx={{ width: "100%" }}
            required
            id="userName"
            label="User Name"
            type="text"
            variant="outlined"
            value={formUser.userName}
            onChange={(e) => onFieldChange(e)}
          />
        </Grid>
        <Grid item xs={4}>
          <MDInput
            sx={{ width: "100%" }}
            required
            id="nickName"
            label="Name"
            type="text"
            variant="outlined"
            value={formUser.nickName}
            onChange={(e) => onFieldChange(e)}
          />
        </Grid>
        <Grid item xs={4}>
          <MDInput
            sx={{ width: "100%" }}
            required
            id="email"
            label="E-Mail"
            type="text"
            variant="outlined"
            value={formUser.email}
            onChange={(e) => onFieldChange(e)}
          />
        </Grid>

        {showPassword && (
          <>
            <Grid item xs={5}>
              <MDInput
                sx={{ width: "100%" }}
                id="password"
                label="Password"
                type="text"
                autoComplete="current-password"
                variant="outlined"
                value={formUser.password}
                error={formUser.password !== formUser.verifypassword}
                onChange={(e) => onFieldChange(e)}
              />
            </Grid>
            <Grid item xs={5}>
              <MDInput
                sx={{ width: "100%" }}
                id="verifypassword"
                label="Verify Password"
                type="text"
                autoComplete="current-password"
                variant="outlined"
                value={formUser.verifypassword}
                onChange={(e) => onFieldChange(e)}
              />
            </Grid>
          </>
        )}
        {!showPassword && (
          <>
            <Grid item xs={5}>
              <MDInput
                sx={{ width: "100%" }}
                id="password"
                label="Password"
                type="password"
                autoComplete="current-password"
                variant="outlined"
                value={formUser.password}
                error={formUser.password !== formUser.verifypassword}
                onChange={(e) => onFieldChange(e)}
              />
            </Grid>
            <Grid item xs={5}>
              <MDInput
                sx={{ width: "100%" }}
                id="verifypassword"
                label="Verify Password"
                type="password"
                autoComplete="current-password"
                variant="outlined"
                value={formUser.verifypassword}
                onChange={(e) => onFieldChange(e)}
              />
            </Grid>
          </>
        )}
        <Grid item xs={2}>
          <MDButton
            onClick={onGenerateClicked}
            color="secondary"
            variant="contained"
            size="small"
          >
            Generate
          </MDButton>
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
            <MDInput
              select
              label="Group"
              id="group-select-filled"
              value={groupId}
              onChange={onGroupChanged}
              variant="outlined"
              InputProps={{
                classes: { root: "select-input-styles" },
              }}
              size="large"
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
            </MDInput>
          </FormControl>
        </Grid>
        <Grid item xs={5}>
          <FormControl sx={{ width: "100%" }} variant="filled">
            <MDInput
              select
              label="Role"
              id="role-select-filled"
              value={roleId}
              onChange={onRoleChanged}
              variant="outlined"
              InputProps={{
                classes: { root: "select-input-styles" },
              }}
              size="large"
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
            </MDInput>
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
                    onClick={onSaveClicked}
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
