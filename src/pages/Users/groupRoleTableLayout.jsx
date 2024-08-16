import Button from "@mui/material/Button";
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

  rows: [
    {
      id: 1,
      groupId: 1,
      group: 'olab',
      roleId: 17,
      role: 'administrator'
    },
    {
      id: 2,
      groupId: 1,
      group: 'olab',
      roleId: 18,
      role: 'student'
    },
    {
      id: 3,
      groupId: 1,
      group: 'olab',
      roleId: 6,
      role: 'learner'
    }

  ],
};

export default groupRoleTableLayout;
