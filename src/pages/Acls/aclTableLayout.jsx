import Checkbox from '@mui/icons-material/CheckBox';

const aclTableLayout = {
  columns: [
    { field: 'id', headerName: 'Id', editable: false },
    {
      field: 'groupName',
      headerName: 'Group',
      flex: 1, editable: false
    },
    {
      field: 'roleName',
      headerName: 'Role',
      flex: 1, editable: false
    },
    {
      field: 'objectType',
      headerName: 'Type',
      flex: 1, editable: false,
      type: 'singleSelect',
      valueOptions: ['All', 'Maps', 'Nodes']
    },
    {
      field: 'objectIndex',
      headerName: 'Name',
      flex: 1, editable: false
    },
    {
      field: 'read',
      width: 10,
      headerName: 'R',
      flex: .25, editable: false,
      renderCell: (params) => {
        return <Checkbox defaultChecked size="small" />;
      }
    },
    {
      field: 'write',
      width: 10,
      headerName: 'W',
      flex: .25, editable: false,
      renderCell: (params) => {
        return <Checkbox defaultChecked size="small" />;
      }
    },
    {
      field: 'execute',
      width: 10,
      headerName: 'X',
      flex: .25, editable: false,
      renderCell: (params) => {
        return <Checkbox defaultChecked size="small" />;
      }
    }

  ],

  rows: [
    {
      id: 1,
      groupName: "group1",
      roleName: "role1",
      objectType: "Maps",
      objectIndex: "*",
      read: true,
      write: true,
      execute: true
    },
  ],
};

export default aclTableLayout;
