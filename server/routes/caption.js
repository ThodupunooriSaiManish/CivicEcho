const express = require("express");
const router = express.Router();
const multer = require("multer");
const { spawn } = require("child_process");

const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), (req, res) => {

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const imagePath = req.file.path;

  const python = spawn("python", ["blip_caption.py", imagePath]);

  let result = "";

  python.stdout.on("data", (data) => {
    result += data.toString();
  });

  python.on("close", () => {

    const parts = result.trim().split("|");

    res.json({
      caption: parts[0],
      issue: parts[1]
    });

  });

});

module.exports = router;