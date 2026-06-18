const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types;


// eslint-disable-next-line camelcase
const file_parser_schema = new mongoose.Schema({
        file:{
            require:true,
            type:String
        },
        isSelectedForParsing:{
            type:Boolean,
            default:false
        },
        s3Url:{
            type:String
        },
        supplierId:{
            type:ObjectId,
        },
        service:{
            type:String,
            enum:["Gas","Electric"]
        },
        totalRows:{
            require:true,
            type:Number
        },
        rowsParsed:{
            type:Number,
            default:0
        },
        isFinished:{
            default:false,
            type:Boolean
        }
},{timestamps:true});

// file_parser_schema.index({ldz:1,postcode:1})

const FileParserModel = mongoose.model('file_parser', file_parser_schema);

module.exports = FileParserModel;