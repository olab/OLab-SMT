const nodeTableLayout = {
  columns: [
    { field: 'id', headerName: 'Id', editable: false },
    {
      field: 'mapName',
      headerName: 'Map',
      flex: 1, editable: false
    },
    {
      field: 'title',
      headerName: 'Name',
      flex: 1, editable: false
    }   
  ],

  rows: [ ],
};

export default nodeTableLayout;
