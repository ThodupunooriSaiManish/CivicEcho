const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// ✅ Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "complaints",
    allowed_formats: ["jpg", "png", "jpeg", "mp4"]
  }
});

// ✅ Use ONLY this upload
const upload = multer({ storage });


// ✅ STEP 2 — Submit Complaint
router.post("/submit", upload.single("file"), async (req, res) => {

  try {
    const { username, mode, dataType, description, caption, issue } = req.body;

    // ✅ Cloudinary gives URL here
    const fileUrl = req.file ? req.file.path : "";

    const newComplaint = new Complaint({
      username,
      mode,
      dataType,
      description,
      caption,
      issue,
      file: fileUrl   // ✅ IMPORTANT (store URL)
    });

    await newComplaint.save();

    res.json({ message: "Complaint submitted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }

});


// ✅ STEP 3 — Fetch Complaints (User)
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


// ✅ Get ALL complaints (Admin)
router.get("/", async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ Update complaint status
router.put("/update/:id", async (req, res) => {

  try {
    const { status } = req.body;

    await Complaint.findByIdAndUpdate(
      req.params.id,
      { status }
    );

    res.json({ message: "Status updated successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }

});

module.exports = router;