const { putObject, deleteObject } = require("../services/S3.js");

exports.uploadToS3 = async (req, res, next) => {
    let imagesUrls = [];
    let fileUploadStatus = true;

    if (!req.files || req.files.length === 0) {
            req.body.imagesUrls = imagesUrls;
            next();
    }

    if (!process.env.S3_BUCKET_NAME) {
        throw new Error("S3_BUCKET_NAME is not set in environment variables.");
    }

    const uploadPromises = req.files.map( async(file) => {
        try {
            const key = `${Date.now()}-${file.originalname}`;
            const response = await putObject(file, key);
            if (!response.$metadata.httpStatusCode || response.$metadata.httpStatusCode !== 200) {
                throw new Error("Failed to upload file to S3");
            }
            imagesUrls.push(key);
        } 
        catch (e) {
            fileUploadStatus = false;
        }       
    })
    await Promise.all(uploadPromises)
    try {
        if (!fileUploadStatus) {
            throw new Error("Some files failed to upload to S3");
        }
        //make urls.
        imagesUrls = imagesUrls.map(key => `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`);
        //attach the imagesUrls to the request object.
        req.body.imagesUrls = imagesUrls;
        next();
    } 
    catch (e) { 
        //remove uploaded files from S3
        const deletePromises = imagesUrls.map(async (key) => {
            try {
                const response = await deleteObject(key);
                if (!response.$metadata.httpStatusCode || response.$metadata.httpStatusCode !== 204) {
                    throw new Error(`Response Http status code ${response.$metadata.httpStatusCode}`);
                }
                console.log(`File with key ${key} deleted successfully`);
            } catch(e) {
                console.log(`Failed to delete file with key ${key}: ${e.message}`);
            }
        })
        await Promise.all(deletePromises);
        return res
        .status(500)
        .json({
            success: false,
            message: "Internal server error"
        });
    }
}