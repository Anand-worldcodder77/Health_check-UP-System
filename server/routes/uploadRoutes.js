const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const allowedDocumentTypes = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (allowedDocumentTypes.has(file.mimetype)) return cb(null, true);
    return cb(new Error('Only PDF, JPG, PNG, or WEBP documents are allowed.'));
  },
});

const isCloudinaryConfigured = () => (
  Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)
);

router.get('/config', (req, res) => {
  res.json({
    cloudinary: {
      configured: isCloudinaryConfigured(),
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || null,
    },
  });
});

const uploadBufferToCloudinary = (file) => new Promise((resolve, reject) => {
  const stream = cloudinary.uploader.upload_stream(
    {
      folder: 'healthchecks/doctor-applications',
      resource_type: 'auto',
      use_filename: true,
      unique_filename: true,
    },
    (error, result) => {
      if (error) return reject(error);
      return resolve(result);
    },
  );

  stream.end(file.buffer);
});

const handleDoctorDocumentUpload = (req, res, next) => {
  upload.single('document')(req, res, (err) => {
    if (!err) return next();
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ message: 'Document must be 8 MB or smaller.' });
    }
    return res.status(400).json({ message: err.message || 'Invalid document upload.' });
  });
};

router.post('/doctor-documents', handleDoctorDocumentUpload, async (req, res) => {
  try {
    if (!isCloudinaryConfigured()) {
      return res.status(503).json({ message: 'Cloudinary is not configured on the server.' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Document file is required.' });
    }

    const result = await uploadBufferToCloudinary(req.file);

    res.status(201).json({
      document: {
        name: req.file.originalname,
        url: result.secure_url,
        type: req.file.mimetype,
        provider: 'cloudinary',
        publicId: result.public_id,
        bytes: result.bytes,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Document upload failed.' });
  }
});

module.exports = router;
