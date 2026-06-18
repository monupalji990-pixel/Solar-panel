const moment = require('moment')
const { supplyZoneToDistId } = require('../../constants')

class ElectricSupplierParser {
    async smartestEnergyElectricParser(data, mapper) {
        try {
            // let mapper = {
            //     "Dist ID": "distId",
            //     "Region": null,
            //     "Meter Type": "meterType",
            //     "Profile": "profileClass",
            //     "Product": "duration",
            //     "StandingCharge": "standingCharge",
            //     "Day/All/STOD OtherDayUnits": "dayUnitRate",
            //     "NightUnitPrice": "nightUnitRate",
            //     "Eve&Wkend/Control/STOD WinterPeak": "eveningAndWeekendUnitRate",
            //     "MinAQ": "minAQ",
            //     "MaxAQ": "maxAQ",
            //     "Effective From Date": "startDate",
            //     "Effective To Date": "endDate"
            // }
            let parsedData = [];
            data.forEach(d => {
                let o = {};
                let keys = Object.keys(d)
                keys.forEach(k => {
                    if (mapper[k]) {
                        o[mapper[k]] = d[k]  // map field available 
                    } else {
                        o[k] = d[k] // unmapped field
                    }
                })
                /*
                    SmartFIX – 1 Year
                    SmartFIX – 1 Year (Level 2)
                    SmartFIX – 1 Year Renewal
                    SmartFIX – 1 Year Renewal (Level 2)
                    SmartFIX – 2 Year
                    SmartFIX – 2 Year (Level 2)
                    SmartFIX – 2 Year Renewal
                    SmartFIX – 2 Year Renewal (Level 2)
                    SmartFIX – 3 Year
                    SmartFIX – 3 Year (Level 2)
                    SmartFIX – 3 Year Renewal
                    SmartFIX – 3 Year Renewal (Level 2)
                    SmartFIX – 5 Year
                    SmartFIX – 5 Year (Level 2)
                    SmartFIX – 5 Year Renewal
                    SmartFIX – 5 Year Renewal (Level 2)
                    SmartPAY12
                    SmartPAY12_Renewal
                    SmartPAY24
                    SmartPAY24_Renewal
                    SmartPAY36
                    SmartPAY36_Renewal
                    SmartTRACKER =
                    SmartTRACKER (Level 2)=
                    SmartTRACKER Renewal=
                    SmartTRACKER Renewal (Level 2)=

                */
                let pf = Number(o['profileClass'])
                o['profileClass'] = isNaN(pf) ? o['profileClass'] : pf
                if (o['duration'].match(/(\d+\s*year\s*renewal)/gi)) {
                    o['duration'] = o['duration'].match(/(\d+\s*year\s*renewal)/gi)[0].match(/\d+/gi)[0]
                    o['priceFor'] = "Renewal"
                }
                else if (o['duration'].match(/(\d+\s*year)/gi)) {
                    o['duration'] = o['duration'].match(/(\d+\s*year)/gi)[0].match(/\d+/gi)[0]
                    o['priceFor'] = "Acquisition"
                }
                else if (o['duration'].match(/(\d\d(\s*|_)renewal)/gi)) {
                    o['duration'] = String(Number(o['duration'].match(/(\d\d(\s*|_)renewal)/gi)[0].match(/\d+/)[0]) / 12)
                    o['priceFor'] = "Renewal"
                }
                else if (o['duration'].match(/(\d\d)/gi)) {
                    o['duration'] = String(Number(o['duration'].match(/(\d\d)/gi)[0].match(/\d+/)[0]) / 12)
                    o['priceFor'] = "Acquisition"
                }
                else if (o['duration'].match(/(SmartTRACKER\s*Renewal)/gi)) {
                    o['duration'] = "3"
                    o['priceFor'] = "Renewal"
                } else if (o['duration'].match(/(SmartTRACKER)/gi)) {
                    o['duration'] = "3"
                    o['priceFor'] = "Acquisition"
                }

                if (!isNaN(Number(o['standingCharge'])))
                    o['standingCharge'] = 100 * o['standingCharge']
                if (o['dayUnitRate'] && !isNaN(Number(o['dayUnitRate'])))
                    o['dayUnitRate'] = 100 * o['dayUnitRate']
                else
                    o['dayUnitRate'] = "null"
                if (o['nightUnitRate'] && !isNaN(Number(o['nightUnitRate'])))
                    o['nightUnitRate'] = 100 * o['nightUnitRate']
                else
                    o['nightUnitRate'] = "null"
                if (o['eveningAndWeekendUnitRate'] && !isNaN(Number(o['eveningAndWeekendUnitRate'])))
                    o['eveningAndWeekendUnitRate'] = 100 * o['eveningAndWeekendUnitRate']
                else
                    o['eveningAndWeekendUnitRate'] = "null"

                if (o['dayUnitRate'] == 0 || o['nightUnitRate'] == 0 || o['eveningAndWeekendUnitRate'] == 0) {
                    console.log(o)
                    console.log(d)
                }
                parsedData.push(o)
            });
            return parsedData;
        } catch (error) {
            console.log(error)
            return error
        }
    }
    async gazpromElectricParser(data, mapper) { // no min and max aq is there , no start and end date is there instead it has date with before and after 
        try {
            // let mapper = {
            //       "DNO": "distId",
            //       "Meter": "meterType",
            //       "Profile Class": "profileClass",
            //       "Contract Duration": "duration",
            //       "Standing Charge\n(p/day)": "standingCharge",
            //       "Day\n(p/kWh)": "dayUnitRate",
            //       "Night\n(p/kWh)": "nightUnitRate",
            //       "Evening & Weekend\n(p/kWh)": "eveningAndWeekendUnitRate"
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
                // console.log(o);
                let pf = Number(o['profileClass'])
                o['profileClass'] = isNaN(pf) ? o['profileClass'] : pf
                if (o['duration'] && o['duration'].match(/\d+\s*year/gi)) {
                    o['duration'] = o['duration'].match(/\d+/gi)[0]
                }
                if (o['Date'] && o['Date'].match(/\s*Before\s*/gi)) {
                    o['endDate'] = moment(o['Date'].replace(/\s*Before\s*/gi, ''), 'DD-MMMM-YYYY"').subtract(1, 'day').format('DD-MM-YYYY')
                }
                if (o['Date'] && o['Date'].match(/\s*After\s*/gi)) {
                    o['startDate'] = moment(o['Date'].replace(/\s*After\s*/gi, ''), 'DD-MMMM-YYYY"').add(1, 'day').format('DD-MM-YYYY')
                }

                if (o['dayUnitRate'] && !isNaN(Number(o['dayUnitRate']))) {

                    o['dayUnitRate'] = o['dayUnitRate']
                }
                else {
                    o['dayUnitRate'] = "null"
                    console.log(o)

                }
                if (o['nightUnitRate'] && !isNaN(Number(o['nightUnitRate'])))
                    o['nightUnitRate'] = o['nightUnitRate']
                else
                    o['nightUnitRate'] = "null"
                if (o['eveningAndWeekendUnitRate'] && !isNaN(Number(o['eveningAndWeekendUnitRate'])))
                    o['eveningAndWeekendUnitRate'] = o['eveningAndWeekendUnitRate']
                else
                    o['eveningAndWeekendUnitRate'] = "null"
                // if(o['standingCharge']  && o['dayUnitRate']  && o['nightUnitRate']  && o['eveningAndWeekendUnitRate']   )
                parsedData.push(o)
                // else
                // console.log(o)
            });
            return parsedData;
        } catch (error) {
            console.log(error)
            return error
        }
    }
    async unitedGasAndPowerElectricParser(data, mapper) { //no min and max aq is there and confusion in rates and its fields
        try {
            // let mapper = {
            //     "Rate Type":null,
            //     "Code":null,
            //     "MPaN Area":"distId",
            //     "Term":"duration",
            //     "profile class":"profileClass",
            //     "Contract Start Date":"startDate",
            //     "Unit Rate p/kWh":"",
            //     "Daily Standing Charge":"standingCharge"
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
                if (typeof o['duration'] == 'number') {
                    o['duration'] = String(o['duration'] / 12)
                }
                // console.log(o['profileClass'].match(/\d+/gi));
                if (o['profileClass'].match(/\d+/gi)) {
                    // console.log('in if of profile class');
                    o['profileClass'] = Number(o['profileClass'].match(/\d+/gi)[0])
                }
                if (o['standingCharge'] && o['standingCharge'].match(/\d+/)) {
                    o['standingCharge'] = Number(o['standingCharge'].match(/\d+/)[0])
                }
                // console.log(o['Code'].match(/\D/gi));
                o['dayUnitRate'] = "null";
                o['eveningAndWeekendUnitRate'] = "null"
                o['nightUnitRate'] = "null"

                if (o['Code'].match(/\d+[A-Z]/gi)) {
                    let ch = o['Code'].match(/[A-Z]/gi)[0]
                    switch (ch) {
                        case 'D':
                            o['dayUnitRate'] = o['Unit Rate p/kWh']
                            break;
                        case 'E':
                            o['eveningAndWeekendUnitRate'] = o['Unit Rate p/kWh']
                            break;
                        case 'N':
                            o['nightUnitRate'] = o['Unit Rate p/kWh']
                            break;
                    }
                }

                if (parsedData.length > 0 && parsedData[parsedData.length - 1]['Code'].match(/\d+[A-Z]/gi) &&
                    o['Code'].match(/\d+[A-Z]/gi) &&
                    parsedData[parsedData.length - 1]['Code'].match(/\d+/gi)[0] == o['Code'].match(/\d+/gi)[0]) {
                    // console.log(parsedData[parsedData.length -1]['Code'] , "==" , o["Code"])

                    let ch = o['Code'].match(/[A-Z]/gi)[0]
                    switch (ch) {
                        case 'D':
                            parsedData[parsedData.length - 1]['dayUnitRate'] = o['Unit Rate p/kWh']
                            break;
                        case 'E':
                            parsedData[parsedData.length - 1]['eveningAndWeekendUnitRate'] = o['Unit Rate p/kWh']
                            break;
                        case 'N':
                            parsedData[parsedData.length - 1]['nightUnitRate'] = o['Unit Rate p/kWh']
                            break;
                    }
                } else {
                    parsedData.push(o)
                }
            });
            return parsedData;
        } catch (error) {
            console.log(error)
            return error
        }
    }
    async d_energiElectricParser(data, mapper) {
        try {
            // let mapper = {
            //     "PES":"distId",
            //     "Profile Class":"profileClass",
            //     "TariffName(Lookup)":null,
            //     "Term":"duration",
            //     "Start Month":"startDate",
            //     "TariffName":"",
            //     "LowerLimitValue":"minAQ",
            //     "UpperLimitValue":"maxAQ",
            //     "StandingCharge(p/day)":"standingCharge",
            //     "DayRate(p/day)":"dayUnitRate",
            //     "NightRate(p/day)":"nightUnitRate",
            //     "EveningOrWeekEndRate(p/day)":"eveningAndWeekendUnitRate",
            //     "CapacityCharge(p/month/kva)":null
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
                if (o['startDate'].includes('-')) {
                    o['startDate'] = String(o['startDate'].split('-')[0]).trim()
                }
                o['startDate'] = moment(o['startDate'], 'MMMM-YYYY"').format('DD-MM-YYYY')

                if (typeof o['duration'] == 'string' && o['duration'].match(/([0-9]+\s*month+)/gi)) {
                    let n = o['duration'].match(/([0-9]+\s*month+)/gi)[0];
                    n = Number(o['duration'].match(/\d+/gi)[0])
                    if (!isNaN(n)) {
                        o['duration'] = String(n / 12)
                    }
                } else {
                    o['duration'] = "N/A"

                }
                if (!o["dayUnitRate"])
                    o['dayUnitRate'] = "null"
                if (!o["nightUnitRate"])
                    o['nightUnitRate'] = "null"
                if (!o["eveningAndWeekendUnitRate"])
                    o['eveningAndWeekendUnitRate'] = "null"
                if (o['duration'] !== "N/A")
                    parsedData.push(o)

                if (typeof o['profileClass'] == 'string' && o['profileClass'].includes('-')) {
                    let [left, right] = o['profileClass'].match(/\d+/gi)
                    left = Number(left)
                    right = Number(right)
                    o['profileClass'] = left;

                    for (let i = left + 1; i <= right; i++) {
                        let temp = { ...o }
                        temp['profileClass'] = i
                        if (o['duration'] !== "N/A")

                            parsedData.push(temp)
                    }
                }
                // if(o['startDate']){
                // }

            });
            return parsedData;
        } catch (error) {
            console.log(error)
            return error
        }
    }
    async scottishPowerElectricParser(data, mapper) {
        try {

            // let mapper={
            //     "Key":null,
            //     "Utility":null,
            //     "DnoId":"distId",
            //     "ProfileClass":"profileClass",
            //     "RateStructure":"meterType",
            //     "Ldz":null,
            //     "ExitZone":null,
            //     "SaleType":"priceFor",
            //     "ContractDuration":"duration",
            //     "MinimumAnnualConsumption":"minAQ",
            //     "MaximumAnnualConsumption":"maxAQ",
            //     "MinimumContractStartDate":"startDate",
            //     "MaximumContractStartDate":null,
            //     "MinimumValidQuoteDate":null,
            //     "MaximumValidQuoteDate":null,
            //     "PaymentMethod":null,
            //     "ProductName":null,
            //     "StandingChargeType":null,
            //     "GreenEnergy":null,
            //     "Amr":null,
            //     "MinimumCreditScore":null,
            //     "MaximumCreditScore":null,
            //     "SetUplift":null,
            //     "StandingCharge":"standingCharge",
            //     "DayRate":"dayUnitRate",
            //     "NightRate":"nightUnitRate",
            //     "EveningWeekendRate":"eveningAndWeekendUnitRate",
            //     "UnitRate":null,
            //     "FixedContractEndDate":"endDate ",
            //     "Version":null,
            //     "TariffInformation1":null,
            //     "TariffInformation2":null,
            //     "TariffInformation3":null,
            //     "TariffInformation4":null,
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
                if (!o["dayUnitRate"])
                    o['dayUnitRate'] = "null"
                if (!o["nightUnitRate"])
                    o['nightUnitRate'] = "null"
                if (!o["eveningAndWeekendUnitRate"])
                    o['eveningAndWeekendUnitRate'] = "null"

                parsedData.push(o)
            });

            return parsedData;
        } catch (error) {
            console.log(error)
            return error
        }
    }
    async hubEnergyElectricParser(data, mapper) {  // supplier closed
        try {

            /*
            Business - FIX12 - Electricity - Day/Evening & Weekend
            Business - FIX12 - Electricity - Day/Night
            Business - FIX12 - Electricity - Day/Night/Evening & Weekend
            Business - FIX12 - Electricity - Single
            Business - FIX24 - Electricity - Day/Evening & Weekend
            Business - FIX24 - Electricity - Day/Night
            Business - FIX24 - Electricity - Day/Night/Evening & Weekend
            Business - FIX24 - Electricity - Single
            Business - FIX36 - Electricity - Day/Evening & Weekend
            Business - FIX36 - Electricity - Day/Night
            Business - FIX36 - Electricity - Day/Night/Evening & Weekend
            Business - FIX36 - Electricity - Single
            */

            // let mapper={
            //  "Price Book":null,
            //  "ProductType":null,
            //  "Dist ID":"distId",
            //  "Meter Type":"meterType",
            //  "Profile":"profileClass",
            //  "Product Bundle Bill Display":null,
            //  "Duration":"duration",
            //  "Payment Type":null,
            //  " Standing Charge ":"standingCharge",
            //  " Uni/Day Rate ":"dayUnitRate",
            //  " Night Unit Rate ":"nightUnitRate",
            //  " Evening and Weekend Rate ":"eveningAndWeekendUnitRate",
            //  " MinAQ ":"minAQ",
            //  " MaxAQ ":"maxAQ",
            //  "MinimumContractStartDate":"startDate",
            //  "MaximumContractStartDate":"endDate",
            //  "MinimumValidQuoteDate":null,
            //  "MaximumValidQuoteDate":null,
            //  "Tariff Name":null,
            //  "End date":null,
            //  "LDZ for Gas":null
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
                if (!isNaN(Number(o['dayUnitRate'])))
                    o['dayUnitRate'] = 100 * o['dayUnitRate']
                if (!isNaN(Number(o['nightUnitRate'])))
                    o['nightUnitRate'] = 100 * o['nightUnitRate']
                if (!isNaN(Number(o['eveningAndWeekendUnitRate'])))
                    o['eveningAndWeekendUnitRate'] = 100 * o['eveningAndWeekendUnitRate']

                parsedData.push(o)
            });

            return parsedData;
        } catch (error) {
            console.log(error)
            return error
        }
    }
    async utiliaElectricParser(data, mapper) {
        try {

            // let mapper={
            //     "FUEL":null,
            //     "REGION":null,
            //     "DNO AREA":"distId",
            //     "GSP AREA":null,
            //     "PROFILE CLASS":"profileClass",
            //     "TARIFF_NAME":"duration",
            //     "HELPER":null,
            //     "STANDING CHARGE":"standingCharge",
            //     "UNIT RATE":"dayUnitRate",
            //     "NIGHT RATE":"nightUnitRate",
            //     "EVENING/WEEKEND RATE":"eveningAndWeekendUnitRate",
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
                if (o['duration'].match(/(\d+\s*year)/gi)) {
                    o['duration'] = o['duration'].match(/(\d+\s*year)/gi)[0].match(/\d+/gi)[0]
                }
                if (!o["dayUnitRate"])
                    o['dayUnitRate'] = "null"
                if (!o["nightUnitRate"])
                    o['nightUnitRate'] = "null"
                if (!o["eveningAndWeekendUnitRate"])
                    o['eveningAndWeekendUnitRate'] = "null"
                parsedData.push(o)
            });

            return parsedData;
        } catch (error) {
            console.log(error)
            return error
        }
    }
    async coronaEnergyElectricParser(data, mapper) {
        try {

            // let mapper = {
            //     "Date Created":null,
            //     "On Sale From":"startDate",
            //     "On Sale To":null,
            //     "Supplier":null,
            //     "Partner":null,
            //     "Fuel":null,
            //     "Product Type":null,
            //     "Tariff Code":null,
            //     "Tariff Name":null,
            //     "Tariff Length Months":"duration",
            //     "Minimum Consumption kwh":"minAQ",
            //     "Maximum Consumption kwh":"maxAQ",
            //     "Supply Zone":"distId",
            //     "Profile":"profileClass",
            //     "Rate Structure":null,
            //     "Green Tariff":null,
            //     "Uplift Allowed":null,
            //     "First Supply Start Date":null,
            //     "Last Supply Start Date":null,
            //     "Payment Method":null,
            //     "Rate 1 pkwh":"dayUnitRate",
            //     "Rate 2 pkwh":"nightUnitRate",
            //     "Rate 3 pkwh":"eveningAndWeekendUnitRate",
            //     "Daily Charge pday":"standingCharge"
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
                if (supplyZoneToDistId[o['distId']]) {
                    o['distId'] = supplyZoneToDistId[o['distId']]
                }
                if (!o["dayUnitRate"])
                    o['dayUnitRate'] = "null"
                if (!o["nightUnitRate"])
                    o['nightUnitRate'] = "null"
                if (!o["eveningAndWeekendUnitRate"])
                    o['eveningAndWeekendUnitRate'] = "null"
                parsedData.push(o)
            });

            return parsedData;
        } catch (error) {
            console.log(error)
            return error
        }
    }

    async sseElectricParser(data, mapper) {
        try {
            // let mapper = {
            //     "TENDERID":"",
            //     "SSE Ref":"",
            //     "Contract_Start":"startDate",
            //     "Distributor":"distId",
            //     "Metering_System":"",
            //     "PROFILECODE":"profileClass",
            //     "SSE_Structure":"",
            //     "Period":"duration",
            //     "TCR Band":"",
            //     "Min Consumption":"minAQ",
            //     "Max Consumption":"maxAQ",
            //     "AMR Monthly Charge":"",
            //     "Non AMR Monthly Charge":"",
            //     "AMR Quarterly Charge":"",
            //     "Non AMR Quarterly Charge":"",
            //     "All Units":"",
            //     "Day Units":"dayUnitRate",
            //     "Evening and Weekend Units":"eveningAndWeekendUnitRate",
            //     "Night Units":"nightUnitRate",
            //     "Week Day Units":"",
            //     "All Year 00_00 - 07_00":"",
            //     "Non Week Day Units":"",
            //     "Off Peak Units":""
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
                if (o['distId'].match(/(\d+)/) && o['distId'].match(/(\d+)/).length > 0)
                    o['distId'] = Number(o['distId'].match(/(\d+)/)[0])

                if (o['All Units'] != null && o['All Units'] != "") {
                    o['dayUnitRate'] = Number(o['All Units'])
                    o['nightUnitRate'] = Number(o['All Units'])
                    o['eveningAndWeekendUnitRate'] = Number(o['All Units'])
                }
                if (o['profileClass'])
                    o['profileClass'] = Number(o['profileClass'])
                if (!o["dayUnitRate"])
                    o['dayUnitRate'] = "null"
                if (!o["nightUnitRate"])
                    o['nightUnitRate'] = "null"
                if (!o["eveningAndWeekendUnitRate"])
                    o['eveningAndWeekendUnitRate'] = "null"
                parsedData.push(o)
            });

            return parsedData;
        } catch (error) {
            console.log(error)
            return error
        }
    }

    async EDFEnergyGasParser(data, mapper) {
        try {
            //     let mapper  = {
            //             "Min EAC Threshold":"minAQ",
            //             "Max EAC Threshold":"maxAQ",
            //             "Min Selling Window Days":null,
            //             "Max Selling Window Days":null,
            //             "Region":"distId",
            //             "Meter":null,
            //             "Contract":null,
            //             "Contract Length Months":"duration",
            //             "Rank":null,
            //             "Standing Charge £/day":"standingCharge",
            //             "Day":"dayUnitRate",
            //             "Night":"nightUnitRate",
            //             "Evening / Weekend":"eveningAndWeekendUnitRate",
            //             "Commission Uplift p/KWH":null,
            //             "SAP Product":null,
            //             "Contract Review date":null,
            //             "Credit score availability":null,
            //             "DD Discount Effective Standing Charge (£ Per Day)":null,
            //             "DD Discount Effective Day":null,
            //             "DD Discount Effective Night":null,
            //             "DD Discount Effective Evening / Weekend":null,
            //             "ProductName":null,
            //             "EAC Band":null,
            //             "Selling Window":null
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
                if (o['distId'].match(/(\d+)/) && o['distId'].match(/(\d+)/).length > 0)
                    o['distId'] = Number(o['distId'].match(/(\d+)/)[0])



                if (Number(o["dayUnitRate"]) <= 0)
                    o['dayUnitRate'] = "null"
                if (Number(o["nightUnitRate"]) <= 0)
                    o['nightUnitRate'] = "null"
                if (Number(o["eveningAndWeekendUnitRate"]) <= 0)
                    o['eveningAndWeekendUnitRate'] = "null"
                parsedData.push(o)
            });

            return parsedData;
        } catch (error) {
            console.log(error)
            return error
        }
    }

    async TotalGasAndPowerElectricParser(data, mapper) {
        try {
            // let mapper = {
            //     "Pricebook Version": null,
            //     "Window Open": "startDate",
            //     "Window Close": "endDate",
            //     "Region (PES)": "distId",
            //     "Profile Class": "profileClass",
            //     "Meter Type": "meterType",
            //     "Dummy MPAN Description": null,
            //     "Sales Type": "priceFor",
            //     "Contract Duration": "duration",
            //     "Consumption Range": null,
            //     "Standing Charge": "standingCharge",
            //     "Payment Method": null,
            //     "Price Line Description": null,
            //     "Unit Charge": "dayUnitRate",
            //     "Unit Type": null
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
                if (String(o['distId']).match(/(\d+)/) && String(o['distId']).match(/(\d+)/).length > 0)
                    o['distId'] = Number(String(o['distId']).match(/(\d+)/)[0])
                o['standingCharge']=0
                if(Number(o["dayUnitRate"]) >= 0 ) {

                    o['dayUnitRate'] = Number(o["dayUnitRate"]) 
                    o['nightUnitRate'] =Number(o["dayUnitRate"]) 
                    o['eveningAndWeekendUnitRate'] = Number(o["dayUnitRate"]) 
                } else{
                    o['dayUnitRate'] = "null"
                    o['nightUnitRate'] = "null"
                    o['eveningAndWeekendUnitRate'] = "null"
                }        
                parsedData.push(o)
            });

            return parsedData;
        } catch (error) {
            console.log(error)
            return error
        }
    }

    async DRAXElectricParser(data, mapper) {
        try {
            // let mapper = {
            //     "Area": "distId",
            //     "Day Rate p/kWh": "dayUnitRate",
            //     "Duration (months)": "duration",
            //     "EAC Banding (kWh)": "maxAQ",
            //     "Eve/Weekend Rate p/kWh": "eveningAndWeekendUnitRate",
            //     "Meter Type": null,
            //     "Night Rate p/kWh": "nightUnitRate",
            //     "Product": null,
            //     "Profile Class": "profileClass",
            //     "Rate Structure": null,
            //     "SSD": "startDate",
            //     "Single Rate p/kWh": null,
            //     "Standing Charge p/day": "standingCharge"
            // }

            let parsedData = [];
            let prevDuration = null;
            let prevProfileClass = null;
            let prevDistId=null;
            let prevStartDate=null;

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
                
                if (!isNaN(Number(o['duration'])) && o['duration'] !== null) {
                    o['duration'] = String(Number(o['duration']) / 12)
                    prevDuration = o['duration']
                }else if(prevDuration)
                    o['duration'] = prevDuration

                if (Number(o['distId'])){
                    o['distId'] = Number(o['distId'])
                    prevDistId = o['distId']
                }else if(prevDistId)
                    o['distId'] = prevDistId

                if(o['startDate']){
                    
                    o['startDate'] = new Date(moment(moment(o['startDate']),'DD/MM/YY'))
                    prevStartDate = o['startDate']
                }else
                    o['startDate'] = prevStartDate

                o['maxAQ'] = Number(o['maxAQ'])

                    if (Number(o['profileClass'])){
                        o['profileClass'] = Number(o['profileClass'])
                        prevProfileClass = o['profileClass']
                    }else if(prevProfileClass)
                        o['profileClass'] = prevProfileClass 

                if(Number(o['standingCharge']))
                o['standingCharge'] = Number(o['standingCharge'])
                else 
                o['standingCharge']=0

                if(Number(o["dayUnitRate"]))
                    o['dayUnitRate'] = Number(o["dayUnitRate"]) 
                if(Number(o["nightUnitRate"]))
                    o['nightUnitRate'] =Number(o["nightUnitRate"]) 
                if(Number(o["eveningAndWeekendUnitRate"]))
                    o['eveningAndWeekendUnitRate'] = Number(o["eveningAndWeekendUnitRate"]) 
                parsedData.push(o)
            });

            return parsedData;
        } catch (error) {
            console.log(error)
            return error
        }
    }
}

module.exports = ElectricSupplierParser