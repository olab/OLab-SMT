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
      field: "action",
      headerName: "",
      sortable: false,
      renderCell: (params) => {
        const onClick = (e) => {
          e.stopPropagation(); // don't select this row after clicking
          return alert(JSON.stringify(params.row, null, 4));
        };
  
        return <DeleteIcon onClick={onClick}/>;

      }
    },    
  ],

  rows: [],
};

export default groupRoleTableLayout;
