const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const DocumentTimelineSchema = new mongoose.Schema({
    sentBy:{
        type: ObjectId,
        ref: 'User'
    },
    consumerId:{
        type: ObjectId,
        ref: 'User'
    },
    companyId:{
        type: ObjectId,
        ref: 'Company'
    },
    quoteId:{
        type: ObjectId,
        ref: 'Quote'
    },
    renewalId:{
        type:ObjectId,
        ref:'Renewal'
    },
    renewalServiceType:{
        type:String,
    },
    quoteServiceType:{
        type:String,
    },
    templateId:{
        type: ObjectId,
        ref: 'Template'
    },
    templateName:String,
    templateType:String,
    filename:String,
    receivedFileName:String,
    status:{
        type:String,
        enum:["Sent","Received","Cancelled"]
    },
    sentDocumentUrl:String,
    receivedDocumentUrl:String,
    sentDocumentTimestamp:Date,
    receivedDocumentTimestamp:Date,
    docusignEnvId:String,
    docusignEmailSubject:String,
    docusignEnvDocumentUrl:String,
    mode:{
        type:String,
        enum:["Manual","Verbal","Docusign"]
    },
    lastAccessedAt:{
        type:Date,
        default: ()=> new Date()
    },
    // Handover pack email automation
    handoverEmailSentAt: {
        type: Date,
        default: null,
    },
    handoverEmailQuoteId: {
        type: String,
        default: null,
    },
}, { timestamps: true });

const DocumentTimeline = mongoose.model('DocumentTimeline', DocumentTimelineSchema);
export default DocumentTimeline;
