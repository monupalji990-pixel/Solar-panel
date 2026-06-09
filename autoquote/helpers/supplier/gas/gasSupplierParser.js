const { distIdToLdzMapper } = require('../../constants')

class GasSupplierParser {
    async avantiGasParser(data, mapper) {
        try {
            console.log(mapper)
            // let mapper = {
            //     "Unique Tariff Matrix Identifier":null,
            //     "End User Category":null,
            //     "Local Distribution Zone":"ldz",
            //     "Exit Zone":null,
            //     "AQ Band Lower":"minAQ",
            //     "AQ Band Upper":"maxAQ",
            //     "Product Name" : "duration",
            //     "Broker" : null,
            //     "Start Date":"startDate",
            //     "End Date":"endDate",
            //     "Unit Rate" :"unitRate",
            //     "Standing Charge":"standingCharge",
            //     "Broker Max Margin":null
            // }

            let parsedData = [];
            data.forEach(d => {
                let o = {};
                let keys = Object.keys(d)
                keys.forEach(k => {
                    if (mapper[k]) {
                        o[mapper[k]] = d[k]
                    } else {
                        o[k] = d[k]
                    }
                })
                if (o['duration'].match(/([1-9]\s*[year]+)/gi)) {
                    o['duration'] = o['duration'].match(/([1-9]\s*[year]+)/gi)[0] // extract year text
                        .replace(/\s*/gi, "")             // remove unnecessary spaces   
                        .match(/\d/g)[0]                 // extract year digit
                }
                // if (o['minAQ'] === 25000) {
                //     o['minAQ'] = 0
                // }
                //o['total']= (o['unitRate'] * o['minAQ']) + (o['standingCharge']*365)
                parsedData.push(o);
            });
            return parsedData
        } catch (error) {
            console.log(error);
            return error;
        }
    }
    async smartestEnergyGasParser(data, mapper) {
        try {
            console.log(mapper)
            // let mapper = {
            //     "Product" : "duration",
            //     "Tariff":"priceFor",
            //     "Region":"ldz",
            //     "Standing Charge":"standingCharge",
            //     "Unit Rate" :"unitRate",
            //     "Min AQ":"minAQ",
            //     "Max AQ":"maxAQ",
            //     "Effective From":"startDate",
            //     "Effective To":"endDate",
            // }

            let parsedData = [];
            data.forEach(d => {
                let o = {};
                let keys = Object.keys(d)
                keys.forEach(k => {
                    if (mapper[k]) {
                        o[mapper[k]] = d[k]
                    } else {
                        o[k] = d[k]
                    }
                })
                if (o['duration'].match(/([1-9]\s*[year]+)/gi)) {
                    o['duration'] = o['duration'].match(/([1-9]\s*[year]+)/gi)[0] // extract year text
                        .replace(/\s*/gi, "")             // remove unnecessary spaces   
                        .match(/\d/g)[0]                 // extract year digit
                } else if (o['duration'].match(/smarttracker/gi)) {
                    o['duration'] = '3';
                }
                // if (o['minAQ'] === 25000) {
                //     o['minAQ'] = 0
                // }
                if (!isNaN(Number(o['standingCharge'])))
                    o['standingCharge'] = 100 * o['standingCharge']
                if (!isNaN(Number(o['unitRate'])))
                    o['unitRate'] = 100 * o['unitRate']

                //o['total']= (o['unitRate'] * o['minAQ']) + (o['standingCharge']*365)

                parsedData.push(o);
            });
            return parsedData
        } catch (error) {
            console.log(error);
            return error;
        }
    }
    async gazPromGasParser(data, mapper) {
        try {
            console.log(mapper)
            //does not have priceFor , start and end date
            // let mapper = {
            //     "Matrix":null,
            //     "Band":null,
            //     "Min":"minAQ",
            //     "Max":"maxAQ",
            //     "Contract Duration":"duration",
            //     "LDZ":"ldz",
            //     "Standing Charge\r\n(£/day)":"standingCharge",
            //     "Unit Rate\r\n(p/kWh)":"unitRate"
            // }

            let parsedData = [];
            data.forEach(d => {
                let o = {};
                let keys = Object.keys(d)
                keys.forEach(k => {
                    if (mapper[k]) {
                        o[mapper[k]] = d[k]
                    } else {
                        o[k] = d[k]
                    }
                })
                if (o['duration'].match(/([0-9]*\s*[month]+)/gi)) {
                    o['duration'] = o['duration'].match(/([0-9]*\s*[month]+)/gi)[0] // extract months text
                        .replace(/\s*/gi, "")             // remove unnecessary spaces   
                        .match(/\d+/g)[0]                 // extract year digit
                    o['duration'] = String(Number(o['duration'] / 12))
                }
                // if (o['minAQ'] === 25000) {
                //     o['minAQ'] = 0
                // }
                if (!isNaN(Number(o['standingCharge'])))
                    o['standingCharge'] = 100 * o['standingCharge']

                //o['total']= (o['unitRate'] * o['minAQ']) + (o['standingCharge']*365)

                parsedData.push(o);
            });
            return parsedData
        } catch (error) {
            console.log(error);
            return error;
        }
    }
    async sseGasParser(data, mapper) {
        try {
            console.log(mapper)
            // minAQ and maxAQ has to be split from consumption band
            // let mapper = {
            //    "MatrixID":null,
            //    "ProposedStartDate":"startDate",
            //    "TERM":"duration",
            //    "ProposedEndDate":"endDate",
            //    "BillingFreqLive":null,
            //    "StandingChargeLive":"standingCharge",
            //    "UnitRateLive":"unitRate",
            //    "Consumption Band":minAQ,
            //    "PAYMENTMETHOD":null,
            //    "ExitZone":null,
            //    "LDZ":"ldz"
            // }

            let parsedData = [];
            data.forEach(d => {
                let o = {};
                let keys = Object.keys(d)
                keys.forEach(k => {
                    if (mapper[k]) {
                        o[mapper[k]] = d[k]
                    } else {
                        o[k] = d[k]
                    }
                })
                if (!isNaN(Number(o['duration']))) {
                    o['duration'] = String(Number(o['duration']) / 12)
                }
                let temp = o['minAQ']
                if (temp.match(/\d+/gi).length == 2) {
                    o['minAQ'] = Number(temp.match(/\d+/gi)[0])
                    o['maxAQ'] = Number(temp.match(/\d+/gi)[1])
                }
                // if (o['minAQ'] === 25000) {
                //     o['minAQ'] = 0
                // }
                //o['total']= (o['unitRate'] * o['minAQ']) + (o['standingCharge']*365)

                parsedData.push(o);
            });
            return parsedData
        } catch (error) {
            console.log(error);
            return error;
        }
    }
    async unitedGasAndPowerGasParser(data, mapper) {
        try {
            console.log(mapper)
            // minAQ and maxAQ has to be split from consumption band
            // let mapper = {
            //     "Region":"ldz",
            //     "Start Month":"startDate",
            //     "Consumption Band":null,
            //     "Min AQ":"minAQ",
            //     "Max AQ":"maxAQ",
            //     "ContractLength":"duration",
            //     "Price p/kWh":"unitRate",
            //     "Daily Standing Charge":"standingCharge"
            // }

            let parsedData = [];
            let previousSC = null;
            data.forEach(d => {
                let o = {};
                let keys = Object.keys(d)
                keys.forEach(k => {
                    if (mapper[k]) {
                        o[mapper[k]] = d[k]
                    } else {
                        o[k] = d[k]
                    }
                })
                let n = o['duration'].match(/\d+/gi);
                if (n) {
                    o['duration'] = String(Number(n[0]) / 12)
                }
                if (o['standingCharge']) {
                    let standingCharge = o['standingCharge'].match(/\d+/gi)
                    o['standingCharge'] = Number(standingCharge[0])
                    previousSC = o['standingCharge']
                } else {
                    if (previousSC)
                        o['standingCharge'] = previousSC
                    else
                        o['standingCharge'] = 0
                }
                // if (o['minAQ'] === 25000) {
                //     o['minAQ'] = 0
                // }
                //o['total']= (o['unitRate'] * o['minAQ']) + (o['standingCharge']*365)

                parsedData.push(o);
            });
            return parsedData
        } catch (error) {
            console.log(error);
            return error;
        }
    }
    async d_energiGasParser(data, mapper) {
        try {
            console.log(mapper)
            // minAQ and maxAQ has to be split from consumption band
            // let mapper = {
            //    "TariffName":null,
            //    "Start date from":"startDate",
            //    "Term":"duration",
            //    "start date to":"endDate",
            //    "Standing Charge (pence/day)":"standingCharge",
            //    "p/kWh":"unitRate",
            //    "AQ Min (kWh)":"minAQ",
            //    "AQ Max (kWh)":"maxAQ",
            //    "Region":"ldz"
            // }

            let parsedData = [];
            data.forEach(d => {
                let o = {};
                let keys = Object.keys(d)
                keys.forEach(k => {
                    if (mapper[k]) {
                        o[mapper[k]] = d[k]
                    } else {
                        o[k] = d[k]
                    }
                })
                if (o['duration'].match(/([0-9]+\s*month+)/gi)) {
                    let n = o['duration'].match(/([0-9]+\s*month+)/gi)[0];
                    n = Number(o['duration'].match(/\d+/gi)[0])
                    if (!isNaN(n)) {
                        o['duration'] = String(n / 12)
                    }
                } else {
                    o['duration'] = '3'
                }
                // if (o['minAQ'] === 25000) {
                //     o['minAQ'] = 0
                // }
                //o['total']= (o['unitRate'] * o['minAQ']) + (o['standingCharge']*365)

                parsedData.push(o);
            });
            return parsedData
        } catch (error) {
            console.log(error);
            return error;
        }
    }
    async cngGasParser(data, mapper) {
        try {
            console.log(mapper)
            // minAQ and maxAQ has to be split from consumption band
            // let mapper = {
            //     "Lower AQ":"minAQ",
            //     "Upper AQ":"maxAQ",
            //     "Band":null,
            //     "LDZ":"ldz",
            //     "Exit Zone":null,
            //     "EUC":null,
            //     "Minimum Contract Start":"startDate",
            //     "Maximum Contract start":"endDate",
            //     "Contract Band":null,
            //     "Miniumum contract end":null,
            //     "Maximum contract end":null,
            //     "Contract Term":"duration",
            //     "StandingChargeType":null,
            //     "DD/NON DD":null,
            //     "Unit Rate only Price":"unitRate",
            //     "Standing charge":"standingCharge",
            //     "Product Name":null
            // }

            let parsedData = [];
            data.forEach(d => {
                let o = {};
                let keys = Object.keys(d)
                keys.forEach(k => {
                    if (mapper[k]) {
                        o[mapper[k]] = d[k]
                    } else {
                        o[k] = d[k]
                    }
                })
                if (!isNaN(o['duration'])) {
                    o['duration'] = String(o['duration'] / 12)
                }
                else if (o['duration'].match(/([0-9]+)/gi)) {
                    let n = o['duration'].match(/([0-9]+)/gi)[0];
                    n = Number(o['duration'])
                    if (!isNaN(n)) {
                        o['duration'] = String(n / 12)
                    }
                }
                // console.log('example mapped obj');
                // console.log(o);
                // if (o['minAQ'] === 25000) {
                //     o['minAQ'] = 0
                // }
                // console.log(o)
                parsedData.push(o);
                // //o['total']= (o['unitRate'] * o['minAQ']) + (o['standingCharge']*365)

            });
            return parsedData
        } catch (error) {
            console.log(error);
            return error;
        }
    }
    async scottishPowerGasParser(data, mapper) {
        try {
            console.log(mapper)
            // let mapper = {
            //     "Key": null,
            //     "Utility": null,
            //     "DnoId": "ldz",
            //     "ProfileClass": null,
            //     "RateStructure": null,
            //     "Ldz": null,
            //     "ExitZone": null,
            //     "SaleType": "priceFor",
            //     "ContractDuration": "duration",
            //     "MinimumAnnualConsumption": "minAQ",
            //     "MaximumAnnualConsumption": "maxAQ",
            //     "MinimumContractStartDate": "startDate",
            //     "MaximumContractStartDate": null,
            //     "MinimumValidQuoteDate": null,
            //     "MaximumValidQuoteDate": null,
            //     "PaymentMethod": null,
            //     "ProductName": null,
            //     "StandingChargeType": null,
            //     "GreenEnergy": null,
            //     "Amr": null,
            //     "MinimumCreditScore": null,
            //     "MaximumCreditScore": null,
            //     "SetUplift": null,
            //     "StandingCharge": "standingCharge",
            //     "DayRate": null,
            //     "NightRate": null,
            //     "EveningWeekendRate": null,
            //     "UnitRate": "unitRate",
            //     "FixedContractEndDate": "endDate",
            //     "Version": null,
            //     "TariffInformation1": null,
            //     "TariffInformation2": null,
            //     "TariffInformation3": null,
            //     "TariffInformation4": null
            // }

            let parsedData = [];
            data.forEach(d => {
                let o = {};
                let keys = Object.keys(d)
                keys.forEach(k => {
                    if (mapper[k]) {
                        o[mapper[k]] = d[k]
                    } else {
                        o[k] = d[k]
                    }
                })
                if (!isNaN(Number(o['duration']))) {
                    o['duration'] = String(Number(o['duration']) / 12)
                }
                if (distIdToLdzMapper[o['ldz']]) {
                    o['ldz'] = distIdToLdzMapper[o['ldz']]
                }

                // console.log('example mapped obj');
                // console.log(o);
                // if(o['minAQ'] === 25000){
                //     o['minAQ']=0
                // }
                //o['total']= (o['unitRate'] * o['minAQ']) + (o['standingCharge']*365)

                parsedData.push(o);
            });
            return parsedData
        } catch (error) {
            console.log(error);
            return error;
        }
    }
    async hubEnergiGasParser(data, mapper) {
        try {

            console.log(mapper)
            // let mapper = {
            //     "Price Book":null,
            //     "ProductType":null,
            //     "Dist ID":null,
            //     "Product Bundle Bill Display":null,
            //     "Duration":"duration",
            //     "Payment Type":null,
            //     "Standing Charge":"standingCharge",
            //     "Uni/Day Rate":"unitRate",
            //     "MinAQ":"minAQ",
            //     "MaxAQ":"maxAQ",
            //     "MinimumContractStartDate":"startDate",
            //     "MaximumContractStartDate":"endDate",
            //     "MinimumValidQuoteDate":null,
            //     "MaximumValidQuoteDate":null,
            //     "Tariff Name":null,
            //     "End date":null,
            //     "LDZ for Gas":"ldz"
            // }

            let parsedData = [];
            data.forEach(d => {
                let o = {};
                let keys = Object.keys(d)
                keys.forEach(k => {
                    if (mapper[k]) {
                        o[mapper[k]] = d[k]
                    } else {
                        o[k] = d[k]
                    }
                })
                if (!isNaN(Number(o['duration']))) {
                    o['duration'] = String(Number(o['duration']) / 12)
                }
                if (!isNaN(Number(o['standingCharge'])))
                    o['standingCharge'] = 100 * o['standingCharge']
                if (!isNaN(Number(o['unitRate'])))
                    o['unitRate'] = 100 * o['unitRate']

                // console.log('example mapped obj');
                // console.log(o);
                // if(o['minAQ'] === 25000){
                //     o['minAQ']=0
                // }
                //o['total']= (o['unitRate'] * o['minAQ']) + (o['standingCharge']*365)

                parsedData.push(o);
            });
            return parsedData
        } catch (error) {
            console.log(error);
            return error;
        }
    }
    async utilitaGasParser(data, mapper) { //no minaq and manaq 
        try {

            console.log(mapper)
            // let mapper = {
            //     "FUEL":null,
            //     "REGION":null,
            //     "DNO AREA":"ldz",
            //     "GSP AREA":null,
            //     "PROFILE CLASS":null,
            //     "TARIFF_NAME":"duration",
            //     "HELPER":null,
            //     "STANDING CHARGE":"standingCharge",
            //     "UNIT RATE":"unitRate",
            //     "NIGHT RATE":null,
            //     "EVENING/WEEKEND RATE":null,
            //     "UPLIFT":null
            // }

            let parsedData = [];
            data.forEach(d => {
                let o = {};
                let keys = Object.keys(d)
                keys.forEach(k => {
                    if (mapper[k]) {
                        o[mapper[k]] = d[k]
                    } else {
                        o[k] = d[k]
                    }
                })

                if (!isNaN(Number(o['ldz'])) && distIdToLdzMapper[Number(o['ldz'])]) {
                    o['ldz'] = distIdToLdzMapper[Number(o['ldz'])]
                }
                if (o['duration'].match(/(\d+\s*year)/gi)) {
                    o['duration'] = o['duration'].match(/(\d+\s*year)/gi)[0].match(/\d+/gi)[0]
                }
                //o['total']= (o['unitRate'] * o['minAQ']) + (o['standingCharge']*365)

                parsedData.push(o);
            });
            return parsedData
        } catch (error) {
            console.log(error);
            return error;
        }
    }
    async coronaGasParser(data, mapper) {
        try {

            // let mapper = {
            //     "DATE_INSERTED":"",
            //     "ONSALEFROM":"",
            //     "ONSALETO":"",
            //     "SUPPLIER":"",
            //     "PARTNERID":"",
            //     "SUPPLIERTARIFFCODE":"",
            //     "TARIFFNAME":"",
            //     "FIXEDRATEPERIOD":"duration",
            //     "MIN_CONSUMPTION":"minAQ",
            //     "MAX_CONSUMPTION":"maxAQ",
            //     "FUELTYPE":"",
            //     "PRODUCTTYPE":"",
            //     "PROFILECLASS":"",
            //     "AMR":"",
            //     "Renewable Energy":"",
            //     "ISUPLIFTALLOWED":"",
            //     "TARIFFID":"",
            //     "DNO_EXITZONE":"ldz",
            //     "FIRST_SSD":"",
            //     "LAST_SSD":"",
            //     "STARTDATE":"startDate",
            //     "PAYMENTTYPE":"",
            //     "CURRENCY":"",
            //     "Rate1_A_PER_kWh":"",
            //     "Rate1_B_PER_kWh":"",
            //     "DYLY_STDG_CHRG":"standingCharge"
            // }

            let parsedData = [];
            data.forEach(d => {
                let o = {};
                let keys = Object.keys(d)
                keys.forEach(k => {
                    if (mapper[k]) {
                        o[mapper[k]] = d[k]
                    } else {
                        o[k] = d[k]
                    }
                })

                if (o['ldz'] && o['ldz'].match(/(\D+)/g) && o['ldz'].match(/(\D+)/g).length > 0) {
                    o['ldz'] = o['ldz'].match(/(\D+)/g)[0]
                }
                if (!isNaN(Number(o['duration']) / 12)) {
                    o['duration'] = Number(o['duration']) / 12
                }
                o['unitRate'] = 100 * o['unitRate']
                o['standingCharge'] = 100 * o['standingCharge']

                parsedData.push(o);
            });
            return parsedData
        } catch (error) {
            console.log(error);
            return error;
        }
    }
    async EDFEnergyGasParser(data, mapper) {
        try {

            // let mapper = {
            //     "Min EAC Threshold":"minAQ",
            //     "Max EAC Threshold":"maxAQ",
            //     "Min Selling Window Days":null,
            //     "Max Selling Window Days":null,
            //     "Region":"ldz",
            //     "Meter":null,
            //     "Contract":null,
            //     "Contract Length Months":"duration",
            //     "Rank":null,
            //     "Standing Charge £/day":"standingCharge",
            //     "Day":"unitRate",
            //     "Commission Uplift p/KWH":null,
            //     "SAP Product":null,
            //     "Contract Review date":null,
            //     "Credit score availability":null,
            //     "DD Discount Effective Standing Charge (£ Per Day)":null,
            //     "DD Discount Effective Day":null,
            //     "ProductName":null,
            //     "EAC Band":null,
            //     "Selling Window":null
            // }

            let parsedData = [];
            data.forEach(d => {
                let o = {};
                let keys = Object.keys(d)
                keys.forEach(k => {
                    if (mapper[k]) {
                        o[mapper[k]] = d[k]
                    } else {
                        o[k] = d[k]
                    }
                })

                if (o['ldz'] && o['ldz'].match(/(\d+)/g) && o['ldz'].match(/(\d+)/g).length > 0) {
                    o['ldz'] = o['ldz'].match(/(\d+)/g)[0]
                    o['ldz'] = distIdToLdzMapper[o['ldz']];
                }
                if (!isNaN(Number(o['duration']) / 12)) {
                    o['duration'] = Number(o['duration']) / 12
                }
                o['unitRate'] = 100 * o['unitRate']
                o['standingCharge'] = 100 * o['standingCharge']

                parsedData.push(o);
            });
            return parsedData
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async BGLiteGasParser(data, mapper) {
        try {

            // let mapper = {
            //     "Pricebook Version":null,
            //     "Window Open":"startDate",
            //     "Window Close":"endDate",
            //     "Exit Zone":null,
            //     "LDZ / PES Region":"ldz",
            //     "Dummy MPRN Description":null,
            //     "Sales Type":"priceFor",
            //     "Contract Duration":"duration",
            //     "Consumption Range":null,
            //     "Standing Charge":null,
            //     "Payment Method":null,
            //     "Price Line Description":null,
            //     "Unit Charge":"unitRate",
            //     "Unit Type":null
            // }
            let tempStandingCharges = null
            let parsedData = [];
            data.forEach(d => {
                let o = {};
                let keys = Object.keys(d)
                keys.forEach(k => {
                    if (mapper[k]) {
                        o[mapper[k]] = d[k]
                    } else {
                        o[k] = d[k]
                    }
                })

                if (!isNaN(Number(o['duration']) / 12)) {
                    o['duration'] = Number(o['duration']) / 12
                }
                if (o['Unit Type'].trim() === "p/DAY") {
                    o['standingCharge'] = 100 * o['standingCharge']
                    tempStandingCharges = o['standingCharge']

                } else {

                    o['unitRate'] = 100 * o['unitRate']
                }
                if (o['Unit Type'].trim() === "p/KWH") {
                    o['standingCharge'] = tempStandingCharges
                    parsedData.push(o);
                }
            });
            return parsedData
        } catch (error) {
            console.log(error);
            return error;
        }
    }
}


module.exports = GasSupplierParser