const mongoose = require('mongoose');
let { ObjectId } = mongoose.Schema.Types;

export interface RenewalInterface {
    RenewalID: string,
    LinkedQuote: string,
    Lead: string
    Company: string
    Consumer: string
    Site: string
    User: Array<string>,
    Assignee: string,
    createdBy: string,
    service: any,
    serviceType: string,
    isActive: boolean
    isBlock: boolean
    isDelete: boolean
    Status: number,
    Invoiced: string,
    Price: string,
    notes: string,
    Amount: number,
    contractLength: string,
    contractLengthDate: any
    contractAcceptDate: Date
    expiryDate: string,
    StatusHistory: any
    RenewalHistory: [],
    BlockedBy: string,
    Supplier: string,
    Notes: [
        {
            addedBy: string
            notes: string,
            attachment: any,
            timestamps: Number,
            createdAt: Date
        }
    ]
}
const RenewalSchema = new mongoose.Schema({
    RenewalID: { type: String, index: true },
    LinkedQuote: {
        type: ObjectId,
        ref: 'Quotes'
    },
    Lead: {
        type: ObjectId,
        ref: 'Lead',
        index: true
    },
    Company: {
        type: ObjectId,
        ref: 'Company',
        index: true
    },
    Consumer: {
        type: ObjectId,
        ref: 'User',
        index: true
    },
    Site: {
        type: ObjectId,
        ref: 'Site'
    },
    User: [
        {
            type: ObjectId,
            ref: 'User'
        }
    ],
    Assignee: {
        type: ObjectId,
        ref: 'User'
    },
    createdBy: {
        type: ObjectId,
        ref: 'User'
    },
    service: {
        gas: {
            "meterNumber": { type: String, index: true },
            "meterNumberTwo":String,
            "accountNumber": String,
            "meterSerialNumber": String,
            "COT": String,
            "previous_contract_length": String,
            "contract_length": String,
            "meterType": String,
            "dailyCharges": String,
            "unitRate": String,
            "kWH": String,
            "contract_start_date": Number,
            "contract_end_date": Number,
            "previous_contract_start_date": Number,
            "no_of_days": String,
            "bill_date_type": String,
            "bill_start_date": Number,
            "bill_end_date": Number,
            "postcode": String,
            "onlineAccountUserName": String,
            "onlineAccountPassword": String
        },
        electric: {
            "topLine": String,
            "meterNumber": { type: String, index: true },
            "topLineTwo": String,
            "meterNumberTwo": String,
            "accountNumber": String,
            "onlineAccountUserName": String,
            "onlineAccountPassword": String,
            "meterSerialNumber": String,
            "COT": String,
            "previous_contract_length": String,
            "contract_length": String,
            "contract_start_date": Number,
            "contract_end_date": Number,
            "previous_contract_start_date": Number,
            "dailyCharges": String,
            "unitDayRate": String,
            "unitDaykWh": String,
            "unitNightRate": String,
            "unitNightkWH": String,
            "unitWkdRate": String,
            "unitWkdkWh": String,
            "unitWinterRate": String,
            "unitWinterkWH": String,
            "bill_date_type": String,
            "no_of_days": String,
            "bill_start_date": Number,
            "bill_end_date": Number,
        },
        water: {
            "WaterSupplier": String,
            "SewageApidRates": String,
            "WaterCorespId": String,
            "CoreSpidRates": String,
            "previous_contract_length": String,
            "previous_contract_start_date": Number,
            "contract_length": String,
            "contract_start_date": Number,
            "contract_end_date": Number,
            "SewageSpid": String,
            "WaterMeterSN": String,
            "WaterAnnualSpend": String,
            "WaterDiscount": String,
            "WaterRenewalDate": Number,
            "accountNumber": String
        },
        chipAndPin: {
            "MachineType": String,
            "PDQFinanceStatus": String,
            "NumberTerminals": String,
            "ProviderRefNumber": String,
            "MerchantRental": String,
            "Package": String,
            "AnalyticsCost": String,
            "CreditCardRate": String,
            "DebitCardRate": String,
            "BusinessCardRate": String,
            "DeploymentCost": String,
            "AuthorizationFee": String,
            "PCIDSSCharge": String,
            "previous_contract_length": String,
            "contract_length": String,
            "contract_start_date": Number,
            "contract_end_date": Number,
            "previous_contract_start_date": Number,
            "ConnectionType": String,
            "DeliveryDate": String,
            "FirstTransactionDate": Number,
            "RenewalDate": Number,
            "PCIDSSUserName": String,
            "PCIDSSPassword": String,
            "PCIComplaintDate": Number,
            "midNumber": { type: String, index: true },
            "tidNumber":[],
            "accountNumber": String
        },
        telecoms: {
            "PhoneNumber1": String,
            "PhoneNumber2": String,
            "PhoneNumber3": String,
            "PhoneNumber4": String,
            "PhoneRange4": String,
            "PhoneNumber5": String,
            "PhoneRange5": String,
            "PhoneNumber6": String,
            "PhoneRange6": String,
            "status": String,
            'connectionType': String,
            "LineRental": String,
            "ConnectionCharges": String,
            "CashAmount": String,
            "AddExtras": String,
            "Extras": Object,
            "previous_contract_length": String,
            "contract_length": String,
            "contract_start_date": Number,
            "contract_end_date": Number,
            "previous_contract_start_date": Number,
            "TelecomsLiveDate": Number,
            "TelecomsRenewalDate": Number,
            "accountNumber": String,
            "WholeSaleProvider": String,
            "cust_id":String
        },
        broadband: {
            "Products": String,
            "Rental": String,
            "ConnectionCharges": String,
            "RouterPrice": Number,
            "status": String,
            "previous_contract_length": String,
            "contract_length": String,
            "contract_start_date": Number,
            "contract_end_date": Number,
            "previous_contract_start_date": Number,
            "UserName": String,
            "Password": String,
            "IPAddress": String,
            "RouterModel": String,
            "SerialNumber": String,
            "ProgrammedDate": Number,
            "BroadbandPostageProof": String,
            "BroadbandLiveDate": Number,
            "BroadbandRenewalDate": Number,
            "accountNumber": String,
            "WholeSaleProvider": String,
            "wifi_name":String,
            "wifi_password":String
        },
        energy: {
            "EAnnualCost": String,
            "currentTariff": String,
            "economy": String,
            "contractReviewOption":String,
            "EMonthlyCost": String,
            "GAnnualCost": String,
            "GMonthlyCost": String,
            "electricAnnual": String,
            "gasAnnual": String,
            "paymentOption": String,
            "warmHomeDiscount": String,
            "pcode": String,
            "newSupplier": String,
            "newTariff": String,
            "contract_length": String,
            "contract_start_date": Number,
            "contract_end_date": Number,
            "previous_contract_start_date": Number
        },
        funeral: {
            "funeralProvider": String,
            "name": String,
            "phone": String,
            "email": String,
            "address": String,
            "funeralType": String,
            "planType": String,
            "paymentType": String,
            "PaymentPlan": String,
            "specialRequest": String,
            "contract_length": String,
            "contract_start_date": Number,
            "contract_end_date": Number,
        },
        mortgage: {
            "estateAgent": {
                "EAcompanyName": String,
                "EAphoneNumber": String,
                "EAemail": String,
                "EAnameOfContact": String
            },
            "solicitors": {
                "ScompanyName": String,
                "SphoneNumber": String,
                "Semail": String,
                "SnameOfContact": String
            },
            "lender": {
                "LcompanyName": String,
                "LphoneNumber": String,
                "Lemail": String,
                "LnameOfContact": String
            },
            "addproperty": String,
            "morgage_type": String,
            "phone": String,
            "email": String,
            "phoneNumber": String,
            "companyName": String,
            "nameOfContact": String,
            "propertyValue": String,
            "deposit": String,
            "loanValue": String,
            "creditScore": String,
            "valuationDate": Number,
            "cValuation": String,
            "dateOffer": Number,
            "contract_exchange_date": Number,
            "completionDate": Number,
            "lifeInsurance": String,
            "criticalIllness": String,
            "homeInsurance": String,
            "funeralPlan": String,
            "contract_length": String,
            "contract_start_date": Number,
            "contract_end_date": Number,
        },
        waste: {
            'wasteType': String,
            'EwcCode': Number,
            'containerType': String,
            'monthlyDD': String,
            'numberOfContainers': Number,
            'chargePerLift': Number,
            'dailyRental': Number,
            'serviceFrequency': String,
            'deliveryCharge': Number,
            'WasteTransferNoteComplainceCharge': Number,
            'assumedWeight': Number,
            'totalMonthlyCost': Number,
            'previous_contract_length': String,
            'previous_contract_start_date': Number,
            'contract_length': String,
            'contract_start_date': Number,
            'contract_end_date': Number
        },
        insurance: {
            'insuranceType': String,
            'insuranceProduct': Object,
            'typeOfBusiness': String,
            'contactNumber': Number,
            'email': String,
            'previous_contract_length': String,
            'previous_contract_start_date': Number,
            'contract_length': String,
            'contract_start_date': Number,
            'contract_end_date': Number
        },
        businessrates: {
            'previous_contract_length': String,
            'previous_contract_start_date': Number,
            'contract_length': String,
            'contract_start_date': Number,
            'contract_end_date': Number,
            'insurance': String,
            'passportNumber': String,
            'typeOfBusinessRatesWork': {
                type: Array,
                default: undefined
            },
            'localAuthorityRefNumber': Number,
            'currentRateableValue': Number,
            'businessRatesAccountNo': Number,
            'businessRatesBill': String,
            'ratesReliefCompletedForm': String,
            'britishPassport': String,
            'homeProof': String,
            'propertyLayoutDiagram': String,
            'sitePhotos': String,
            'lease': String,
            'directorStatement': String,
            'directorDetails': String
        },
        debt:{
            "previous_contract_length": String,
            "contract_length": String,
            "contract_start_date": Number,
            "contract_end_date": Number,
            "previous_contract_start_date": Number,
            "full_name":String,
            "dob":Date,
            "address":String,
            "businessName":String,
            "businessAddress":String
        },
        telecomandbroadband:{
            IPAddress: String,
            Multiline_PhoneNumber: Number,
            Password: String,
            PhoneNumber: Number,
            UserName: String,
            additional_handsets: Number,
            broadband_number: String,
            contract_end_date: Number,
            contract_length: String,
            contract_start_date: Number,
            divertsCost: String,
            extraMultiLine: String,
            multiline: String,
            multilineCost: Number,
            number_of_handset: Number,
            overall_customer_cost: Number,
            phoneSystem: String,
            products: String,
            provider: String,
            router: String,
            oneOffCharge: Number,
            costOfExtras: Number,
            noOfRouter: Number,
        }
    },
    debtpayments:[{
        title:String,
        amount:Number,
        paymentDueDate:Date
    }], // for debt service
    serviceType: { type: String, index: true },
    beforemonths:{type:Number},
    isActive: {
        type: Boolean,
        default: 1
    },
    isBlock: {
        type: Boolean,
        default: 0
    },
    isDelete: {
        type: Boolean,
        default: false
    },
    Status: { type: String, index: true },
    Invoiced: String,
    Price: { type: String, index: true },
    notes: String,
    Amount: { type: Number, index: true },
    contractLength: String,
    contractLengthDate: {
        type: Date,
        default: ''
    },
    contractAcceptDate: {
        type: Date,
        default: Date.now
    },
    expiryDate: String,
    StatusHistory: [
        {
            User: {
                type: ObjectId,
                ref: 'User'
            },
            invoice: {
                name: String,
                value: String,
                type: ''
            },
            status: String,
            notes: String,
            timestamps: Number,
            negotiation: {}
        }
    ],
    RenewalHistory: [],
    BlockedBy: {
        type: ObjectId,
        ref: 'User'
    },
    Supplier: {
        type: ObjectId,
        ref: 'Supplier'
    },
    Notes: [
        {
            addedBy: {
                type: ObjectId,
                ref: 'User'
            },
            notes: '',
            attachment: '',
            timestamps: Number,
            createdAt: Date
        }
    ],
}, { timestamps: true });

const Renewal = mongoose.model('Renewal', RenewalSchema);

export default Renewal;
