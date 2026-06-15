export { };
const express = require('express');
const compression = require('compression');
const session = require('express-session');
import type { Request, Response } from 'express';
const { createServer } = require("http");
// const io = require("socket.io")({   cors: {
//     origin: "*",
//     methods: ["GET", "POST"]
//   } });

const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const dotenv = require('dotenv');
const MongoStore = require('connect-mongo');
const flash = require('express-flash');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const expressValidator = require('express-validator');
const expressStatusMonitor = require('express-status-monitor');
const sass = require('node-sass-middleware');
// import UsersControllers from "../projects/user/controller";
// const usersContObj = new UsersControllers();

console.log('Health check comment ---------------------');
/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config({ path: '.env' });
/**
 * Create Express server.
 */
//comment added to test
const app = express();
// const httpServer = createServer();
// const io = new Server(httpServer, {   cors: {
//     origin: "*",
//     methods: ["GET", "POST"]
//   } });

app.use(bodyParser.json({ limit: process.env.JSON_BODY_LIMIT || '10mb' }));
//comment added
/**
 * Connect to MongoDB.
 */
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
var mongodb_string: String = "";
if (process.env.NODE_ENV == "development") {
    mongoose.set('debug', true);
    app.set('port', process.env.DEVELOPMENT_PORT);
    if (process.env.SERVER == "local") {
        mongodb_string = String(process.env.DEV_LOCAL_MONGODB_URI as any);
    }
} else if (process.env.NODE_ENV == "test") {
    app.set('port', process.env.DEVELOPMENT_PORT);
    if (process.env.SERVER == "local") {
        mongodb_string = String(process.env.TEST_LOCAL_MONGODB_URI as any);
    } else {
        mongodb_string = String(process.env.TEST_ONLINE_MONGODB_URI as any);
    }
} else if (process.env.NODE_ENV == "staging") {
    app.set('port', process.env.STAGING_PORT);
    // Performance: avoid verbose query logging in staging.
    // mongoose.set('debug', true);

    if (process.env.SERVER == "local") {
        mongodb_string = String(process.env.STAGING_LOCAL_MONGODB_URI as any);
    } else {
        mongodb_string = String(process.env.STAGING_ONLINE_MONGODB_URI as any);
    }
} else if (process.env.NODE_ENV == "production") {

    // mongoose.set('debug', true);

    app.set('port', process.env.PRODUCTION_PORT);
    if (process.env.SERVER == "local") {
        mongodb_string = String(process.env.DEV_LOCAL_MONGODB_URI as any);
    } else {
        mongodb_string = String(process.env.PROD_ONLINE_MONGODB_URI as any);
    }
}
process.env['mongodb_string'] = String(mongodb_string)

if (!process.env.SESSION_SECRET) {
    console.error('SESSION_SECRET is not set.');
    throw new Error('Missing SESSION_SECRET');
}

const hasMongo = Boolean(mongodb_string && String(mongodb_string).trim().length > 0);

console.log("Before socket-app");

require('./socket-app');

console.log("After socket-app");

console.log('Currently working environment is:    ' + process.env.NODE_ENV + " " + mongodb_string);

if (hasMongo) {
    mongoose.connect(mongodb_string, { useUnifiedTopology: true });

    mongoose
        .connection
        .on('error', (err: any) => {
            console.error(err);
            console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
        });
} else {
    console.error('MongoDB connection string is empty/missing. App will start but /api routes may fail.');
}


/**
 * Express configuration.
 */
app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

/**
 * Status monitor spawns OS-level process sampling (pidusage -> wmic on Windows).
 * On some Windows setups this can crash the app with `spawn ENOMEM`.
 * Keep it opt-in to avoid bringing down the API server.
 */
const shouldEnableStatusMonitor =
    String(process.env.ENABLE_STATUS_MONITOR || '').toLowerCase() === 'true' &&
    process.env.NODE_ENV !== 'test' &&
    process.platform !== 'win32';

