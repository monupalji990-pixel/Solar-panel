import React, { useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Select from "react-select";
import CardActions from "@material-ui/core/CardActions";
import Icon from "@material-ui/core/Icon";
import { useDispatch, useSelector } from "react-redux";
import DateFnsUtils from "@date-io/date-fns";
import FormHelperText from "@material-ui/core/FormHelperText";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import moment from "moment";
import { renewalAction, selectRenewalState } from "../Redux/renewal";
import { RenewalServicesForDropdown } from "../../../sharedUtils/globalHelper/constantValues";
import {
  RenewalStatusForFilter,
  DataOfList,
} from "../../../sharedUtils/globalHelper/status";
import { assigneeAction, selectAssigneeState } from "projects/assignee/redux/assignee";

export default function Filter(props) {
  useEffect(() => {
    dispatch(assigneeAction.list(null))
  }, [])
  const renewalState = useSelector(selectRenewalState);
  const currentProps = props;
  const dispatch = useDispatch();
  const _loadingDataAction = (payload) =>
    dispatch(renewalAction.LoaderStart(payload));
  const _filterData = (payload) =>
    dispatch(renewalAction.renewalFilter(payload));

  let initDataOf = [];
  let initQuoteService = [];
  let initRenewalStatus = [];

  if (renewalState.filterData.DataOfArray !== undefined) {
    initDataOf = DataOfList.filter((data) => {
      return renewalState.filterData.DataOfArray.includes(data.value);
    });
  }
  if (renewalState.filterData.ServicesArray !== undefined) {
    initQuoteService = RenewalServicesForDropdown.filter((service) => {
      return renewalState.filterData.ServicesArray.includes(service.value);
    });
  }
  if (renewalState.filterData.StatusArray !== undefined) {
    initRenewalStatus = RenewalStatusForFilter.filter((renewal) => {
      return renewalState.filterData.StatusArray.includes(renewal.value);
    });
  }

  const assigneeState = useSelector(selectAssigneeState);

  let allPl = [];
  if (assigneeState.assigneeListForDropdown) allPl = assigneeState.assigneeListForDropdown.map((e) => ({ label: e.name, value: e._id }));

  return (
    <div className="app">
      <Formik
        initialValues={{
          dataOf:
            renewalState.filterData.DataOfArray !== undefined &&
              renewalState.filterData.DataOfArray.length > 0
              ? initDataOf
              : null,
          services:
            renewalState.filterData.ServicesArray !== undefined &&
              renewalState.filterData.ServicesArray.length > 0
              ? initQuoteService
              : null,
          status:
            renewalState.filterData.StatusArray !== undefined &&
              renewalState.filterData.StatusArray.length > 0
              ? initRenewalStatus
              : null,
          dateTo:
            renewalState.filterData.dateTo !== undefined
              ? renewalState.filterData.dateTo
              : null,
          dateFrom:
            renewalState.filterData.dateFrom !== undefined
              ? renewalState.filterData.dateFrom
              : null,
          Assignee: (renewalState.filterData.Assignee !== undefined) ? renewalState.filterData.Assignee : null

        }}
        enableReinitialize
        onSubmit={(values) => {
          const filterObject: any = {};
          if (values.dataOf)
            filterObject.DataOfArray = values.dataOf.map((v) => v.value);
          if (values.status)
            filterObject.StatusArray = values.status.map((v) => v.value);
          if (values.services)
            filterObject.ServicesArray = values.services.map((v) => v.value);
          if (values.dateTo)
            filterObject.dateTo = moment(values.dateTo).format("YYYY-MM-DD");
          if (values.dateFrom)
            filterObject.dateFrom = moment(values.dateFrom).format(
              "YYYY-MM-DD"
            );
          if (values.Assignee) filterObject.Assignee = values.Assignee

          _loadingDataAction(false);
          _filterData(filterObject);
        }}
        validationSchema={Yup.object().shape({
          dateFrom: Yup.date().nullable(),
          dateTo: Yup.date().test(
            "date-check",
            "To date must be greater than from date",
            function (value) {
              if (value === undefined || !value) return true;
              return (
                moment(this.parent.dateFrom).format("YYYY-MM-DD") <
                moment(value).format("YYYY-MM-DD")
              );
            }
          ).nullable(),
        })}
      >
        {(props) => {
          const {
            values,
            touched,
            errors,
            dirty,
            isSubmitting,
            handleChange,
            handleBlur,
            handleSubmit,
            handleReset,
            setFieldValue,
          } = props;

          return (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                  <Select
                    error={errors.dataOf && touched.dataOf ? true : false}
                    id="role"
                    className="WidhtFull100"
                    placeholder="Search Data of"
                    value={values.dataOf}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="dataOf-number-error"
                    onChange={(e) => setFieldValue("dataOf", e)}
                    isMulti
                    name="dataOf"
                    options={DataOfList}
                  />
                </Grid>
                <Grid item xs={12} md={12}>
                  <Select
                    error={errors.services && touched.services ? true : false}
                    id="role"
                    className="WidhtFull100"
                    placeholder="Services"
                    value={values.services}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="services-number-error"
                    onChange={(e) => setFieldValue("services", e)}
                    isMulti
                    name="services"
                    options={RenewalServicesForDropdown}
                  />
                </Grid>

                <Grid item xs={12} md={12}>
                  <Select
                    error={errors.status && touched.status ? true : false}
                    id="role"
                    className="WidhtFull100"
                    placeholder="Renewal Status"
                    value={values.status}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="status-number-error"
                    onChange={(e) => setFieldValue("status", e)}
                    isMulti
                    name="status"
                    options={RenewalStatusForFilter}
                  />
                </Grid>

                {
                  !['service_partner'].includes(currentProps.slug) ? <Grid item xs={12} md={12}>
                    <Select
                      error={errors.Assignee && touched.Assignee}
                      id="Assignee"
                      className="WidhtFull100 basic-multi-select"
                      placeholder="Assignee"
                      onBlur={handleBlur}
                      onChange={e => {

                        props.setFieldValue('Assignee', e);
                      }}
                      value={values.Assignee}
                      margin="normal"
                      aria-describedby="Assignee-number-error"
                      isMulti={false}
                      name="Assignee"
                      options={allPl}
                      classNamePrefix="select"
                    />
                  </Grid> : null
                }


                <Grid item xs={12} md={12}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-around">
                      <KeyboardDatePicker
                        error={
                          errors.dateFrom && touched.dateFrom ? true : false
                        }
                        margin="normal"
                        id="date-picker-dialog"
                        label="From Date"
                        className="WidhtFull100"
                        allowKeyboardControl
                        format="dd/MM/yyyy"
                        name="dateFrom"
                        value={values.dateFrom ? values.dateFrom : null}
                        onChange={(e) => setFieldValue("dateFrom", e)}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
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
                        error={errors.dateTo && touched.dateTo ? true : false}
                        id="date-picker-dialog"
                        label="To Date"
                        format="dd/MM/yyyy"
                        name="dateTo"
                        value={values.dateTo ? values.dateTo : null}
                        onChange={(e) => setFieldValue("dateTo", e)}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
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
                  <CardActions
                    style={{ paddingLeft: 0, paddingRight: 0, marginTop: 20 }}
                  >
                    <Button
                      size="large"
                      variant="contained"
                      onClick={() => {
                        handleReset();
                        props.resetForm();
                        // setChecked(false);
                        _loadingDataAction(false);
                        _filterData({});
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
