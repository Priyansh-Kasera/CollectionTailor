const fs = require("fs");
const getDatefromUTC = require("./timeUtility");
const path = require("path");

exports.generatehtml = (bill, user) => {
  console.log("user Details", user);
  let total = 0;
  let imagePath = path.join(__dirname, "images/logo11C.png");
  console.log("image path", imagePath);
  let tableRows = "";
  bill.items.map((data) => {
    total += data.price * data.quantity;
    tableRows += `
        <tr>
            <td colspan="2">${data.name}</td>
            <td>${data.quantity}</td>
            <td>${data.price}</td>
            <td>${data.price * data.quantity}</td>
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
        width: 20%; 
        padding: 5px 0;  
        text-align: center;
    }
    tr  {
        height : 25px;
        border-bottom : 1px solid black;
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
            <h1 class="headerText">INVOICE</h1>
        </div>
        <div class="customerDetails">
            <div class="customerAddress">
                <p class="boldText">BILLED TO :</p>
                <p>${bill.customerName}</p>
                <p>${bill.address.city ? `${bill.address.city},` : ""}${
    bill.address.state ? ` ${bill.address.state},` : ""
  }${bill.address.pincode ? ` (${bill.address.pincode})` : ""} 
                </p>
            </div>
            <div class="billInfo">
                <p class="boldText">Date. ${getDatefromUTC(bill.date)}</p>
                <p>Invoice No. ${bill.invoiceNo}</p>
                <p>Challan No. ${bill.challanNo}</p>
                ${bill.orderNo ? `<p>Order No. ${bill.orderNo}</p>` : ""}
                ${bill?.lrNo ? `<p>Lr No. ${bill.lrNo}</p>` : ""}
            </div>    
        </div>

        <div style="min-height:430px";>
            <div class="productDiv">
                <table>
                    <tr>
                    <th colspan="2">Item</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                    </tr>
                
                    ${tableRows}
                        
            </table>
            </div>
            <div class="subTotalDiv">
                <p style="width: 20%; text-align: center; font-weight: bold; margin : 20px 0px;">Subtotal</p>
                <p style="width: 20%; text-align: center; margin : 20px 0px;">${total}</p>
            </div>
            <div class="subTotalDiv" >
                <p style="width: 20%;margin: 0; text-align: center; font-weight: bold; border-bottom: 1px solid black; padding-bottom: 10px;">Tax</p>
                <p style="width: 20%;margin: 0; text-align: center; border-bottom: 1px solid black; padding-bottom: 10px;">0</p>
            </div>
            <div class="subTotalDiv">
                <h2 style="width: 20%; text-align: center; font-weight: bold;">Total</h2>
                <p style="width: 20%; text-align: center;">${total}</p>
            </div>
        </div>

        <h4>Terms & Conditons</h4>
        <ul>
            <li>Order will not be cancelled.</li>
            <li>Goods once sold will not be taken back or exchange.</li>
            <li>We are not responsible for garment after 3 months.</li>
        </ul>

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
