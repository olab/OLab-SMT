/**
=========================================================
* Material Dashboard 2 PRO React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-pro-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

const dataTableData = {
  columns: [
    { Header: "User Id", accessor: "id", width: "20px", align: "center" },
    { Header: "User Name", accessor: "userName", align: "center" },
    { Header: "Nick Name", accessor: "nickName", align: "center" },
  ],

  rows: [
    {
      id: 1,
      userName: "wirunc",
      nickName: "Corey Wirun",
      align: "left"
    },

    {
      id: 2,
      userName: "olab4s",
      nickName: "OLab Super User"
    },

  ],
};

export default dataTableData;
