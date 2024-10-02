import Card from "@mui/material/Card";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";

import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import { useState, useEffect } from "react";

import MDBox from "@/components/MDBox";
import MDButton from "@/components/MDButton";
import MDInput from "@/components/MDInput";
import MDTypography from "@/components/MDTypography";

import mapTableLayout from "../layouts/mapTableLayout";
import nodeTableLayout from "../layouts/nodeTableLayout";
import tableSettings from "../layouts/tableSettings";
import { useAuth } from "../../../hooks/useAuth";
import { Log, LogInfo, LogError, LogEnable } from "../../../utils/Logger";

// Data
import { getMaps, getNodes } from "../../../services/api";

const initialState = {
  groupId: -1,
  roleId: -1,
  selectedMapIds: [],
  selectedNodeIds: [],
};

export const MapsNodesQuery = ({
  groups,
  onStateChange,
  onLoadAclClicked,
  onCreateAclClicked,
  roles,
}) => {
  const [mapTableData, setMapTableData] = useState([]);
  const [nodeTableData, setNodeTableData] = useState([]);
  const [queryState, setQueryState] = useState(initialState);
  const [mapTableLoading, setMapTableLoading] = useState(true);
  const [nodeTableLoading, setNodeTableLoading] = useState(false);

  const { user } = useAuth();

  const apiRef = useGridApiRef();

  useEffect(() => {
    if (mapTableData.length == 0) {
      getMaps(user.authInfo.token).then((response) => {
        setMapTableData(response.data);
        setMapTableLoading(false);
      });
    }
  }, []);

  const onFieldChanged = (ev) => {
    let newState = { ...queryState, [ev.target.name]: ev.target.value };
    setQueryState(newState);
    onStateChange({
      ...newState,
      groupId: newState.groupId == -1 ? null : newState.groupId,
      roleId: newState.roleId == -1 ? null : newState.roleId,
    });
  };

  const setMapSelection = (ids) => {
    setQueryState({ ...queryState, selectedMapIds: ids });
  };

  const setNodeSelection = (ids) => {
    setQueryState({ ...queryState, selectedNodeIds: ids });
  };

  const onMapSelectionChanged = (ids) => {
    Log(`onMapSelectionChanged ${ids}`);

    let mapNodes = [];

    if (ids.length == 0) {
      setNodeTableData([]);
    } else {
      setNodeTableLoading(true);
      for (const mapId of ids) {
        getNodes(user.authInfo.token, mapId).then((response) => {
          mapNodes = mapNodes.concat(response.data);
          setNodeTableData(mapNodes);
        });
      }
      setNodeTableLoading(false);
    }

    setMapSelection(ids);
    onStateChange({
      ...queryState,
      groupId: queryState.groupId == -1 ? null : queryState.groupId,
      roleId: queryState.roleId == -1 ? null : queryState.roleId,
      selectedMapIds: ids,
    });
  };

  const onNodeSelectionChanged = (ids) => {
    Log(`onNodeSelectionChanged ${ids}`);
    setNodeSelection(ids);
    onStateChange({
      ...queryState,
      groupId: queryState.groupId == -1 ? null : queryState.groupId,
      roleId: queryState.roleId == -1 ? null : queryState.roleId,
      selectedNodeIds: ids,
    });
  };

  const onResetQueryFormClicked = () => {
    // reset the map selections manually
    // since settings the model doesn't
    // appear to work
    apiRef.current.setRowSelectionModel([]);

    setQueryState({ ...initialState });
    onStateChange({
      ...initialState,
      groupId: null,
      roleId: null,
    });
  };

  return (
    <Card>
      <Grid container spacing={0}>
        <Grid item xs={6}>
          <MDBox p={3} pt={0} lineHeight={0}>
            <MDTypography variant="h6" fontWeight="medium">
              Maps
            </MDTypography>
            <DataGrid
              apiRef={apiRef}
              rows={mapTableData}
              columns={mapTableLayout.columns}
              onRowSelectionModelChange={onMapSelectionChanged}
              checkboxSelection
              loading={mapTableLoading}
              {...tableSettings}
            />
          </MDBox>
        </Grid>
        <Grid item xs={6}>
          <MDBox p={3} pt={0} lineHeight={0}>
            <MDTypography variant="h6" fontWeight="medium">
              Nodes
            </MDTypography>
            <DataGrid
              rows={nodeTableData}
              columns={nodeTableLayout.columns}
              onRowSelectionModelChange={onNodeSelectionChanged}
              checkboxSelection
              {...tableSettings}
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
                  <MDButton onClick={onLoadAclClicked}>Query ACLs</MDButton>
                </Tooltip>
                &nbsp;
                <Tooltip title="Create ACLs from Query Form">
                  <MDButton onClick={onCreateAclClicked}>Create ACLs</MDButton>
                </Tooltip>
                &nbsp;
                <Tooltip title="Reset Query Form">
                  <MDButton onClick={onResetQueryFormClicked}>Reset</MDButton>
                </Tooltip>
              </Grid>
            </Grid>
          </MDBox>
        </Grid>
      </Grid>
    </Card>
  );
};
