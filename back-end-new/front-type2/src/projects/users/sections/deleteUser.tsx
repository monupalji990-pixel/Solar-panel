import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import Select from 'react-select';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import { selectUsersState, userAdminAction } from '../redux/userAdmin';

export default function DeleteUser(props) {
  const dispatch = useDispatch();
  const userState = useSelector(selectUsersState);
  const dropdownUsers = userState.dropdownUsers;

  const _assigneeList = (payload) => dispatch(userAdminAction.userListForDropdown(payload));
  const _removeUser = (payload) => dispatch(userAdminAction.removeUser(payload));
  const [startLoader, setStartLoader] = useState(false);

  useEffect(() => {
    _assigneeList(null);
  }, []);

  let userList = []
  if (dropdownUsers) {
    const list = dropdownUsers.filter(e => e._id !== props.user._id && e.role.roleName === props.user.role && e.isActive === 1);
    userList = list.map(e => ({ label: e.name, value: e._id }))
  }

  return (
    <div className="app">
      <Formik
        initialValues={{
          NewUser: null
        }}
        onSubmit={(value, { resetForm }) => {
          const a = {
            OldUser: props.user._id,
            NewUser: value.NewUser.value
          }
          setStartLoader(true);
          setTimeout(function () { setStartLoader(false); resetForm() }, 2000)
          _removeUser(a)
        }}
        validationSchema={Yup.object().shape({
          NewUser: Yup.string().required('Please select the Sales Rep'),
        })}
      >
        {props => {
          const {
            values,
            touched,
            errors,
            handleBlur,
            handleSubmit,
            setFieldValue,
          } = props;

          return (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item md={12} sm={12}>
                  <Typography variant="body2">Please select another Sales Rep before deleting </Typography>
                  <Select
                    className={errors.NewUser && touched.NewUser ? 'ErrorColor' : ''}
                    id="NewUser"
                    placeholder="Select Sales Rep"
                    value={values.NewUser}
                    onChange={e => { setFieldValue('NewUser', e) }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="NewUser-number-error"
                    name="colors"
                    options={userList}
                  />
                  {errors.NewUser && touched.NewUser && (
                    <FormHelperText className="errormsg" id="NewUser-error">
                      {errors.NewUser}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>
              <CardActions
                style={{ paddingLeft: 0, paddingRight: 0, marginTop: 20 }}
              >
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Delete </Button>{startLoader && <CircularProgress />}
              </CardActions>
            </form>
          );
        }}
      </Formik>
    </div>
  );
}
