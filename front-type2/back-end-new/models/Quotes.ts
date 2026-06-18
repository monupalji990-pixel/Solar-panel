const mongoose = require('mongoose');
let { ObjectId } = mongoose.Schema.Types;
export interface QuoteInterface {
    QuoteID: string,
    Lead: string
    Company: string
    Consumer: string
    Site: string
    User: Array<string>,
    Assignee: string
    createdBy: string
    service: {
        gas: Object,
        electric: Object,
        water: Object,
        chipAndPin: Object,
        telecoms: Object,
        broadband: Object,
        energy: Object,
        funeral: Object,
        mortgage: Object,
        waste: Object,
        insurance: Object,
        businessrates: Object

    },
    serviceType: string,
    isActive: boolean
    isBlock: boolean
    isDelete: boolean
    isRenewal: number
    quoteStatus: number,
    Invoiced: string,
    quotePrice: string,
    notes: string,
    Amount: number,
    contractLength: string,
    contractLengthDate: Date
    contractAcceptDate: Date
    expiryDate: number,
    StatusHistory: any,
    QuoteHistory: Array<any>,
    docusignHistory: Array<any>,
    BlockedBy: string
    Supplier: string
    IsRenewalCreated: number,
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
const QuoteSchema = new mongoose.Schema({
    QuoteID: { type: String, index: true },
    Lead: {
        type: ObjectId,
        ref: 'Lead'
    },

    // ---- Fast list query indexes (created below via QuoteSchema.index) ----
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
            ref: 'User',
            index: true
        }
    ],
    Assignee: {
        type: ObjectId,
        ref: 'User',
        index: true
    },
    createdBy: {
        type: ObjectId,
        ref: 'User'
    },
    uplift: Number,
    service: {
        gas: {
            "meterNumber": { type: String, index: true },//MPRN
            "meterNumberTwo": String,
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
            "tidNumber": [],
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
            "cust_id": String,
            "lineRentalPackageName": String,
            "lineRental": Number,
            "ExtraServiceName": String,
            "ExtraServiceCharges": Number,
            "phoneNumbers": []
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
            "wifi_name": String,
            "wifi_password": String

        },
        energy: {
            "EAnnualCost": String,
            "currentTariff": String,
            "economy": String,
            "contractReviewOption": String,
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
        debt: {
            "previous_contract_length": String,
            "contract_length": String,
            "contract_start_date": Number,
            "contract_end_date": Number,
            "previous_contract_start_date": Number,
            "full_name": String,
            "dob": Date,
            "address": String,
            "businessName": String,
            "businessAddress": String,
            "typeOfDebt": String
        },
        telecomandbroadband: {
            // "previous_contract_length": String,
            // "contract_length": String,
            // "contract_start_date": Number,
            // "contract_end_date": Number,
            // "previous_contract_start_date": Number,
            // "products": String,
            // "combined_package": String,
            // "handsetsTypes": String,
            // "number_of_handset": String,
            // additional_handset: String,
            // handset_price: String,
            // live_date: Number,
            // renewal_date: Number,
            // accountNumber: String,
            // WholeSaleProvider: String,
            // status: String,
            // PhoneNumber1: Number,
            // PhoneNumber2: Number,
            // PhoneNumber3: Number,
            // PhoneNumber4: Number,
            // PhoneRange4: Number,
            // PhoneNumber5: Number,
            // PhoneRange5: Number,
            // PhoneNumber6: Number,
            // PhoneRange6: Number,
            // totalMonthlyCost: Number,
            // oneOffCharges: String,
            // serialNumber: String,
            // macAddress: String,
            // connectionType: String,
            // ConnectionCharges: String,
            // AddExtras: String,
            // Extras: [String],
            // Rental: Number,
            // BBConnectionCharges: String,
            // RouterPrice: String,
            // oneoffcost: Number,
            // UserName: String,
            // Password: String,
            // IPAddress1: String,
            // IPAddress2: String,
            // RouterModel: String,
            // router_serialNumber: Number,
            // sim_cards: String,
            // additional_sims: String
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

        },
        eco: {
            subservice: {
                type: Object,
                default: null
            },
            "surveyAppoinment": {
                type: ObjectId,
                ref: 'Appoinment'
            },
            "scaffoldingAppoinment": {
                type: ObjectId,
                ref: 'Appoinment'
            },
            "installationAppoinment": {
                type: ObjectId,
                ref: 'Appoinment'
            },
            "insulationAppoinment": {
                type: ObjectId,
                ref: 'Appoinment'
            },
            "ventilationAppoinment": {
                type: ObjectId,
                ref: 'Appoinment'
            },
            "heatingAppoinment": {
                type: ObjectId,
                ref: 'Appoinment'
            },
            "solarRenewablesAppoinment": {
                type: ObjectId,
                ref: 'Appoinment'
            },
            "contract_length": String,
            "contract_start_date": Number,
            "contract_end_date": Number,
        },
        paidsolar: {
            type: Object
        }
    },
    debtpayments: [{
        title: String,
        amount: Number,
        paymentDueDate: Date,
        isEmailSent: {
            type: Boolean,
            default: false
        }
    }], // for debt service
    serviceType: String,
    subServiceType: {
        type: []
    },
    isCreatedByServicePartner: {
        type: Boolean
    },
    commissionPercentage: {
        type: Number
    },
    commissionPrice: {
        type: Number
    },
    commissionStatus: {
        type: String,
        enum: ['Outstanding', 'Paid']
    },
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
    isRenewal: {
        type: Number,
        default: 0
    },
    quoteStatus: { type: Number, index: true },
    Invoiced: String,
    quotePrice: { type: String, index: true },
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
    expiryDate: Number,
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
    QuoteHistory: [],
    docusignHistory: [],
    BlockedBy: {
        type: ObjectId,
        ref: 'User'
    },
    Supplier: {
        type: ObjectId,
        ref: 'Supplier'
    },
    IsRenewalCreated: {
        type: Number,
        default: 0
    },
    isLiveDateProvided: {
        type: Boolean,
        default: false
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
    gallery: [Object],
    Scaffolders: {
        type: ObjectId,
        ref: 'User'
    },
    Roofers: {
        type: ObjectId,
        ref: 'User'
    },
    Electricians: {
        type: ObjectId,
        ref: 'User'
    },
    "Gas Engineers": {
        type: ObjectId,
        ref: 'User'
    },
    "Cavity Wall Installer": {
        type: ObjectId,
        ref: 'User'
    },
    "Under Floor Installer": {
        type: ObjectId,
        ref: 'User'
    },
    "Loft Installer": {
        type: ObjectId,
        ref: 'User'
    },
    "Ventilation Installer": {
        type: ObjectId,
        ref: 'User'
    },
    "Internal Wall Insulation": {
        type: ObjectId,
        ref: 'User'
    },
    "External Wall Insulation": {
        type: ObjectId,
        ref: 'User'
    },
    "Room In Roof Installer": {
        type: ObjectId,
        ref: 'User'
    },
    "ASHP Installer": {
        type: ObjectId,
        ref: 'User'
    },
    "OpenSolarProjectId": {
        type: String,
    },
    "OpenSolarProjectUrl": {
        type: String
    },
    digitalDashboard: Object

}, { timestamps: true, minimize: false });

// Indexes to speed up list/lead/company/consumer filtering in listOfQuotes
// These are based on controller.ts listOfQuotes filter usage + sort by updatedAt/createdAt.
// Note: MongoDB needs these indexes built in the collection (happens automatically on startup in many setups).
QuoteSchema.index({ Assignee: 1, isActive: 1, isDelete: 1, quoteStatus: 1, updatedAt: -1 });
QuoteSchema.index({ Company: 1, isActive: 1, isDelete: 1, quoteStatus: 1, updatedAt: -1 });
QuoteSchema.index({ Consumer: 1, isActive: 1, isDelete: 1, quoteStatus: 1, updatedAt: -1 });
QuoteSchema.index({ BlockedBy: 1, isActive: 1, isDelete: 1, quoteStatus: 1, updatedAt: -1 });
QuoteSchema.index({ serviceType: 1, isActive: 1, isDelete: 1, quoteStatus: 1, updatedAt: -1 });

const Quote = mongoose.model('Quote', QuoteSchema);

export default Quote;
