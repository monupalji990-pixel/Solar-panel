var _ = require('lodash');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);

var mongodb_string;
if (process.env.NODE_ENV == "staging") {
    if (process.env.SERVER == "local") {
        mongodb_string = process.env.STAGING_LOCAL_MONGODB_URI;
    } else {
        mongodb_string = process.env.STAGING_ONLINE_MONGODB_URI;
    }
} else if (process.env.NODE_ENV == "production") {
    if (process.env.SERVER == "local") {
        mongodb_string = process.env.DEV_LOCAL_MONGODB_URI;
    } else {
        mongodb_string = process.env.PROD_ONLINE_MONGODB_URI;
    }
} else if (process.env.NODE_ENV == "development") {
    mongodb_string = process.env.DEV_LOCAL_MONGODB_URI;
}

console.log('Currently working environment is:' + process.env.NODE_ENV + '    ' + process.env.SERVER + " " + mongodb_string);

mongoose.connect(mongodb_string, function (err:any) { });

mongoose
    .connection
    .on('error', (err:any) => {
        console.log('%s MongoDB connection error. Please make sure MongoDB is running.');
        process.exit();
    });

import initials from '../sharedModules/initials/index';

initials
    .setup()
    .then(() => { process.exit(); })
    .catch(() => { process.exit(); });
