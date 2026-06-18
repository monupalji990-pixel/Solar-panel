const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const DocusignAuditEventSchema = new mongoose.Schema({
    envId:String,
    data:Object,
    documentUrl : String,
    envStatus:String,
}, { timestamps: true });

const Docusign = mongoose.model('DocusignAuditEvent', DocusignAuditEventSchema);
export default Docusign;
