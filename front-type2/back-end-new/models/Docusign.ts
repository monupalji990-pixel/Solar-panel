const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const DocusignSchema = new mongoose.Schema({
    userId:String,
    data:Object
}, { timestamps: true });

const Docusign = mongoose.model('Docusign', DocusignSchema);
export default Docusign;
