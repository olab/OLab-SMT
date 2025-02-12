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

export const MapsNodesQuery = ({
  currentState,
  groups,
  onStateChange,
  onLoadAclClicked,
  onCreateAclClicked,
  roles,
}) => {
  Log(`MapsNodesQuery: ${JSON.stringify(currentState, null, 1)}`);

  const [queryState, setQueryState] = useState(currentState);

  const [mapTableData, setMapTableData] = useState([]);
  const [mapTableLoading, setMapTableLoading] = useState(true);
  const [mapRowSelectionModel, setMapRowSelectionModel] = useState(currentState.selectedMapsIds);

  const [nodeTableData, setNodeTableData] = useState([]);
  const [nodeTableLoading, setNodeTableLoading] = useState(false);
  const [nodeRowSelectionModel, setNodeRowSelectionModel] = useState(currentState.selectedNodeIds);

  const { user } = useAuth();

  useEffect(() => {
    if (mapTableData.length == 0) {
      getMaps(user.authInfo.token).then((response) => {
        setMapTableData(response.data);
        setMapTableLoading(false);
      });
    }

    setMapRowSelectionModel(currentState.selectedMapIds);
    setNodeRowSelectionModel(currentState.selectedNodeIds);

  }, [currentState.selectedMapsIds, currentState.selectedNodeIds]);

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

    setMapRowSelectionModel(ids);
    onStateChange({ selectedMapIds: ids });
  };

  const onNodeSelectionChanged = (ids) => {
    Log(`onNodeSelectionChanged ${ids}`);
    setNodeRowSelectionModel(ids);
    onStateChange({ selectedNodeIds: ids });
  };

  return (
    <Grid container spacing={0}>
      <Grid item xs={6}>
        <MDBox p={3} pt={0} lineHeight={0}>
          <MDTypography variant="h6" fontWeight="medium">
            Maps
          </MDTypography>
          <DataGrid
            rows={mapTableData}
            columns={mapTableLayout.columns}
            onRowSelectionModelChange={onMapSelectionChanged}
            rowSelectionModel={mapRowSelectionModel}
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
            rowSelectionModel={nodeRowSelectionModel}
            checkboxSelection
            {...tableSettings}
          />
        </MDBox>
      </Grid>
    </Grid>
  );
};
