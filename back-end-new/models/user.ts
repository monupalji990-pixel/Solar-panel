const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types;
export interface UserInterface {
    _id: string
    name: string;
    mobile: string;
    email: string;
    avatar: string,
    residentialAddress: string;
    membershipType: string;
    validUpTo: string;
    userPic: string;
    dob: string;
    community: string;
    profession: string;
    area: string;
    pinCode: string;
    bloodGroup: string;
    designation: string;
    status: string;
    appInstalled: string;
    password: string;
    role: string;
    resetToken: string;
    tokenExpiryTimeStamp: Number;
    phone: string
    jobTitle: string
    DOB: Date
    nationalInsurance: any
    portalAccess: boolean
    isActive: number
    companyId: string
    Site: [],
    consumerId: string,
    title: string,
    firstName: string,
    surName: string,
    address: string,
    lat: string,
    lon: string,
    addressOne: string,
    addressTwo: string,
    town: string,
    city: string,
    postcode: string,
    telephoneNumber: string,
    age: number,
    bankName: string,
    accountHolderName: string,
    sortCode: string,
    accountNumber: string,
    phoneNumbers: Array<{type: string; number: string}>;
    additionalFieldOne: string,
    additionalFieldTwo: string,
    Assignee: Array<string>,
    Lead: [string],
    meterReading: [
        {
            addedBy: string
            description: string,
            attachment: any,
            service_type: any,
            timestamps: Number
        }
    ],
    documents: [
        {
            addedBy: string
            title: string,
            attachment: any,
            timestamps: Number
        }
    ],
    Notes: [
        {
            addedBy: string
            notes: string,
            attachment: any,
            timestamps: Number,
            createdAt: Date
        }
    ],
    history: [
        {
            addedBy: string,
            description: string,
            field: String,
            previousValue: any,
            currentValue: any,
            createdAt: Date
        }
    ],
    how_long_have_you_lived_at_this_address: string,
    previousAddress: any,
    do_you: string,
    are_you_responsible_for_any_commercial_properties: any,
    promotion_code: string,
    term_condition: [string]
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        sparse: true,
        unique: true
    },
    secondary_email: {
        type: String,
    },
    createdBy: String,
    avatar: String,
    password: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    name: { type: String, index: true },
    lastName: { type: String, index: true },
    firstName: { type: String, index: true },
    gender: String,
    jobTitle: String,
    mobile: { type: String, index: true },
    phone: { type: String, index: true },
    portalAccess: Boolean,
    homeAddress: String,
    consumerId: String,
    title: String,
    surName: String,
    address: String,
    lat: String,
    lon: String,
    addressOne: String,
    addressTwo: String,
    siteAddress: String,
    town: String,
    city: String,
    city_list: [String],
    postcode: String,
    telephoneNumber: String,
    age: Number,
    bankName: String,
    accountHolderName: String,
    sortCode: String,
    accountNumber: String,
    phoneNumbers: [
        {
            type: String,
            number: String
        }
    ],
    additionalFieldOne: String,
    additionalFieldTwo: String,
    nationalInsurance: String,
    fixCommission: Number,
    percentageCommission: Number,
    companyId: {
        type: ObjectId,
        ref: 'Company',
        index: true
    },
    Site: [{
        type: ObjectId,
        ref: 'Site'
    }],
    Lead: [{
        type: ObjectId,
        ref: 'Lead'
    }],
    role: {
        type: ObjectId,
        ref: 'Roles',
        index: true
    },
    isActive: { type: Number, default: 1 },
    isBlock: { type: Boolean, default: false },
    isDelete: { type: Boolean, default: false },
    BlockedBy: {
        type: ObjectId,
        ref: 'User'
    },
    DOB: {
        type: Date,
        default: Date.now,
        index: true
    },
    gdpr: {
        type: Boolean,
        default: false
    },
    Assignee: [
        {
            type: ObjectId,
            ref: 'User'
        }
    ],
    meterReading: [
        {
            addedBy: {
                type: ObjectId,
                ref: 'User'
            },
            description: '',
            attachment: '',
            service_type: '',
            timestamps: Number
        }
    ],
    documents: [
        {
            addedBy: {
                type: ObjectId,
                ref: 'User'
            },
            title: '',
            attachment: '',
            timestamps: Number
        }
    ],
    installerDocuments: [
        {
            addedBy: {
                type: ObjectId,
                ref: 'User'
            },
            title: '',
            attachment: '',
            timestamps: Number
        }
    ],
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
    history: [
        {
            addedBy: {
                type: ObjectId,
                ref: 'User'
            },
            description: '',
            field: String,
            previousValue: '',
            currentValue: '',
            createdAt: Date
        }
    ],
    how_long_have_you_lived_at_this_address: String,
    previousAddress: String,
    previousAddressYear: Number,
    do_you: String,
    are_you_responsible_for_any_commercial_properties: String,
    promotion_code: String,
    term_condition: Array,
    isOnline: {
        type: Boolean
    },
    idleStatus: {
        type: String
    },
    isFromPrimo: {
        type: Boolean
    },
    EPCrating: {
        type: String
    },
    color: {
        type: String
    },
    installerType: {
        type: [String],
        default: undefined

    }
}, { timestamps: true });

/**
 * Password hash middleware.
 */
userSchema.pre('save', function save(next: Function) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(10, (err: any, salt: String) => {
        if (err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, (error: any, hash: String) => {
            if (error) {
                return next(error);
            }
            user.password = hash;
            next();
        });
    });
});

userSchema.pre("updateOne", function save(next: Function) {
    const user = this;
    if (!user._update.password) {
        return next(null);
    }

    bcrypt.genSalt(13, (err: any, salt: any) => {
        if (err) {
            return next(err);
        }
        bcrypt.hash(user._update.password, salt, (err: any, hash: any) => {
            if (err) {
                return next(err);
            }
            user._update.password = hash;
            next(null);
        });
    });
});


/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function comparePassword(candidatePassword: Function, cb: Function) {
    let that = this;
    return new Promise(function (
        resolve: Function,
        reject: Function
    ) {
        bcrypt.compare(
            candidatePassword,
            that.password,
            (err: any, isMatch: any) => {
                if (err) reject(err);
                else resolve(isMatch);
            }
        );
    });
};

const UserModel = mongoose.model('User', userSchema);

UserModel.newpassword = function (newpassword: any, cb: Function) {
    bcrypt.genSalt(10, (err: any, salt: any) => {
        if (err) {
            return cb(err);
        }
        bcrypt.hash(newpassword, salt, (error: any, hash: any) => {
            if (error) {
                return cb(error);
            }
            // user.password = hash;
            cb(null, hash);
        });
    });
};

export default UserModel;