const mongoose = require('mongoose');
export const ItemSelectFields = {
    title: 1,
    price: 1,
    description: 1,
}
function toTitleCase(str) {
    return str.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

const itemSchema = new mongoose.Schema({
    title: {
        type: String,
        set: toTitleCase
    },
    price: Number,
    description: String

}, { timestamps: true });

const item = mongoose.model('item', itemSchema);
export default item;