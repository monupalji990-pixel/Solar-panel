const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const {constants,distIdToLdzMapper} = require('./constants');
const GasSupplierParser = require('./supplier/gas/gasSupplierParser')
const ElectricSupplierParser = require('./supplier/electric/electricSupplierParser')
const FileParserModel = require('../Models/fileparsers')

function deleteFile(filedata) {
    fs.stat(filedata, function (err, exists) {
        if (err) {
            console.log(filedata, 'file does not exists');
        }
        if (exists) {
            console.log('file : ', filedata, ' exists')
            fs.unlink(filedata, (err) => {
                if (err) console.log(err);
                console.log(filedata, 'was deleted');
            });
        }
    });
}
class BaseXlsx {
    async getExcelHeaders(filedata) {
        try {

            let file = XLSX.readFile(filedata, {
                cellDates: true,
                sheetRows: 5
            });
            if (file && file.SheetNames.length > 1) {
                throw { message: "File has multiple sheets , Please try after deleting unnecessary sheets" }
            }
            let data = XLSX.utils.sheet_to_json(file.Sheets[file.SheetNames[0]], { defval: null });
            // console.log(data[0])
            // console.log(data.length)
            // fs.stat(filedata, function (err, exists) {
            //     if (err) {
            //         console.log(filedata, 'file does not exists');
            //     }
            //     if (exists) {
            //         console.log('file : ', filedata, ' exists')
            //         fs.unlink(filedata, (err) => {
            //             if (err) console.log(err);
            //             console.log(filedata, 'was deleted');
            //         });
            //     }
            // });
            return {data: Object.keys(data[0]) ,file:filedata};
        } catch (error) {
            // console.log(error);
            // return error;

            throw error
        }
    }

