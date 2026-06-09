const mongoose = require('mongoose');
let { ObjectId } = mongoose.Schema.Types;

const SupplierSchema = new mongoose.Schema({
    supplierName: {
        type: String,
        index: true
    },
    supplierType: {
        type: String,
        index: true
    },
    products: [],
    logo: {
        type: String,
    },
    kva: {    // price for line crosse factor of profilecode of 00
        type: Number
    },
    SupplierContact: [],
    supplierLogo: String,
    supplierFlatFiles: [
        {
            addedBy: {
                type: ObjectId,
                ref: 'User'
            },
            addedOn: {
                type: Date,
                default: Date.now
            },
            service: {
                type: String,
                enum: ["gas", "electric", "gasAndelectric"]
            },
            supplierFlatFile: String,
            standardFlatFile: String
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
    gas_mapper: {
        type: Object
    },
    electric_mapper: {
        type: Object
    },
    status: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const Supplier = mongoose.model('Supplier', SupplierSchema);

export default Supplier;
