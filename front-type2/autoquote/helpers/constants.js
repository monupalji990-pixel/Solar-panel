let id_mapper = null;
let distIdMapper = null;
let distIdToLdzMapper = null;
let supplyZoneToDistId = null;

if (process.env.NODE_ENV === 'production') {
    console.log('id_mapper of production');

    id_mapper = {
        AVANTI_GAS_SUPPLIER_ID: "5dd2d491b3425e2ec2cc66ee",
        SMARTEST_ENERGY_SUPPLIER_ID: "5dcea842b3425e2ec2cc66d9",
        GAZPROM_SUPPLIER_ID: "5e20343da7f1b06e99acd802",
        SSE_SUPPLIER_ID: '5e1df93ea7f1b06e99acd7f3',
        UGP_SUPPLIER_ID: '60240ca63c5a0d64365c05ed',
        D_ENERGI_SUPPLIER_ID: '5fa2c63fbaca937da344c27f',
        CNG_SUPPLIER: '5dd2e52fb3425e2ec2cc66f0',
        SCOTTISH_POWER_SUPPLIER_ID: '5ddd518d0b27c84569ed4005',
        HUB_ENERGY_SUPPLIER_ID: '5dd3f96bb3425e2ec2cc66f5',
        UTILITA_SUPPLIER_ID: '5dde62060b27c84569ed4007',
        CORONA_ENERGY_SUPPLIER_ID: '5dd6c441b3425e2ec2cc6706',
        EDF_ENERGY_SUPPLIER_ID: '5ef1dce61a8ca62860e0a578',
        BGLITE_SUPPLIER_ID: '60115448508e4a78870f3986',
        TOTAL_GAS_AND_POWER_SUPPLIER_ID:'5dde667a0b27c84569ed4009',
        DRAX_SUPPLIER_ID:'5dd2e5f6b3425e2ec2cc66f1'
    }

} else {
    console.log('id_mapper of staging');
    id_mapper = {
        AVANTI_GAS_SUPPLIER_ID: "60d9908f75ab2f0014573549",
        SMARTEST_ENERGY_SUPPLIER_ID: "60d991e675ab2f001457354b",
        GAZPROM_SUPPLIER_ID: "60d9921875ab2f001457354d",
        SSE_SUPPLIER_ID: '60d9923075ab2f001457354f',
        UGP_SUPPLIER_ID: '60d9924e75ab2f0014573551',
        D_ENERGI_SUPPLIER_ID: '60d9926675ab2f0014573553',
        CNG_SUPPLIER: '60d9929475ab2f0014573555',
        SCOTTISH_POWER_SUPPLIER_ID: '60f52f8bb0b9e95d972936d0',
        HUB_ENERGY_SUPPLIER_ID: '61090c1bf9e0814df1823e33',
        UTILITA_SUPPLIER_ID: '6109291881abee7ec82941d6',
        CORONA_ENERGY_SUPPLIER_ID: '610a62fbab260912486c384f',
        EDF_ENERGY_SUPPLIER_ID: '618a2a83b7a0417b1926c99e',
        BGLITE_SUPPLIER_ID: '618cfb103f1a47597f761f13',
        TOTAL_GAS_AND_POWER_SUPPLIER_ID:'5dde667a0b27c84569ed4009',
        DRAX_SUPPLIER_ID:'6257e02836f4af7eb44b1482'
    }
}


let distinctArea = ['EA', 'EM', 'LC', 'LO', 'LS', 'LT', 'NE', 'NO', 'NT', 'NW', 'SC', 'SE', 'SO', 'SW', 'WM', 'WN', 'WS']

distIdMapper = {
    10: "East England",  //EA
    11: "East Midlands", //EM
    12: "London", //NT   -
    13: "North Wales, Merseyside and Cheshire", //NW
    14: "West Midlands", //WM
    15: "North East England", //NO
    16: "North West England", //NW
    17: "North Scotland", //SC
    18: "Central and Southern Scotland",//SC
    19: "South East England", //SE
    20: "Southern England", //SO
    21: "South Wales", //WA
    22: "South West England", //SW
    23: "Yorkshire", //NE
}

distIdToLdzMapper = {
    10: "EA",
    11: "EM",
    12: "NT",
    13: "WN",
    14: "WM",
    15: "NO",
    16: "NW",
    17: "SC",
    18: "SC",
    19: "SE",
    20: "SO",
    21: "WS",
    22: "SW",
    23: "NE"
}

supplyZoneToDistId = {
    '_A': 10,
    '_B': 11,
    '_C': 12,
    '_D': 13,
    '_E': 14,
    '_F': 15,
    '_G': 16,
    '_P': 17,
    '_N': 18,
    '_J': 19,
    '_H': 20,
    '_K': 21,
    '_L': 22,
    '_M': 23
}


