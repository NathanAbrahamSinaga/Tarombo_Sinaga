// routes/familyMembers.js

const express = require('express');
const FamilyMember = require('../models/FamilyMember');
const { authenticateToken } = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');
const mcache = require('memory-cache');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

const convertToWebPAndBase64 = async (buffer) => {
  const webpBuffer = await sharp(buffer)
    .webp({ quality: 80 })
    .toBuffer();
  return webpBuffer.toString('base64');
};

// Cache middleware
const cache = (duration) => {
  return (req, res, next) => {
    const key = '__express__' + req.originalUrl || req.url;
    const cachedBody = mcache.get(key);
    if (cachedBody) {
      res.send(cachedBody);
      return;
    } else {
      res.sendResponse = res.send;
      res.send = (body) => {
        mcache.put(key, body, duration * 1000);
        res.sendResponse(body);
      };
      next();
    }
  };
};

// Add family member, empty node, or text node
router.post('/', authenticateToken, upload.single('photo'), async (req, res) => {
  try {
    const { name, birthDate, bio, isEmptyNode, isTextNode, textContent } = req.body;
    let photo = null;

    if (req.file) {
      photo = await convertToWebPAndBase64(req.file.buffer);
    }

    const familyMember = new FamilyMember({
      name,
      photo,
      birthDate: birthDate ? new Date(birthDate) : null,
      bio,
      isEmptyNode: isEmptyNode === 'true' || isEmptyNode === true,
      isTextNode: isTextNode === 'true' || isTextNode === true,
      textContent
    });

    await familyMember.save();

    res.status(201).json(familyMember);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
});

// Get all family members with caching
router.get('/', cache(10), async (req, res) => {
  try {
    const familyMembers = await FamilyMember.find()
      .select('_id name photo birthDate bio isEmptyNode isTextNode textContent position color')
      .lean();
    res.json(familyMembers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update family member, empty node, or text node
router.put('/:id', authenticateToken, upload.single('photo'), async (req, res) => {
  try {
    const { name, birthDate, bio, isEmptyNode, isTextNode, textContent } = req.body;
    const updateData = {
      name,
      birthDate,
      bio,
      isEmptyNode: isEmptyNode === 'true',
      isTextNode: isTextNode === 'true',
      textContent
    };

    if (req.file) {
      updateData.photo = await convertToWebPAndBase64(req.file.buffer);
    }

    const familyMember = await FamilyMember.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!familyMember) {
      return res.status(404).json({ message: 'Family member not found' });
    }

    res.json(familyMember);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
});

router.put('/:id/color', authenticateToken, async (req, res) => {
  try {
    const { color } = req.body;
    const familyMember = await FamilyMember.findByIdAndUpdate(req.params.id, { color }, { new: true });

    if (!familyMember) {
      return res.status(404).json({ message: 'Family member not found' });
    }

    res.json(familyMember);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'Invalid data', error: error.message });
  }
});

router.post('/update-positions', authenticateToken, async (req, res) => {
  try {
    const updatedNodes = req.body;
    await Promise.all(updatedNodes.map(node =>
      FamilyMember.findByIdAndUpdate(node.id, { position: node.position, color: node.color })
    ));
    res.status(200).json({ message: 'Node positions and colors updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update node positions and colors' });
  }
});

// Delete family member, empty node, or text node
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const familyMember = await FamilyMember.findByIdAndDelete(req.params.id);

    if (!familyMember) {
      return res.status(404).json({ message: 'Family member not found' });
    }

    res.json({ message: 'Node deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
