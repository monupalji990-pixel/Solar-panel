import Grid from "@material-ui/core/Grid";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import OnTextEditInput from "../../../../../sharedUtils/sharedComponents/editHelpers2/onTextEditHelper";
import { AM } from "../../../../../sharedUtils/globalHelper/constantValues";
import {
  selectSupplier_contactState,
  supplier_contactAction,
} from "../redux/supplier_contact";

export default function ViewContact(props) {
  const supplier_contactState = useSelector(selectSupplier_contactState);
  const { currentContact, supplierId, hideSideBar, remote } = {
    ...supplier_contactState,
  };
  const dispatch = useDispatch();

  const _loadingDataAction = (payload) =>
    dispatch(supplier_contactAction.supplier_contactLoaderStart(payload));
  const _closeSideBar = (payload) =>
    dispatch(supplier_contactAction.supplier_contactCloseSideBar(payload));
  const _viewContact = (payload) =>
    dispatch(supplier_contactAction.viewSupplier_contactReq(payload));
  const _editContact = (payload) =>
    dispatch(supplier_contactAction.updateSupplier_contact(payload));

  useEffect(() => {
    _loadingDataAction(false);
    _viewContact(props);
  }, []);

  if (hideSideBar) {
    props.onClose();
    _closeSideBar(false);
  }

  const simpleEdit = (data) => {
    const updateObject = {
      supplierId: supplierId,
      editData: { ...currentContact },
    };
    updateObject.editData.previousEmail = currentContact.Email;
    if (data.ContactPersonName)
      updateObject.editData.ContactPersonName = data.ContactPersonName;
    if (data.Email) updateObject.editData.Email = data.Email;
    if (data.Address) updateObject.editData.Address = data.Address;
    if (data.jobTitle) updateObject.editData.jobTitle = data.jobTitle;
    if (data.TelephoneNumber)
      updateObject.editData.TelephoneNumber = data.TelephoneNumber;
    if (data.Department) updateObject.editData.Department = data.Department;
    _editContact(updateObject);
  };

  const {
    ContactPersonName,
    Department,
    Email,
    Address,
    jobTitle,
    TelephoneNumber,
  } = currentContact;

  if (!remote) {
    return (
      <Grid container direction="row" justify="center" alignItems="center">
        <CircularProgress />
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid item md={12} xs={12}>
        <TableContainer component={Paper}>
          <Table aria-label="caption table">
            <TableBody>
              <TableRow>
                <TableCell>
                  <strong>Contact Person Name</strong>
                </TableCell>
                {AM.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="ContactPersonName"
                      value={ContactPersonName}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        ContactPersonName: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              !!(
                                props.errors.ContactPersonName &&
                                props.touched.ContactPersonName
                              )
                            }
                            name="ContactPersonName"
                            value={props.values.ContactPersonName}
                            helperText={!props.errors.ContactPersonName}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            margin="normal"
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell>{ContactPersonName}</TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Email</strong>
                </TableCell>
                {AM.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="Email"
                      value={Email}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        Email: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              !!(props.errors.Email && props.touched.Email)
                            }
                            name="Email"
                            value={props.values.Email}
                            helperText={!props.errors.Email}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            margin="normal"
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell>{Email}</TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Telephone Number</strong>
                </TableCell>
                {AM.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="TelephoneNumber"
                      value={TelephoneNumber}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        TelephoneNumber: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              !!(
                                props.errors.TelephoneNumber &&
                                props.touched.TelephoneNumber
                              )
                            }
                            name="TelephoneNumber"
                            value={props.values.TelephoneNumber}
                            helperText={!props.errors.TelephoneNumber}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            margin="normal"
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell>{TelephoneNumber}</TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Department</strong>
                </TableCell>
                {AM.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="Department"
                      value={Department}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        Department: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              !!(
                                props.errors.Department &&
                                props.touched.Department
                              )
                            }
                            name="Department"
                            value={props.values.Department}
                            helperText={!props.errors.Department}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            margin="normal"
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell>{Department}</TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Job Title</strong>
                </TableCell>
                {AM.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="jobTitle"
                      value={jobTitle}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        jobTitle: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              !!(
                                props.errors.jobTitle && props.touched.jobTitle
                              )
                            }
                            name="jobTitle"
                            value={props.values.jobTitle}
                            helperText={!props.errors.jobTitle}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            margin="normal"
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell>{jobTitle}</TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Address</strong>
                </TableCell>
                {AM.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="Address"
                      value={Address}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        Address: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              !!(props.errors.Address && props.touched.Address)
                            }
                            name="Address"
                            value={props.values.Address}
                            helperText={!props.errors.Address}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            margin="normal"
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell>{Address}</TableCell>
                )}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
}
