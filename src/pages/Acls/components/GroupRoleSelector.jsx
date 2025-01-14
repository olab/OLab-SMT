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

export const GroupRoleSelector = ({ 
  currentState, 
  groups, 
  onStateChange, 
  roles 
}) => {
  
  Log(`GroupRoleSelector: ${JSON.stringify(currentState, null, 1)}`);

  const [queryState, setQueryState] = useState({ ...currentState });

  useEffect(()=>{
    setQueryState({...currentState});
  }, [currentState?.groupId, currentState?.roleId]);

  const onFieldChanged = (ev) => {

    Log(`onFieldChanged: ${ev.target.name} = ${ev.target.value}`);
    
    const tmp = { ...queryState, [ev.target.name]: ev.target.value };
    setQueryState(tmp);
    onStateChange(tmp);
  };

  return (
    <Grid container spacing={0}>
      <Grid item xs={12}>
        <MDBox p={3} lineHeight={0}>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <FormControl variant="filled" sx={{ width: "100%" }}>
                <MDInput
                  select
                  label="Group"
                  name="groupId"
                  id="group-select-filled"
                  value={queryState.groupId}
                  onChange={onFieldChanged}
                  InputProps={{
                    classes: { root: "select-input-styles" },
                  }}
                  size="large"
                >
                  <MenuItem value="-1">
                    <em>-- Select --</em>
                  </MenuItem>
                  <MenuItem value="0">
                    <em>*</em>
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
                  name="roleId"
                  id="role-select-filled"
                  value={queryState.roleId}
                  onChange={onFieldChanged}
                  InputProps={{
                    classes: { root: "select-input-styles" },
                  }}
                  size="large"
                >
                  <MenuItem value="-1">
                    <em>-- Select --</em>
                  </MenuItem>
                  <MenuItem value="0">
                    <em>*</em>
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
          </Grid>
        </MDBox>
      </Grid>
    </Grid>
  );
};
