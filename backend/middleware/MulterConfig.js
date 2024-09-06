import multer from 'multer';
import path from 'path';

// Set up penyimpanan file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../uploads'); // Tentukan folder penyimpanan
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Set nama file yang unik
    }
});

// Filter file yang diupload
const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Only images are allowed'));
    }
};

// Inisialisasi Multer dengan konfigurasi penyimpanan dan filter
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // Batas ukuran file 5MB
    fileFilter: fileFilter
});

export default upload;
