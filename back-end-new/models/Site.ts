const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const SiteSchema = new mongoose.Schema({
    siteName: { type: String, index: true },
    siteAddress: String,
    town: String,
    city: String,
    country: String,
    postcode: { type: String, index: true },
    company: {
        type: ObjectId,
        ref: 'Company',
        index: true
    },
    User: [
        {
            type: ObjectId,
            ref: 'User'
        }
    ],
    gas:{
            MPRN:String,
            meterSerialNumber:String
    },
    electric:{
          topLine:String,
          meterNumber:String,//bottom line
          meterSerialNumber:String,

    },
    water:{
        WaterCorespId:String,
        SewageSpid:String,
        WaterMeterSN:String,
    },
    chipandpin:{
        ProviderRefNumber:String,
        midNumber:String
    }

}, { timestamps: true });

const Site = mongoose.model('Site', SiteSchema);
export default Site;