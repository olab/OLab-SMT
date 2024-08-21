import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import { useState, useEffect } from "react";

import MDBox from "@/components/MDBox";
import MDTypography from "@/components/MDTypography";
import DashboardLayout from "@/components/DashboardLayout";

// Data
import { getMaps, getNodes } from "../../services/api";
import mapTableLayout from "./mapTableLayout";
import nodeTableLayout from "./nodeTableLayout";
import aclTableLayout from "./aclTableLayout";
import { useAuth } from "../../hooks/useAuth";
import { Log, LogInfo, LogError, LogEnable } from "../../utils/Logger";

export const AclPage = ({ groups, roles }) => {
  const [mapTableData, setMapTableData] = useState(mapTableLayout);
  const [mapSelection, setMapSelection] = useState([]);
  const [nodeTableData, setNodeTableData] = useState(nodeTableLayout);
  const [nodeSelection, setNodeSelection] = useState([]);
  const [aclTableData, setAclTableData] = useState(aclTableLayout);
  const [aclSelection, setAclSelection] = useState([]);

  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  useEffect(() => {
    getMaps(user.authInfo.token).then((response) => {
      const maps = { ...mapTableLayout, rows: response.data };
      setMapTableData(maps);
      setLoading(false);
    });
  }, []);

  const onNodeSelectionChanged = (selectedNodeIds) => {
    Log(`onNodeSelectionChanged ${selectedNodeIds}`);
    setNodeSelection(selectedNodeIds);
  };

  const onAclSelectionChanged = (selectedAclIds) => {
    Log(`onAclSelectionChanged ${selectedAclIds}`);
    setAclSelection(selectedAclIds);
  };

  const onMapSelectionChanged = (selectedMapIds) => {
    Log(`onMapSelectionChanged ${selectedMapIds}`);

    setLoading(true);

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

    setLoading(false);
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
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Card>
              <MDBox p={3} lineHeight={0}>
                <MDTypography variant="h6" fontWeight="medium">
                  Maps
                </MDTypography>
                <DataGrid
                  rows={mapTableData.rows}
                  columns={mapTableData.columns}
                  onRowSelectionModelChange={onMapSelectionChanged}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 10,
                      },
                    },
                  }}
                  pageSizeOptions={[5, 10, 15, 20]}
                  checkboxSelection
                  rowHeight={25}
                  columnHeaderHeight={30}
                  autoHeight
                />
              </MDBox>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card>
              <MDBox p={3} lineHeight={0}>
                <MDTypography variant="h6" fontWeight="medium">
                  Nodes
                </MDTypography>
                <DataGrid
                  rows={nodeTableData.rows}
                  columns={nodeTableData.columns}
                  onRowSelectionModelChange={onNodeSelectionChanged}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 10,
                      },
                    },
                  }}
                  pageSizeOptions={[5, 10, 15, 20]}
                  checkboxSelection
                  rowHeight={25}
                  columnHeaderHeight={30}
                  autoHeight
                />
              </MDBox>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <MDBox p={3} lineHeight={0}>
                <MDTypography variant="h6" fontWeight="medium">
                  {mapSelection.length == 0 && nodeSelection.length == 0 && (
                    <>System Default ACLs</>
                  )}
                  {mapSelection.length == 1 && nodeSelection.length == 0 && (
                    <>Single-Map ACLs</>
                  )}
                  {mapSelection.length > 1 && nodeSelection.length == 0 && (
                    <>Multi-Map ACLs</>
                  )}
                  {mapSelection.length >= 1 && nodeSelection.length == 1 && (
                    <>Single-Node ACLs</>
                  )}
                  {mapSelection.length >= 1 && nodeSelection.length > 1 && (
                    <>Multi-Node ACLs</>
                  )}
                </MDTypography>

                <DataGrid
                  rows={aclTableData.rows}
                  columns={aclTableData.columns}
                  onRowSelectionModelChange={onAclSelectionChanged}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 10,
                      },
                    },
                  }}
                  pageSizeOptions={[5, 10, 15, 20]}
                  checkboxSelection
                  rowHeight={25}
                  columnHeaderHeight={30}
                  autoHeight
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
};
