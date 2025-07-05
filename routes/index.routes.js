const express = require('express');
const router = express.Router();
const upload = require('../config/multer.config');
const File = require('../models/files.models');
const isLoggedIn = require('../middleware/auth');
const fs = require('fs');
const path = require('path');

router.get('/home', isLoggedIn, async (req, res) => {
    try {
        const files = await File.find({ user: req.user.id });
        res.render('home', { files, user: req.user });
    } catch (error) {
        console.error('Error fetching files:', error);
        res.status(500).send('Server error');
    }
});

// name should match with whats in home.ejs (in our case it is 'file')
router.post('/upload', isLoggedIn, upload.single('file'), async (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        const newFile = new File({
            path: file.path.replace('public', ''),
            originalname: file.originalname,
            user: req.user.id // User ID from the authenticated user
        });
        await newFile.save();
        res.redirect('/home');
    } catch (error) {
        console.error('Error saving file metadata:', error);
        res.status(500).send('Error uploading file.');
    }
});

// Update file metadata
router.put('/file/:id', isLoggedIn, async (req, res) => {
    try {
        const { originalname } = req.body;
        const updatedFile = await File.findByIdAndUpdate(
            req.params.id,
            { originalname },
            { new: true, runValidators: true }
        );
        if (!updatedFile) {
            return res.status(404).json({ message: 'File not found' });
        }
        res.status(200).json(updatedFile);
    } catch (error) {
        console.error('Error updating file metadata:', error);
        res.status(500).send('Server error');
    }
});

// Delete a file
router.delete('/file/:id', isLoggedIn, async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Delete the file from the filesystem
        const filePath = path.join(__dirname, '../public', file.path);
        fs.unlink(filePath, async (err) => {
            if (err) {
                console.error('Error deleting file from filesystem:', err);
                return res.status(500).send('Error deleting file.');
            }

            // Delete the file metadata from the database
            await File.findByIdAndDelete(req.params.id);
            res.status(200).json({ message: 'File deleted successfully' });
        });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;