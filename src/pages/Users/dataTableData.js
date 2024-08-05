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
    { Header: "id", accessor: "id", width: "20%" },
    { Header: "username", accessor: "username", width: "25%" },
    { Header: "nickname", accessor: "nickname" },
  ],

  rows: [
    {
      id: 1,
      username: "wirunc",
      nickname: "Corey Wirun"
    },

    {
      id: 2,
      username: "olab4s",
      nickname: "OLab Super User"
    },

  ],
};

export default dataTableData;
