const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });


// ✅ STEP 2 — Submit Complaint
router.post("/submit", upload.single("file"), async (req, res) => {

  try {
    const { username, mode, dataType, description, caption, issue } = req.body;

    const filePath = req.file ? req.file.path : "";
    const newComplaint = new Complaint({
      username,
      mode,
      dataType,
      description,
      caption,
      issue
    });

    await newComplaint.save();

    res.json({ message: "Complaint submitted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }

});


// ✅ STEP 3 — Fetch Complaints (PASTE HERE)
router.get("/:username", async (req, res) => {

  try {

    const complaints = await Complaint.find({
      username: req.params.username
    });

    res.json(complaints);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }

});

// Get ALL complaints (Admin)
router.get("/", async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;