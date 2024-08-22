import AclCheckBox from "./AclCheckBox";

const aclTableLayout = {
  columns: [
    { field: "id", headerName: "Id", editable: false },
    {
      field: "groupName",
      headerName: "Group",
      type: "singleSelect",
      flex: 1,
      editable: false,
      valueOptions: null
    },
    {
      field: "roleName",
      headerName: "Role",
      type: "singleSelect",
      flex: 1,
      editable: false,
      valueOptions: null
    },
    {
      editable: true,
      field: "objectType",
      headerName: "Type",
      flex: 1,
      type: "singleSelect",
      valueOptions: (params) => {
        return ["All", "Maps", "Nodes"];
      },
    },
    {
      field: "objectIndex",
      headerName: "Name",
      flex: 1,
      editable: false,
    },
    {
      field: "read",
      headerName: "R",
      flex: 0.25,
      renderCell: AclCheckBox,
    },
    {
      field: "write",
      headerName: "W",
      flex: 0.25,
      renderCell: AclCheckBox,
    },
    {
      field: "execute",
      headerName: "X",
      flex: 0.25,
      renderCell: AclCheckBox,
    },
  ],

  rows: [],
};

export default aclTableLayout;
