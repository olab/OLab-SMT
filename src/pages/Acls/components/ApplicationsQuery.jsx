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

import applicationTableLayout from "../layouts/applicationTableLayout";
import tableLayout from "../layouts/tableLayout";

import { useAuth } from "../../../hooks/useAuth";
import { Log, LogInfo, LogError, LogEnable } from "../../../utils/Logger";

import { getApplications } from "../../../services/api";

export const ApplicationsQuery = ({ 
  currentState,
  onCreateAclClicked, 
  onLoadAclClicked, 
  onResetQueryFormClicked, 
  onStateChange, 
}) => {

  const [tableData, setTableData] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [queryState, setQueryState] = useState(currentState);

  const { user } = useAuth();
  const apiRef = useGridApiRef();

  useEffect(() => {
    if (tableData.length == 0) {
      getApplications(user.authInfo.token).then((response) => {
        setTableData(response.data);
        setTableLoading(false);
      });
    }
  }, []);

  const setSelection = (ids) => {
    onStateChange({ ...queryState, selectedApplicationIds: ids });
  };

  const onSelectionChanged = (ids) => {
    Log(`onSelectionChanged ${ids}`);
    setSelection(ids);
  };

  return (
    <Card>
      <Grid container spacing={0}>
        <Grid item xs={6}>
          <MDBox p={3} pt={0} lineHeight={0}>
            <MDTypography variant="h6" fontWeight="medium">
              Applications
            </MDTypography>
            <DataGrid
              apiRef={apiRef}
              rows={tableData}
              columns={applicationTableLayout.columns}
              onRowSelectionModelChange={onSelectionChanged}
              checkboxSelection
              loading={tableLoading}
              {...tableLayout}
            />
          </MDBox>
        </Grid>
        <Grid item xs={6}>
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
    </Card>);
};
