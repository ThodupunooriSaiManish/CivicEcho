const express = require("express");
const router = express.Router();
const Complaint = require("../models/Complaint");

const multer = require("multer");
const { exec } = require("child_process");

// ✅ LOCAL STORAGE
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// ================================
// ✅ SUBMIT COMPLAINT
// ================================
router.post("/submit", upload.single("file"), async (req, res) => {
  try {
    const { username, dataType, description } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "File not uploaded" });
    }

    const filePath = req.file.path;

    exec(`python dl_model.py "${filePath}"`, async (err, stdout, stderr) => {
      if (err) {
        console.error("DL Error:", err);
        return res.status(500).json({ message: "AI Error" });
      }

      const output = stdout.trim().split("|");

      let issue = output[0] || "General Issue";
      const transport = output[1] || "Bus";
      const confidence = output[2] ? parseFloat(output[2]) : 0;

      // ✅ NORMALIZE ISSUE
      if (issue === "Safety") issue = "Safety Issue";
      if (issue === "Cleanliness") issue = "Cleanliness Issue";
      if (issue === "Delay") issue = "Delay Issue";

      // ================================
      // 🎯 PRIORITY CALCULATION (STRONG FIX)
      // ================================

      let basePriority = 50;

      if (issue === "Safety Issue") basePriority = 90;
      else if (issue === "Overcrowding") basePriority = 75;
      else if (issue === "Delay Issue") basePriority = 60;
      else if (issue === "Cleanliness Issue") basePriority = 45;

      // 🔥 RANDOM (MANDATORY FOR VARIATION)
      const randomBoost = Math.floor(Math.random() * 15); // 0–14

      // 🔥 CONFIDENCE IMPACT (LIMITED)
      const confidenceBoost = Math.min(10, confidence * 0.1);

      const priority = Math.min(
        100,
        Math.floor(basePriority + randomBoost + confidenceBoost)
      );

      const newComplaint = new Complaint({
        username,
        mode: transport,
        dataType,
        description,
        issue,
        confidence,
        priority,
        file: filePath,
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
// ✅ ADMIN - ALL COMPLAINTS
// ================================
router.get("/", async (req, res) => {
  try {
    const complaints = await Complaint.find();

    const updated = complaints.map(c => {

      // 🔥 BASE FROM ISSUE (OVERRIDE OLD BAD DATA)
      let basePriority = 50;

      let issue = c.issue;

      if (issue === "Safety Issue") basePriority = 90;
      else if (issue === "Overcrowding") basePriority = 75;
      else if (issue === "Delay Issue") basePriority = 60;
      else if (issue === "Cleanliness Issue") basePriority = 45;

      // ⏱ TIME BOOST
      const hoursOld =
        (new Date() - new Date(c.createdAt)) / (1000 * 60 * 60);

      const timeBoost = Math.min(10, Math.floor(hoursOld));

      // 🔥 RANDOM EACH FETCH (THIS FIXES YOUR PROBLEM)
      const randomBoost = Math.floor(Math.random() * 10);

      const finalPriority = Math.min(
        100,
        basePriority + timeBoost + randomBoost
      );

      return {
        ...c._doc,
        priority: finalPriority
      };
    });

    // 🔥 SORT BY PRIORITY
    updated.sort((a, b) => b.priority - a.priority);

    res.json(updated);

  } catch (err) {
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