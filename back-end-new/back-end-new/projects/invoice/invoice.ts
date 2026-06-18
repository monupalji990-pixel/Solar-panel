const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
export const InvoiceSelectFields = {
    dueDate: 1,
    discount: 1,
    discountType: 1,
    tax: 1,
    totalAmount: 1,
    paymentDue: Number,
    invoiceNumber: 1,
    lineItems: 1,
    consumer: 1,
    company: 1,
    status: 1,
    fromCompany: 1,
    fromAddress: 1,
    createdAt: 1

}
const InvoiceSchema = new mongoose.Schema({
    dueDate: Number,
    discount: Number,
    discountType: String,
    tax: Number,
    totalAmount: Number,
    paymentDue: Number,
    invoiceNumber: String,
    lineItems: [{
        title: String,
        price: Number,
        quantity: Number,
        tax: Number,
        description: String,
        itemId: { type: ObjectId, ref: 'item' },
        totalAmount: { type: Number, default: 0 },
    }],
    fromCompany: String,
    fromAddress: String,
    consumer: { type: ObjectId, ref: 'User' },
    company: { type: ObjectId, ref: 'Company' },
    status: { type: String, default: 'draft', index: true },

}, { timestamps: true });

const Invoice = mongoose.model('Invoice', InvoiceSchema);
export default Invoice;