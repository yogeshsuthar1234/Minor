const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

// Create a separate connection to traffic_violation_db
const trafficViolationDB = mongoose.createConnection(process.env.MONGO);

// Define Violation schema for traffic_violation_db
const violationSchema = new mongoose.Schema({}, { strict: false });
const Violation = trafficViolationDB.model("Violation", violationSchema, "violations");

// Import your existing models (for user database)
const User = require("../models/User");

// Generate memo automatically (if needed)
router.post("/generate", async (req, res) => {
  try {
    const { vehicle_ID, rule_Broken, fine_Amount } = req.body;

    // Check if user exists with this vehicle_ID
    const user = await User.findOne({ vehicle_ID });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Create memo
    const memo = new Memo({
      vehicle_ID,
      rule_Broken,
      fine_Amount
    });

    await memo.save();
    res.status(201).json({ message: "Memo generated", memo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch memos for a user - UPDATED: Match user's vehicle_ID with violation's plate_text
router.get("/:vehicle_ID", async (req, res) => {
  try {
    const vehicle_ID = req.params.vehicle_ID;
    console.log(`🔍 Fetching violations for vehicle ID: ${vehicle_ID}`);

    // Find user to get their vehicle information
    const user = await User.findOne({ vehicle_ID });
    if (!user) {
      console.log(`❌ User not found with vehicle_ID: ${vehicle_ID}`);
      return res.status(404).json({ message: "User not found" });
    }

    console.log(`✅ User found: ${user.vehicle_ID}`);

    // Find violations where plate_text matches the user's vehicle_ID
    const violations = await Violation.find({ 
      plate_text: vehicle_ID 
    }).sort({ timestamp: -1 });

    console.log(`📊 Found ${violations.length} violations for plate: ${vehicle_ID}`);

    // Log first violation for debugging
    if (violations.length > 0) {
      console.log('Sample violation:', {
        plate_text: violations[0].plate_text,
        violation_types: violations[0].violation_types,
        fine_amount: violations[0].fine_amounts?.final_amount
      });
    }


// Transform violations to match the frontend's expected memo format
const memos = violations.map(violation => ({
  // Core fields for MemoList table
  _id: violation._id,
  vehicle_ID: violation.vehicle_id || violation.plate_text,
  rule_Broken: violation.violation_details?.[0]?.description || 
               violation.violation_types?.map(type => type.replace(/-/g, ' ')).join(", ") || 
               "Traffic Violation",
  fine_Amount: violation.fine_amounts?.final_amount || 0,
  status: violation.status === "paid" ? "paid" : 
          violation.payment_info?.is_paid ? "paid" : "unpaid",
  date: violation.timestamp?.$date || violation.timestamp,
  evidenceImage: violation.cloudinary_url || 
                (violation.evidence_path ? 
                  `http://localhost:5000/${violation.evidence_path.replace(/\\/g, '/')}` : 
                  null),
  complaint: violation.complaint_id || null,
  remark: violation.comp_message || null,
  comp_date: violation.complainedAt || null,
  
  // Fields specifically for ComplaintPage detailed view
  fullDetails: {
    location: violation.location,
    plate_text: violation.plate_text,
    vehicle_id: violation.vehicle_id,
    violation_types: violation.violation_types,
    violation_details: violation.violation_details,
    confidence_scores: violation.confidence_scores,
    fine_amounts: violation.fine_amounts,
    payment_info: violation.payment_info,
    timestamp: violation.timestamp,
    evidence_path: violation.cloudinary_url || violation.evidence_path, // Use Cloudinary URL first
    status: violation.status
  }
}));

res.json(memos);
  } catch (error) {
    console.error('❌ Error fetching memos:', error);
    res.status(500).json({ error: error.message });
  }
});

// Pay memo (update status) - UPDATED: Update violation payment info
router.put("/pay/:id", async (req, res) => {
  try {
    const { payment_method = "online", paid_amount } = req.body;

    console.log(`💳 Processing payment for violation: ${req.params.id}`);

    // Update the violation in traffic_violation_db
    const violation = await Violation.findByIdAndUpdate(
      req.params.id,
      {
        "payment_info.is_paid": true,
        "payment_info.paid_date": new Date(),
        "payment_info.paid_amount": paid_amount,
        "payment_info.payment_method": payment_method,
        "status": "paid"
      },
      { new: true }
    );

    if (!violation) {
      console.log(`❌ Violation not found: ${req.params.id}`);
      return res.status(404).json({ message: "Violation not found" });
    }

    console.log(`✅ Payment processed for violation: ${violation.plate_text}`);

    res.json({ 
      message: "Memo paid successfully", 
      memo: {
        _id: violation._id,
        status: "paid",
        vehicle_ID: violation.plate_text,
        fine_Amount: violation.fine_amounts?.final_amount
      }
    });
  } catch (error) {
    console.error('❌ Error processing payment:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all memos (for admin dashboard) - UPDATED
router.get("/", async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (status === 'paid') {
      query["payment_info.is_paid"] = true;
    } else if (status === 'unpaid') {
      query["payment_info.is_paid"] = false;
    }

    console.log(`📋 Fetching all violations with query:`, query);

    const violations = await Violation.find(query)
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Violation.countDocuments(query);

    console.log(`📊 Found ${violations.length} violations total`);

    // Transform to memo format for frontend
    const memos = violations.map(violation => ({
      _id: violation._id,
      vehicle_ID: violation.plate_text,
      rule_Broken: violation.violation_types?.join(", ") || "Traffic Violation",
      fine_Amount: violation.fine_amounts?.final_amount || 0,
      status: violation.payment_info?.is_paid ? "paid" : "unpaid",
      date: violation.timestamp,
      location: violation.location,
      plate_text: violation.plate_text
    }));

    res.json({
      memos,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('❌ Error fetching all memos:', error);
    res.status(500).json({ error: error.message });
  }
});

// Debug endpoint to check database connection
router.get("/debug/check-violations", async (req, res) => {
  try {
    const totalViolations = await Violation.countDocuments();
    const sampleViolations = await Violation.find().limit(5);
    
    res.json({
      totalViolations,
      sampleViolations: sampleViolations.map(v => ({
        _id: v._id,
        plate_text: v.plate_text,
        vehicle_id: v.vehicle_id,
        violation_types: v.violation_types,
        fine_amount: v.fine_amounts?.final_amount
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;