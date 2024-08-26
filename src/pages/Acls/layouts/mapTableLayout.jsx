import LoadNodeIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

const mapTableLayout = {
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

export default mapTableLayout;
