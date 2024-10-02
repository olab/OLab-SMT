import LoadNodeIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

const tableLayout = {
  columns: [
    { field: 'id', headerName: 'Id', editable: false },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1, editable: false
    }   
  ],

  rows: [ ],
};

export default tableLayout;
