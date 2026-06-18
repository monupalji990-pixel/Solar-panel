const mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

export interface LeadInterface {
    _id: string,
    leadId: string,
    Company: string,
    Consumer: string,
    Contact: string,
    Site: string,
    Assignee: string,
    Partner: string,
    serviceType: string,
    actionDate: string,
    isDelete: number,
    status: string,
    notes: string,
    history: [
        {
            status: string,
            notes: string,
            timestamps: number,
            editedBy: string,
            addedBy: string,
            description: string,
            field: String,
            previousValue: any,
            currentValue: any,
            createdAt: Date
        }
    ],
    notesComment: [
        {
            addedBy: string
            notes: string,
            attachment: any,
            timestamps: Number,
            createdAt: Date
        }
    ],
}

const leadSchema = new mongoose.Schema({
    leadId: {
        type: String,
        index: true
    },
    // Backward-compatible audit/link fields (new workflow only)
    createdBy: {
        type: String,
        default: ''
    },
    createdByUserId: {
        type: ObjectId,
        ref: 'User',
        index: true
    },
    // Explicit customer link for new solar workflow; legacy uses `Consumer`
    customerId: {
        type: ObjectId,
        ref: 'User',
        index: true
    },
    source: {
        type: String,
        index: true
    },
    appoinmentBooker: {
        type: ObjectId,
        ref: 'User'
    },
    Appoinment: {
        type: ObjectId,
        ref: 'Appoinment'
    },
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
    Assignee: {
        type: ObjectId,
        ref: 'User'
    },
    Contact: {
        type: ObjectId,
        ref: 'User'
    },
    Site: {
        type: ObjectId,
        ref: 'Site'
    },
    Partner: {
        type: ObjectId,
        ref: 'User'
    },
    LeadGenerator: {
        type: ObjectId,
        ref: 'User'
    },
    dialer: {
        type: ObjectId,
        ref: 'User'
    },
    leadAdministrator: {
        type: ObjectId,
        ref: 'User'
    },
    Installer: {
        type: ObjectId,
        ref: 'User'
    },
    Surveyor: {
        type: ObjectId,
        ref: 'User'
    },
    SystemDesigner: {
        type: ObjectId,
        ref: 'User'
    },
    Scaffolders: {
        type: ObjectId,
        ref: 'User'
    },
    Roofers: {
        type: ObjectId,
        ref: 'User'
    },
    Electricians: {
        type: ObjectId,
        ref: 'User'
    },
    GasEngineers: {
        type: ObjectId,
        ref: 'User'
    },
    CavityWallInstaller: {
        type: ObjectId,
        ref: 'User'
    },
    UnderFloorInstaller: {
        type: ObjectId,
        ref: 'User'
    },
    LoftInstaller: {
        type: ObjectId,
        ref: 'User'
    },
    VentilationInstaller: {
        type: ObjectId,
        ref: 'User'
    },
    InternalWallInsulation: {
        type: ObjectId,
        ref: 'User'
    },
    ExternalWallInsulation: {
        type: ObjectId,
        ref: 'User'
    },
    RoomInRoofInstaller: {
        type: ObjectId,
        ref: 'User'
    },
    ASHPInstaller: {
        type: ObjectId,
        ref: 'User'
    },
    salesRep: {
        type: ObjectId,
        ref: 'User'
    },
    serviceType: {
        type: []
    },
    subServiceType: {
        type: []
    },
    leadType: {
        type: String
    },
    jobType: {
        type: String
    },
    serviceData: {
        gas: { type: Object, default: null },
        electric: { type: Object, default: null },
        water: { type: Object, default: null },
        chipAndPin: { type: Object, default: null },
        telecoms: { type: Object, default: null },
        broadband: { type: Object, default: null },
        energy: { type: Object, default: null },
        funeral: { type: Object, default: null },
        mortgage: { type: Object, default: null },
        waste: { type: Object, default: null },
        insurance: { type: Object, default: null },
        businessrates: { type: Object, default: null },
        debt: { type: Object, default: null },
        telecomandbroadband: { type: Object, default: null },
        eco: { type: Object, default: null },
        paidsolar: { type: Object, default: null }
    },
    actionDate: {
        type: Date,
        default: Date.now
    },
    isDelete: {
        type: Boolean,
        default: false
    },
    status: { type: String, index: true },
    notes: String,
    history: [
        {
            status: String,
            notes: String,
            timestamps: Number,
            editedBy: {
                type: ObjectId,
                ref: 'User'
            },
            addedBy: {
                type: ObjectId,
                ref: 'User'
            },
            description: '',
            field: String,
            previousValue: '',
            currentValue: '',
            createdAt: Date
        }
    ],
    notesComment: [
        {
            addedBy: {
                type: ObjectId,
                ref: 'User'
            },
            notes: '',
            attachment: '',
            timestamps: Number,
            createdAt: Date
        }
    ],
    leadImportedTag: String,
    gallery: [Object],
    digitalDashboard: Object,
    "InstallationCompleteDate": Date,
    "SubmissionCompletedDate": Date
}, { timestamps: true });

const Lead = mongoose.model('Lead', leadSchema);
export default Lead;