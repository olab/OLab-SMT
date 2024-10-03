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
import tableSettings from "../layouts/tableSettings";

import { useAuth } from "../../../hooks/useAuth";
import { Log, LogInfo, LogError, LogEnable } from "../../../utils/Logger";

import { getApplications } from "../../../services/api";

export const ApplicationsQuery = ({
  currentState,
  onCreateAclClicked,
  onLoadAclClicked,
  onResetQueryFormClicked,
  onStateChange,
  title,
}) => {
  Log(`ApplicationsQuery: ${JSON.stringify(currentState, null, 1)}`);

  const [queryState, setQueryState] = useState(currentState);
  const [tableData, setTableData] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [rowSelectionModel, setRowSelectionModel] = useState(currentState.selectedApplicationIds);

  const { user } = useAuth();

  useEffect(() => {
    if (tableData.length == 0) {
      getApplications(user.authInfo.token).then((response) => {
        setTableData(response.data);
        setTableLoading(false);
      });
    }
  }, []);

  const onTableSectionChanged = (ids) => {
    Log(`onSelectionChanged '${ids}'`);
    setRowSelectionModel(ids);
  };

  return (
    <Grid container spacing={0}>
      <Grid item xs={6}>
        <MDBox p={3} pt={0} lineHeight={0}>
          <MDTypography variant="h6" fontWeight="medium">
            {title}
          </MDTypography>
          <DataGrid
            rows={tableData}
            columns={applicationTableLayout.columns}
            onRowSelectionModelChange={onTableSectionChanged}
            rowSelectionModel={rowSelectionModel}
            checkboxSelection
            loading={tableLoading}
            {...tableSettings}
          />
        </MDBox>
      </Grid>
      <Grid item xs={6}></Grid>
    </Grid>
  );
};
