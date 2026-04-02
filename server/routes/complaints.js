const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");

const multer = require("multer");
const { exec } = require("child_process");

// ✅ SIMPLE LOCAL STORAGE (BEST FOR YOU NOW)
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// ================================
// ✅ SUBMIT COMPLAINT (FINAL)
// ================================
router.post("/submit", upload.single("file"), async (req, res) => {
  try {
    const { username, dataType, description } = req.body;

    // ✅ CHECK FILE
    if (!req.file) {
      return res.status(400).json({ message: "File not uploaded" });
    }

    const filePath = req.file.path;

    // ================================
    // 🧠 CALL DL MODEL
    // ================================
    exec(`python dl_model.py "${filePath}"`, async (err, stdout, stderr) => {
      if (err) {
        console.error("DL Error:", err);
        return res.status(500).json({ message: "AI Error" });
      }

      const output = stdout.trim().split("|");

      const issue = output[0] || "General Issue";
      const transport = output[1] || "Bus";

      // (optional)
      const confidence = output[2] || "90";

      // ================================
      // 💾 SAVE TO DB
      // ================================
      const newComplaint = new Complaint({
        username,
        mode: transport,
        dataType,
        description,
        issue,
        confidence,
        file: filePath, // ✅ store local path
        status: "Pending"
      });

      await newComplaint.save();

      res.json({ message: "Complaint submitted successfully" });
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ================================
// ✅ USER COMPLAINTS
// ================================
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

// ================================
// ✅ ADMIN - ALL COMPLAINTS
// ================================
router.get("/", async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// ================================
// ✅ UPDATE STATUS
// ================================
router.put("/update/:id", async (req, res) => {
  try {
    const { status } = req.body;

    await Complaint.findByIdAndUpdate(req.params.id, { status });

    res.json({ message: "Status updated successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;