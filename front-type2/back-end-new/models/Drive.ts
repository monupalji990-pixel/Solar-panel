const mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

const driveSchema = new mongoose.Schema({
    Company: {
        type: ObjectId,
        ref: 'Company',
        index: true
    },
    Consumer: {
        type: ObjectId,
        ref: 'User',
        index: true
    },
    file:{
        type:String,
    },
    folder:{
        type: ObjectId,
        ref: 'Drive',
        index: true,
       
    },
    folderName:{
        type:String,
        // unique:true,
        sparse:true, 
    },
    level:{
        type:Number,
        default:0
    },
    isDelete: { type: Boolean, default: false }
    
},{timestamps:true})

const DriveModel = mongoose.model('Drive',driveSchema);
export default DriveModel;