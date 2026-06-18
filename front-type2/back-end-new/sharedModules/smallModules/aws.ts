const aws = require("aws-sdk");
const dotenv = require("dotenv");
const multer = require("multer");
const multerS3 = require("multer-s3");
const mime = require("mime-types");
const fs = require('fs');

const S3AmazoneURL = 'https://edan-power.s3.amazonaws.com/'
dotenv.config({ path: ".env" });
import { Request } from '../../templates/commandInterface'

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: process.env.AWS_REGION,
});
var s3 = new aws.S3({ /* ... */ })

const addProfileImage = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET,
    acl: 'public-read',
    contentType: (req: Request, file: any, cb: Function) => {
      cb(null, `${file.mimetype}`);
    },
    key(req: Request, file: any, cb: Function) {
      cb(null, `${Math.random().toString(36).substring(7)}${Math.floor(Math.random() * 10000000)}${Math.random().toString(36).substring(7)}-${Date.now().toString()}.${mime.extension(file.mimetype)}`);
    },
  }),
});

const putBase64 = async (req,res,next,isMiddleware=true)=>{
  try {
    
  
  if(!req.body.filename){
      throw {message : "file name required"}
  }
  if(!req.body.data){
      throw {message: "file data required"};
  }
  if(!req.body.contentType){
      throw {message: "content type required"};
  }
  let params = {
    Key:  req.user._id+'_'+ new Date().getTime().toString()+'_'+req.body.filename,
    Body : Buffer.from(req.body.data,'base64'),
    Bucket:process.env.AWS_BUCKET,
    ContentType:req.body.contentType,
    ACL:'public-read'
  }
  let response = await s3.upload(params).promise();
  if(isMiddleware){
  req.aws = response;
  next();
  }
  else{
    return response;
  }
} catch (error) {
    res.send({success:false,message:error.message});
}
}

const putUnit8Array = async (req:Request,data:Uint8Array,metaData:any)=>{
  try {
    let params = {
      Key:  req.user._id+metaData.filename,
      Body : Buffer.from(data),
      Bucket:process.env.AWS_BUCKET,
      ContentType:metaData.contentType,
      ACL:'public-read'
    }
  let response = await s3.upload(params).promise();
    return response
  } catch (error) {
    console.log(error);
    
  }
}
const deleteFileFromS3 = (fileName) => {
const fn = fileName.value.replace(S3AmazoneURL, "");
  var params = {
    Bucket: process.env.AWS_BUCKET,
    Key: fn
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
}

const pipeFileDownload = async (userPicKey: String, req: any, res: any) => {
  try {
    var params = { Bucket: process.env.AWS_BUCKET, Key: userPicKey };
    s3.getObject(params).createReadStream().pipe(res);
  }
  catch (err) {
    throw err
  }
}

const s3FileDownloadToDir =  (filepath:String,url:String,req:any,res:any) => {
  try {
    return new Promise((resolve:any,reject:any)=>{
      let params = { Bucket: process.env.AWS_BUCKET, Key: url.replace(process.env.AWS_FILE_BASE_URL,'') };
      console.log(filepath);
      let readStream = s3.getObject(params).createReadStream();
      let writeStream = fs.createWriteStream(filepath);
      readStream.pipe(writeStream);
      writeStream.on('finish',()=>{
        resolve(filepath)
      })
      writeStream.on('error',(err)=>{
        console.log(err)
      })
    });
  } catch (error) {
    console.log(error);
  }
}

export default {
  addProfileImage,
  deleteFileFromS3,
  pipeFileDownload,
  s3FileDownloadToDir,
  putBase64,
  putUnit8Array
};
