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
// ✅ SUBMIT COMPLAINT (FINAL)
// ================================
router.post("/submit", upload.single("file"), async (req, res) => {
  try {
    const { username, dataType, description } = req.body;

    let filePath = null;

    if (req.file) {
      filePath = req.file.path;
    }

    // ✅ DEFAULT VALUES
    let issue = "General Issue";
    let transport = "Bus";
    let confidence = 50;

    // ================================
    // 🧠 RUN MODEL (ONLY IF FILE)
    // ================================
    if (filePath) {
      exec(`python dl_model.py "${filePath}"`, async (err, stdout, stderr) => {

        if (!err && stdout) {
          const output = stdout.trim().split("|");

          issue = output[0] || issue;
          transport = output[1] || transport;
          confidence = output[2] ? parseFloat(output[2]) : confidence;
        }

        saveComplaint();
      });
    } else {
      // ✅ TEXT INPUT FLOW
      saveComplaint();
    }

    // ================================
    // 💾 SAVE FUNCTION
    // ================================
    async function saveComplaint() {

      // ================================
      // 🧠 TEXT-BASED ISSUE DETECTION
      // ================================
      if (!filePath && description) {

        const text = description.toLowerCase();

        if (text.includes("crowd") || text.includes("rush") || text.includes("overcrowd")) {
          issue = "Overcrowding";
        }

        else if (text.includes("delay") || text.includes("late") || text.includes("waiting")) {
          issue = "Delay Issue";
        }

        else if (text.includes("dirty") || text.includes("clean") || text.includes("garbage")) {
          issue = "Cleanliness Issue";
        }

        else if (text.includes("accident") || text.includes("danger") || text.includes("unsafe")) {
          issue = "Safety Issue";
        }

        else {
          issue = "General Issue";
        }
      }

      // ================================
      // ✅ NORMALIZE ISSUE
      // ================================
      if (issue === "Safety") issue = "Safety Issue";
      if (issue === "Cleanliness") issue = "Cleanliness Issue";
      if (issue === "Delay") issue = "Delay Issue";

      // ================================
      // 🎯 PRIORITY CALCULATION
      // ================================
      let basePriority = 50;

      if (issue === "Safety Issue") basePriority = 90;
      else if (issue === "Overcrowding") basePriority = 75;
      else if (issue === "Delay Issue") basePriority = 60;
      else if (issue === "Cleanliness Issue") basePriority = 45;

      const randomBoost = Math.floor(Math.random() * 15);
      const confidenceBoost = Math.min(10, confidence * 0.1);

      const priority = Math.min(
        100,
        Math.floor(basePriority + randomBoost + confidenceBoost)
      );

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
        priority,
        file: filePath,
        status: "Pending"
      });

      await newComplaint.save();

      res.json({ message: "Complaint submitted successfully" });
    }

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

      let basePriority = 50;
      let issue = c.issue;

      if (issue === "Safety Issue") basePriority = 90;
      else if (issue === "Overcrowding") basePriority = 75;
      else if (issue === "Delay Issue") basePriority = 60;
      else if (issue === "Cleanliness Issue") basePriority = 45;

      const hoursOld =
        (new Date() - new Date(c.createdAt)) / (1000 * 60 * 60);

      const timeBoost = Math.min(10, Math.floor(hoursOld));
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

// ================================
// ✅ UPDATE ISSUE (MANUAL)
// ================================
router.put("/update-issue/:id", async (req, res) => {
  try {
    const { issue } = req.body;

    await Complaint.findByIdAndUpdate(req.params.id, { issue });

    res.json({ message: "Issue updated successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;