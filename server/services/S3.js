const { S3Client } = require("@aws-sdk/client-s3");
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const accessKeyId = process.env.S3_ACCESS_KEY;
const secretAccessKey = process.env.S3_SECRET_KEY;
const region = process.env.AWS_REGION

if (!accessKeyId || !secretAccessKey || !region) {
    throw new Error("AWS credentials or region are not set in environment variables.");
}

const client = new S3Client({
    region: region || "eu-north-1",
    credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
    }
});

const putObject = async (file, key) => {
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
    };
    const command = new PutObjectCommand(params);
    const response = await client.send(command);
    return response;
}

const deleteObject = async (key) => {
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key
    }
    const command = new DeleteObjectCommand(params);
    const response = await client.send(command);
    return response;
} 

module.exports = {
    putObject,
    deleteObject
};