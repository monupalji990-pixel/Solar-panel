const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

export interface CompanyInterface {
    _id: string
    businessName: string,
    businessSector: string,
    trendingName: string,
    address: string,
    lat: string,
    lon: string,
    firstLine: string,
    secondLine: string,
    town: string,
    country: string,
    postcode: string,
    registerNumber: string,
    vatNumber: string,
    businessType: string,
    liveServices: [],
    isActive: Boolean,
    isBlock: Boolean,
    isDelete: Boolean,
    companyID: string,
    Site: [string],
    Contact: [string],
    Lead: [string],
    Partner: string
    BlockedBy: string
    Assignee: Array<string>,
    meterReading: [
        {
            addedBy: string
            description: string,
            attachment: any,
            service_type: any,
            timestamps: Number
        }
    ],
    documents: [
        {
            addedBy: string
            title: string,
            attachment: any,
            timestamps: Number
        }
    ]
}
const CompanySchema = new mongoose.Schema({
    businessName: { type: String, index: true },
    businessSector: String,
    trendingName: String,
    address: String,
    lat: String,
    lon: String,
    firstLine: { type: String, index: true },
    secondLine: String,
    town: String,
    country: String,
    utr:Number,
    postcode: { type: String, index: true },
    registerNumber: String,
    vatNumber: String,
    gatewayNumber: String,
    bankSortcode: String,
    creditScore: String,
    creditScoreDate: Date,
    bankName: String,
    bankAccountNumber: String,
    website: String,
    businessType: String,
    isCompanyClose:{
        type:Boolean,
        default:false
    },
    liveServices: [],
    isActive: {
        type: Boolean,
        default: false
    },
    isBlock: {
        type: Boolean,
        default: false
    },
    isDelete: {
        type: Boolean,
        default: false
    },
    companyID: {
        type: String,
        index: true
    },
    Site: [
        {
            type: ObjectId,
            ref: 'Site',
            index: true
        }
    ],
    Contact: [
        {
            type: ObjectId,
            ref: 'User',
            index: true
        }
    ],
    Lead: [
        {
            type: ObjectId,
            ref: 'Lead'
        }
    ],
    Partner: {
        type: ObjectId,
        ref: 'User'
    },
    BlockedBy: {
        type: ObjectId,
        ref: 'User'
    },
    Assignee: [
        {
            type: ObjectId,
            ref: 'User',
            index: true
        }
    ],
    meterReading: [
        {
            addedBy: {
                type: ObjectId,
                ref: 'User'
            },
            description: '',
            attachment: '',
            service_type: '',
            timestamps: Number
        }
    ],
    documents: [
        {
            addedBy: {
                type: ObjectId,
                ref: 'User'
            },
            title: '',
            attachment: '',
            timestamps: Number
        }
    ],
     installerDocuments: [
        {
            addedBy: {
                type: ObjectId,
                ref: 'User'
            },
            title: '',
            attachment: '',
            timestamps: Number
        }
    ],
    Notes: [
        {
            addedBy: {
                type: ObjectId,
                ref: 'User'
            },
            notes: '',
            attachment:'',
            createdAt:Date,
            timestamps: Number
        }
    ]
}, { timestamps: true });

const Company = mongoose.model('Company', CompanySchema);
export default Company;
