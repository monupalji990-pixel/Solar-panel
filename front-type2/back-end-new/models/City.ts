const mongoose = require('mongoose');
let { ObjectId } = mongoose.Schema.Types;

const CitySchema = new mongoose.Schema({
   city:{
       type:String,
       require:true
   },
   total:{
       type:Number
   }
}, { timestamps: true });

const City = mongoose.model('city', CitySchema);

export default City;
