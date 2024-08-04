// routes/familyDiagram.js
const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const FamilyDiagram = require('../models/FamilyDiagram');
const router = express.Router();

router.post('/save-diagram', authenticateToken, async (req, res) => {
  try {
    await FamilyDiagram.deleteMany({});

    const { edges } = req.body;
    const diagramState = new FamilyDiagram({ edges, lastUpdated: new Date() });
    await diagramState.save();

    res.status(200).json(diagramState);
  } catch (error) {
    console.error('Error saving diagram:', error);
    res.status(500).json({ message: 'Failed to save diagram', error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const diagramState = await FamilyDiagram.findOne().sort({ lastUpdated: -1 });
    res.json(diagramState);
  } catch (error) {
    console.error('Error fetching diagram state:', error);
    res.status(500).json({ message: 'Failed to fetch diagram state', error: error.message });
  }
});

module.exports = router;