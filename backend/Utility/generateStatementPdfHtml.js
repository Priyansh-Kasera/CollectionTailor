const fs = require("fs");
const getDatefromUTC = require("./timeUtility");

const generateStatementPdfHtml = (user, bills, startDate, endDate) => {
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function getFinalAmount(data) {
    let amt = data?.payment
      ? (data?.lastBalance || 0) - (data?.amount || 0)
      : (data?.lastBalance || 0) + (data?.amount || 0);
    return Math.abs(amt);
  }

  let crAmount = 0;
  let drAmount = 0;
  let tableRows = "";
  bills.map((data) => {
    if (data.payment) {
      crAmount = crAmount + data.amount;
    } else {
      drAmount = drAmount + data.amount;
    }
    tableRows += `
            <tr>
                <td colspan="2">${data.customerName}</td>
                <td>${formatDate(new Date(data?.date))}</td>
                ${
                  data?.payment
                    ? `<td></td>
                    <td>${data?.amount || 0}</td>`
                    : `
                  <td>${data?.amount || 0}</td>
                  <td></td>`
                }
            </tr>
                `;
  });

  tableRows = tableRows.replace(",", "");
  let html = `
      <head>
      <title>HTML content</title>
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@200;300;400&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    
    <style>
      *{
          font-family: 'Roboto', sans-serif;
          box-sizing: border-box;
         
      }
    
      .header {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          margin-bottom : 3rem;
          align-items: center;
          
      }
      .headerText {
          width: 100%;
          text-align: right;
          font-size: 2.5rem;
          padding-top : 0.5rem;
          font-weight: 200;
          
      }
      .customerDetails{
        display: flex;
        width : 100%
        flex-direction: row;
        justify-content : space-between;
        margin-bottom : 3rem;
    
    }
    .customerAddress{
        width: 70%;
    }
    .billInfo {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    p {
        margin: 3px;
    }
    .boldText{
        font-weight: bold;
        margin : 3px;
    }
    .productDiv {
      
      width: 100%;
      display: flex;
      align-items: top;
      justify-content: center;
      align-items: flex-start;
    
    }
    table {
          width: 100%;
          border-collapse: collapse;
      }
    
    th, td {
      width: 16%; 
      padding: 5px 0;  
      text-align: center;
    }
    tr  {
      height : 25px;
      border-bottom : 0.1em solid grey;
    }
     tr :first-child {
        width : 40%;
        padding-left: 1rem;
        text-align: start;
    }
    .subTotalDiv {
    width: 100%;
    display: flex;
    justify-content: end;
    align-items: center;
    gap : 0;
    }
    .bankDetailDiv {
    margin-top : 3rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: end;
    page-break-before: auto;
    
    }
    .footerName {
    display: flex;
    flex-direction: column;
    margin : 0;
    align-items: end;
    }
    </style>
    </head>
    <body>
      <div class="header">
      <img src="data:image/png;base64,${fs
        .readFileSync("D:/BillGenerator/backend/Utility/Images/logo11C.png")
        .toString("base64")}" alt="alt text" width="300" class="logo" />
          <h1 class="headerText">STATEMENT</h1>
      </div>
    
      <div class="customerDetails">
          <div class="billInfo">
              <p class="boldText">Total ${Math.abs(drAmount - crAmount)}
          ${drAmount > crAmount ? "DR" : "CR"}</p>
            <div>
              <p>From : ${getDatefromUTC(startDate)}</p>
              <p>To ${"  "}: ${getDatefromUTC(endDate)}</p>
            </div>
    
          </div>    
      </div>
    
      <div style="min-height:580px";>
          <div class="productDiv">
              <table>
                  <tr>
                  <th colspan="2">Party Name</th>
                  <th>DATE</th>
                  <th>DEBIT</th>
                  <th>CREDIT</th>
                  </tr>
    
                  ${tableRows}
                      
              </table>
          </div>
           <div class="subTotalDiv">
                <p style="width: 18.5%; text-align: center; font-weight: bold; margin : 20px 0px;">${drAmount}</p>
                <p style="width: 18.5%; text-align: center; margin : 20px 0px; font-weight: bold;">${crAmount}</p>
            </div>
          </div>
      </div>
    
      <div class="bankDetailDiv">
      <div>
          <p class="boldText">PAYMENT INFORMATION</p>
          <p>${user?.bankDetail?.[0]?.bankName || "Bank Name"}</p>
          <p>Account no: ${user?.bankDetail?.[0]?.accountNumber || ""}</p>
          <p>Ifsc code: ${user?.bankDetail?.[0]?.ifscCode || ""} </p>
      </div>
      <div class="footerName">
          <h2 style="margin : 3px;">Collection Tailor</h2>
          <p>Mob No: ${user?.mobileNumber || 7239857149}, 8947973470</p>
          <p>Hirapanna Market, Sindhi Bazar, Udaipur</p>
      </div>
    </div>
    
     
    
      
    </body>
    
    
    </html>
        `;
  return html;
};

module.exports = generateStatementPdfHtml;
