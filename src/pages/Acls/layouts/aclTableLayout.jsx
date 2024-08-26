import AclCheckBoxCell from "../components/AclCheckBoxCell";
import AclNullableCell from "../components/AclNullableCell";
import AclChangeStatusCell from "../components/AclChangeStatusCell";

const aclTableLayout = {
  columns: [
    {
      headerAlign: "center",
      field: "status",
      headerName: "",
      flex: 0.25,
      renderCell: AclChangeStatusCell,
    },    
    {
      field: "groupName",
      headerName: "Group",
      flex: 1,
      editable: false,
      renderCell: AclNullableCell,
    },
    {
      field: "roleName",
      headerName: "Role",
      flex: 1,
      editable: false,
      renderCell: AclNullableCell,
    },
    {
      editable: true,
      field: "objectType",
      headerName: "Type",
      flex: 1,
      renderCell: AclNullableCell,
    },
    {
      field: "objectIndex",
      headerName: "Id",
      flex: 1,
      editable: false,
      renderCell: AclNullableCell,
    },
    {
      field: "read",
      headerAlign: "center",
      headerName: "R",
      flex: 0.25,
      renderCell: AclCheckBoxCell,
    },
    {
      headerAlign: "center",
      field: "write",
      headerName: "W",
      flex: 0.25,
      renderCell: AclCheckBoxCell,
    },
    {
      headerAlign: "center",
      field: "execute",
      headerName: "X",
      flex: 0.25,
      renderCell: AclCheckBoxCell,
    }
  ],

  rows: [],
};

export default aclTableLayout;
