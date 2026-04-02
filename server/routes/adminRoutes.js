const express = require("express");
const router = express.Router();
const { getGroupedComplaints } = require("../controllers/adminController");

router.get("/grouped-complaints", getGroupedComplaints);

module.exports = router;