const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const FamilyNews = require('../models/FamilyNews');
const { authenticateToken } = require('../middleware/auth');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/', authenticateToken, upload.fields([{ name: 'headerImage' }, { name: 'pdfFile' }]), async (req, res) => {
  try {
    console.log('Received request to create news');
    const { title } = req.body;

    if (!req.files || !req.files.headerImage || !req.files.pdfFile) {
      return res.status(400).json({ message: 'Header image and PDF file are required' });
    }

    const webpBuffer = await sharp(req.files.headerImage[0].buffer).webp().toBuffer();
    const base64Image = `data:image/webp;base64,${webpBuffer.toString('base64')}`;
    const pdfBuffer = req.files.pdfFile[0].buffer;
    const base64PDF = `data:application/pdf;base64,${pdfBuffer.toString('base64')}`;

    const news = new FamilyNews({ title, headerImage: base64Image, pdfFile: base64PDF });

    await news.save();
    console.log('News created successfully');
    res.status(201).json(news);
  } catch (error) {
    console.error('Error creating news:', error);
    res.status(400).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const news = await FamilyNews.find().sort({ date: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const news = await FamilyNews.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', authenticateToken, upload.fields([{ name: 'headerImage' }, { name: 'pdfFile' }]), async (req, res) => {
  try {
    const { title } = req.body;
    const news = await FamilyNews.findById(req.params.id);

    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }

    news.title = title;

    if (req.files.headerImage) {
      const webpBuffer = await sharp(req.files.headerImage[0].buffer).webp().toBuffer();
      const base64Image = `data:image/webp;base64,${webpBuffer.toString('base64')}`;
      news.headerImage = base64Image;
    }

    if (req.files.pdfFile) {
      const pdfBuffer = req.files.pdfFile[0].buffer;
      const base64PDF = `data:application/pdf;base64,${pdfBuffer.toString('base64')}`;
      news.pdfFile = base64PDF;
    }

    await news.save();
    res.json(news);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const news = await FamilyNews.findByIdAndDelete(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    res.json({ message: 'News deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
