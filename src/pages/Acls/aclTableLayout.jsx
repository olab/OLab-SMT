import AclCheckBox from "./AclCheckBox";
import AclNullableCell from "./AclNullableCell";
import DeleteIcon from "@mui/icons-material/Delete";

const aclTableLayout = {
  columns: [
    {
      field: "groupName",
      headerName: "Group",
      flex: 1,
      editable: false,
      renderCell: AclNullableCell
    },
    {
      field: "roleName",
      headerName: "Role",
      flex: 1,
      editable: false,
      renderCell: AclNullableCell
    },
    {
      editable: true,
      field: "objectType",
      headerName: "Type",
      flex: 1,
      renderCell: AclNullableCell
    },
    {
      field: "objectIndex",
      headerName: "Name",
      flex: 1,
      editable: false,
      renderCell: AclNullableCell
    },
    {
      field: "read",
      headerAlign: 'center',
      headerName: "R",
      flex: 0.25,
      renderCell: AclCheckBox,
    },
    {
      headerAlign: 'center',
      field: "write",
      headerName: "W",
      flex: 0.25,
      renderCell: AclCheckBox,
    },
    {
      headerAlign: 'center',
      field: "execute",
      headerName: "X",
      flex: 0.25,
      renderCell: AclCheckBox,
    },
    {
      headerAlign: 'center',
      field: "delete",
      headerName: "",
      sortable: false,
      renderCell: () => {
        return <DeleteIcon />;
      },
    },
  ],

  rows: [],
};

export default aclTableLayout;
