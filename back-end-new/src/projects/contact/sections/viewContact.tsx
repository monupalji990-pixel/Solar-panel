import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import CircularProgress from "@material-ui/core/CircularProgress";
import { helperMethods } from "../../../sharedUtils/globalHelper/helperMethod";
import OnTextEditInput from "../../../sharedUtils/sharedComponents/editHelpers2/onTextEditHelper";
import { contactAction, selectContactState } from "../redux/contact";
import { selectCompanyState } from "projects/company/redux/company";

export default function viewContact(props) {
  const contactState = useSelector(selectContactState);
  const companyState = useSelector(selectCompanyState);

  const {
    hideSideBar,
    isLoadingData,
    singleContact,
  } = contactState;

  const dispatch = useDispatch();

  const _isLoadingData = (payload) =>
    dispatch(contactAction.LoaderAction(payload));
  const _editContact = (payload) =>
    dispatch(contactAction.EditContact(payload));
  const _slugUpdate = (payload) => dispatch(contactAction.SlugUpdate(payload));
  const _closeSideBar = (payload) =>
    dispatch(contactAction.CloseSideBar(payload));
  const _viewContact = (payload) =>
    dispatch(contactAction.ViewSingleContact(payload));

  useEffect(() => {
    _isLoadingData(true);
    _slugUpdate({
      slug: props.slug,
      contactId: props.contact !== undefined ? props.contact._id : "",
    });
    _viewContact(null);
  }, []);

  if (hideSideBar) {
    props.onClose();
    _closeSideBar(false);
  }

  const updateEmail = (input) => {
    const x = input.split("@");
    const timeStamp = new Date().getTime();
    x.splice(1, 0, '+', timeStamp, "@")
    return x.join('');
  }

  const simpleEdit = (value) => {
    const editUser: any = {
      findId: singleContact._id,
      editData: {},
    };
    editUser.companyId = companyState.currentCompany._id;
    if (value.name) editUser.editData.name = value.name;
    if (value.phone) editUser.editData.phone = value.phone;
    if (value.mobile) editUser.editData.mobile = value.mobile;
    if (value.email) editUser.editData.email = updateEmail(value.email);
    if (value.secondary_email)
      editUser.editData.secondary_email = value.secondary_email;
    if (value.jobTitle) editUser.editData.jobTitle = value.jobTitle;
    if (value.DOB) editUser.editData.DOB = value.DOB;
    if (value.nationalInsurance)
      editUser.editData.nationalInsurance = value.nationalInsurance;
    if (value.homeAddress) editUser.editData.homeAddress = value.homeAddress;
    if (value.previousAddress) editUser.editData.previousAddress = value.previousAddress;
    if (value.previousAddressYear) editUser.editData.previousAddressYear = value.previousAddressYear;
    _isLoadingData(true);
    _editContact(editUser);
  };

  const {
    name,
    phone,
    mobile,
    email,
    secondary_email,
    jobTitle,
    DOB,
    nationalInsurance,
    homeAddress,
    previousAddress,
    previousAddressYear
  } = singleContact || {};

  if (isLoadingData) {
    return (
      <Grid container direction="row" justify="center" alignItems="center">
        <CircularProgress />
      </Grid>
    );
  }

  return (
    <Grid container spacing={3} className="txt-uppercase">
      <Grid item md={8} xs={12}>
        <TableContainer component={Paper}>
          <Table aria-label="caption table">
            <TableBody>
              <TableRow>
                <TableCell>
                  <strong>Contact Name</strong>
                </TableCell>
                {["admin", "management", "partner", "sales_rep"].includes(
                  props.slug
                ) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="name"
                      value={name ? name : 'N/A'}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        name: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.name && props.touched.name
                                ? true
                                : false
                            }
                            name="name"
                            value={props.values.name}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            margin="normal"
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    {name}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Contact Office Number</strong>
                </TableCell>
                {["admin", "management", "partner", "sales_rep"].includes(
                  props.slug
                ) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="phone"
                      value={phone ? phone : 'N/A'}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        phone: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.phone && props.touched.phone
                                ? true
                                : false
                            }
                            name="phone"
                            value={props.values.phone}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            margin="normal"
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    {phone}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Contact Mobile Number</strong>
                </TableCell>
                {["admin", "management", "partner", "sales_rep"].includes(
                  props.slug
                ) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="mobile"
                      value={mobile ? mobile : 'N/A'}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        mobile: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.mobile && props.touched.mobile
                                ? true
                                : false
                            }
                            name="mobile"
                            value={props.values.mobile}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            margin="normal"
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    {mobile}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Contact Email</strong>
                </TableCell>
                {["admin", "management", "partner", "sales_rep"].includes(
                  props.slug
                ) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="email"
                      value={email ? email.replace(/\+[0-9]+/g, "") : 'N/A'}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        email: Yup.string().email("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.email && props.touched.email
                                ? true
                                : false
                            }
                            name="email"
                            value={props.values.email}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            margin="normal"
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    {email}
                  </TableCell>
                )}
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Secondary Email</strong>
                </TableCell>
                {["admin", "management", "partner", "sales_rep"].includes(
                  props.slug
                ) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="secondary_email"
                      value={secondary_email ? secondary_email : "N/A"}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        secondary_email: Yup.string().email("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.secondary_email &&
                                props.touched.secondary_email
                                ? true
                                : false
                            }
                            name="secondary_email"
                            value={props.values.secondary_email}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            margin="normal"
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    {secondary_email}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Job Title</strong>
                </TableCell>
                {["admin", "management", "partner", "sales_rep"].includes(
                  props.slug
                ) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="jobTitle"
                      value={jobTitle ? jobTitle : 'N/A'}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        jobTitle: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.jobTitle && props.touched.jobTitle
                                ? true
                                : false
                            }
                            name="jobTitle"
                            value={props.values.jobTitle}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            margin="normal"
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    {jobTitle}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>DOB</strong>
                </TableCell>
                {["admin", "management", "partner", "sales_rep"].includes(
                  props.slug
                ) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="DOB"
                      value={
                        DOB !== undefined && DOB
                          ? helperMethods.ConvertDate(DOB)
                          : ""
                      }
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        DOB: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Grid container justify="space-around">
                              <KeyboardDatePicker
                                error={
                                  props.errors.DOB && props.touched.DOB
                                    ? true
                                    : false
                                }
                                disableFuture
                                margin="normal"
                                className="profile-pic"
                                name="DOB"
                                format="dd/MM/yyyy"
                                value={props.values.DOB}
                                onChange={(e) =>
                                  props.setFieldValue("DOB", new Date(e))
                                }
                                KeyboardButtonProps={{
                                  "aria-label": "change date",
                                }}
                                aria-describedby="DOB-number-error"
                              />
                            </Grid>
                          </MuiPickersUtilsProvider>
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    {DOB !== undefined && DOB
                      ? helperMethods.ConvertDate(DOB)
                      : ""}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>National Insurance Number</strong>
                </TableCell>
                {["admin", "management", "partner", "sales_rep"].includes(
                  props.slug
                ) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="nationalInsurance"
                      value={nationalInsurance ? nationalInsurance : 'N/A'}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        nationalInsurance: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.nationalInsurance &&
                                props.touched.nationalInsurance
                                ? true
                                : false
                            }
                            name="nationalInsurance"
                            value={props.values.nationalInsurance}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            margin="normal"
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    {nationalInsurance}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Home Address</strong>
                </TableCell>
                {["admin", "management", "partner", "sales_rep"].includes(
                  props.slug
                ) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="homeAddress"
                      value={homeAddress ? homeAddress : 'N/A'}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        homeAddress: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.homeAddress &&
                                props.touched.homeAddress
                                ? true
                                : false
                            }
                            name="homeAddress"
                            value={props.values.homeAddress}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            margin="normal"
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    {homeAddress}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Previous Address</strong>
                </TableCell>
                {["admin", "management", "partner", "sales_rep"].includes(
                  props.slug
                ) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="previousAddress"
                      value={previousAddress ? previousAddress : 'N/A'}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        previousAddress: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.previousAddress &&
                                props.touched.previousAddress
                                ? true
                                : false
                            }
                            name="previousAddress"
                            value={props.values.previousAddress}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            margin="normal"
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    {previousAddress}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Previous Address Years</strong>
                </TableCell>
                {["admin", "management", "partner", "sales_rep"].includes(
                  props.slug
                ) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="previousAddressYear"
                      value={previousAddressYear ? previousAddressYear : 'N/A'}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        previousAddressYear: Yup.number().positive().integer().required('This is Required')
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.previousAddressYear &&
                                props.touched.previousAddressYear
                                ? true
                                : false
                            }
                            name="previousAddressYear"
                            type="number"
                            inputProps={{ min: 0 }}
                            value={props.values.previousAddressYear}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            margin="normal"
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    {previousAddressYear}
                  </TableCell>
                )}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}
