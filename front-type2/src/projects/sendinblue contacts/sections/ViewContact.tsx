import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectContactOptions,
  selectSendinblueContactState,
  contactAction,
} from "../redux/sendinblueContact";
import MyDrawer from "../../../sharedUtils/sharedComponents/drawerHelper";
import {
  Grid,
  Table,
  TableContainer,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  TextField,
} from "@material-ui/core";
import { AMPS } from "../../../sharedUtils/globalHelper/constantValues";
import OnTextEditInput from "../../../sharedUtils/sharedComponents/editHelpers2/onTextEditHelper";
import * as Yup from "yup";
import Select from "react-select";

export default function ViewContact(props) {
  const templateState = useSelector(selectSendinblueContactState);
  const templateOptions = useSelector(selectContactOptions);
  const dispatch = useDispatch();

  function handleClose() {
    dispatch(contactAction.changeViewTemplateDrawerStatus(false));
  }

  const ds =
    props.showingFrom &&
      ["viewCompany", "viewQuote", "viewLead", "viewConsumer"].includes(
        props.showingFrom
      )
      ? "960px"
      : "850px";

  return (
    <MyDrawer
      drawerSize='850px'
      iconName="Contact"
      open={templateOptions.openViewContactDrawer}
      onClose={handleClose}
    >
      <Grid container justify="center">
        {templateState.isLoadingData == true ? (
          <CircularProgress style={{ justifySelf: "center" }} />
        ) : (
          <ViewContactLogic {...props} />
        )}
      </Grid>
    </MyDrawer>
  );
}