    async readExcel(filedata) {
        try {

            let file = XLSX.readFile(filedata, {
                cellDates: true
            });
            if (file && file.SheetNames.length > 1) {
                throw { message: "File has multiple sheets , Please try after deleting unnecessary sheets" }
            }
            let data = XLSX.utils.sheet_to_json(file.Sheets[file.SheetNames[0]], { defval: null });
            console.log(data[0])
            return data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async parseEXcel(service, supplier, data, mapper) {
        try {
            let gasParser = new GasSupplierParser();
            let electricParser = new ElectricSupplierParser();
            if (supplier === constants.AVANTI_GAS_SUPPLIER_ID) {
                if (service === 'gas') {
                    let formattedData = gasParser.avantiGasParser(data, mapper);
                    return formattedData;
                }
                else if (service === 'electric') {
                    //NA
                }
                else throw { message: 'no service name found' }
            }
            if (supplier === constants.SMARTEST_ENERGY_SUPPLIER_ID) {
                if (service === 'gas') {
                    let formattedData = gasParser.smartestEnergyGasParser(data, mapper);
                    return formattedData;
                } else if (service === 'electric') {
                    let formattedDate = electricParser.smartestEnergyElectricParser(data, mapper);
                    return formattedDate;
                }
                else throw { message: 'no service name found' }
            }
            if (supplier === constants.GAZPROM_SUPPLIER_ID) {
                if (service === 'gas') {
                    let formattedData = gasParser.gazPromGasParser(data, mapper);
                    return formattedData;
                } else if (service === 'electric') {
                    let formattedDate = electricParser.gazpromElectricParser(data, mapper);
                    return formattedDate;
                }
                else throw { message: 'no service name found' }
            }
            if (supplier === constants.SSE_SUPPLIER_ID) {
               
                if (service === 'gas') {
                    let formattedData = gasParser.sseGasParser(data, mapper);
                    return formattedData;
                } else if (service === 'electric') {
                    let formattedDate = electricParser.sseElectricParser(data,mapper)
                    return formattedDate;
                }
                else throw { message: 'no service name found' }
            }
            if (supplier === constants.UGP_SUPPLIER_ID) {
                if (service === 'gas') {
                    let formattedData = gasParser.unitedGasAndPowerGasParser(data, mapper);
                    return formattedData;
                } else if (service === 'electric') {
                    let formattedDate = electricParser.unitedGasAndPowerElectricParser(data, mapper);
                    return formattedDate;
                }
                else throw { message: 'no service name found' }
            }
            if (supplier === constants.D_ENERGI_SUPPLIER_ID) {
                if (service === 'gas') {
                    let formattedData = gasParser.d_energiGasParser(data, mapper);
                    return formattedData;
                } else if (service === 'electric') {
                    let formattedDate = electricParser.d_energiElectricParser(data, mapper);
                    return formattedDate;
                }
                else throw { message: 'no service name found' }
            }
            if (supplier === constants.CNG_SUPPLIER) {
                let formattedData = gasParser.cngGasParser(data, mapper);
                return formattedData;
            }
            if (supplier === constants.SCOTTISH_POWER_SUPPLIER_ID) {
                if (service === 'gas') {
                    let formattedData = gasParser.scottishPowerGasParser(data, mapper);
                    return formattedData;
                } else if (service === 'electric') {
                    let formattedDate = electricParser.scottishPowerElectricParser(data, mapper);
                    return formattedDate;
                }
                else throw { message: 'no service name found' }
            }
            if (supplier === constants.HUB_ENERGY_SUPPLIER_ID) {
                if (service === 'gas') {
                    let formattedData = gasParser.hubEnergiGasParser(data, mapper);
                    return formattedData;
                } else if (service === 'electric') {
                    let formattedDate = electricParser.hubEnergyElectricParser(data, mapper);
                    return formattedDate;
                }
                else throw { message: 'no service name found' }
            }
            if (supplier === constants.UTILITA_SUPPLIER_ID) {
                if (service === 'gas') {
                    let formattedData = gasParser.utilitaGasParser(data, mapper);
                    return formattedData;
                } else if (service === 'electric') {
                    let formattedDate = electricParser.utiliaElectricParser(data, mapper);
                    return formattedDate;
                }
                else throw { message: 'no service name found' }
            }
            if (supplier === constants.CORONA_ENERGY_SUPPLIER_ID) {
                if (service === 'gas') {
                    let formattedData = gasParser.coronaGasParser(data, mapper);
                    return formattedData;
                } else if (service === 'electric') {
                    let formattedDate = electricParser.coronaEnergyElectricParser(data, mapper);
                    return formattedDate;
                }
                else throw { message: 'no service name found' }
            }
            if (supplier === constants.EDF_ENERGY_SUPPLIER_ID) {
                if (service === 'gas') {
                    let formattedData = gasParser.EDFEnergyGasParser(data, mapper);
                    return formattedData;
                } else if (service === 'electric') {
                    let formattedDate = electricParser.EDFEnergyGasParser(data, mapper);
                    return formattedDate;
                }
                else throw { message: 'no service name found' }
            }
            if (supplier === constants.BGLITE_SUPPLIER_ID) {
                if (service === 'gas') {
                    let formattedData = gasParser.BGLiteGasParser(data, mapper);
                    return formattedData;
                }
                else throw { message: 'no service name found' }
            }
            if (supplier === constants.TOTAL_GAS_AND_POWER_SUPPLIER_ID) {
                if (service === 'electric') {
                    let formattedData = electricParser.TotalGasAndPowerElectricParser(data, mapper);
                    return formattedData;
                }
                else throw { message: 'no service name found' }
            }
            if(supplier === constants.DRAX_SUPPLIER_ID){
                if(service === 'electric'){
                    let formattedData = electricParser.DRAXElectricParser(data, mapper);
                    return formattedData;
                }
            }
            else {
                throw { message: "No supplier found" }
            }

        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async writeExcel(filename, data) {
        try {
            // console.log('filename: ', filename)
            let wb = XLSX.utils.book_new();
            let newFile = filename.match(/upload\S*/gi)[0]
            console.log(newFile) 
            // console.log(newFile)
            // console.log(newFile.replace(/\/tmp\/upload/,'/tmp/standard'),filename.replace(/\/tmp\/upload/,'/tmp/standard'))
            // newFile.replace(/\/tmp\/upload/,'/tmp/standard');
            let ws = XLSX.utils.json_to_sheet(data)
            XLSX.utils.book_append_sheet(wb, ws, 'sheet');
            let res = XLSX.writeFile(wb, newFile, { cellDates: true, compression: true });
            console.log('new file reading finished')
            return {file:true,newFile,totalRows:data.length};
        } catch (error) {
            console.log(error);
            return error;
        }
    }
}

function getNumber(num){
if(process.env.NODE_ENV === 'staging'){
    if(num.length > 0 && num[0] === '+'){
        return num
    }else {
        return '+91'+num
    }
}
if(process.env.NODE_ENV === 'production'){
    if(num.length > 0 && num[0] === '+'){
        return num
    }else {
        return '+44'+num
    }
}

}
module.exports = {
    BaseXlsx,
    deleteFile,
    getNumber
}