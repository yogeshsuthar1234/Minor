const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
require("dotenv").config();
const userRoutes = require('./routes/User');
const memoRoutes = require("./routes/memo");
const complaintRoutes=require("./routes/complaint");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/user', userRoutes);
app.use('/api/memos', memoRoutes);
app.use('/api/complaint', complaintRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Connect to main database (for users)
const mainDBUri = process.env.MONGO_URI || "mongodb+srv://bsshah161104_db_user:bhavya1611@cluster0.4elsmuu.mongodb.net/test";
mongoose.connect(mainDBUri)
  .then(() => {
    console.log("✅ Main MongoDB connected");
    app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
  })
  .catch(err => console.error("❌ Main MongoDB connection error:", err));