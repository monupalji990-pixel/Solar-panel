// @ts-nocheck
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import FormHelperText from "@material-ui/core/FormHelperText";
import CardActions from "@material-ui/core/CardActions";
import Switch from "@material-ui/core/Switch";
import CircularProgress from "@material-ui/core/CircularProgress";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import { selectItemState, itemAdminAction } from "../redux/itemAdmin";
import OnTextEditInput from "../../../sharedUtils/sharedComponents/editHelpers2/onTextEditHelper";
import OnTextEditInputForColor from "../../../sharedUtils/sharedComponents/editHelpers2/onTextEditHelperForColor";
import {
  PasswordMasking,
  PasswordMaskingSame,
} from "../../../sharedUtils/sharedComponents/passwordMasking";
import MyDrawer from "../../../sharedUtils/sharedComponents/drawerHelper";
import { selectGlobalConfig } from "sharedUtils/sharedRedux/configuration";
import DeleteUser from "./deleteItem";
import { Common as HistoryTable } from "../../history/loadable/Common";
import SelectCity from '../../../sharedUtils/sharedComponents/editHelpers2/editHelperSelectForCity';
import PaymentHistory from './viewPayments'
import { AMS, InstallerTypeOptions } from "sharedUtils/globalHelper/constantValues";
import Select from "react-select";
import { helperMethods } from "sharedUtils/globalHelper/helperMethod";

export default function EditItem(props) {
  return (
    <MyDrawer
      drawerSize="600px"
      iconName="Item"
      open={props.open === "editItemDrawer"}
      onClose={props.onClose.bind(this)}
    >
      <EditItemLogic {...props} />
    </MyDrawer>
  );
}

function EditItemLogic(props) {
  const itemState = useSelector(selectItemState);
  const { hideSideBar, message, isLoadingData } = itemState;
  const dispatch = useDispatch();

  const _editItem = (payload) => dispatch(itemAdminAction.editItem(payload));

  const currentProps = props;

  const [startLoader, setStartLoader] = useState(false);

  const { title, description, price, _id } = currentProps.user;

  const simpleEdit = (data, closeEdit, setSubmitting) => {
    setStartLoader(true)

    const updateObject = {
      _id: _id,
    };

    if (data.title) updateObject.title = data.title;
    if (data.description) updateObject.description = data.description;
    if (data.price) updateObject.price = data.price;
    _editItem(updateObject);

    setTimeout(() => {
      setStartLoader(false)
      closeEdit(null);
      setSubmitting(false);
      props.onClose()
    }, 2000)
  };

  if (startLoader) {
    return (
      <Grid container direction="row" justify="center" alignItems="center">
        <CircularProgress />
      </Grid>
    );
  }

  return (
    <div className="txt-uppercase">
      <Grid container spacing={3}>
        <Grid item md={12} xs={12}>
          <TableContainer component={Paper}>
            <Table aria-label="caption table">
              <TableBody>
                <TableRow>
                  <TableCell>
                    <strong>Title</strong>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="title"
                      value={title}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        title: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              !!(props.errors.title && props.touched.title)
                            }
                            name="title"
                            value={props.values.title}
                            onChange={props.handleChange}
                            helperText={!props.errors.title}
                            onBlur={props.handleBlur}
                            margin="normal"
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <strong>Price</strong>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="price"
                      value={price}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        price: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              !!(props.errors.price && props.touched.price)
                            }
                            name="price"
                            value={props.values.price}
                            onChange={props.handleChange}
                            helperText={!props.errors.price}
                            onBlur={props.handleBlur}
                            margin="normal"
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell>
                    <strong>Description</strong>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="description"
                      value={description}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        description: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              !!(props.errors.description && props.touched.description)
                            }
                            name="description"
                            value={props.values.description}
                            onChange={props.handleChange}
                            helperText={!props.errors.description}
                            onBlur={props.handleBlur}
                            margin="normal"
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </div>
  );
}
