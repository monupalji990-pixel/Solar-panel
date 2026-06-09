interface User {
    _id: string
    name: string
    password: string
    comparePassword: Function
    profileImage: string
    secondaryEmails: [string]
    email: string,
    role:any;
}
export interface Request {
    body: any;
    query: any;
    params: any;
    assert: Function;
    validationErrors: Function;
    logIn: Function;
    logout: Function;
    session: any;
    user: User;
    file: any;
    files:any;
    isAuthenticated:Function;
    path:any;
    sanitize:Function
    flash:Function,
    route:any
}
export interface Response {
    send: Function
    sendFile: Function
    download:Function,
    redirect:Function
}
export interface Next {

}