
const userTableLayout = {
  columns: [
    { field: 'id', headerName: 'User Id', width: 90, editable: false },
    {
      field: 'userName',
      headerName: 'User Name',
      flex: 1, editable: false
    },
    {
      field: 'nickName',
      headerName: 'Full Name',
      flex: 1, editable: false
    }
  ],

  rows: [ ],
};

export default userTableLayout;
