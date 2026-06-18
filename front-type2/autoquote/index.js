/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const OS = require('os')
const cors = require('cors')
const morgan = require('morgan')
console.log("autoquote env: ",process.env.NODE_ENV)

process.env.UV_THREADPOOL_SIZE = OS.cpus().length
dotenv.config({ path: '.env' });
const router = require('./routes/routing');
console.log('docker version')
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

mongoose.connect(mongoDBUrl,
    { useNewUrlParser: true, useUnifiedTopology: true }
    ).then(data => console.log('DB connected'));

console.log('connected to DB: ',mongoDBUrl)
console.log('NODE ENV :',process.env.NODE_ENV)
const app = express();
app.use(cors({
    origin:[ 'http://localhost:8092','http://localhost:3486','https://edan-frontend.onrender.com','https://edan-power-staging.tidbitlab.com','https://thepowerportal.co.uk', 'http://192.168.1.4:3486']
}));
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/price',router);
app.get('/price', (req, res) => {
    res.send('this are the suppliers prices');
});
app.get('/price/test', (req, res) => {
    res.send('test latest');
});

app.listen(8333, () => {
    console.log('Supplier prices server is running on port ', 8333);
});

//comment added
