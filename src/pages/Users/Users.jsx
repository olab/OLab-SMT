// @mui material components
import Card from "@mui/material/Card";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { FileUploader } from "react-drag-drop-files";

// Material Dashboard 2 PRO React components
import MDBox from "@/components/MDBox";
import ConfirmDialog from "@/components/ConfirmDialog";
import OLabAlert from "@/components/OLabAlert";
import OLabUsers from "@/components/OLabUsers";

// Material Dashboard 2 PRO React examples
import DashboardLayout from "@/components/DashboardLayout";
import Grid from "@mui/material/Grid";
import { useState, useEffect } from "react";

// Data
import defaultUser from "./defaultUser";
import {
  getUsers,
  getGroups,
  getRoles,
  deleteUser,
  importUsers,
} from "../../services/api";
import { useAuth } from "../../hooks/useAuth";
import { Log, LogInfo, LogError, LogEnable } from "../../utils/Logger";
import { UserDetail } from "./components/UserDetail";

const fileTypes = ["XLSX"];

export default function UserPage() {
  const [selectedUser, setSelectedUser] = useState({
    ...defaultUser,
    verifypassword: defaultUser.password,
  });
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState([]);
  const [statusMessage, setStatusMessage] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [postImportReview, setPostImportReview] = useState(true);
  const [tableTitle, setTableTitle] = useState('Users');

  const { user } = useAuth();

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

  const onRowClick = (table) => {
    setSelectedUser({
      ...table.row,
      password: "*******",
      verifypassword: "*******",
    });
  };

  const deleteSelectedIds = (selectedIds) => {
    Log(`deleteSelectedIds ${JSON.stringify(selectedIds)}`);

    deleteUser(user.authInfo.token, selectedIds).then((response) => {
      Log(
        `deleted ${selectedIds.length} users.  ${JSON.stringify(
          response,
          null,
          1
        )}`
      );
    });

    // get non-deleted users from table
    // and use for new table contents
    const newRows = tableData.filter((user) => !selectedIds.includes(user.id));

    setTableData(newRows);
    setSelectedUser(null);
    setStatusMessage("User(s) deleted");
  };

  const onExportClicked = () => {};

  const onImportFile = (file) => {
    const formData = new FormData();
    formData.append("file", file);

    importUsers(user.authInfo.token, formData).then((response) => {
      let newTableData = [];
      if ( postImportReview ) {
        newTableData = [...response.data];
        setTableTitle("Imported Users");
      }
      else {
        newTableData = [...response.data, ...tableData];
      }
      setTableData(newTableData);
      setStatusMessage(`${response.data.length} User(s) Uploaded`);
    });
  };

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

  const onSelectionChanged = (rowIds) => {
    Log(`onSelectionChanged ${JSON.stringify(rowIds)}`);
    const newState = { ...buttons };
    newState.export.visible = rowIds.length > 0;
    setButtons(newState);
  };

  const userButtons = {
    export: {
      visible: false,
      tooltip: "Export Selected Users",
      onClick: onExportClicked,
      label: "Export",
    },
  };

  const [buttons, setButtons] = useState(userButtons);

  const onReviewUsersChanged = (e) => {
    setPostImportReview(e.target.checked);
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
                <OLabUsers
                  buttons={buttons}
                  data={tableData}
                  loading={loading}
                  onDeleteRows={deleteSelectedIds}
                  onRowClicked={onRowClick}
                  onSelectionChanged={onSelectionChanged}
                  setConfirmDialog={setConfirmDialog}
                  setStatusMessage={setStatusMessage}
                  title={tableTitle}
                />
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
          <Grid item xs={12}>
            <Card>
              <MDBox p={3} lineHeight={0}>
                <Grid container spacing={5} justifyContent="center">
                  <Grid item>
                    <FormGroup>
                      <FileUploader
                        handleChange={onImportFile}
                        name="file"
                        types={["XLSX"]}
                        label="Upload XLSX File"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={postImportReview}
                            onChange={onReviewUsersChanged}
                            inputProps={{ "aria-label": "controlled" }}
                          />
                        }
                        label="Review after import"
                      />
                    </FormGroup>
                  </Grid>
                </Grid>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}
