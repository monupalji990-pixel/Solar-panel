const mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

const driveNewSchema = new mongoose.Schema({
    fileName: {
        type: String,
        index: true
    },
    type:String,
    file:{
        type:String,
    },
    folder:{
        type: ObjectId,
        ref: 'DriveNew',
        index: true,       
    },
    folderName:{
        type:String,
        sparse:true, 
    },
    level:{
        type:Number,
        default:0
    },
    isDelete: { type: Boolean, default: false }
},{timestamps:true})

const DriveNewModel = mongoose.model('DriveNew',driveNewSchema);
export default DriveNewModel;