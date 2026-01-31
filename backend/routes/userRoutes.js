const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const User = require('../models/user');
const isLoggedIn = require('../middlewares/isLoggedIn');

// Multer Storage Engine
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init Upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // 10MB limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('profileImage');

// Check File Type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

// @route   POST api/user/upload-profile-pic
// @desc    Upload profile picture
// @access  Private
router.post('/upload-profile-pic', isLoggedIn, (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            res.status(400).json({ success: false, message: err });
        } else {
            if (req.file == undefined) {
                res.status(400).json({ success: false, message: 'No file selected' });
            } else {
                try {
                    // Normalize path to forward slashes for URL usage
                    const filePath = `uploads/${req.file.filename}`;

                    // Update user in DB
                    await User.findByIdAndUpdate(req.user.id, { profilepic: filePath });

                    res.status(200).json({
                        success: true,
                        message: 'File Uploaded!',
                        filePath: filePath
                    });
                } catch (error) {
                    console.error("Database update error:", error);
                    res.status(500).json({ success: false, message: "Server Error saving image path" });
                }
            }
        }
    });
});

module.exports = router;
