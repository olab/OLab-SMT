import DeleteIcon from '@mui/icons-material/Delete';

const DeleteGroupRoleComponent = ({data, onClick}) => {

  const onDeleteClicked = () => {
    if ( onClick != null ) {
      onClick(data);
    }
  }

  return (
    <DeleteIcon onClick={onDeleteClicked}/>
  );
};

export default DeleteGroupRoleComponent;