function ViewContactLogic(props) {
  const contactState = useSelector(selectSendinblueContactState);
  const contact = contactState.viewContact;
  const listIds = []
  const unlinkListIds = []

  useEffect(() => {
    props._getlistOfContactList();
  }, []);

  let options = [];
  if (contactState?.listContactList?.lists?.length > 0) {
    options = contactState.listContactList.lists.map((e) => {
      return { label: e.name, value: e.id };
    })
  }

  function simpleEdit(values, setEditKey) {
    let updateObj: any = {};
    updateObj.attributes = {}
    if (values.email) {
      updateObj.attributes.EMAIL = values.email;
    }
    if (values.firstname) {
      updateObj.attributes.FIRSTNAME = values.firstname;
    }
    if (values.lastname) {
      updateObj.attributes.LASTNAME = values.lastname;
    }
    if (values.sms) {
      updateObj.attributes.SMS = values.sms;
    }
    updateObj.identifier = contact.email;

    let filterListIds = listIds.filter((listId) => {
      let found = false;
      for (let i = 0; i < contact.listIds.length; i++) {
        if (listId !== contact.listIds[i]) {
          found = false;
        } else
          return false;
      }
      return true;
    })

    let filteredUnlinkListIds = unlinkListIds.filter((listId) => {
      let found = false;
      for (let i = 0; i < listIds.length; i++) {
        if (listId === listIds[i])
          return false;
      }
      return true;
    });

    if (filterListIds.length > 0) {
      updateObj.listIds = filterListIds;
    }
    if (filteredUnlinkListIds.length > 0) {
      updateObj.unlinkListIds = filteredUnlinkListIds
    }
    props._editContact(updateObj);
  }

  return (
    <Grid container justify="center">
      <Grid item md={12} xs={12}>
        <TableContainer>
          <Table aria-label="caption table">
            <TableBody>
              <TableRow>
                <TableCell>
                  <strong>Email</strong>
                </TableCell>
                {AMPS.includes(contactState.slug) ?
                  (
                    <TableCell component="th" scope="row">
                      <OnTextEditInput
                        name="email"
                        value={contact.email}
                        onSubmit={simpleEdit}
                        validateIt={Yup.object().shape({
                          email: Yup.string().required("Required"),
                        })}
                      >
                        {(props) => {
                          return (
                            <TextField
                              error={
                                props.errors.email &&
                                  props.touched.email
                                  ? true
                                  : false
                              }
                              className="profile-pic"
                              name="email"
                              value={props.values.email}
                              onChange={props.handleChange}
                              helperText={!props.errors.email}
                              onBlur={props.handleBlur}
                              margin="normal"
                            />
                          );
                        }}
                      </OnTextEditInput>
                    </TableCell>
                  ) : (
                    <TableCell component="th" scope="row">
                      {contact.email}
                    </TableCell>
                  )
                }
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>First Name</strong>
                </TableCell>
                {AMPS.includes(contactState.slug) ?
                  (
                    <TableCell component="th" scope="row">
                      <OnTextEditInput
                        name="firstname"
                        value={contact.attributes.FIRSTNAME}
                        onSubmit={simpleEdit}
                        validateIt={Yup.object().shape({
                          firstname: Yup.string().required("Required"),
                        })}
                      >
                        {(props) => {
                          return (
                            <TextField
                              error={
                                props.errors.firstname &&
                                  props.touched.firstname
                                  ? true
                                  : false
                              }
                              className="profile-pic"
                              name="firstname"
                              value={props.values.firstname}
                              onChange={props.handleChange}
                              helperText={!props.errors.firstname}
                              onBlur={props.handleBlur}
                              margin="normal"
                            />
                          );
                        }}
                      </OnTextEditInput>
                    </TableCell>
                  ) : (
                    <TableCell component="th" scope="row">
                      {contact.attributes.FIRSTNAME}
                    </TableCell>
                  )
                }
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Last Name</strong>
                </TableCell>
                {AMPS.includes(contactState.slug) ?
                  (
                    <TableCell component="th" scope="row">
                      <OnTextEditInput
                        name="lastname"
                        value={contact.attributes.LASTNAME}
                        onSubmit={simpleEdit}
                        validateIt={Yup.object().shape({
                          lastname: Yup.string().required("Required"),
                        })}
                      >
                        {(props) => {
                          return (
                            <TextField
                              error={
                                props.errors.lastname &&
                                  props.touched.lastname
                                  ? true
                                  : false
                              }
                              className="profile-pic"
                              name="lastname"
                              value={props.values.lastname}
                              onChange={props.handleChange}
                              helperText={!props.errors.lastname}
                              onBlur={props.handleBlur}
                              margin="normal"
                            />
                          );
                        }}
                      </OnTextEditInput>
                    </TableCell>
                  ) : (
                    <TableCell component="th" scope="row">
                      {contact.attributes.LASTNAME}
                    </TableCell>
                  )
                }
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>SMS</strong>
                </TableCell>
                {AMPS.includes(contactState.slug) ?
                  (
                    <TableCell component="th" scope="row">
                      <OnTextEditInput
                        name="sms"
                        value={contact.attributes.SMS}
                        onSubmit={simpleEdit}
                        validateIt={Yup.object().shape({
                          sms: Yup.string().required("Required"),
                        })}
                      >
                        {(props) => {
                          return (
                            <TextField
                              error={
                                props.errors.sms &&
                                  props.touched.sms
                                  ? true
                                  : false
                              }
                              className="profile-pic"
                              name="sms"
                              value={props.values.sms}
                              onChange={props.handleChange}
                              helperText={!props.errors.sms}
                              onBlur={props.handleBlur}
                              margin="normal"
                            />
                          );
                        }}
                      </OnTextEditInput>
                    </TableCell>
                  ) : (
                    <TableCell component="th" scope="row">
                      {contact.attributes.SMS}
                    </TableCell>
                  )
                }
              </TableRow>
              <TableRow>
                <TableCell>
                  <strong>Contact List</strong>
                </TableCell>
                <TableCell component="th" scope="row">
                  <OnTextEditInput
                    name="contactList"
                    value={
                      contact.listData.map(e => e.name).join(',')
                    }
                    onSubmit={simpleEdit}
                    validateIt={Yup.object().shape({
                      contactList: Yup.array()
                        .required("Contact list is required")
                        .nullable(),
                    })}
                  >
                    {(props) => (
                      <Grid className="RatingInfo">
                        <Select
                          error={
                            props.errors.contactList &&
                            props.touched.contactList
                          }
                          className="WidhtFull100 basic-multi-select"
                          isMulti
                          onChange={(e, actions) => {
                            // console.log(e,actions);
                            if (actions.action === "select-option") {
                              if (listIds.indexOf(actions.option.value) === -1)
                                listIds.push(actions.option.value);
                            }
                            if (actions.action === "remove-value") {
                              if (unlinkListIds.indexOf(actions.removedValue.value) === -1)
                                unlinkListIds.push(actions.removedValue.value);
                              if (listIds.indexOf(actions.removedValue.value) !== -1)
                                listIds.splice(listIds.indexOf(actions.removedValue.value), 1);
                            }

                            props.setFieldValue("contactList", e);
                          }}
                          onBlur={props.handleBlur}
                          margin="normal"
                          options={options}
                          defaultValue={contact.listData.map(e => ({ label: e.name, value: e.id }))}
                          classNamePrefix="select"
                        />
                      </Grid>
                    )}
                  </OnTextEditInput>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  )
}