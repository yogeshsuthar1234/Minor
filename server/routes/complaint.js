const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// Create connection to traffic_violation_db
const trafficViolationDB = mongoose.createConnection("mongodb+srv://bsshah161104_db_user:bhavya1611@cluster0.4elsmuu.mongodb.net/traffic_violation_db");

// Violation model (existing collection)
const violationSchema = new mongoose.Schema({}, { strict: false });
const Violation = trafficViolationDB.model("Violation", violationSchema, "violations");

// Complaint model for traffic_violation_db.complaints collection
const complaintSchema = new mongoose.Schema({
  violation_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Violation'
  },
  remark: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "under_review", "resolved", "rejected"],
    default: "pending"
  },
  filed_date: {
    type: Date,
    default: Date.now
  },
  vehicle_id: String,
  plate_text: String
});

const Complaint = trafficViolationDB.model("Complaint", complaintSchema, "complaints");

router.post("/createComplaint", async (req, res) => {
  try {
    const { memo_ID, remark } = req.body;

    console.log("🔍 Searching for violation with _id:", memo_ID);

    // 1. Check if violation exists in violations collection
    const violation = await Violation.findOne({ 
      _id: new mongoose.Types.ObjectId(memo_ID) 
    });

    if (!violation) {
      console.log("❌ No violation found with _id:", memo_ID);
      return res.status(404).json({ message: "Violation not found" });
    }

    console.log("✅ Violation found:", violation._id, "- Plate:", violation.plate_text);

    // 2. Check if complaint already exists for this violation
    const existingComplaint = await Complaint.findOne({ violation_id: memo_ID });
    if (existingComplaint) {
      return res.status(400).json({ message: "Complaint already filed for this violation" });
    }

    // 3. Create complaint in traffic_violation_db.complaints collection
    const complaint = new Complaint({
      violation_id: memo_ID,
      remark: remark,
      vehicle_id: violation.vehicle_id,
      plate_text: violation.plate_text,
      status: "pending"
    });

    await complaint.save();

    // 4. Update the violation document with complaint reference
    const updatedViolation = await Violation.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(memo_ID) },
      { 
        complaint_status: "filed",
        complaint_id: complaint._id, // Reference to the complaint
        status: "complaint_filed",
        comp_message: complaint.remark,
        complainedAt: new Date()
      },
      { new: true }
    );

    console.log("✅ Complaint stored in traffic_violation_db/complaints");
    console.log("   Complaint ID:", complaint._id);
    console.log("   Violation updated with complaint_status:", updatedViolation?.complaint_status);

    res.status(201).json({ 
      success: true,
      message: "Complaint filed successfully", 
      complaint: {
        _id: complaint._id,
        violation_id: complaint.violation_id,
        status: complaint.status,
        filed_date: complaint.filed_date
      },
      violation_updated: !!updatedViolation
    });

  } catch (error) {
    console.error("❌ Error creating complaint:", error);
    res.status(500).json({ error: error.message });
  }
});

// Get complaints for a specific violation
router.get("/violation/:violation_id", async (req, res) => {
  try {
    const { violation_id } = req.params;
    
    const complaints = await Complaint.find({ 
      violation_id: new mongoose.Types.ObjectId(violation_id) 
    }).sort({ filed_date: -1 });

    res.json({
      success: true,
      complaints: complaints
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all complaints
router.get("/", async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ filed_date: -1 });
    
    res.json({
      success: true,
      complaints: complaints
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;