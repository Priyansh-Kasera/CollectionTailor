const express = require('express');
const { createBill, testFun, getAllBill, findBill, deleteBill, updateBill, findBillByName, findBillByDate, findBillByInvoice, chageBillStatus, createPdf } = require('../Controller/billController');

const router = express.Router();

router.route("/create").post(createBill)
router.route("/find/:id").get(findBill)
router.route("/delete/:id").delete(deleteBill)
router.route("/update/:id").put(updateBill)
router.route("/showAll").get(getAllBill)
//find bill by name 
router.route("/getBills").post(findBillByName)
// find bill by date
router.route("/findByDate").post(findBillByDate)
// serach by invoice number
router.route("/findByInvoice/:number").get(findBillByInvoice)
// change status of bill
router.route("/changeStatus").post(chageBillStatus)
router.route("/generatePdf").get(createPdf)
module.exports = router;