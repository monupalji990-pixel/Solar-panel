const { Server } = require("socket.io");
// Some socket.io versions export `Server` as the default export.
// Fallback keeps runtime working across versions.
const ServerCtor = Server || require("socket.io");
const session = require('express-session');
const MongoStore = require('connect-mongo')
import UsersControllers from "../projects/user/controller";
const usersContObj = new UsersControllers();
var cookie = {
  maxAge: 1209600000,
};

const io = new ServerCtor({ 

    cors: {
        origin: "*",
        methods: ["GET", "POST"]
      },
      // path: "/websocket/"
 });
// console.log(io)
let users = []
let adminSocketIds = []

io.on("connection", async (socket) => {
    // ...
    console.log(process?.env?.NODE_APP_INSTANCE)
    console.log('--------------------- socket connected',socket.request.session)

    if(socket.request?.session?.passport?.user){
        let userDetail = await  usersContObj.admin.getUserOnlineStatus(socket.request.session.passport);
        let isAdmin = await usersContObj.admin.isAdmin(socket.request.session.passport)
        if(!isAdmin){
          let index =  users.findIndex(u => u._id.toString() === socket.request.session.passport.user)
          console.log('index',index)
          if(index === -1){
          users.push(userDetail)
          const adminSockets =  await io.in(adminSocketIds).fetchSockets();
          for(const a of adminSockets){

            a.emit('user_list_change',users)
          }
        }

        }else {
          adminSocketIds.push(socket.id)
        }
        console.log(userDetail)

    }
    socket.on('idle',async (data)=>{
        let userDetail = await  usersContObj.admin.wsChangeidleStatus({
            id:socket.request.session.passport.user,
            idleStatus:data.status});

            for(const u of users){
              if(u._id.toString() === socket.request.session.passport.user ){
                  u.idleStatus = data.status
                  const adminSockets =  await io.in(adminSocketIds).fetchSockets();
                    for(const a of adminSockets){

                      a.emit('user_list_change',users)
                    }
                  
              }
            }

    })
  
    socket.on('connect_error', (err) => {
        console.log(`connect_error due to ${err.message}`);
      });

    socket.on('get_list',(data)=>{
        socket.emit('user_list',users)
    })
    socket.on("disconnect", async(reason) => {
      // ...
      console.log(reason,socket.request.session)
     let index =  users.findIndex(u => u._id.toString() === socket.request.session.passport.user)
      console.log('index',index)
      if(index > -1){
        users.splice(index,1)
      }
      await usersContObj.admin.wsSetOffline(socket.request.session.passport);
      const adminSockets =  await io.in(adminSocketIds).fetchSockets();
                    for(const a of adminSockets){

                      a.emit('user_list_change',users)
                    }
    });
  });

  // io.engine.on("connection_error", (err) => {
  //   console.log(err.req);      // the request object
  //   console.log(err.code);     // the error code, for example 1
  //   console.log(err.message);  // the error message, for example "Session ID unknown"
  //   console.log(err.context);  // some additional error context
  // });

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

io.use(wrap(session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
    cookie: cookie, // two weeks in milliseconds
    store: new MongoStore({ mongoUrl: process.env.mongodb_string, autoReconnect: true })
})))


if(process?.env?.NODE_APP_INSTANCE === '0'){
  io.listen(4000);

}