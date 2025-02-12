import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import { getApplications } from "../../../services/api";
import { Log, LogInfo, LogError, LogEnable } from "../../../utils/Logger";
import { useAuth } from "../../../hooks/useAuth";
import { useState, useEffect } from "react";

import applicationTableLayout from "../layouts/applicationTableLayout";
import Grid from "@mui/material/Grid";
import MDBox from "@/components/MDBox";
import MDTypography from "@/components/MDTypography";
import tableSettings from "../layouts/tableSettings";

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

    setRowSelectionModel(currentState.selectedApplicationIds);

  }, [currentState.selectedApplicationIds]);

  const onTableSectionChanged = (ids) => {
    Log(`onSelectionChanged '${ids}'`);
    setRowSelectionModel(ids);
    onStateChange({ selectedApplicationIds: ids });
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
