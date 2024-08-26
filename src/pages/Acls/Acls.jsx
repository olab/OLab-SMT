import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import { useState, useEffect } from "react";

import MDBox from "@/components/MDBox";
import MDInput from "@/components/MDInput";
import MDTypography from "@/components/MDTypography";
import DashboardLayout from "@/components/DashboardLayout";
import MDButton from "@/components/MDButton";
import ConfirmDialog from "@/components/ConfirmDialog";

import mapTableLayout from "./layouts/mapTableLayout";
import nodeTableLayout from "./layouts/nodeTableLayout";
import aclTableLayout from "./layouts/aclTableLayout";
import tableLayout from "./layouts/tableLayout";

import { useAuth } from "../../hooks/useAuth";
import { Log, LogInfo, LogError, LogEnable } from "../../utils/Logger";

// Data
import {
  getAcls,
  getMaps,
  getNodes,
  getGroups,
  getRoles,
} from "../../services/api";

export const AclPage = () => {
  const [aclSelectionIds, setAclSelection] = useState([]);
  const [aclTableColumns, setAclTableColumns] = useState(
    aclTableLayout.columns
  );
  const [aclTableRows, setAclTableRows] = useState(aclTableLayout.rows);
  const [groups, setGroups] = useState([]);
  const [groupId, setGroupId] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [aclTableLoading, setAclTableLoading] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(null);

  const [selectedMapIds, setMapSelection] = useState([]);
  const [mapTableData, setMapTableData] = useState(mapTableLayout);
  const [selectedNodeIds, setNodeSelection] = useState([]);
  const [nodeTableData, setNodeTableData] = useState(nodeTableLayout);
  const [roles, setRoles] = useState([]);
  const [roleId, setRoleId] = useState(-1);
  const [nextIndex, setNextIndex] = useState(-1);
  const apiRef = useGridApiRef();

  const { user } = useAuth();

  useEffect(() => {
    getMaps(user.authInfo.token).then((response) => {
      const maps = { ...mapTableLayout, rows: response.data };
      setMapTableData(maps);

      let newAclTableColumns = [...aclTableColumns];

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

          setLoading(false);
        });
      });
    });
  }, []);

  const refreshAclData = (mapIds = [], nodeIds = []) => {
    setAclTableLoading(true);

    if (mapIds == null) {
      mapIds = [];
    }

    if (nodeIds == null) {
      nodeIds = [];
    }

    Log(`mapIds = ${mapIds}, nodeIds = ${nodeIds}`);

    getAcls(user.authInfo.token, groupId, roleId, mapIds, nodeIds).then(
      (response) => {
        setAclTableRows(response.data);
      }
    );

    setAclTableLoading(false);
  };

  const onMapSelectionChanged = (selectedMapIds) => {
    Log(`onMapSelectionChanged ${selectedMapIds}`);

    let mapNodes = [];

    if (selectedMapIds.length == 0) {
      const nodes = { ...nodeTableLayout };
      setNodeTableData(nodes);
    } else {
      for (const mapId of selectedMapIds) {
        getNodes(user.authInfo.token, mapId).then((response) => {
          mapNodes = mapNodes.concat(response.data);
          const nodes = { ...nodeTableLayout, rows: mapNodes };
          setNodeTableData(nodes);
        });
      }
    }

    setMapSelection(selectedMapIds);
  };

  const onNodeSelectionChanged = (selectedNodeIds) => {
    Log(`onNodeSelectionChanged ${selectedNodeIds}`);
    setNodeSelection(selectedNodeIds);
  };

  const onAclSelectionChanged = (selectedAclIds) => {
    Log(`onAclSelectionChanged ${selectedAclIds}`);
    setAclSelection(selectedAclIds);
  };

  const onGroupChanged = (ev) => {
    setGroupId(ev.target.value);
  };

  const onRoleChanged = (ev) => {
    setRoleId(ev.target.value);
  };

  const onLoadAclClicked = () => {
    refreshAclData(selectedMapIds, selectedNodeIds);
  };

  const onSaveAclClicked = () => {};
  const onClearAclClicked = () => {
    setAclTableRows([]);
  };

  const onResetQueryFormClicked = () => {
    setGroupId(-1);
    setRoleId(-1);
    // reset the map selections
    apiRef.current.setRowSelectionModel([]);
  };

  const onCellClick = (cell) => {
    if (cell.field !== "delete") {
      return;
    }
  };

  const onDeleteAclClicked = () => {
    Log("delete clicked");
    Log(JSON.stringify(aclSelectionIds));
    setConfirmDialog({
      title: "Delete Confirmation",
      message: `Delete ${aclSelectionIds.length} ACLs?`,
      onCancelClicked: () => {
        setConfirmDialog(null);
      },
      onConfirmClicked: () => {
        setConfirmDialog(null);
        deleteSelectedAcls();
      },
    });
  };

  const deleteSelectedAcls = () => {
    const newRows = aclTableRows.filter(
      (acl) => !aclSelectionIds.includes(acl.id)
    );

    setAclTableRows(newRows);
    apiRef.current.forceUpdate();
  };

  const onCreateAclClicked = () => {
    const selectedGroup = groups.filter((group) => group.id == groupId);
    const selectedRole = roles.filter((role) => role.id == roleId);
    const selectedMaps = mapTableData.rows.filter((map) =>
      selectedMapIds.includes(map.id)
    );
    const selectedNodes = nodeTableData.rows.filter((node) =>
      selectedNodeIds.includes(node.id)
    );

    Log(`${JSON.stringify(selectedGroup)} ${JSON.stringify(selectedRole)}`);
    Log(` ${JSON.stringify(selectedMaps)}`);
    Log(` ${JSON.stringify(selectedNodes)}`);

    let newAclRows = [...aclTableRows];
    let index = nextIndex;

    if (selectedNodes.length > 0) {
      for (const selectedNode of selectedNodes) {
        const newRecord = {
          execute: false,
          read: false,
          write: false,
          objectType: "Nodes",
          id: index--,
          groupId: selectedGroup.length == 0 ? 0 : selectedGroup[0].id,
          objectIndex: selectedNode.id,
          roleId: selectedRole.length == 0 ? 0 : selectedRole[0].id,
          groupName: selectedGroup.length == 0 ? "*" : selectedGroup[0].name,
          roleName: selectedRole.length == 0 ? "*" : selectedRole[0].name,
        };

        newAclRows.push(newRecord);
      }
    } else if (selectedMaps.length > 0) {
      for (const selectedMap of selectedMaps) {
        const newRecord = {
          execute: false,
          read: false,
          write: false,
          objectType: "Maps",
          id: index--,
          groupId: selectedGroup.length == 0 ? 0 : selectedGroup[0].id,
          objectIndex: selectedMap.id,
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
      <MDBox p={0} pb={0}>
        <Card>
          <Grid container spacing={0}>
            <Grid item xs={12}>
              <MDBox p={3} pb={0} lineHeight={0}>
                <MDTypography variant="h6" fontWeight="medium">
                  Query Form
                </MDTypography>
              </MDBox>
            </Grid>
            <Grid item xs={12}>
              <MDBox p={3} lineHeight={0}>
                <Grid container spacing={3}>
                  <Grid item xs={6}>
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
                        <MenuItem value="-1">
                          <em>-- Select --</em>
                        </MenuItem>
                        <MenuItem value="0">
                          <em>*</em>
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
                  <Grid item xs={6}>
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
                        <MenuItem value="-1">
                          <em>-- Select --</em>
                        </MenuItem>
                        <MenuItem value="0">
                          <em>*</em>
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
                </Grid>
              </MDBox>
            </Grid>
            <Grid item xs={6}>
              <MDBox p={3} pt={0} lineHeight={0}>
                <MDTypography variant="h6" fontWeight="medium">
                  Maps
                </MDTypography>
                <DataGrid
                  apiRef={apiRef}
                  rows={mapTableData.rows}
                  columns={mapTableData.columns}
                  onRowSelectionModelChange={onMapSelectionChanged}
                  checkboxSelection
                  {...tableLayout}
                />
              </MDBox>
            </Grid>
            <Grid item xs={6}>
              <MDBox p={3} pt={0} lineHeight={0}>
                <MDTypography variant="h6" fontWeight="medium">
                  Nodes
                </MDTypography>
                <DataGrid
                  rows={nodeTableData.rows}
                  columns={nodeTableData.columns}
                  onRowSelectionModelChange={onNodeSelectionChanged}
                  checkboxSelection
                  {...tableLayout}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12}>
              <MDBox pb={3} lineHeight={0}>
                <Grid
                  container
                  spacing={0}
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Grid item xs={12}>
                    <Tooltip title="Query ACLs using Query Form">
                      <MDButton
                        color="secondary"
                        variant="contained"
                        size="small"
                        onClick={onLoadAclClicked}
                      >
                        Query ACLs
                      </MDButton>
                    </Tooltip>
                    &nbsp;
                    <Tooltip title="Create ACLs from Query Form">
                      <MDButton
                        color="secondary"
                        variant="contained"
                        size="small"
                        onClick={onCreateAclClicked}
                      >
                        Create ACLs
                      </MDButton>
                    </Tooltip>
                    &nbsp;
                    <Tooltip title="Reset Query Form">
                      <MDButton
                        color="secondary"
                        variant="contained"
                        size="small"
                        onClick={onResetQueryFormClicked}
                      >
                        Reset
                      </MDButton>
                    </Tooltip>
                  </Grid>
                </Grid>
              </MDBox>
            </Grid>
          </Grid>
        </Card>
        <br />
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <Card>
              <MDBox p={3} lineHeight={0}>
                <MDTypography variant="h6" fontWeight="medium">
                  Aaccess Control Lists (ACL)
                </MDTypography>
                <DataGrid
                  onCellClick={onCellClick}
                  rows={aclTableRows}
                  columns={aclTableColumns}
                  onRowSelectionModelChange={onAclSelectionChanged}
                  disableRowSelectionOnClick
                  loading={aclTableLoading}
                  {...tableLayout}
                />
                <MDBox pt={3} lineHeight={0}>
                  <Grid
                    container
                    direction="column"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Grid item xs={12}>
                      <Tooltip title="Delete Selected ACLs">
                        <MDButton
                          color="secondary"
                          variant="contained"
                          size="small"
                          onClick={onDeleteAclClicked}
                        >
                          Delete
                        </MDButton>
                      </Tooltip>
                      &nbsp;
                      <Tooltip title="Save ACLs">
                        <MDButton
                          color="secondary"
                          variant="contained"
                          size="small"
                          onClick={onSaveAclClicked}
                        >
                          Save
                        </MDButton>
                      </Tooltip>
                      &nbsp;
                      <Tooltip title="Clear ACLs">
                        <MDButton
                          color="secondary"
                          variant="contained"
                          size="small"
                          onClick={onClearAclClicked}
                        >
                          Clear
                        </MDButton>
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
};
