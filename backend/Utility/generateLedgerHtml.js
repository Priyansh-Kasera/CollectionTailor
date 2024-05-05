const fs = require("fs");
const getDatefromUTC = require("./timeUtility");
const path = require("path");

exports.generateLedgerHtml = (user, bills, party, startDate, endDate) => {
  console.log("USER", user);
  let imagePath = path.join(__dirname, "Images/logo11C.png");
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

  let total = 0;
  let tableRows = "";
  bills.map((data) => {
    total += data.price * data.quantity;
    tableRows += `
        <tr>
            <td>${formatDate(new Date(data?.date))}</td>
            <td>${data?.invoiceNo === -1 ? "" : data?.invoiceNo || 0}</td>
            <td></td>
            ${
              data?.payment
                ? `<td></td>
                <td>${data?.amount || 0}</td>`
                : `
              <td>${data?.amount || 0}</td>
              <td></td>`
            }
            <td>${getFinalAmount(data)}
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
    width: 30%;
    display: flex;
    flex-direction: column;
    align-items: end;
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
    .readFileSync(imagePath)
    .toString("base64")}" alt="alt text" width="300" class="logo" />
      <h1 class="headerText">LEDGER</h1>
  </div>

  <div class="customerDetails">
      <div class="customerAddress">
          <p class="boldText">LEDGER TO :</p>
          <p>${party.partyName}</p>
          <p>${party.mobileNo}</p>
          <p>${party.address.city ? `${party.address.city},` : ""}${
    party.address.state ? ` ${party.address.state},` : ""
  }${party.address.pincode ? ` (${party.address.pincode})` : ""} 
          </p>
      </div>
      <div class="billInfo">
          <p class="boldText">Opening Balance ${
            Math.abs(bills?.[0]?.lastBalance) || 0
          }</p>
          <p>From ${getDatefromUTC(startDate)}</p>
          <p>To ${getDatefromUTC(endDate)}</p>

      </div>    
  </div>

  <div style="min-height:580px";>
      <div class="productDiv">
          <table>
              <tr>
              <th>DATE</th>
              <th>INVOICE NO</th>
              <th>DESCRIPTION</th>
              <th>DEBIT</th>
              <th>CREDIT</th>
              <th>BALANCE</th>
              </tr>

              ${tableRows}
                  
          </table>
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
      <p>Mob No: ${user?.mobileNumber || 7239857149}, 8619026424</p>
      <p>Hirapanna Market, Sindhi Bazar, Udaipur</p>
  </div>
</div>

 

  
</body>


</html>
    `;
  return html;
};
