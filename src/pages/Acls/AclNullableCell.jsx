const AclNullableCell = (props) => {
  return (
    <>
    {props.value == null && ( <>{'*'}</> ) }
    {props.value != null && ( <>{props.value}</> ) }
    </>
  );
}

export default AclNullableCell;
