const multer = require("multer")

const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
    //mime type check
    if (!file.mimetype.startsWith("image/")) {
        cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "Only images allowed"), false);
    } 
    else if (file.fileSize > 2 * 1024 * 1024) {
        cb(new multer.MulterError("LIMIT_FILE_SIZE", "File size exceeds 2MB"), false);        
    }
    else {
        cb(null, true);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
 }
)

const fieldName = process.env.FIELD_NAME || "images"

const multipleUpload = upload.array(fieldName, maxCount = process.env.MAX_IMAGES || 4,)


module.exports = { multipleUpload };