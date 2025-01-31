import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import { useState, useEffect } from "react";

import MDBox from "@/components/MDBox";
import MDTypography from "@/components/MDTypography";
import DashboardLayout from "@/components/DashboardLayout";
import MDButton from "@/components/MDButton";
import ConfirmDialog from "@/components/ConfirmDialog";

import { MapsNodesQuery } from "./components/MapsNodesQuery";
import { ApplicationsQuery } from "./components/ApplicationsQuery";
import { GroupRoleSelector } from "./components/GroupRoleSelector";

import mapTableLayout from "./layouts/mapTableLayout";
import nodeTableLayout from "./layouts/nodeTableLayout";
import aclTableLayout from "./layouts/aclTableLayout";
import tableSettings from "./layouts/tableSettings";

import { useAuth } from "../../hooks/useAuth";
import { Log, LogInfo, LogError, LogEnable } from "../../utils/Logger";

// Data
import {
  deleteAcl,
  getAcls,
  getApplications,
  getGroups,
  getRoles,
  postAcl,
  putAcl,
} from "../../services/api";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  );
}

const initialQueryState = {
  groupId: -1,
  roleId: -1,
  selectedMapIds: [],
  selectedNodeIds: [],
  selectedApplicationIds: [],
};

export default function AclPage() {
  const [aclSelectionIds, setAclSelection] = useState([]);
  const [aclTableColumns, setAclTableColumns] = useState(
    aclTableLayout.columns
  );
  const [aclTableRows, setAclTableRows] = useState([]);

  const [groups, setGroups] = useState([]);
  const [roles, setRoles] = useState([]);

  const [aclTableLoading, setAclTableLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [nextIndex, setNextIndex] = useState(-1);

  const [activeTab, setActiveTab] = useState(0);
  const [queryState, setQueryState] = useState(initialQueryState);

  const apiRef = useGridApiRef();

  const { user } = useAuth();

  LogEnable();

  useEffect(() => {
    let newAclTableColumns = [...aclTableColumns];

    // dynamically create group/role select list based on
    // results of database requests
    getGroups(user.authInfo.token).then((response) => {
      setGroups(response.data);

      let columnDef = newAclTableColumns.filter(
        (column) => column.field == "groupName"
      );
      columnDef.valueOptions = groups;

      getRoles(user.authInfo.token).then((response) => {
        setRoles(response.data);

        let columnDef = newAclTableColumns.filter(
          (column) => column.field == "roleName"
        );
        columnDef.valueOptions = roles;

        setAclTableColumns(newAclTableColumns);
      });
    });
  }, []);

  const refreshAclData = () => {
    setAclTableLoading(true);

    try {
      Log(`refreshAclData queryState: ${JSON.stringify(queryState, null, 1)}`);

      getAcls(
        user.authInfo.token,
        queryState.groupId < 0 ? null : queryState.groupId,
        queryState.roleId < 0 ? null : queryState.roleId,
        queryState.selectedMapIds,
        queryState.selectedNodeIds,
        queryState.selectedApplicationIds
      ).then((response) => {
        setAclTableRows(response.data);
      });
    } catch (error) {
      Log(`refreshAclData error: ${error.message}`);
    }

    setAclTableLoading(false);
  };

  const onAclSelectionChanged = (selectedAclIds) => {
    Log(`onAclSelectionChanged ${selectedAclIds}`);
    setAclSelection(selectedAclIds);
  };

  const onLoadAclClicked = () => {
    refreshAclData();
  };

  const onSaveAclClicked = () => {
    setConfirmDialog({
      title: "Confirmation",
      message: `Save ACL Changes?`,
      onCancelClicked: () => {
        setConfirmDialog(null);
      },
      onConfirmClicked: () => {
        setConfirmDialog(null);
        saveChangedAcls();
      },
    });
  };

  const saveChangedAcls = () => {
    for (const aclTableRow of aclTableRows) {
      if (aclTableRow.id < 0) {
        postAcl(user.authInfo.token, aclTableRow).then((response) => {
          Log(`acl id: ${aclTableRow.id} added`);
        });
        continue;
      }

      if (aclTableRow.status == 2) {
        putAcl(user.authInfo.token, aclTableRow).then((response) => {
          Log(`acl id: ${aclTableRow.id} edited`);
        });
        continue;
      }

      if (aclTableRow.status == 3) {
        deleteAcl(user.authInfo.token, aclTableRow).then((response) => {
          Log(`acl id: ${aclTableRow.id} delete`);
        });
        continue;
      }

      Log(`acl id: ${aclTableRow.id} unchanged`);
    }
  };

  const onClearAclClicked = () => {
    setConfirmDialog({
      title: "Confirmation",
      message: `Clear ACL Table?`,
      onCancelClicked: () => {
        setConfirmDialog(null);
      },
      onConfirmClicked: () => {
        setConfirmDialog(null);
        setAclTableRows([]);
      },
    });
  };

  const onCellClick = (cell) => {
    if (
      cell.field !== "read" &&
      cell.field !== "write" &&
      cell.field !== "execute"
    ) {
      return;
    }

    // set 'changed' flag in record
    setAclTableRows(
      aclTableRows.map((row) => {
        if (row.id === cell.row.id) {
          return { ...row, status: 2 };
        } else {
          return row;
        }
      })
    );
  };

  const onDeleteAclClicked = () => {
    Log("delete clicked");
    Log(JSON.stringify(aclSelectionIds));
    deleteSelectedAcls();
  };

  const deleteSelectedAcls = () => {
    // reset the map selections manually
    // since settings the model doesn't
    // appear to work
    apiRef.current.setRowSelectionModel([]);

    // toggle 'deleted' flag in selected records
    setAclTableRows(
      aclTableRows.map((row) => {
        if (aclSelectionIds.includes(row.id)) {
          // undelete, if already marked deleted
          if (row.status == 3) {
            return { ...row, status: null };
          }
          return { ...row, status: 3 };
        } else {
          return row;
        }
      })
    );
  };

  const onResetClicked = () => {
    onStateChange(null);
  };

  const onCreateAclClicked = () => {
    const {
      groupId,
      roleId,
      selectedMapIds,
      selectedNodeIds,
      selectedApplicationIds,
    } = queryState;

    const selectedGroup = groups.filter((group) => group.id == groupId);
    const selectedRole = roles.filter((role) => role.id == roleId);

    Log(`${JSON.stringify(selectedGroup)} ${JSON.stringify(selectedRole)}`);

    let newAclRows = [...aclTableRows];
    let index = nextIndex;

    if (selectedNodeIds.length > 0) {
      for (const selectedNodeId of selectedNodeIds) {
        const newRecord = {
          execute: false,
          read: false,
          write: false,
          objectType: "Nodes",
          id: index--,
          groupId: selectedGroup.length == 0 ? 0 : selectedGroup[0].id,
          objectIndex: selectedNodeId,
          roleId: selectedRole.length == 0 ? 0 : selectedRole[0].id,
          groupName: selectedGroup.length == 0 ? "*" : selectedGroup[0].name,
          roleName: selectedRole.length == 0 ? "*" : selectedRole[0].name,
        };

        newAclRows.push(newRecord);
      }
    } else if (selectedMapIds.length > 0) {
      for (const selectedMapId of selectedMapIds) {
        const newRecord = {
          execute: false,
          read: false,
          write: false,
          objectType: "Maps",
          id: index--,
          groupId: selectedGroup.length == 0 ? 0 : selectedGroup[0].id,
          objectIndex: selectedMapId,
          roleId: selectedRole.length == 0 ? 0 : selectedRole[0].id,
          groupName: selectedGroup.length == 0 ? "*" : selectedGroup[0].name,
          roleName: selectedRole.length == 0 ? "*" : selectedRole[0].name,
        };

        newAclRows.push(newRecord);
      }
    }

    setNextIndex(index);
    setAclTableRows(newAclRows);
  };

  if (confirmDialog != null) {
    <ConfirmDialog data={confirmDialog} />;
  }

  const onStateChange = (state = null) => {
    Log(`onStateChange: ${JSON.stringify(state, null, 1)}`);

    if (state == null) {
      setQueryState({...initialQueryState});
    } else {
      let newQueryState = {
        ...queryState,
        ...state,
      };

      setQueryState(newQueryState);
    }
  };

  const isAclRowSelectedable = (params) => {
    return params.row.groupId != null && params.row.roleId != null;
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

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
      <MDBox p={0} pb={0}>
        <Card>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="ACL Tabs"
          >
            <Tab label="Applications" {...a11yProps(0)} />
          </Tabs>
          <MDBox p={3} pb={0} lineHeight={0}>
            <MDTypography variant="h6" fontWeight="medium">
              Query Form
            </MDTypography>
          </MDBox>
          <GroupRoleSelector
            currentState={queryState}
            groups={groups}
            roles={roles}
            onStateChange={onStateChange}
          />
          <CustomTabPanel value={activeTab} index={1}>
            <MapsNodesQuery
              currentState={queryState}
              groups={groups}
              roles={roles}
              onStateChange={onStateChange}
              onLoadAclClicked={onLoadAclClicked}
              onCreateAclClicked={onCreateAclClicked}
            />
          </CustomTabPanel>
          <CustomTabPanel value={activeTab} index={0}>
            <ApplicationsQuery
              currentState={queryState}
              onStateChange={onStateChange}
              onLoadAclClicked={onLoadAclClicked}
              onCreateAclClicked={onCreateAclClicked}
              title={"Applications"}
            />
          </CustomTabPanel>
          <MDBox p={0} pb={3}>
            <Grid
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
            >
              <Grid item xs={12}>
                <Tooltip title="Query ACLs using Query Form">
                  <MDButton onClick={onLoadAclClicked}>Query ACLs</MDButton>
                </Tooltip>
                &nbsp;
                <Tooltip title="Create ACLs from Query Form">
                  <MDButton onClick={onCreateAclClicked}>Create ACLs</MDButton>
                </Tooltip>
                &nbsp;
                <Tooltip title="Reset Query Form">
                  <MDButton onClick={onResetClicked}>Reset</MDButton>
                </Tooltip>
              </Grid>
            </Grid>
          </MDBox>
        </Card>
      </MDBox>
      <br />
      <MDBox p={0} pb={0}>
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <Card>
              <MDBox p={3} lineHeight={0}>
                <MDTypography variant="h6" fontWeight="medium">
                  Access Control Lists (ACL)
                </MDTypography>
                <DataGrid
                  apiRef={apiRef}
                  onCellClick={onCellClick}
                  rows={aclTableRows}
                  columns={aclTableColumns}
                  onRowSelectionModelChange={onAclSelectionChanged}
                  isRowSelectable={isAclRowSelectedable}
                  disableRowSelectionOnClick
                  loading={aclTableLoading}
                  {...tableSettings}
                  rowHeight={30}
                />
                <MDBox pt={3} lineHeight={0}>
                  <Grid
                    container
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Grid item xs={12}>
                      {aclSelectionIds.length > 0 && (
                        <Tooltip title="(Un)delete Selected ACLs">
                          <MDButton onClick={onDeleteAclClicked}>
                            Delete
                          </MDButton>
                        </Tooltip>
                      )}
                      &nbsp;
                      <Tooltip title="Save ACL Table">
                        <MDButton onClick={onSaveAclClicked}>Save</MDButton>
                      </Tooltip>
                      &nbsp;
                      <Tooltip title="Clear ACL Table">
                        <MDButton onClick={onClearAclClicked}>Clear</MDButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}
