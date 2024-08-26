import { useState, useEffect } from "react";
import Checkbox from "@mui/material/Checkbox";

const AclCheckBoxCell = (props) => {
  const [checked, setChecked] = useState(props.value);

  const handleChange = (event) => {
    setChecked(event.target.checked);
    props.row[props.field] = event.target.checked;
  };

  return (
    <center>
      <Checkbox
        id={props.field}
        size="lg"
        checked={checked}
        onChange={handleChange}
      />
    </center>
  );
};

export default AclCheckBoxCell;
