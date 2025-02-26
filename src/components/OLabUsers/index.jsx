import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import { Log, LogInfo, LogError, LogEnable } from "../../utils/Logger";
import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import MDBox from "@/components/MDBox";
import MDButton from "@/components/MDButton";
import MDTypography from "@/components/MDTypography";
import Tooltip from "@mui/material/Tooltip";
import userTableLayout from "./userTableLayout";

function OLabUsers({
  buttons,
  data,
  loading,
  onDeleteRows,
  onRowClicked,
  onSelectionChanged,
  setConfirmDialog,
  setStatusMessage,
  title,
  ...rest
}) {
  const [actions, setActions] = useState(buttons);
  const [selectedIds, setSelectedIds] = useState([]);

  const apiRef = useGridApiRef();

  const onTableRowClick = (table) => {
    Log(`onTableRowClick ${JSON.stringify(table.row)}`);
    if (onRowClicked != null) {
      onRowClicked(table);
    }    
  };

  const onTableSelectionChanged = (rowIds) => {
    Log(`onTableSelectionChanged ${JSON.stringify(rowIds)}`);
    setSelectedIds(rowIds);
    if (onSelectionChanged != null) {
      onSelectionChanged(rowIds);
    }
  };

  const onComponentDeleteClicked = () => {
    Log(`onComponentDeleteClicked ${JSON.stringify(selectedIds)}`);
    setConfirmDialog({
      title: "Delete Confirmation",
      message: `Delete ${selectedIds.length} rows?`,
      onCancelClicked: () => {
        setConfirmDialog(null);
      },
      onConfirmClicked: () => {
        setConfirmDialog(null);
        if (onDeleteRows != null) {
          onDeleteRows(selectedIds);
        }
      },
    });
  };

  return (
    <>
      <MDTypography variant="h6" fontWeight="medium">
        &nbsp;
      </MDTypography>
      <DataGrid
        apiRef={apiRef}
        rows={data}
        columns={userTableLayout.columns}
        onRowSelectionModelChange={onTableSelectionChanged}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        onRowClick={onTableRowClick}
        pageSizeOptions={[5, 10, 15, 20]}
        checkboxSelection
        disableRowSelectionOnClick
        rowHeight={30}
        columnHeaderHeight={30}
        autoHeight
        loading={loading}
      />
      <MDBox pt={3} lineHeight={0}>
        <Grid container spacing={5} justifyContent="center">
          {selectedIds.length > 0 && (
            <>
              <Grid item>
                <Tooltip title="Delete Selected Rows">
                  <MDButton onClick={onComponentDeleteClicked}>Delete</MDButton>
                </Tooltip>
              </Grid>
            </>
          )}
          {Object.keys(actions).map((key) => {
            if (actions[key].visible) {
              return (
                <Grid key={key} item>
                  <Tooltip title={actions[key].tooltip}>
                    <MDButton onClick={actions[key].onClick}>
                      {actions[key].label}
                    </MDButton>
                  </Tooltip>
                </Grid>
              );
            }
          })}
        </Grid>
      </MDBox>
    </>
  );
}

export default OLabUsers;