let ldzToAbbreviations = {
    "Scotland": "SC",  //17,18 (North , South,Scottish Hydro Electric) //17 (Scottish Hydro Electric)  18 (Scottish Power)
    "Northern": "NO",  //15  (North East England)
    "North West": "NW",  //16  (Norweb)
    "North East": "NE",  //23  (Yorkshire)
    "East Midlands": "EM",  //11
    "West Midlands": "WM",  //14  (Midlands)
    "Wales North": "WN",  //13  (North Wales / Cheshire / Manweb)
    "Wales South": "WS",  //21  (South Wales Electricity)
    "Eastern": "EA",  //10  (East england)
    "North Thames": "NT",  //12  (London)
    "South East": "SE",  //19  (SEEBOARD)
    "Southern": "SO",  //20  (Southern Electric)
    "South West": "SW"   //22
}

const DAY_MT = 1
const NIGHT_MT = 2
const EVE_WKD = 3
const DAY_NIGHT_MT = 12
const DAY_EVE_WKD = 13
const NIGHT_EVE_WKD = 23
const THREE_MT = 123

let distMapper = new Map();

distMapper.set(10, new Map([
    [1, new Map([[801, DAY_MT]])],
    [2, new Map([[807, DAY_NIGHT_MT], [811, DAY_NIGHT_MT], [864, DAY_NIGHT_MT], [865, DAY_NIGHT_MT],])],
    [3, new Map([[801, DAY_MT], [136, DAY_EVE_WKD]])],
    [4, new Map([[100, DAY_EVE_WKD], [807, DAY_EVE_WKD], [808, DAY_EVE_WKD], [809, DAY_EVE_WKD], [811, DAY_EVE_WKD], [812, DAY_EVE_WKD], [100.1, DAY_NIGHT_MT], [138, THREE_MT], [139, THREE_MT], [108, NIGHT_MT], [608, NIGHT_MT], [632, NIGHT_MT]])],
    [5, new Map([[801, DAY_MT], [802, DAY_MT], [807, DAY_NIGHT_MT], [808, DAY_NIGHT_MT]])],
    [0, new Map([[845, DAY_NIGHT_MT], [900, DAY_NIGHT_MT], ['LC-86', 'CT Only'], ['LC-200', 'Non-CT Only']])],

]))

distMapper.set(11, new Map([
    [1, new Map([[801, DAY_MT]])],
    [2, new Map([[811, DAY_NIGHT_MT], [830, DAY_NIGHT_MT], [526, NIGHT_MT]])],
    [3, new Map([[801, DAY_MT], [29, DAY_EVE_WKD], [826, DAY_EVE_WKD]])],
    [4, new Map([[811, DAY_NIGHT_MT], [812, DAY_NIGHT_MT], [830, DAY_NIGHT_MT], [31, THREE_MT], [32, THREE_MT], [828, THREE_MT], [516, NIGHT_MT]])],
    [5, new Map([[801, DAY_MT], [816, DAY_NIGHT_MT], [817, DAY_NIGHT_MT]])],
    [0, new Map([[845, DAY_NIGHT_MT], [900, DAY_NIGHT_MT], ['LC-89', 'CT Only'], ['LC-990', 'CT Only'], ['LC-247', 'Non-CT Only']])]
]))

distMapper.set(12, new Map([
    [1, new Map([[801, DAY_MT]])],
    [2, new Map([[805, DAY_NIGHT_MT], [811, DAY_NIGHT_MT], [865, DAY_NIGHT_MT], [31, NIGHT_MT], [53, NIGHT_MT]])],
    [3, new Map([[801, DAY_MT], [5, DAY_EVE_WKD], [6, DAY_EVE_WKD], [7, DAY_EVE_WKD]])],
    [4, new Map([[807, DAY_NIGHT_MT], [811, DAY_NIGHT_MT], [517, NIGHT_MT], [521, NIGHT_MT]])],
    [5, new Map([[801, DAY_MT], [807, DAY_NIGHT_MT], [808, DAY_NIGHT_MT]])],
    [0, new Map([[845, DAY_NIGHT_MT], [900, DAY_NIGHT_MT], ['LC-9', 'CT Only'], ['LC-200', 'Non-CT Only']])]
]))

distMapper.set(13, new Map([
    [1, new Map([[801, DAY_MT]])],
    [2, new Map([[811, DAY_NIGHT_MT], [512, NIGHT_MT]])],
    [3, new Map([[801, DAY_MT]])],
    [4, new Map([[9, DAY_NIGHT_MT], [811, DAY_NIGHT_MT], [812, DAY_NIGHT_MT], [43, THREE_MT], [44, THREE_MT], [512, NIGHT_MT], [516, NIGHT_MT]])],
    [5, new Map([[801, DAY_MT], [807, DAY_NIGHT_MT], [808, DAY_NIGHT_MT]])],
    [0, new Map([[845, DAY_NIGHT_MT], [900, DAY_NIGHT_MT], ['LC-511', 'CT Only'], ['LC-591', 'CT Only'], ['LC-280', 'Non CT Only']])]
]))

