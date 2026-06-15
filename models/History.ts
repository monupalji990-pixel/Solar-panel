const mongoose = require('mongoose');
let { ObjectId } = mongoose.Schema.Types;

const HistorySchema = new mongoose.Schema({
    field: String,
    previousValue: '',
    currentValue: '',
    User: {
        type: ObjectId,
        ref: 'User'
    },
    Consumer: {
        type: ObjectId,
        ref: 'User'
    },
    Company: {
        type: ObjectId,
        ref: 'User'
    },
    Lead: {
        type: ObjectId,
        ref: 'Lead'
    },
    Supplier: {
        type: ObjectId,
        ref: 'Supplier'
    },
    Quote: {
        type: ObjectId,
        ref: 'Quote'
    },
    Renewal: {
        type: ObjectId,
        ref: 'Renewal'
    },
    Task: {
        type: ObjectId,
        ref: 'Task'
    },
    addedBy: {
        type: ObjectId,
        ref: 'User',
        index: true
    },
    createdAt: {
        type: Date,
        default: '',
        index: true
    },
    negotiation: {},
    notes: String,
    invoice: {}
}, { timestamps: true });

const History = mongoose.model('History', HistorySchema);

export default History;
