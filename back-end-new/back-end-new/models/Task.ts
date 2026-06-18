const mongoose = require('mongoose');
let { ObjectId } = mongoose.Schema.Types;

const TaskSchema = new mongoose.Schema({
    customTaskId: { type: String, index: true },
    TaskID: { type: String, index: true },
    Title: { type: String, index: true },
    Description: String,
    Priority: String,
    DueDate: {
        type: Date,
        default: '',
        index: true
    },
    Time: {
        type: Date
    },
    Attachments: [
        {
            name: String,
            value: String,
            type: ''
        }
    ],
    Events:[
        {
            title:String,
            description:String,
            eventDate:Date,
            eventTime:Date,
            eventStatus:String
        }
    ],
    Status: { type: String, index: true },
    TaskOn: { type: String, index: true },
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
    Lead: {
        type: ObjectId,
        ref: 'Lead'
    },
    Quote: {
        type: ObjectId,
        ref: 'Quote'
    },
    Renewal:{
        type: ObjectId,
        ref: 'Renewal'
    },
    Observer: [
        {
            type: ObjectId,
            ref: 'User'
        }
    ],
    Assignee: {
        type: ObjectId,
        ref: 'User',
        index: true
    },
    Comments: [
        {
            CommentedBy: {
                type: ObjectId,
                ref: 'User'
            },
            Description: String,
            Attachments: [
                {
                    name: String,
                    value: String,
                    type: ''
                }
            ],
            History: String,
            timestamps: Number,
            createdAt: Date
        }
    ],
    Reminder: [
        {
            ReminderBefore: Number,
            ReminderType: String,
            IsSent: false,
            timestamps: Number
        }
    ],
    isActive: {
        type: Boolean,
        default: 1
    },
    isBlock: {
        type: Boolean,
        default: 0
    },
    isDelete: {
        type: Boolean,
        default: 0
    },
    BlockedBy: {
        type: ObjectId,
        ref: 'User'
    },
    createdBy: {
        type: ObjectId,
        ref: 'User'
    },
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
}, { timestamps: true });

const Task = mongoose.model('Task', TaskSchema);

export default Task;
