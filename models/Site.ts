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

// Indexes used by listCompanyRegUser search (gas/electric/chip&pin/siteName/postcode)
SiteSchema.index({ company: 1 });
SiteSchema.index({ 'gas.MPRN': 1 });
SiteSchema.index({ 'electric.topLine': 1 });
SiteSchema.index({ 'electric.meterNumber': 1 });
SiteSchema.index({ 'chipandpin.midNumber': 1 });
SiteSchema.index({ siteName: 1 });
SiteSchema.index({ postcode: 1 });

const Site = mongoose.model('Site', SiteSchema);
export default Site;

