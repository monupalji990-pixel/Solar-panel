const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const PaymentsHistorySchema = new mongoose.Schema({
    supplierId: {
        type: ObjectId,
        ref: 'Supplier',
        index: true,
        require: true
    },
    quoteId: {
        type: ObjectId,
        ref: 'Quote',
        index: true,
        require: true
    },
    companyId: {
        type: ObjectId,
        ref: 'Company'
    },
    tarrif: {
        type: String
    },
    service: {
        type: String,
        enum: ["Gas", "Electric"]
    },
    isFromCRM: {
        type: Boolean,
        default: true
    },
    uplift: {
        type: Number,
        require: true
    },
    gasAq: {
        type: Number,
        require: true
    },
    electricAq: {
        unitDaykWh: Number,
        unitNightkWH: Number,
        unitWkdkWh: Number,
    },
    gasUnitRate: {
        type: Number
    },
    electricUnitRates: {
        unitDayRate: Number,
        unitNightRate: Number,
        unitWkdRate: Number
    },
    contractAcceptDate: {
        type: Date,
        require: true
    },
    contractData: {
        type: Object
    },
    totalPrice: {
        type: Number,
        require: true
    },
    contractStatus: {
        type: String,
        enum: [1000, 1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008]
    },
    lesStatus: {
        type: String,
        enum: [1000, 1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009]
    },
    supplierPayments: [
        {
            amount: Number, 
            date: {
                type: Date,
                default: Date.now
            },
            paymentType: {
                type: String,
                enum: ["Paid", "Received"]
            },
            commissionType: {
                type: String,
                enum: ["Commission", "Clawback"]
            },
            comment: String
        }
    ],
    commissionPayments: [
        {
            amount: Number,
            totalCommissionAmount: Number,
            date: {
                type: Date,
                default: Date.now
            },
            paymentType: {
                type: String,
                enum: ["Paid", "Received", "Payout Pending"]
            },
            commissionType: {
                type: String,
                enum: ["Commission", "Clawback"]
            },
            user: {
                type: ObjectId,
                ref: 'User'
            },
            comment: String,
            percentage: Number
        }
    ]

}, { timestamps: true });

PaymentsHistorySchema.index({ supplierId: 1, quoteId: 1 }, { unique: true })

const PaymentHistory = mongoose.model('PaymentsHistory', PaymentsHistorySchema);
export default PaymentHistory;
