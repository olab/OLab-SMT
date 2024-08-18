// @mui material components
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";

// Material Dashboard 2 PRO React components
import MDBox from "@/components/MDBox";
import MDTypography from "@/components/MDTypography";
import ConfirmDialog from "@/components/ConfirmDialog";
import MDButton from "@/components/MDButton";

import { DataGrid, useGridApiRef } from "@mui/x-data-grid";

// Material Dashboard 2 PRO React examples
import DashboardLayout from "./DashboardLayout";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { useState, useEffect } from "react";

// Data
import userTableLayout from "./userTableLayout";
import defaultUser from "./defaultUser";
import { getUsers, getGroups, getRoles } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import { Log, LogInfo, LogError, LogEnable } from "../../utils/Logger";
import { UserDetail } from "./UserDetail";

export const UserPage = () => {
  const [selectedUser, setSelectedUser] = useState({
    ...defaultUser,
    verifypassword: defaultUser.password,
  });
  const [selection, setSelection] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [tableData, setTableData] = useState(userTableLayout);
  const { user } = useAuth();
  const [confirmDialog, setConfirmDialog] = useState(null);
  const apiRef = useGridApiRef();

  LogEnable();

  useEffect(() => {
    getUsers(user.authInfo.token).then((response) => {
      const users = { ...userTableLayout, rows: response.data };
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

  const onDeleteClicked = () => {
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

    const newRows = 
      tableData.rows.filter((user) => !selection.includes(user.id));
    const newTableData = { 
      ...tableData,
      rows: newRows
    };

    setTableData(newTableData);
    apiRef.current.forceUpdate();
  };

  if (confirmDialog != null) {
    <ConfirmDialog data={confirmDialog} />;
  }

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
                  rows={tableData.rows}
                  columns={tableData.columns}
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
                        <MDButton
                          onClick={onDeleteClicked}
                          color="secondary"
                          variant="contained"
                          size="small"
                        >
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
                <MDTypography variant="h6" fontWeight="medium">
                  User Detail
                </MDTypography>

                <UserDetail
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
                  <MDButton
                    onClick={onAddClicked}
                    color="secondary"
                    variant="contained"
                    size="small"
                  >
                    Import
                  </MDButton>
                  &nbsp;
                  <MDButton
                    onClick={onAddClicked}
                    color="secondary"
                    variant="contained"
                    size="small"
                  >
                    Export
                  </MDButton>
                </>
              </Grid>
            </Grid>
          </Grid>
        </MDBox>
      </Card>
    </DashboardLayout>
  );
};
