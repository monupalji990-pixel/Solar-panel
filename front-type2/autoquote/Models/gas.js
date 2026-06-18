const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types;


// eslint-disable-next-line camelcase
const gas_supplier_price_schema = new mongoose.Schema({
    supplierId: {
        type: ObjectId,
        required: true
    },
    startDate:{
        type:Date,
        required: true
    },
    endDate:{
        type:Date,
        required: true
    },
    duration:{
        type:String,
        required: true,
        // index:true
    },
    standingCharge:{
        type:Number
    },
    unitRate:{
        type:Number,
        required:true,
        index:true
    },
    minAQ:{
        type:Number,
        required:true
    },
    ldz:{
        type:String,
        required:true,
        // index :true
    },
    maxAQ:{
        type:Number,
        required:true
    },
    priceFor:{
        type:String
    },
    flatFileLocation:{
        type:String
    },
    other:{
        type:Object
    }

},{timestamps:true});

gas_supplier_price_schema.index({ldz:1,duration:1})
gas_supplier_price_schema.index({minAQ:1,maxAQ:1})
gas_supplier_price_schema.index({supplierId:1,duration:1})


const GasSupplierData = mongoose.model('Gas-price', gas_supplier_price_schema);
module.exports = GasSupplierData;
