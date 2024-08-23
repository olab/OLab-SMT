import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import { useState, useEffect } from "react";

import MDBox from "@/components/MDBox";
import MDInput from "@/components/MDInput";
import MDTypography from "@/components/MDTypography";
import DashboardLayout from "@/components/DashboardLayout";
import MDButton from "@/components/MDButton";

// Data
import {
  getAcls,
  getMaps,
  getNodes,
  getGroups,
  getRoles,
} from "../../services/api";
import mapTableLayout from "./mapTableLayout";
import nodeTableLayout from "./nodeTableLayout";
import aclTableLayout from "./aclTableLayout";
import tableLayout from "./tableLayout";

import { useAuth } from "../../hooks/useAuth";
import { Log, LogInfo, LogError, LogEnable } from "../../utils/Logger";

export const AclPage = () => {
  const [aclSelection, setAclSelection] = useState([]);
  const [aclTableLabel, setAclTableLabel] = useState("");
  const [aclTableColumns, setAclTableColumns] = useState(
    aclTableLayout.columns
  );
  const [aclTableRows, setAclTableRows] = useState(aclTableLayout.rows);
  const [groups, setGroups] = useState([]);
  const [groupId, setGroupId] = useState(0);
  const [loading, setLoading] = useState(true);
  const [aclTableLoading, setAclTableLoading] = useState(false);

  const [selectedMapIds, setMapSelection] = useState([]);
  const [mapTableData, setMapTableData] = useState(mapTableLayout);
  const [selectedNodeIds, setNodeSelection] = useState([]);
  const [nodeTableData, setNodeTableData] = useState(nodeTableLayout);
  const [roles, setRoles] = useState([]);
  const [roleId, setRoleId] = useState(0);
  const [nextIndex, setNextIndex] = useState(-1);
  // 0 = default mode
  // 1 = single map mode
  // 2 = multi map mode
  // 3 = single node mode
  // 4 = multi-node mode
  const [aclTableMode, setAclTableMode] = useState(0);

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

          refreshAclData();

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

    if (mapIds.length == 0 && nodeIds.length == 0) {
      setAclTableLabel("Default ACLs");
    } else if (mapIds.length == 1 && nodeIds.length == 0) {
      setAclTableLabel("Single-Map ACLs");
    } else if (mapIds.length > 1 && nodeIds.length == 0) {
      setAclTableLabel("Multi-Map ACLs");
    } else if (mapIds.length >= 1 && nodeIds.length == 1) {
      setAclTableLabel("Single-Node ACLs");
    } else if (mapIds.length >= 1 && nodeIds.length > 1) {
      setAclTableLabel("Multi-Node ACLs");
    }

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
    refreshAclData(selectedMapIds);
  };

  const onNodeSelectionChanged = (selectedNodeIds) => {
    Log(`onNodeSelectionChanged ${selectedNodeIds}`);
    setNodeSelection(selectedNodeIds);
    refreshAclData(selectedMapIds, selectedNodeIds);
  };

  const onAclSelectionChanged = (selectedAclIds) => {
    Log(`onAclSelectionChanged ${selectedAclIds}`);
    setAclSelection(selectedAclIds);
    refreshAclData();
  };

  const onGroupChanged = (ev) => {
    setGroupId(ev.target.value);
  };

  const onRoleChanged = (ev) => {
    setRoleId(ev.target.value);
  };

  const onSaveClicked = () => {};

  const onCreateClicked = () => {
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
          groupId: selectedGroup[0].id,
          objectIndex: selectedNode.id,
          roleId: selectedRole[0].id,
          groupName: selectedGroup[0].name,
          roleName: selectedRole[0].name,
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
          groupId: selectedGroup[0].id,
          objectIndex: selectedMap.id,
          roleId: selectedRole[0].id,
          groupName: selectedGroup[0].name,
          roleName: selectedRole[0].name,
        };

        newAclRows.push(newRecord);
      }
    }

    setNextIndex(index);
    setAclTableRows(newAclRows);
  };

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
      <MDBox pt={0} pb={0}>
        <Card>
          <Grid container spacing={0}>
            <Grid item xs={6}>
              <MDBox p={3} lineHeight={0}>
                <MDTypography variant="h6" fontWeight="medium">
                  Maps
                </MDTypography>
                <DataGrid
                  rows={mapTableData.rows}
                  columns={mapTableData.columns}
                  onRowSelectionModelChange={onMapSelectionChanged}
                  checkboxSelection
                  {...tableLayout}
                />
              </MDBox>
            </Grid>
            <Grid item xs={6}>
              <MDBox p={3} lineHeight={0}>
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
              <MDBox p={3} lineHeight={0}>
                <Grid container spacing={2}>
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
                  <Grid item xs={6}>
                    <FormControl sx={{ width: "100%" }} variant="filled">
                      <MDInput
                        select
                        label="Role"
                        id="role-select-filled"
                        value={roleId}
                        onChange={onRoleChanged}
                        variant="outlined"
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
                  <Grid item xs={12}>
                    <Grid
                      container
                      spacing={0}
                      direction="column"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Grid item xs={12}>
                        <MDButton
                          color="secondary"
                          variant="contained"
                          size="small"
                          onClick={onCreateClicked}
                        >
                          Create ACLs
                        </MDButton>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </MDBox>
            </Grid>
          </Grid>
        </Card>
        <br/>
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <Card>
              <MDBox p={3} lineHeight={0}>
                <MDTypography variant="h6" fontWeight="medium">
                  {aclTableLabel}
                </MDTypography>
                <DataGrid
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
                      <MDButton
                        color="secondary"
                        variant="contained"
                        size="small"
                        onClick={onSaveClicked}
                      >
                        Save
                      </MDButton>
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
