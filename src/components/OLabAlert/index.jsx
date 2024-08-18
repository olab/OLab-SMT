import MDAlert from "@/components/MDAlert";

function OLabAlert({ color, children }) {

  if ( children == null ) {
    return (<></>);
  }
  return (
    <MDAlert color={color} dismissible>
      {children}
    </MDAlert>
  );
}

export default OLabAlert;