distMapper.set(14, new Map([
    [1, new Map([[801, DAY_MT]])],
    [2, new Map([[811, DAY_NIGHT_MT], [534, NIGHT_MT], [538, NIGHT_MT]])],
    [3, new Map([[801, DAY_MT], [31, DAY_EVE_WKD]])],
    [4, new Map([[811, DAY_NIGHT_MT], [812, DAY_NIGHT_MT], [532, NIGHT_MT], [536, NIGHT_MT]])],
    [5, new Map([[801, DAY_MT], [807, DAY_NIGHT_MT], [808, DAY_NIGHT_MT]])],
    [0, new Map([[900, DAY_NIGHT_MT], ['LC-27', 'CT Only'], ['LC-129', 'CT Only'], ['LC-633', 'Non CT Only']])]
]))

distMapper.set(15, new Map([
    [1, new Map([[801, DAY_MT]])],
    [2, new Map([[529, DAY_NIGHT_MT], [531, DAY_NIGHT_MT], [807, DAY_NIGHT_MT], [511, NIGHT_MT]])],
    [3, new Map([[801, DAY_MT], [43, DAY_EVE_WKD]])],
    [4, new Map([[807, DAY_NIGHT_MT], [808, DAY_NIGHT_MT], [511, NIGHT_MT]])],
    [5, new Map([[801, DAY_MT], [807, DAY_NIGHT_MT], [808, DAY_NIGHT_MT]])],
    [0, new Map([[845, DAY_NIGHT_MT], [900, DAY_NIGHT_MT], ['LT-251', 'CT Only'], ['LT-278', 'Non CT Only']])],
]))

distMapper.set(16, new Map([
    [1, new Map([[801, DAY_MT]])],
    [2, new Map([[811, DAY_NIGHT_MT], [832, DAY_NIGHT_MT], [511, NIGHT_MT]])],
    [3, new Map([[801, DAY_MT], [19, DAY_EVE_WKD]])],
    [4, new Map([[811, DAY_NIGHT_MT], [812, DAY_NIGHT_MT], [5, THREE_MT], [511, NIGHT_MT]])],
    [5, new Map([[801, DAY_MT], [807, DAY_NIGHT_MT], [808, DAY_NIGHT_MT]])],
    [0, new Map([[845, DAY_NIGHT_MT], [900, DAY_NIGHT_MT], ['LT-801', 'CT Only'], ['LT-831', 'Non CT Only']])],
]))

distMapper.set(17, new Map([
    [1, new Map([[801, DAY_MT]])],
    [2, new Map([[89, DAY_NIGHT_MT], [12, DAY_NIGHT_MT], [519, NIGHT_MT], [641, NIGHT_MT]])],
    [3, new Map([[801, DAY_MT], [94, DAY_EVE_WKD]])],
    [4, new Map([[89, DAY_NIGHT_MT], [531, NIGHT_MT], [561, NIGHT_MT], [658, NIGHT_MT],])],
    [5, new Map([[801, DAY_MT], [100, DAY_NIGHT_MT], [900, DAY_NIGHT_MT]])],
    [0, new Map([[845, DAY_NIGHT_MT], [900, DAY_NIGHT_MT], ['LC-500', 'CT Only'], ['LC-507', 'Non CT Only']])],
]))

distMapper.set(18, new Map([
    [1, new Map([[801, DAY_MT]])],
    [2, new Map([[588, DAY_NIGHT_MT], [624, NIGHT_MT], [628, NIGHT_MT], [676, NIGHT_MT],])],
    [3, new Map([[801, DAY_MT], [826, DAY_EVE_WKD]])],
    [4, new Map([[1, DAY_NIGHT_MT], [3, DAY_NIGHT_MT], [588, DAY_NIGHT_MT], [522, DAY_NIGHT_MT]])],
    [5, new Map([[801, DAY_MT], [874, DAY_NIGHT_MT]])],
    [0, new Map([[845, DAY_NIGHT_MT], [900, DAY_NIGHT_MT], ['LC-500', 'CT Only'], ['LC-504', 'CT Only'], ['LC-280', 'Non CT Only']])]
]))

