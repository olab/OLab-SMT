import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";

import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState, Fragment } from "react";

import MDButton from "@/components/MDButton";
import MDInput from "@/components/MDInput";
import MDTypography from "@/components/MDTypography";
import OLabAlert from "@/components/OLabAlert";

// Data
import { useAuth } from "../../hooks/useAuth";
import { postUser, putUser } from "../../services/api";
import { Log, LogEnable, LogError, LogInfo } from "../../utils/Logger";
import defaultUser from "./defaultUser";
import groupRoleTableLayout from "./layouts/groupRoleTableLayout";

// this is set in the form when there
// is a selected user.  something to
// compare against to test if user
// changes it
const DefaultUserPassword = "******";

export const UserDetail = ({ selectedUser, groups, roles, onUserChanged }) => {
  const [formUser, setFormUser] = useState({
    ...defaultUser,
    verifypassword: defaultUser.password,
  });
  const [statusMessage, setStatusMessage] = useState(null);
  const [originalUser, setOriginalUser] = useState(formUser);
  const [groupId, setGroupId] = useState(0);
  const [nextIndex, setNextIndex] = useState(-1);
  const [roleId, setRoleId] = useState(0);
  const [isChanged, setIsChanged] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (selectedUser.id != 0) {
      selectedUser.password = DefaultUserPassword;
      selectedUser.verifypassword = DefaultUserPassword;
    }

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
      setStatusMessage("Group/Role already exists");
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

  const onCloneClicked = () => {
    const newPassword = generatePassword();

    let cloneUser = {
      ...formUser,
      id: 0,
      userName: "",
      nickName: "",
      email: "",
      password: newPassword,
      verifypassword: newPassword,
    };

    setShowPassword(true);
    setFormUser(cloneUser);
    setIsChanged(true);
  };

  const onSaveClicked = () => {
    var apiUser = {
      Id: formUser.id,
      UserName: formUser.userName,
      Email: formUser.email,
      NickName: formUser.nickName,
      GroupRoles: [],
    };

    // add the password only if it has been edited
    if (formUser.password != DefaultUserPassword) {
      apiUser.Password = formUser.password;
    }

    var roleParts = [];
    for (const role of formUser.roles) {
      roleParts.push(`${role.group}:${role.role}`);
    }

    apiUser.GroupRoles = roleParts.join(",");

    Log(JSON.stringify(apiUser, null, 2));

    // id > 0 are existing records => edit
    // else is an add user
    if (formUser.id > 0) {
      putUser(user.authInfo.token, apiUser).then((response) => {
        setOriginalUser(formUser);
        setIsChanged(false);
        setStatusMessage(`User '${formUser.nickName}' saved`);

        onUserChanged(formUser);
      });
    } else {
      postUser(user.authInfo.token, apiUser).then((response) => {
        setOriginalUser(formUser);
        setIsChanged(false);
        setStatusMessage(`User '${formUser.nickName}' created`);

        onUserChanged(formUser);
      });
    }
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
      <OLabAlert
        severity="info"
        onClose={() => {
          setStatusMessage(null);
        }}
      >
        {statusMessage}
      </OLabAlert>

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
            value={formUser.userName}
            error={formUser.userName == ""}
            onChange={(e) => onFieldChange(e)}
          />
        </Grid>
        <Grid item xs={4}>
          <MDInput
            sx={{ width: "100%" }}
            required
            id="nickName"
            label="Name"
            value={formUser.nickName}
            error={formUser.nickName == ""}
            onChange={(e) => onFieldChange(e)}
          />
        </Grid>
        <Grid item xs={4}>
          <MDInput
            sx={{ width: "100%" }}
            required
            id="email"
            label="E-Mail"
            value={formUser.email}
            error={formUser.email == ""}
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
                autoComplete="current-password"
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
                autoComplete="current-password"
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
                value={formUser.password}
                error={
                  formUser.password !== formUser.verifypassword ||
                  formUser.password == ""
                }
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
                value={formUser.verifypassword}
                error={
                  formUser.password !== formUser.verifypassword ||
                  formUser.verifypassword == ""
                }
                onChange={(e) => onFieldChange(e)}
              />
            </Grid>
          </>
        )}
        <Grid item xs={2}>
          <MDButton onClick={onGenerateClicked}>Generate</MDButton>
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
              InputProps={{
                classes: { root: "select-input-styles" },
              }}
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
              InputProps={{
                classes: { root: "select-input-styles" },
              }}
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
            <MDButton onClick={onAddGroupRoleClicked}>Add</MDButton>
          )}
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
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
          >
            <Grid item xs={12}>
              {formUser.id > 0 && (
                <Tooltip title="Clone Current User">
                  <MDButton onClick={onCloneClicked}>Clone</MDButton>
                </Tooltip>
              )}
              &nbsp;
              {isChanged && (
                <>
                  <Tooltip title="Save User">
                    <MDButton onClick={onSaveClicked}>Save</MDButton>
                  </Tooltip>
                  &nbsp;
                  <Tooltip title="Revert User">
                    <MDButton onClick={onRevertClicked}>Revert</MDButton>
                  </Tooltip>
                </>
              )}
              <>
                &nbsp;
                <Tooltip title="Clear User Form">
                  <MDButton onClick={onClearClicked}>Clear</MDButton>
                </Tooltip>
              </>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </form>
  );
};
