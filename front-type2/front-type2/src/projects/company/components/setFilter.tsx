import React, { useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import Select from "react-select";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import CardActions from "@material-ui/core/CardActions";
import Icon from "@material-ui/core/Icon";
import FormHelperText from "@material-ui/core/FormHelperText";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import MyDrawerLeft from "../../../sharedUtils/sharedComponents/drawerHelperLeft";
import { useDispatch, useSelector } from "react-redux";
import { assigneeAction, selectAssigneeState } from "projects/assignee/redux/assignee";
import { AM } from "../../../sharedUtils/globalHelper/constantValues";

export default function CompanyFilter(props) {
  return (
    <MyDrawerLeft
      open={props.open == "filterDrawer" ? true : false}
      onClose={props.onClose}
    >
      <CompanyFilterLogic
        {...props}
      />
    </MyDrawerLeft>
  );
}

function CompanyFilterLogic(props) {

  const dispatch = useDispatch();
  const assigneeState = useSelector(selectAssigneeState);
  const allAssignee = assigneeState.assigneeListForDropdown;

  useEffect(() => {
    dispatch(assigneeAction.list(null))
    props._partnerList();
  }, []);

  const currentProps = props;

  let pl = [];
  let initPl = [];

  if (props.partnerListForDropdown) {
    pl = props.partnerListForDropdown.map((e) => ({
      label: e.name,
      value: e._id,
    }));
  }

  if (props.filterData.PartnerArray !== undefined) {
    initPl = pl.filter((partner) => {
      return props.filterData.PartnerArray.findIndex((p) => {
        return p === partner.value;
      }) !== -1
        ? true
        : false;
    });
  }

  const ObspartnerOptions = [];
  const saleRepOptions = [];

  allAssignee.map(e => {
    if (e.role?.roleName == 'Observing Partner') {
      ObspartnerOptions.push({ ...e, value: e._id, label: e.name })
    }
    if (e.role?.roleName == 'Sales Rep') {
      saleRepOptions.push({ ...e, value: e._id, label: e.name })
    }
  })

  return (
    <div className="app">
      <Formik
        initialValues={{
          partner:
            props.filterData.PartnerArray1 !== undefined &&
              props.filterData.PartnerArray1.length > 0
              ? props.filterData.PartnerArray1
              : null,
          ObservingPartner: props.filterData.ObservingPartner !== undefined && props.filterData.ObservingPartner.length > 0 ? props.filterData.ObservingPartner : null,
          SalesRep: props.filterData.SalesRep !== undefined && props.filterData.SalesRep.length > 0 ? props.filterData.SalesRep : null,

          dateTo:
            props.filterData.dateTo !== undefined
              ? props.filterData.dateTo
              : "",
          dateFrom:
            props.filterData.dateFrom !== undefined
              ? props.filterData.dateFrom
              : "",
        }}
        enableReinitialize
        onSubmit={(values) => {
          const filterObject: any = {};
          let mergedArray = [];

          if (values.partner) {
            filterObject.PartnerArray1 = values.partner;
            mergedArray = [...mergedArray, ...values.partner]
          }

          if (values.dateTo)
            filterObject.dateTo = moment(values.dateTo).format("YYYY-MM-DD");

          if (values.dateFrom)
            filterObject.dateFrom = moment(values.dateFrom).format(
              "YYYY-MM-DD"
            );

          if (values.ObservingPartner) {
            filterObject.ObservingPartner = values.ObservingPartner;
            mergedArray = [...mergedArray, ...values.ObservingPartner]

          }

          if (values.SalesRep) {
            filterObject.SalesRep = values.SalesRep;
            mergedArray = [...mergedArray, ...values.SalesRep]
          }
          filterObject.mergedAssignee = mergedArray;
          props._loadingDataAction(false);
          props._filterData(filterObject);
        }}
        validationSchema={Yup.object().shape({
          dateFrom: Yup.date(),
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
          ),
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
                    error={errors.partner && touched.partner ? true : false}
                    id="role"
                    isMulti
                    className="WidhtFull100 basic-multi-select"
                    placeholder="Partner List"
                    value={values.partner}
                    margin="normal"
                    aria-describedby="partner-number-error"
                    onChange={(e) => setFieldValue("partner", e)}
                    onBlur={handleBlur}
                    name="partner"
                    options={pl}
                    classNamePrefix="select"
                  />
                </Grid>

                <Grid item xs={12} md={12}>
                  <Select
                    error={errors.ObservingPartner && touched.ObservingPartner ? true : false}
                    id="role"
                    isMulti
                    className="WidhtFull100 basic-multi-select"
                    placeholder="Observing Partner"
                    value={values.ObservingPartner}
                    margin="normal"
                    aria-describedby="ObservingPartner-number-error"
                    onChange={(e) => setFieldValue("ObservingPartner", e)}
                    onBlur={handleBlur}
                    name="ObservingPartner"
                    options={ObspartnerOptions}
                    classNamePrefix="select"
                  />
                </Grid>

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