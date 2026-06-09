const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const appoinmentSchema = new mongoose.Schema({
    assignee: {
        type: ObjectId,
        ref: 'User',
        required: true,
    },
    consumer: {
        type: ObjectId,
        ref: 'User',
        required: true,
    },
    data:Object

}, { timestamps: true })

const FormModel = mongoose.model('Form', appoinmentSchema)

export default FormModel;