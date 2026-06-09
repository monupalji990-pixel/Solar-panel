const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types;


// eslint-disable-next-line camelcase
const electric_supplier_price_schema = new mongoose.Schema({
    supplierId: {
        type: ObjectId,
        required: true
    },
    ldz:{
        type:String
    },
    startDate:{
        type:Date,
        required: true,
        index:true
    },
    endDate:{
        type:Date,
        required: true,
        index:true
    },
    duration:{
        type:Number,
        required: true,
        duration:true
    },
    distId:{
        type:Number,
        required: true,
        index:true
    },
    profileClass:{
        type:Number,
        required: true
    },
    standingCharge:{
        type:Number
    },
    dayUnitRate:{
        type:Number,
        index:true
    },
    nightUnitRate:{
        type:Number,
        index:true
    },
    eveningAndWeekendUnitRate:{
        type:Number,
        index:true
    },
    meterType:{
        type:String
    },
    minAQ:{
        type:Number,
        required:true
    },
    maxAQ:{
        type:Number,
        required:true
    },
    priceFor:{
        type:String,
        index:true
    }

},{timestamps:true});

electric_supplier_price_schema.index({minAQ:1,maxAQ:1})

const ElectricSupplierData = mongoose.model('Electric-price', electric_supplier_price_schema);

// ElectricSupplierData.watch().on('change',(data)=>console.log(data))
module.exports = ElectricSupplierData;