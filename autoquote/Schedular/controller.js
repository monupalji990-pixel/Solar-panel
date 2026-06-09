const mongoose = require('mongoose');
const dotenv = require('dotenv')
const fileParserModel = require('../Models/fileparsers')
const SupplierHelper = require('../helpers/baseXlsx')
const GasSupplierModel = require('../Models/gas')
const SupplierModel = require('../Models/supplier')
const moment = require('moment')
const axios = require('axios').default
const { ObjectId } = mongoose.Types


const IntOfBaseXlsx = new SupplierHelper.BaseXlsx()

dotenv.config({ path: '.env' });
console.log(process.env.NODE_ENV)
mongoose.set('useFindAndModify', false);

let mongoDBUrl = null;
    if(process.env.NODE_ENV === 'staging'){
        mongoose.set('debug', true);
        mongoDBUrl= process.env.DEV_MONGODB_URI
    }  
    if(process.env.NODE_ENV === 'production'){
        mongoose.set('debug', true);
        mongoDBUrl= process.env.PROD_MONGODB_URI
    }


class Schedular{ 
    constructor(){
         this.currentJob = null
        
    }

    async insertData(){
        try{

            if(this.currentJob == null){
                console.log('no job currently')
                await this.selectJob()
            }

            if(this.currentJob && this.currentJob.isFinished){
                await this.selectJob()
            }

            if(this.currentJob == null ){
                console.log('no job found')
                return
            }

            console.log('in insert data')
            let reqUrl = null
            let job = null
            if(this.currentJob.service === "Gas"){
                reqUrl = 'http://localhost:8333/price/admin/addPrices/gas',
                job = {
                    supplierId:this.currentJob.supplierId,
                    file:this.currentJob.file,
                    totalRows:this.currentJob.totalRows,
                    isFromSchedular:true,
                    s3Url:{
                        Location:this.currentJob.s3Url
                    }
                }

            }
            else if(this.currentJob.service === "Electric"){
                reqUrl = 'http://localhost:8333/price/admin/addPrices/electric',
                job = {
                    supplierId:this.currentJob.supplierId,
                    file:this.currentJob.file,
                    totalRows:this.currentJob.totalRows,
                    isFromSchedular:true,
                    s3Url:{
                        Location:this.currentJob.s3Url
                    }
                }
            }
           
        let data = await axios.post(reqUrl,job);
        if(data.data.success){
            this.currentJob = await fileParserModel.findOneAndUpdate({_id:this.currentJob._id},{$inc:{rowsParsed:data.data.dataInserted}},{new:true})
            if(this.currentJob.rowsParsed == this.currentJob.totalRows)
                this.currentJob.isFinished = true
                this.currentJob.save()
        }

        console.log(data.data)
        return
        }catch(err){
            console.log(err)
            
        }
    }

    async getJobs(){
            let data = await fileParserModel.find({isFinished:false,isSelectedForParsing:false});
            console.log(data)
    }

    async selectJob(){
        let data = await fileParserModel.findOneAndUpdate({isFinished:false,isSelectedForParsing:true},{isSelectedForParsing:true},{new:true}).lean()
        if (!data ||  Object.keys(data).length < 1)
          data = await fileParserModel.findOneAndUpdate({isFinished:false,isSelectedForParsing:false},{isSelectedForParsing:true},{new:true}).lean()
        this.currentJob = data;
        console.log('selected job',this.currentJob)
    }
}

let schedular = new Schedular()
mongoose.set('debug', true);

// console.log(mongoDBUrl)
mongoose.connect(mongoDBUrl,
    { useNewUrlParser: true, useUnifiedTopology: true }
    ).then(  async (data) => {
        console.log('Node schedular DB connected')
        if(mongoose.connection.readyState){ 
            setInterval(async ()=>{
                await schedular.insertData()
                console.log('interval-----------------')
            },300000)
        }
}).catch(err =>{
    console.log(err)
});
