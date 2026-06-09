const mongoose = require('mongoose');

const ConfigSchema = new mongoose.Schema({
    data:Object,
    token:String,
    token_expires : Date
})

const ConfigModel = mongoose.model('Config',ConfigSchema)

export default ConfigModel