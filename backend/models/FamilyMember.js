const mongoose = require('mongoose');

const familyMemberSchema = new mongoose.Schema({
  name: String,
  photo: String,
  birthDate: Date,
  bio: String,
  isEmptyNode: { type: Boolean, default: false },
  isTextNode: { type: Boolean, default: false },
  textContent: String,
  position: {
    x: Number,
    y: Number
  },
  color: { type: String, default: '#ffffff' } // Add this line
});

module.exports = mongoose.model('FamilyMember', familyMemberSchema);