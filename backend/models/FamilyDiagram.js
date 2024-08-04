const mongoose = require('mongoose');

const familyDiagramSchema = new mongoose.Schema({
  edges: [{
    id: String,
    source: String,
    target: String,
    sourceHandle: String,
    targetHandle: String,
    color: { type: String, default: '#000000' } // Add this line
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('FamilyDiagram', familyDiagramSchema);