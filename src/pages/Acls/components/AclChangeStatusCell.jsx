import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";

const AclChangeStatusCell = (props) => {
  return (
    <>
      {props.value == null && (
        <></>
      )}
      {props.row.id < 0 && (
        <Tooltip title="Added">
          <AddIcon />
        </Tooltip>
      )}
      {props.value == 2 && (
        <Tooltip title="Edited">
          <EditIcon />
        </Tooltip>
      )}
      {props.value == 3 && (
        <Tooltip title="To Be Deleted">
          <DeleteIcon />
        </Tooltip>
      )}{" "}
    </>
  );
};

export default AclChangeStatusCell;
