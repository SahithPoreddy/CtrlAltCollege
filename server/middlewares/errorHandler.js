const multerErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res
        .status(400)
        .json({
            success: false,
            message: err.field
        });
    }
    if (err) {
        return res
        .status(500)
        .json({
            success: false,
            message: "Internal server error."
        });
    }
    next();
}

module.exports = { multerErrorHandler }