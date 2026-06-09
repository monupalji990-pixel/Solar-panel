const aws = require('aws-sdk')
const fs = require('fs');
const S3AmazoneURL = 'https://edan-power.s3.amazonaws.com/'

aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: process.env.AWS_REGION,
});

let s3 = new aws.S3();

async function uploadToS3(file) {
    try {

        var uploadParams = { Bucket: process.env.AWS_BUCKET, Key: '', Body: '', ACL: 'public-read' };


        // Configure the file stream and obtain the upload parameters

        let fileStream = fs.createReadStream(file);
        fileStream.on('error', function (err) {
            console.log('File Error', err);
        });
        uploadParams.Body = fileStream;
        var path = require('path');
        uploadParams.Key = Date.now().toString() + path.basename(file);
        let data = await s3.upload(uploadParams).promise()
        console.log(data);
        return data;
    } catch (error) {
        console.log(error)

    }
}

async function deleteFromS3(fileUrl) {
    try {
        const fn = fileUrl.replace(S3AmazoneURL, "");
        let params = {
            Bucket: process.env.AWS_BUCKET,
            Key: fn,

        };

        s3.deleteObject(params, function (err, data) {
            if (data) {
                console.log("File deleted successfully");
            }
            else {
                console.log("Check if you have sufficient permissions : " + err);
            }
            return true;
        });
    } catch (error) {
        console.log(error)

    }
}

// uploadToS3('./helpers/constants.js').then(data => console.log('data: ',data)).catch(err => console.log('err',err))
// deleteFromS3('https://edan-power.s3.amazonaws.com/1624872325039upload_2a1c78eabe4ebbfda1c5529bce65c271.xlsx').then(data => console.log(data)).catch(data => console.log(data))

module.exports = {
    uploadToS3,
    deleteFromS3
}