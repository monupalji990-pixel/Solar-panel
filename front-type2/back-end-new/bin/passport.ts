export { };
import User from "../models/user";
const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const _ = require("lodash");
const modules = require("../sharedModules/index");
import { Request, Response } from "../templates/commandInterface";

passport.serializeUser(
  (user: { id: any }, done: (arg0: any, arg1: any) => void) => {
    done(null, user.id);
  }
);

passport.deserializeUser((id: any, done: (arg0: any, arg1: any) => void) => {
  User.findById(id, (err: any, user: any) => {
    done(err, user);
  });
});

/**
 * Sign in using Email and Password.
 */
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    (
      email: String,
      password: String,
      done: Function
    ) => {
      User.findOne({ email: email })
        .populate("role")
        .exec(function (err: any, user: any) {
          if (err) {
            return done(err, false, { msg: "Got an err" });
          }
          if (!user) {
            return done(null, false, { msg: `Email ${email} not found.` });
          }
          user
            .comparePassword(password)
            .then((isMatch: Boolean) => {
              if (isMatch == true) {
                return done(null, user, { msg: "Ok" });
              } else
                return done(null, false, {
                  msg: "Invalid email or password.",
                });
            })
            .catch((err: any) => {
              return done(err, false, { msg: "Got an err" });
            });
        }
        );
    }
  )
);

/**
 * Login Required middleware.
 */
const isAuthenticated = (req: Request, res: Response, next: Function) => {
  if (req.isAuthenticated()) {
    
    return next();
  }
  return res.send({ err: "you are not logged IN",  success: false });
};

/**
 * Authorization Required middleware.
 */

const isAuthorized = (req: Request, res: Response, next: Function) => {
  try {
    User.findById(req.user._id)
    .populate('role')
    .exec(function (err: any, result: { role: { apis: any[] }, roleId: any }) {
      if (err && !result) {
        return res.send(err);
      } else {
        if (result.role) {
          req.user.role = result.role;
          next();
        } else {
          return res.send({ err: "not assigned to any role", success: false });
        }
      }
    });
  } catch (error) {}
};

export default {
  isAuthenticated,
  isAuthorized,
};
