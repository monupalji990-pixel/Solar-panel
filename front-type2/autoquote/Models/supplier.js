const mongoose = require('mongoose');
let { ObjectId } = mongoose.Schema.Types;

const SupplierSchema = new mongoose.Schema({
    supplierName: {
        type: String,
        index: true
    },
    SupplierContact: [],
    supplierLogo:String,
    supplierFlatFiles:[
        {
            addedOn:{
                type:Date,
                default:Date.now
            },
            service:{
                type:String,
                enum:["gas","electric","gasAndelectric"]
            },
            supplierFlatFile:String,
            standardFlatFile:String,
            dataInserted:Number
        }
    ],
    createdBy: {
        type: ObjectId,
        ref: 'User',
        index: true
    },
    serviceType: [],
    isActive: {
        type: Boolean,
        default: 1
    },
    isDelete: {
        type: Boolean,
        default: 0
    },
    documents: [
        {
            addedBy: {
                type: ObjectId,
                ref: 'User'
            },
            title: '',
            attachment: '',
            timestamps: Number,
            createdAt: Date
        }
    ],
}, { timestamps: true });

const Supplier = mongoose.model('Supplier', SupplierSchema);

module.exports=Supplier;