distMapper.set(19, new Map([
    [1, new Map([[801, DAY_MT]])],
    [2, new Map([[16, DAY_NIGHT_MT], [811, DAY_NIGHT_MT], [585, NIGHT_MT]])],
    [3, new Map([[801, DAY_MT]])],
    [4, new Map([[16, DAY_NIGHT_MT], [811, DAY_NIGHT_MT], [812, DAY_NIGHT_MT], [67, THREE_MT], [68, THREE_MT], [829, THREE_MT], [535, NIGHT_MT]])],
    [5, new Map([[801, DAY_MT], [66, DAY_NIGHT_MT], [807, DAY_NIGHT_MT], [808, DAY_NIGHT_MT]])],
    [0, new Map([[845, DAY_NIGHT_MT], [900, DAY_NIGHT_MT], ['LC-550', 'CT Only'], ['LC-200', 'Non CT Only']])]
]))

distMapper.set(20, new Map([
    [1, new Map([[801, DAY_MT]])],
    [2, new Map([[44, DAY_NIGHT_MT], [803, DAY_NIGHT_MT], [805, DAY_NIGHT_MT], [578, NIGHT_MT], [609, NIGHT_MT], [633, NIGHT_MT]])],
    [3, new Map([[801, DAY_MT], [104, DAY_EVE_WKD], [105, DAY_EVE_WKD]])],
    [4, new Map([[44, DAY_NIGHT_MT], [45, DAY_NIGHT_MT], [65, DAY_NIGHT_MT], [108, THREE_MT], [109, THREE_MT], [110, THREE_MT], [111, THREE_MT], [576, NIGHT_MT]])],
    [5, new Map([[801, DAY_MT], [807, DAY_NIGHT_MT], [808, DAY_NIGHT_MT]])],
    [0, new Map([[845, DAY_NIGHT_MT], [900, DAY_NIGHT_MT], ['LC-453', 'CT Only'], ['LC-470', 'CT Only'], ['LC-457', 'Non CT Only']])],
]))

distMapper.set(21, new Map([
    [1, new Map([[801, DAY_MT]])],
    [2, new Map([[809, DAY_NIGHT_MT], [811, DAY_NIGHT_MT]])],
    [3, new Map([[801, DAY_MT], [220, DAY_EVE_WKD]])],
    [4, new Map([[811, DAY_NIGHT_MT], [603, NIGHT_MT]])],
    [5, new Map([[801, DAY_MT], [816, DAY_NIGHT_MT]])],
    [0, new Map([[845, DAY_NIGHT_MT], [900, DAY_NIGHT_MT], ['LC-300', 'CT Only'], ['LC-117', 'Non CT Only']])],
]))

distMapper.set(22, new Map([
    [1, new Map([[801, DAY_MT]])],
    [2, new Map([[41, DAY_NIGHT_MT], [807, DAY_NIGHT_MT], ['LC-430', NIGHT_MT]])],
    [3, new Map([[801, DAY_MT]])],
    [4, new Map([[807, DAY_NIGHT_MT], [808, DAY_NIGHT_MT], [874, DAY_NIGHT_MT], [56, THREE_MT], [60, THREE_MT], [574, NIGHT_MT]])],
    [5, new Map([[801, DAY_MT], [23, DAY_NIGHT_MT], [803, DAY_NIGHT_MT], [804, DAY_NIGHT_MT]])],
    [0, new Map([[845, DAY_NIGHT_MT], [900, DAY_NIGHT_MT], ['LC-570', 'CT Only'], ['LC-203', 'Non CT Only']])],
]))

distMapper.set(23, new Map([
    [1, new Map([[801, DAY_MT]])],
    [2, new Map([[811, DAY_NIGHT_MT], [530, NIGHT_MT]])],
    [3, new Map([[801, DAY_MT], [826, DAY_EVE_WKD]])],
    [4, new Map([[811, DAY_NIGHT_MT], [812, DAY_NIGHT_MT], [814, DAY_NIGHT_MT], [828, THREE_MT], [829, THREE_MT], [522, NIGHT_MT], [530, NIGHT_MT], [532, NIGHT_MT], [533, NIGHT_MT], [534, NIGHT_MT]])],
    [5, new Map([[801, DAY_MT], [807, DAY_NIGHT_MT], [808, DAY_NIGHT_MT]])],
    [0, new Map([[845, DAY_NIGHT_MT], [900, DAY_NIGHT_MT], ['LC-281', 'CT Only'], ['LC-299', 'Non CT Only']])]
]))

// console.log(Array.from(distMapper.keys()))
// Array.from(distMapper.keys()).forEach(distid => {
// console.log(distid,'---------------')
//     Array.from(distMapper.get(distid).keys()).forEach(pc => {
//         let key = distMapper.get(distid).get(pc).keys()
//         console.log(pc,Array.from(key).length)
//     })
// });
module.exports = { constants: id_mapper, distIdToLdzMapper, supplyZoneToDistId, distMapper, DAY_MT, DAY_EVE_WKD, DAY_NIGHT_MT, NIGHT_MT, EVE_WKD, THREE_MT, NIGHT_EVE_WKD }