const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types;


// eslint-disable-next-line camelcase
const postcode_schema = new mongoose.Schema({
    ldz:{
        type:String
    },
    postcode:{
        type:String
    }
   
},{timestamps:true});

postcode_schema.index({ldz:1,postcode:1})

const PostcodeData = mongoose.model('postcode', postcode_schema);

module.exports = PostcodeData;