if (shouldEnableStatusMonitor) {
    try {
        app.use(expressStatusMonitor());
    } catch (e) {
        console.warn('express-status-monitor failed to start; continuing without it.', e);
    }
}
app.use(compression({
    // keep defaults; explicitly avoid disabling compression
    level: process.env.NODE_ENV === 'production' ? 6 : 1,
}));
// app.use(sass({
//     src: path.join(__dirname, 'public'),
//     dest: path.join(__dirname, 'public')
// }));
if (process.env.NODE_ENV !== 'test') {
    app.use(logger('dev'));
}
app.use(bodyParser.json({ limit: process.env.JSON_BODY_LIMIT || '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
var cookie = {
    maxAge: 1209600000,
};
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    cookie: cookie, // two weeks in milliseconds
    store: new MongoStore({ mongoUrl: mongodb_string, autoReconnect: true })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
// app.use((req, res, next) => {     if (req.path === '/api/upload') { next(); }
// else {         next()         // lusca.csrf()(req, res, next);    } });
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.disable('x-powered-by');
app.use((req: { user: any; }, res: { locals: { user: any; }; }, next: () => void) => {
    res.locals.user = req.user;
    next();
});



app.get('/api/health', (req: Request, res: Response) => {
  
  return (res as any).send({
    success: true,
    message: 'Backend is working',
  });
});


// Root health page so visiting the live domain shows a friendly message
app.get('/', (req: Request, res: Response) => {
  const r: any = res;
  r.setHeader('Content-Type', 'text/html');
  return r.send(
    '<!doctype html><html><head><meta charset="utf-8"><title>Backend</title></head><body><h1>Backend is running</h1><p>API base: /api</p></body></html>'
  );
});

 
app.use(function (req: { headers: { origin: any; }; }, res: { setHeader: (arg0: string, arg1: string | boolean) => void; }, next: () => void) {
    var allowedOrigins = [
        'http://localhost:3486',
        'http://localhost:8087',
        'https://edan-frontend.onrender.com',
        'http://localhost:5173',
        'http://localhost:8092',
        'http://localhost:8080',
        'https://edanpower.co.uk',
        'http://stage.thepowerportal.co.uk',
        // Render frontend origin (add if your frontend is hosted there)
    ];
    var origin = req.headers.origin;

    // If origin isn't explicitly allowed, DO NOT silently omit CORS headers.
    // Instead, mirror it back when it matches our allowlist.
    if (allowedOrigins.indexOf(origin) > -1) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    // res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,sessionID,Accept,Origin,Cache');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,sessionID,Accept,Origin,Cache,authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

/**
 * Primary app routes.
 */
// Compression already applied above (keep as-is)
// Middleware wiring for caching + query time logging is done per-route.
require('./routing')(app);

/**
 * Error Handler.
 */
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'staging') {
    // only use in development
    app.use(errorHandler());
} else {
    app.use((err: any, req: any, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: string): void; new(): any; }; }; }, next: any) => {
        res
            .status(500)
            .send('Server Error');
    });
}
// const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

// io.use(wrap(session({
//     resave: true,
//     saveUninitialized: true,
//     secret: process.env.SESSION_SECRET,
//     cookie: cookie, // two weeks in milliseconds
//     store: new MongoStore({ url: mongodb_string, autoReconnect: true })
// })))

/**
 * Start Express server.
 */
const PORT = process.env.PORT || app.get('port') || 3000;

console.log("PORT ENV =", process.env.PORT);
console.log("APP PORT =", app.get("port"));
console.log("BEFORE LISTEN");

try {
    app.listen(PORT, () => {
        console.log("LISTEN SUCCESS", PORT);
        console.log("PORT =", process.env.PORT);
    });
} catch (err) {
    console.error("LISTEN ERROR", err);
}
// io.listen(4000)
// httpServer.listen(4000)
// let users = []

// io.on("connection", async (socket) => {
//     // ...
//     console.log('--------------------- socket connected',socket.request.session)
//     if(socket.request?.session?.passport?.user){
//         let userDetail = await  usersContObj.admin.getUserOnlineStatus(socket.request.session.passport);
//         console.log(userDetail)
//         users.push(userDetail)

//     }
//     socket.on('idle',async (data)=>{
//         let userDetail = await  usersContObj.admin.wsChangeidleStatus({
//             users,
//             id:socket.request.session.passport.user,
//             status:data.status});

//     })

//     socket.on('connect_error', (err) => {
//         console.log(`connect_error due to ${err.message}`);
//       });

//     socket.on('get_list',(data)=>{
//         socket.emit('user_list',users)
//     })
//     socket.on("disconnect", (reason) => {
//       // ...
//       console.log(reason,socket.request.session)
//      let index =  users.findIndex(u => u._id.toString() === socket.request.session.passport.user)
//       console.log('index',index)
//       if(index > -1){
//         users.splice(index,1)
//       }
//     });
//   });

//   io.engine.on("connection_error", (err) => {
//     console.log(err.req);      // the request object
//     console.log(err.code);     // the error code, for example 1
//     console.log(err.message);  // the error message, for example "Session ID unknown"
//     console.log(err.context);  // some additional error context
//   });
module.exports = app;

console.log("Before cron");
require('../projects/cron/Modules/cron_jobs');
console.log("After cron");