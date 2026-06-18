import React from 'react';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import FormHelperText from '@material-ui/core/FormHelperText';
import CardActions from '@material-ui/core/CardActions';
import { selectUsersState, userAdminAction } from '../redux/userAdmin';
import MyDrawer from '../../../sharedUtils/sharedComponents/drawerHelper';

export default function ChangePassword(props) {
  return (
    <MyDrawer drawerSize="profile-user-drawer" iconName="User" open={props.open == 'changePassDrawer'} onClose={props.onClose.bind(this)}>
      <ChangePasswordLogic {...props} />
    </MyDrawer>
  );
}

function ChangePasswordLogic(props) {
  const userState = useSelector(selectUsersState)
  const { hideSideBar } = userState;
  const dispatch = useDispatch();

  const initialValues = {
    password: '',
    confirmPassword: '',
  };

  const _editUser = (payload, resolve) => dispatch(userAdminAction.editUser(payload));
  const _closeSideBar = payload => dispatch(userAdminAction.userCloseSideBar(payload));

  if (hideSideBar) {
    props.onClose();
    _closeSideBar(false);
  }

  const ChangePasswordMethod = (value, setErrors, setSubmitting) => {
    _editUser({ userId: value._id, updation: value }, resp => {
      setSubmitting(false);
      props.onClose();
      props.getUserTable.current.onQueryChange();
    });
  };

  return (
    <div className="app">
      <Formik
        initialValues={initialValues}
        onSubmit={(values, { setErrors, setSubmitting }) => {
          ChangePasswordMethod(values, setErrors, setSubmitting);
        }}
        validationSchema={Yup.object().shape({
          password: Yup.string().required('Required'),
          confirmPassword: Yup.string()
            .required('Confirm Password is a required field')
            .test(
              'passwords-match',
              'Password and confirm Password should match',
              function (value) {
                return this.parent.password === value;
              },
            ),
        })}
      >
        {props => {
          const {
            values,
            touched,
            errors,
            dirty,
            isSubmitting,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            handleReset,
          } = props;
          return (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <div
                  style={{
                    position: 'absolute',
                    top: 10,
                    display: 'flex',
                    justifyContent: 'center',
                    width: '81%',
                    marginLeft: '6%',
                  }}
                >
                  <h1 style={{ fontSize: 22 }}> Change Password </h1>
                </div>
                <Grid item xs={12} md={6}>
                  <TextField
                    error={errors.password && touched.password ? true : false}
                    id="password"
                    className="WidhtFull100"
                    label="Password"
                    type="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="password-error"
                  />
                  {errors.password && touched.password && (
                    <FormHelperText className="errormsg" id="password-error">
                      {errors.password}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    error={
                      errors.confirmPassword && touched.confirmPassword
                        ? true
                        : false
                    }
                    id="confirmPassword"
                    label="Confirm Password"
                    className="WidhtFull100"
                    type="password"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="confirm-pass-error"
                  />
                  {errors.confirmPassword && touched.confirmPassword && (
                    <FormHelperText
                      className="errormsg"
                      id="confirmPassword-error"
                    >
                      {errors.confirmPassword}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>
              <CardActions
                style={{ paddingLeft: 0, paddingRight: 0, marginTop: 20 }}
              >
                <Button
                  size="large"
                  type="button"
                  variant="outlined"
                  onClick={handleReset}
                  disabled={!dirty || isSubmitting}
                >
                  Reset
                </Button>
                <Button
                  size="large"
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Submit
                </Button>
              </CardActions>
            </form>
          );
        }}
      </Formik>
    </div>
  );
}
