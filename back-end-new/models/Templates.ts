const mongoose = require('mongoose');
let { ObjectId } = mongoose.Schema.Types;

const TemplateSchema = new mongoose.Schema({
    templateName: {
        type: String
    },
    type:{
        type:String,
        enum : ["LOA","CONTRACT","VERBAL"]
    },
    serviceType:{
        type:String,
    },
    createdBy: {
        type: ObjectId,
        ref: 'User'
    },
    editedBy:{
        type: ObjectId,
        ref: 'User'
    },
    url:{
        type:String
    },
    mapper:Object
}, { timestamps: true });

const Template = mongoose.model('Template', TemplateSchema);

export default Template;
