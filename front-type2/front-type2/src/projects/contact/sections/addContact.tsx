import React, { useEffect, useState, useCallback } from "react";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import Grid from "@material-ui/core/Grid";
import CardActions from "@material-ui/core/CardActions";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import CircularProgress from "@material-ui/core/CircularProgress";
import { validation } from "../../../sharedUtils/globalHelper/validationConstant";
import { contactAction, selectContactState } from "../redux/contact";
import { selectCompanyState } from "projects/company/redux/company";
import { campaignAction, selectCampaignState, sliceKeyCampaign, campaignReducer, campaignSaga } from 'projects/campaign/redux/campaign';
import Lodash from 'lodash';
import Select from "react-select";
import { useInjectReducer, useInjectSaga } from "utils/redux-injectors";

export default function addContact(props) {

  useInjectReducer({ key: sliceKeyCampaign, reducer: campaignReducer });
  useInjectSaga({ key: sliceKeyCampaign, saga: campaignSaga })

  const contactState = useSelector(selectContactState);
  const companyState = useSelector(selectCompanyState);

  const dispatch = useDispatch();

  const _addContact = (payload) =>
    dispatch(contactAction.addCompanyContact(payload));
  const _closeSideBar = (payload) =>
    dispatch(contactAction.CloseSideBar(payload));

  useEffect(() => {
    if (contactState.isLoadingData == false) {
      setStartLoader(false);
    }
  }, [contactState.isLoadingData]);

  let options = [];
  if (props?.contactState?.listContactList?.lists?.length > 0) {
    options = props.contactState.listContactList.lists.map((e) => {
      return { label: e.name, value: e.id };
    })
  }

  const [startLoader, setStartLoader] = useState(false);

  const campaignState = useSelector(selectCampaignState)
  const contctlistsState = campaignState.contactlists;

  function handleSearchContactlists(payload) {
    dispatch(campaignAction.changeSearchlistContactList({ search: payload.search }));
  }

  const delayedHandleSearchContactlists = useCallback(
    Lodash.debounce((payload) => {
      handleSearchContactlists(payload);
    }, 500),
    []
  );

  function handleScolldownContactlists() {
      dispatch(campaignAction.changePagelistContactList({ skip: contactlistsOption.length, limit: contctlistsState.limit }))
  }

  const [contactlistsOption, setContactlistsOption] = useState([]);

  useEffect(() => {
    const list = contctlistsState.list.map(e => ({ value: e.id, label: e.name }));
    setContactlistsOption(list)

  }, [contctlistsState.list])

  useEffect(() => {
    dispatch(campaignAction.SlugUpdate({ slug: props.slug }));

    if (contctlistsState.list?.length <= 0)
      dispatch(campaignAction.listContactList(null));
  }, [])


  var initialValues: any = {
    contactName: "",
    contactEmail: "",
    secondary_email: "",
    contactOffice: "",
    contactMobile: "",
    jobTitle: "",
    dob: null,
    nationalInsurance: "",
    registerNumber: "",
    homeAddress: "",
    companyId: "",
    listIds: [],
    previousAddress: '',
    previousAddressYear: '',
  };

  const updateEmail = (input) => {
    const x = input.split("@");
    const timeStamp = new Date().getTime();
    x.splice(1, 0, '+', timeStamp, "@")
    return x.join('');
  }

  return (
    <div className="app">
      <Formik
        initialValues={initialValues}
        onSubmit={(value, { setSubmitting, resetForm, setErrors }) => {
          value.companyId = props.currentCompany?._id;
          if (value.dob) value.dob = new Date(value.dob).getTime();
          const so: any = { ...value };
          if (value.contactEmail) so.contactEmail = updateEmail(value.contactEmail);
          so.listIds = value.listIds.map(e => e.value);
          setStartLoader(true);
          _addContact(so);
          // resetForm();
        }}
        validationSchema={Yup.object().shape({
          contactName: Yup.string().required("Contact name is required"),
          contactOffice: Yup.string()
            .matches(
              validation.phoneRegExp,
              "Contact office number is not valid"
            )
            .required("Contact office number is required"),
          contactMobile: Yup.string()
            .matches(validation.phoneRegExp, "Contact number is not valid")
            .required("Contact mobile is required"),
          contactEmail: Yup.string().required("Contact email is required"),
          jobTitle: Yup.string().required("Job title is required"),
          dob: Yup.date().required("DOB is required").nullable(),
          nationalInsurance: Yup.string().required(
            "National insurance number is required"
          ),
          homeAddress: Yup.string().required("Home address is required"),
          listIds: Yup.array().required('SendInBlue recipient lists are required').nullable(),
          previousAddress: Yup.string().required('This is Required'),
          previousAddressYear: Yup.number().positive().integer().required('This is Required')
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
                <Grid item xs={12} md={6}>
                  <TextField
                    variant="outlined"
                    error={
                      errors.contactName && touched.contactName ? true : false
                    }
                    id="contactName"
                    className="WidhtFull100"
                    label="Contact name"
                    type="name"
                    value={values.contactName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="contactName-error"
                  />
                  {errors.contactName && touched.contactName && (
                    <FormHelperText className="errormsg" id="contactName-error">
                      {errors.contactName}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    variant="outlined"
                    error={
                      errors.contactOffice && touched.contactOffice
                        ? true
                        : false
                    }
                    id="contactOffice"
                    label="Contact office number"
                    className="WidhtFull100"
                    type="contactOffice"
                    value={values.contactOffice}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="contactOffice-error"
                  />
                  {errors.contactOffice && touched.contactOffice && (
                    <FormHelperText
                      className="errormsg"
                      id="contactOffice-error"
                    >
                      {errors.contactOffice}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    variant="outlined"
                    error={
                      errors.contactMobile && touched.contactMobile
                        ? true
                        : false
                    }
                    id="contactMobile"
                    label="Contact Mobile number"
                    className="WidhtFull100"
                    type="contactMobile"
                    value={values.contactMobile}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="contactMobile-error"
                  />
                  {errors.contactMobile && touched.contactMobile && (
                    <FormHelperText
                      className="errormsg"
                      id="contactMobile-error"
                    >
                      {errors.contactMobile}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    variant="outlined"
                    error={
                      errors.contactEmail && touched.contactEmail ? true : false
                    }
                    id="contactEmail"
                    label="Contact Email"
                    className="WidhtFull100"
                    type="contactEmail"
                    value={values.contactEmail}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="contactEmail-error"
                  />
                  {errors.contactEmail && touched.contactEmail && (
                    <FormHelperText
                      className="errormsg"
                      id="contactEmail-error"
                    >
                      {errors.contactEmail}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    variant="outlined"
                    error={
                      errors.secondary_email && touched.secondary_email ? true : false
                    }
                    id="secondary_email"
                    label="Secondary Email"
                    className="WidhtFull100"
                    type="secondary_email"
                    value={values.secondary_email}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="secondary_email-error"
                  />
                  {errors.secondary_email && touched.secondary_email && (
                    <FormHelperText
                      className="errormsg"
                      id="secondary_email-error"
                    >
                      {errors.secondary_email}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    variant="outlined"
                    error={errors.jobTitle && touched.jobTitle ? true : false}
                    id="jobTitle"
                    className="WidhtFull100"
                    label="Job Title"
                    type="jobTitle"
                    value={values.jobTitle}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="jobTitle-error"
                  />
                  {errors.jobTitle && touched.jobTitle && (
                    <FormHelperText className="errormsg" id="jobTitle-error">
                      {errors.jobTitle}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-around">
                      <KeyboardDatePicker
                        clearable
                        variant="dialog"
                        error={errors.dob && touched.dob ? true : false}
                        disableFuture
                        inputVariant="outlined"
                        margin="normal"
                        id="dob"
                        className="WidhtFull100"
                        placeholder="Date of Birth"
                        allowKeyboardControl
                        format="dd/MM/yyyy"
                        value={values.dob ? values.dob : null}
                        onChange={(e) => setFieldValue("dob", e)}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        aria-describedby="dob-error"
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                  {errors.dob && touched.dob && (
                    <FormHelperText className="errormsg" id="dob-error">
                      {errors.dob}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    variant="outlined"
                    error={
                      errors.nationalInsurance && touched.nationalInsurance
                        ? true
                        : false
                    }
                    id="nationalInsurance"
                    className="WidhtFull100"
                    label="National Insurance number"
                    type="text"
                    value={values.nationalInsurance}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="nationalInsurance-error"
                  />
                  {errors.nationalInsurance && touched.nationalInsurance && (
                    <FormHelperText
                      className="errormsg"
                      id="nationalInsurance-error"
                    >
                      {errors.nationalInsurance}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    variant="outlined"
                    error={
                      errors.homeAddress && touched.homeAddress ? true : false
                    }
                    id="homeAddress"
                    className="WidhtFull100"
                    label="Home Address"
                    type="homeAddress"
                    value={values.homeAddress}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="homeAddress-error"
                  />
                  {errors.homeAddress && touched.homeAddress && (
                    <FormHelperText className="errormsg" id="homeAddress-error">
                      {errors.homeAddress}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    variant="outlined"
                    error={
                      errors.previousAddress && touched.previousAddress ? true : false
                    }
                    id="previousAddress"
                    className="WidhtFull100"
                    label="Previous Address"

                    value={values.previousAddress}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="previousAddress-error"
                  />
                  {errors.previousAddress && touched.previousAddress && (
                    <FormHelperText className="errormsg" id="previousAddress-error">
                      {errors.previousAddress}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    variant="outlined"
                    error={
                      errors.previousAddressYear && touched.previousAddressYear ? true : false
                    }
                    id="previousAddressYear"
                    className="WidhtFull100"
                    label="Previous Address Years"
                    type='number'
                    inputProps={{ min: 0 }}
                    value={values.previousAddressYear}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="previousAddressYear-error"
                  />
                  {errors.previousAddressYear && touched.previousAddressYear && (
                    <FormHelperText className="errormsg" id="previousAddressYear-error">
                      {errors.previousAddressYear}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  <Select
                    className={
                      errors.listIds && touched.listIds
                        ? "ErrorColor"
                        : ""
                    }
                    id="listIds"
                    placeholder="Select Contact List"
                    value={values.listIds}
                    onChange={(e) => {
                      setFieldValue("listIds", e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="listIds-error"
                    isMulti
                    options={contactlistsOption}
                    onMenuScrollToBottom={
                      handleScolldownContactlists
                    }
                    isSearchable={true}
                    isLoading={contctlistsState.isLoading}
                  />
                  {errors.listIds && touched.listIds && (
                    <FormHelperText
                      className="errormsg"
                      id="listIds-error"
                    >
                      {errors.listIds}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>

              <CardActions
                style={{ paddingLeft: 0, paddingRight: 0, marginTop: 20 }}
              >
                <Button
                  size="medium"
                  variant="contained"
                  onClick={handleReset}
                  disabled={!dirty || isSubmitting}
                >
                  Reset
                </Button>
                <Button
                  size="medium"
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Add Contact
                </Button>
                {startLoader && <CircularProgress />}
              </CardActions>
            </form>
          );
        }}
      </Formik>
    </div>
  );
}