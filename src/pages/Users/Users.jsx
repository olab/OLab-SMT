// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 PRO React components
import MDBox from "@/components/MDBox";
import MDTypography from "@/components/MDTypography";
import ConfirmDialog from "@/components/ConfirmDialog";
import MDButton from "@/components/MDButton";
import OLabAlert from "@/components/OLabAlert";

import { DataGrid, useGridApiRef } from "@mui/x-data-grid";

// Material Dashboard 2 PRO React examples
import DashboardLayout from "@/components/DashboardLayout";
import Grid from "@mui/material/Grid";
import { useState, useEffect } from "react";

// Data
import userTableLayout from "./layouts/userTableLayout";
import defaultUser from "./defaultUser";
import { getUsers, getGroups, getRoles, deleteUser } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import { Log, LogInfo, LogError, LogEnable } from "../../utils/Logger";
import { UserDetail } from "./components/UserDetail";

export default function UserPage() {
  const [selectedUser, setSelectedUser] = useState({
    ...defaultUser,
    verifypassword: defaultUser.password,
  });
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [selection, setSelection] = useState([]);
  const [statusMessage, setStatusMessage] = useState(null);
  const [tableData, setTableData] = useState([]);
  const { user } = useAuth();
  const apiRef = useGridApiRef();

  LogEnable();

  useEffect(() => {
    getUsers(user.authInfo.token).then((response) => {
      setTableData(response.data);

      getGroups(user.authInfo.token).then((response) => {
        setGroups(response.data);

        getRoles(user.authInfo.token).then((response) => {
          setRoles(response.data);
          setLoading(false);
        });
      });
    });
  }, []);

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

  const onDeleteUserClicked = () => {
    Log("delete clicked");
    Log(JSON.stringify(selection));
    setConfirmDialog({
      title: "Delete Confirmation",
      message: `Delete ${selection.length} users?`,
      onCancelClicked: () => {
        setConfirmDialog(null);
      },
      onConfirmClicked: () => {
        setConfirmDialog(null);
        deleteSelectedUsers();
      },
    });
  };

  const deleteSelectedUsers = () => {
    deleteUser(user.authInfo.token, selection).then((response) => {
      Log(
        `deleted ${selection.length} users.  ${JSON.stringify(
          response,
          null,
          1
        )}`
      );
    });

    // get non-deleted users from table
    // and use for new table contents
    const newRows = tableData.filter((user) => !selection.includes(user.id));

    setTableData(newRows);
    apiRef.current.forceUpdate();
    setStatusMessage("User(s) deleted");
  };

  // if (loading) {
  //   return (
  //     <DashboardLayout>
  //       <center>
  //         <CircularProgress color="inherit" />
  //       </center>
  //     </DashboardLayout>
  //   );
  // }

  // fires if user detail page changed something that
  // requires updating the user list
  const onUserChanged = (user) => {
    let newTableData = [...tableData];

    let targetIndex = -1;
    for (let index = 0; index < newTableData.length; index++) {
      if (newTableData[index].id == user.id) {
        targetIndex = index;
        break;
      }
    }

    newTableData[targetIndex] = user;

    setTableData(newTableData);

    Log("user list updated from user detail change");
  };

  return (
    <DashboardLayout>
      <OLabAlert
        severity="info"
        onClose={() => {
          setStatusMessage(null);
        }}
      >
        {statusMessage}
      </OLabAlert>
      {confirmDialog != null && (
        <ConfirmDialog
          title={confirmDialog.title}
          message={confirmDialog.message}
          handleCancel={confirmDialog.onCancelClicked}
          handleOk={confirmDialog.onConfirmClicked}
        />
      )}
      <MDBox pt={0} pb={0}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Card>
              <MDBox p={3} lineHeight={0}>
                <MDTypography variant="h6" fontWeight="medium">
                  Users
                </MDTypography>
                <DataGrid
                  apiRef={apiRef}
                  rows={tableData}
                  columns={userTableLayout.columns}
                  onRowSelectionModelChange={setSelection}
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
                  loading={loading}
                />
                {selection.length > 0 && (
                  <MDBox pt={3} lineHeight={0}>
                    <Grid
                      container
                      spacing={5}
                      direction="column"
                      justifyContent="center"
                    >
                      <Grid item xs={12}>
                        <MDButton onClick={onDeleteUserClicked}>
                          Delete
                        </MDButton>
                      </Grid>
                    </Grid>
                  </MDBox>
                )}
              </MDBox>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card>
              <MDBox p={3} lineHeight={0}>
                <UserDetail
                  onUserChanged={onUserChanged}
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
        <MDBox p={3} lineHeight={0}>
          <Grid item xs={12}>
            <Grid
              container
              spacing={0}
              direction="column"
              justifyContent="center"
            >
              <Grid item xs={12}>
                <>
                  <MDButton onClick={onAddClicked}>Import</MDButton>
                  &nbsp;
                  <MDButton onClick={onAddClicked}>Export</MDButton>
                </>
              </Grid>
            </Grid>
          </Grid>
        </MDBox>
      </Card>
    </DashboardLayout>
  );
}
