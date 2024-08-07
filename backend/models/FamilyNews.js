const mongoose = require('mongoose');

const familyNewsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  headerImage: {
    type: String,
    required: true,
  },
  pdfFile: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('FamilyNews', familyNewsSchema);