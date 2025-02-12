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
  const [appTableData, setAppTableData] = useState([]);
  const [appTableLoading, setAppTableLoading] = useState(true);
  const [appRowSelectionModel, setAppRowSelectionModel] = useState(currentState.selectedApplicationIds);

  const { user } = useAuth();

  useEffect(() => {
    if (appTableData.length == 0) {
      getApplications(user.authInfo.token).then((response) => {
        setAppTableData(response.data);
        setAppTableLoading(false);
      });
    }

    setAppRowSelectionModel(currentState.selectedApplicationIds);

  }, [currentState.selectedApplicationIds]);

  const onAppSectionChanged = (ids) => {
    Log(`onSelectionChanged '${ids}'`);
    
    setAppRowSelectionModel(ids);
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
            rows={appTableData}
            columns={applicationTableLayout.columns}
            onRowSelectionModelChange={onAppSectionChanged}
            rowSelectionModel={appRowSelectionModel}
            checkboxSelection
            loading={appTableLoading}
            {...tableSettings}
          />
        </MDBox>
      </Grid>
      <Grid item xs={6}></Grid>
    </Grid>
  );
};
