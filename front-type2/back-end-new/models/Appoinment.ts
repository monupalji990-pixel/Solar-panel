const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const appoinmentSchema = new mongoose.Schema({
    Assignee: {
        type: ObjectId,
        ref: 'User',
        required: true,
    },
    Assignee2: {
        type: ObjectId,
        ref: 'User',
        // required: true,
    },
    Booker: {
        type: ObjectId,
        ref: 'User',
        required: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
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
    status: {
        type: String,
        required: true
    },
    service: {
        type: [String],
        default: undefined
    },
    surveyFor: {
        type: [String],
        default: undefined
    },
    installerFor: {
        type: [String],
        default: undefined
    },
    leadId: {
        type: ObjectId,
        ref: 'Lead',
    },
    appointmentType: {
        type: String,
    },
    appointmentSubType: {
        type: String,
    },
    leadAdministrator: {
        type: ObjectId,
        ref: 'User'
    }

}, { timestamps: true })

const AppoinmentModel = mongoose.model('Appoinment', appoinmentSchema)

export default AppoinmentModel;