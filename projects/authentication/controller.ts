import { Request, Response } from "../../templates/commandInterface";
import User from "../../models/user";
import ControllerUtils from "../../utils/ControllerUtils";

const passport = require("passport");
const constantsModules = require("../../sharedModules/index");
import commandUtils from "../../sharedModules/smallModules/commanUtils";
const responseStatusCode = constantsModules.responseCode

export default class authControllers extends ControllerUtils {
  constructor() {
    super();
  }
  index(req: Request, res: Response) { return res.send({ title: req.body.username }); }

  login = (req: Request, res: Response, next: any) => {

    req
      .assert('password', 'Password cannot be blank')
      .notEmpty();
      console.log('Request Body:', req.body); // Debugging line to check the request body
    const errors = req.validationErrors();

    if (errors) {
      return res.send({ err: 'login error', status: 1005 });
    }
    passport.authenticate('local', async (err:any, user:any) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.send({ err: 'User not there' });
      }
      if (Number(user.isActive) === 0) {
        return res.send({ err: 'This account has not been activated or it is blocked', statusCode: 2310 , success: false });
      }
      if (!user.gdpr) {
        await User.update({ _id: user._id }, { gdpr: req.body.gdpr });
      }

      req.logIn(user, (error:any) => {
        if (error) {
          next(error);
        }
        if (user.role) {
          res.send({
            success: 'yes! you are logged In',
            role: {
              configurations: user.role.configurations,
              authorisedContainers: user.role.authorisedContainers,
              authorisedAPIS: user.role.authorisedAPIS,
              roleName : user.role.roleName
            },
            email: user.email,
            username: user.username,
            name: user.name,
            mobile: user.mobile,
            avatar: user.avatar
          });
        } else {
          res.send({
            success: 'yes! you are logged In',
            role: {
              configurations: null,
              authorisedContainers: [],
              authorisedAPIS:[]
            },
            email: user.email,
            username: user.username,
            name: user.name,
            mobile: user.mobile,
            avatar: user.avatar
          });
        }
      });
    })(req, res, next);
  };

  signup = (req: Request, res: Response, next:Function) => {
    req
      .assert('email', 'Email is not valid')
      .isEmail();
    req
      .assert('password', 'Password must be at least 4 characters long')
      .len(4);
    req
      .sanitize('email')
      .normalizeEmail({ gmail_remove_dots: false });

    const errors = req.validationErrors();

    if (errors) {
      return res.send({ err: errors, status: responseStatusCode.INPUTDATAERROR });
    }

    const user = new User({
      email: req
        .body
        .email
        .toLowerCase(),
      password: req.body.password
    });

    User.findOne({
      email: req.body.email
    }, (err:any, existingUser:any) => {
      if (err) {
        return next(err);
      }
      if (existingUser) {
        req.flash('errors', { msg: 'Account with that email address already exists.' });
        return res.send({ err: 'exiting user', status: responseStatusCode.USERALREADYTHERE });
      }
      user.save((error1:any) => {
        if (error1) {
          return next(error1);
        }
        req.logIn(user, (error:any) => {
          if (error) {
            return next(error);
          }
          return res.send({ success: 'successfully created new user' });
        });
      });
    });
  };

  isLoggedIn(req: Request, res: Response) {
    // added roleName
    if (!req.user || !req.user._id) {
      return res.send({ success: false, err: 'Not authenticated', status: responseStatusCode.UNAUTHORIZED || 1004 });
    }

    commandUtils.newFindQuery(User, {
      filterType: 'byid',
      filter: {
        id: req.user._id
      },
      populate: 'role',
      populateSelect: 'apis containers configurations roleName',
      select: 'name email username mobile avatar'
    }).exec((err:any, result:any) => {
      if (err) {
        res.send(err);
      } else {
        res.send({
          ...result,
          success: 'yes! you are logged In'
        });
      }
    });
  };

  logout(req: Request, res: Response) {
    req.logout();
    req
      .session
      .destroy((err:any) => {
        if (err) {
          return res.send({
            Error: `Failed to destroy the session during logout2${err}`
          });
        }
        return res.send({ success: 'successfully! logout' });
      });
  };

  NewUpdate(req: Request, res: Response) {
    res.send({ VersionName: 'v-2310.2' });
  };

getAllUsers(req: Request, res: Response) {

  console.log('API HIT');

  User.findOne({ email: 'gagandeep@edanpower.co.uk' })

    .exec((err: any, result: any) => {

      console.log('Mongo Query Running');

      if (err) {

        console.log('DATABASE ERROR:', err);

        return res.send({
          success: false,
          message: 'Error fetching user',
          error: err
        });
      }

      console.log('USER RESULT:', result);

      if (!result) {

        console.log('USER NOT FOUND');

        return res.send({
          success: false,
          message: 'User not found'
        });
      }

      console.log('USER ROLE:', result.role);
      console.log('USER EMAIL:', result.email);
      console.log('USER STATUS:', result.status);
      console.log('USER ACTIVE:', result.isActive);

      return res.send({
        success: true,
        message: 'Successfully got user',
        user: result
      });

    });
}
}

