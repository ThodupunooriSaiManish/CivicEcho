const Complaint = require("../models/Complaint");

exports.getGroupedComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find();

    const grouped = {};

    complaints.forEach(c => {
      if (!grouped[c.issueType]) {
        grouped[c.issueType] = {};
      }

      if (!grouped[c.issueType][c.transportType]) {
        grouped[c.issueType][c.transportType] = [];
      }

      grouped[c.issueType][c.transportType].push(c);
    });

    res.json(grouped);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};