import DeleteIcon from '@mui/icons-material/Delete';

const groupRoleTableLayout = {
  columns: [
    {
      field: 'group',
      headerName: 'Group',
      flex: 1, 
      editable: false
    },
    {
      field: 'role',
      headerName: 'Role',
      flex: 1, 
      editable: false
    },
    {
      field: "delete",
      headerName: "",
      sortable: false,
      renderCell: (params) => {
        return <DeleteIcon/>;
      }
    },    
  ]
};

export default groupRoleTableLayout;
