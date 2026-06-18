import React, { useEffect } from 'react';
import { Formik } from 'formik';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import CardActions from '@material-ui/core/CardActions';
import Icon from '@material-ui/core/Icon';
import DateFnsUtils from '@date-io/date-fns';
import FormHelperText from '@material-ui/core/FormHelperText';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import moment from 'moment'
import { assigneeAction, selectAssigneeState } from "projects/assignee/redux/assignee";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { AM } from "../../../sharedUtils/globalHelper/constantValues";

export default function Filter(props) {
  const currentProps = props;
  const saleRepOptions = [];

  const dispatch = useDispatch();
  const assigneeState = useSelector(selectAssigneeState);

  const allAssignee = assigneeState.assigneeListForDropdown;

  useEffect(() => {
    dispatch(assigneeAction.list(null))
  }, [])

  allAssignee.map(e => {
    if (e.role?.roleName == 'Sales Rep') {
      saleRepOptions.push({ value: e._id, label: e.name })
    }
  })

  return (
    <div className="app">
      <Formik
        initialValues={{
          dateTo: props.filterData.dateTo !== undefined ? props.filterData.dateTo : '',
          dateFrom: props.filterData.dateFrom !== undefined ? props.filterData.dateFrom : '',
          SalesRep: props.filterData.SalesRep !== undefined && props.filterData.SalesRep.length > 0 ? props.filterData.SalesRep : null,
        }}
        enableReinitialize
        onSubmit={(values) => {
          const filterObject: any = {}
          if (values.dateTo) filterObject.dateTo = moment(values.dateTo).format("YYYY-MM-DD")
          if (values.dateFrom) filterObject.dateFrom = moment(values.dateFrom).format("YYYY-MM-DD")
          if (values.SalesRep) {
            filterObject.ConsumerAssignee = values.SalesRep;
          }

          props._loadingDataAction(false);
          props._filterData(filterObject);
        }}
      >
        {props => {
          const {
            values,
            touched,
            errors,
            handleSubmit,
            handleBlur,
            handleReset,
            setFieldValue,
          } = props;

          return (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>

                {AM.includes(currentProps.slug) &&
                  <Grid item xs={12} md={12}>
                    <Select
                      error={errors.SalesRep && touched.SalesRep ? true : false}
                      id="role"
                      isMulti
                      className="WidhtFull100 basic-multi-select"
                      placeholder="Sales Rep"
                      value={values.SalesRep}
                      margin="normal"
                      aria-describedby="SalesRep-number-error"
                      onChange={(e) => setFieldValue("SalesRep", e)}
                      onBlur={handleBlur}
                      name="SalesRep"
                      options={saleRepOptions}
                      classNamePrefix="select"
                    />
                  </Grid>
                }

                <Grid item xs={12} md={12}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-around">
                      <KeyboardDatePicker
                        margin="normal"
                        id="date-picker-dialog"
                        label="From Date"
                        className="WidhtFull100"
                        allowKeyboardControl
                        format="dd/MM/yyyy"
                        name="dateFrom"
                        value={values.dateFrom ? values.dateFrom : null}
                        onChange={e => setFieldValue('dateFrom', e)}
                        KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }}
                      />
                    </Grid>
                    {errors.dateFrom && touched.dateFrom && (
                      <FormHelperText className="errormsg" id="dateFrom-error">
                        {errors.dateFrom}
                      </FormHelperText>
                    )}
                  </MuiPickersUtilsProvider>
                </Grid>

                <Grid item xs={12} md={12}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-around">
                      <KeyboardDatePicker
                        margin="normal"
                        id="date-picker-dialog"
                        label="To Date"
                        format="dd/MM/yyyy"
                        name="dateTo"
                        value={values.dateTo ? values.dateTo : null}
                        onChange={e => setFieldValue('dateTo', e)}
                        KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }}
                      />
                    </Grid>
                    {errors.dateTo && touched.dateTo && (
                      <FormHelperText className="errormsg" id="dateTo-error">
                        {errors.dateTo}
                      </FormHelperText>
                    )}
                  </MuiPickersUtilsProvider>
                </Grid>
                <Grid item xs={12} md={12}>
                  <CardActions style={{ paddingLeft: 0, paddingRight: 0, marginTop: 20 }}>
                    <Button
                      size="large"
                      variant="contained"
                      onClick={() => {
                        handleReset()
                        props.resetForm()
                        currentProps._loadingDataAction(false);
                        currentProps._filterData({});
                      }}
                    >
                      <Icon className="fa fa-refresh" />
                    </Button>
                    <Button
                      size="large"
                      variant="contained"
                      color="primary"
                      type="submit"
                    >
                      <Icon className="fa fa-filter" />
                    </Button>
                  </CardActions>
                </Grid>
              </Grid>
            </form>
          );
        }}
      </Formik>
    </div>
  );
}