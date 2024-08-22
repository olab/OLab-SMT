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
import MDTypography from "@/components/MDTypography";
import DashboardLayout from "@/components/DashboardLayout";

// Data
import { getMaps, getNodes, getGroups, getRoles } from "../../services/api";
import mapTableLayout from "./mapTableLayout";
import nodeTableLayout from "./nodeTableLayout";
import { aclTableLayout } from "./aclTableLayout";
import { useAuth } from "../../hooks/useAuth";
import { Log, LogInfo, LogError, LogEnable } from "../../utils/Logger";

export const AclPage = () => {
  const [aclSelection, setAclSelection] = useState([]);
  const [aclTableLabel, setAclTableLabel] = useState("");
  const [aclTableData, setAclTableData] = useState(aclTableLayout);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapSelection, setMapSelection] = useState([]);
  const [mapTableData, setMapTableData] = useState(mapTableLayout);
  const [nodeSelection, setNodeSelection] = useState([]);
  const [nodeTableData, setNodeTableData] = useState(nodeTableLayout);
  const [roles, setRoles] = useState([]);

  const { user } = useAuth();

  useEffect(() => {
    getMaps(user.authInfo.token).then((response) => {
      const maps = { ...mapTableLayout, rows: response.data };
      setMapTableData(maps);

      // let newAclTableColumns = { ...aclTableData.columns };

      getGroups(user.authInfo.token).then((response) => {
        setGroups(response.data);

        // let columnDef = newAclTableColumns.columns.filter(
        //   (column) => column.field == "groupName"
        // );
        // columnDef.valueOptions = groups;
        
        getRoles(user.authInfo.token).then((response) => {
          setRoles(response.data);

          // let columnDef = newAclTableColumns.columns.filter(
          //   (column) => column.field == "roleName"
          // );
          // columnDef.valueOptions = roles;

          // setAclTableData(newAclTableColumns);

          refreshAclData();

          setLoading(false);
        });
      });
    });
  }, []);

  const refreshAclData = () => {
    if (mapSelection.length == 0 && nodeSelection.length == 0) {
      setAclTableLabel("System Default ACLs");
    } else if (mapSelection.length == 1 && nodeSelection.length == 0) {
      setAclTableLabel("Single-Map ACLs");
    } else if (mapSelection.length > 1 && nodeSelection.length == 0) {
      setAclTableLabel("Multi-Map ACLs");
    } else if (mapSelection.length >= 1 && nodeSelection.length == 1) {
      setAclTableLabel("Single-Node ACLs");
    } else if (mapSelection.length >= 1 && nodeSelection.length > 1) {
      setAclTableLabel("Multi-Node ACLs");
    }
  };

  const onNodeSelectionChanged = (selectedNodeIds) => {
    Log(`onNodeSelectionChanged ${selectedNodeIds}`);
    setNodeSelection(selectedNodeIds);
    refreshAclData();
  };

  const onAclSelectionChanged = (selectedAclIds) => {
    Log(`onAclSelectionChanged ${selectedAclIds}`);
    setAclSelection(selectedAclIds);
    refreshAclData();
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
    refreshAclData();

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
                />
              </MDBox>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <MDBox p={3} lineHeight={0}>
                <MDTypography variant="h6" fontWeight="medium">
                  <>{aclTableLabel}</>
                  {/* {mapSelection.length == 0 && nodeSelection.length == 0 && (
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
                  )} */}
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
                  columnHeaderHeight={30}
                  autoHeight
                  disableRowSelectionOnClick
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
};
