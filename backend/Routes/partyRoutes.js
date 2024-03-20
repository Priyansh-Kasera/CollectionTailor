const express = require("express");
const {
  getParties,
  addParty,
  updateParty,
  deleteParty,
  findById,
  searchParty,
  getPartyLedger,
  downloadLedgerPdf,
} = require("../Controller/partyController");

const router = express.Router();

router.route("/:id").put(updateParty);
router.route("/delete").post(deleteParty);
router.route("/:id").get(findById);
router.route("/").get(getParties);
router.route("/").post(addParty);
router.route("/search").post(searchParty);
router.route("/ledger").post(getPartyLedger);
router.route("/ledgerPdf").post(downloadLedgerPdf);

module.exports = router;
