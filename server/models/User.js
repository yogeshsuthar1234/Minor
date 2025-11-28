const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  vehicle_ID:String,
  phone_No: String,
  name:String,
  registered_Address: {
    state:String,
    city:String,
    postal_area:String,
  },
  mail: String,
  pass: {
    type: String,
    default: "0000",
  },
  otp: String,
  otpExpiry: Date,
});

module.exports = mongoose.model('User', userSchema);
