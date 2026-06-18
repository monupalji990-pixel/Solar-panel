import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import Grid from "@material-ui/core/Grid";
import CardActions from "@material-ui/core/CardActions";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import CircularProgress from "@material-ui/core/CircularProgress";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import Paper from "@material-ui/core/Paper";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { selectSupplierState, supplierAction } from "../redux/supplier";
import { SupplierServices, SupplierTypeOptions } from "../../../sharedUtils/globalHelper/constantValues";
import MyDrawer from "../../../sharedUtils/sharedComponents/drawerHelper";
import AuthApi from '../redux/model/supplier';
import { globalConfigActions } from "../../../sharedUtils/sharedRedux/configuration";
import Select from "react-select";
import ChipInput from 'material-ui-chip-input'

const useStyles = makeStyles(() => ({
  formControl: {
    minWidth: "100%",
  },
  Spacing: {
    padding: "10px",
  },
  MarginSpacing: {
    marginTop: "30px",
    marginBottom: "30px",
  },
  cursorShow: {
    cursor: "pointer",
  },
  uploadInput: {
    width: '100%',
    border: '1px solid #999',
    padding: 10,
    borderRadius: 5,
  }
}));

export default function AddNewSupplier(props) {
  return (
    <MyDrawer
      drawerSize="1100px"
      iconName="Supplier"
      open={props.open == "addSupplierDrawer"}
      onClose={props.onClose.bind(this)}
    >
      <AddSupplierLogic {...props} />
    </MyDrawer>
  );
}

function AddSupplierLogic(props) {
  const supplierState = useSelector(selectSupplierState);

  const { hideSideBar } = { ...supplierState };
  const dispatch = useDispatch();

  const _addSupplier = (payload) =>
    dispatch(supplierAction.addSupplier(payload));
  const _closeSideBar = (payload) =>
    dispatch(supplierAction.supplierCloseSideBar(payload));

  const [startLoader, setStartLoader] = useState(false);
  const [serviceArray, setServiceArray] = useState([]);
  const [contacts, setContacts] = useState({
    SuppliersContacts: [
      {
        ContactPersonName: "",
        TelephoneNumber: "",
        Email: "",
        Department: "",
        jobTitle: "",
        Address: "",
        timestamps: "",
      },
    ],
  });
  const [ContactPersonName, setContactPersonName] = useState([]);
  const [TelephoneNumber, setTelephoneNumber] = useState([]);
  const [Email, setEmail] = useState([]);
  const [Department, setDepartment] = useState([]);
  const [JobTitle, setJobTitle] = useState([]);
  const [Address, setAddress] = useState([]);
  const [newUserPic, setNewUserPic] = React.useState('');
  const [products, setProducts] = React.useState([]);

  const classes = useStyles();

  if (hideSideBar) {
    props.onClose();
    _closeSideBar(false);
  }

  const addServiceInArray = (service) => {
    let a = [];
    if (serviceArray && serviceArray.indexOf(service) !== -1) {
      const index = serviceArray.indexOf(service);
      if (index > -1) {
        serviceArray.splice(index, 1);
        a = serviceArray;
      }
    } else {
      a = serviceArray;
      a.push(service);
    }
    setServiceArray(a);
  };

  const AddSuppliersContacts = () => {
    const a = contacts.SuppliersContacts;
    const ob = {
      ContactPersonName: "",
      TelephoneNumber: "",
      Email: "",
      Department: "",
      jobTitle: "",
      Address: "",
      timestamps: "",
    };
    a.push(ob);
    setContacts({ SuppliersContacts: a });
  };

  const onChangeContact = (e, index, type) => {
    let previousOne = [];
    if (type === "ContactPersonName") {
      previousOne = ContactPersonName;
      previousOne[index] = e.target.value;
      setContactPersonName(previousOne);
    }
    if (type === "TelephoneNumber") {
      previousOne = TelephoneNumber;
      previousOne[index] = e.target.value;
      setTelephoneNumber(previousOne);
    }
    if (type === "Email") {
      previousOne = Email;
      previousOne[index] = e.target.value;
      setEmail(previousOne);
    }
    if (type === "Department") {
      previousOne = Department;
      previousOne[index] = e.target.value;
      setDepartment(previousOne);
    }
    if (type === "JobTitle") {
      previousOne = JobTitle;
      previousOne[index] = e.target.value;
      setJobTitle(previousOne);
    }
    if (type === "Address") {
      previousOne = Address;
      previousOne[index] = e.target.value;
      setAddress(previousOne);
    }
  };

  const RemoveContact = (i) => {
    const ContactData = [];
    contacts.SuppliersContacts.map(() => {
      const OB = {
        ContactPersonName: ContactPersonName[i],
        TelephoneNumber: TelephoneNumber[i],
        Email: Email[i],
        Department: Department[i],
        jobTitle: JobTitle[i],
        Address: Address[i],
        timestamps: new Date().getTime(),
      };
      ContactData.push(OB);
    });
    const a = ContactData;
    a.splice(i, 1);
    setContacts({ SuppliersContacts: a });
  };

  const uploadImage = e => {
    if (!e.target.files) return;

    const data = new FormData();
    data.append('logo', e.target.files[0]);

    if (e.target.files && e.target.files[0]) {
      AuthApi.uploadProfileImage(data).then((response: any) => {
        if (response.success) {
          setNewUserPic(response.url);
          dispatch(globalConfigActions.enableFeedback("Logo uploaded successfully."));
        }
      });
    }
  };

  const handleChangeProducts = (chip) => {
    setProducts(chip)
  }

  // const handleDeleteProducts = (chip, index) => {
  //   console.log("delete product", chip, index);
  // }

  return (
    <div className="app">
      <Formik
        initialValues={{
          supplierName: "",
          contactPersonName: "",
          telephoneNumber: "",
          email: "",
          department: "",
          jobTitle: "",
          address: "",
          supplierType: null,
        }}
        onSubmit={(value) => {
          const SupplierOB: any = {};
          if (value.supplierName) SupplierOB.supplierName = value.supplierName;
          if (value.supplierType?.value) SupplierOB.supplierType = value.supplierType?.value
          SupplierOB.serviceType = serviceArray;
          SupplierOB.SupplierContact = [];
          if(products.length > 0) SupplierOB.products = products
          contacts.SuppliersContacts.map((v, i) => {
            const OB = {
              ContactPersonName: ContactPersonName[i],
              TelephoneNumber: TelephoneNumber[i],
              Email: Email[i],
              Department: Department[i],
              jobTitle: JobTitle[i],
              Address: Address[i],
              timestamps: new Date().getTime(),
            };
            if (Email[i]) {
              SupplierOB.SupplierContact.push(OB);
            }
          });
          if (newUserPic) SupplierOB.logo = newUserPic

          setStartLoader(true);
          _addSupplier(SupplierOB);
        }}
        validationSchema={Yup.object().shape({
          supplierName: Yup.string().required("Supplier name is required"),
        })}
      >
        {(props) => {
          const {
            values,
            touched,
            errors,
            isSubmitting,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
          } = props;

          return (
            <form onSubmit={handleSubmit}>
              <Paper elevation={1} className={classes.Spacing}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={12}>
                    <Typography variant="h6" gutterBottom>
                      Create Supplier
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container spacing={3}>
                  <Grid item xs={6} md={6}>
                    <TextField
                      variant="outlined"
                      error={
                        errors.supplierName && touched.supplierName
                          ? true
                          : false
                      }
                      label="Supplier Name"
                      name="supplierName"
                      value={values.supplierName}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="supplierName-error"
                      className="WidhtFull100"
                    />
                    {errors.supplierName && touched.supplierName && (
                      <FormHelperText
                        className="errormsg"
                        id="supplierName-error"
                      >
                        {errors.supplierName}
                      </FormHelperText>
                    )}
                  </Grid>

                  <Grid item xs={6} md={6}>
                    <Select
                      className={
                        errors.supplierType && touched.supplierType
                          ? "ErrorColor"
                          : ""
                      }
                      id="leadType"
                      placeholder="Supplier Type"
                      value={values.supplierType}
                      onChange={(e) => {
                        setFieldValue("supplierType", e);
                      }}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="leadType-number-error"
                      name="colors"
                      options={SupplierTypeOptions}
                    />
                    {errors.supplierType && touched.supplierType && (
                      <FormHelperText
                        className="errormsg"
                        id="supplierType-error"
                      >
                        {errors.supplierType}
                      </FormHelperText>
                    )}
                  </Grid>

                  <Grid item xs={12} md={12}>
                    <Grid item xs={12} md={8}>
                      <label>Upload Logo</label>
                      <TextField
                        id="logo"
                        name="logo"
                        inputProps={{ accept: 'image/x-png,image/jpg,image/jpeg' }}
                        // accept="image/*"
                        type="file"
                        className={classes.uploadInput}
                        onChange={uploadImage}
                        onBlur={handleBlur}
                        margin="normal"
                        aria-describedby="logo-error"
                      />
                    </Grid>
                  </Grid>

                  <Grid item xs={12} md={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Products
                    </Typography>

                    <ChipInput
                      // value={yourChips}
                      onChange={(chips) => handleChangeProducts(chips)}
                      placeholder="Enter products here"
                      fullWidth={true}
                    />
                  </Grid>

                  <Grid item xs={12} md={12}>
                    <Paper elevation={0} className={classes.Spacing}>
                      <Typography variant="subtitle1" gutterBottom>
                        Select Services
                      </Typography>
                      {SupplierServices.map((s) => (
                        <React.Fragment>
                          <FormControlLabel
                            control={
                              <Checkbox
                                name="checkedB"
                                color="primary"
                                onClick={() => {
                                  addServiceInArray(s.value);
                                }}
                              />
                            }
                            label={s.name}
                            value={s.name}
                          />
                        </React.Fragment>
                      ))}
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>

              <Paper
                elevation={1}
                className={clsx(classes.MarginSpacing, classes.Spacing)}
              >
                <Grid container spacing={3}>
                  <Grid item xs={6} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Add Contact
                    </Typography>
                  </Grid>
                </Grid>
                {contacts.SuppliersContacts.map((s, index) => (
                  <Grid>
                    <Grid
                      container
                      direction="row"
                      justify="flex-end"
                      md={12}
                      xs={12}
                      className={classes.Spacing}
                    >
                      <span
                        className={classes.cursorShow}
                        onClick={() => RemoveContact(index)}
                      >
                        <HighlightOffIcon />
                      </span>
                    </Grid>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={4}>
                        <TextField
                          variant="outlined"
                          error={
                            errors.contactPersonName &&
                              touched.contactPersonName
                              ? true
                              : false
                          }
                          name="contactPersonName"
                          label="Contact Person Name"
                          onChange={(e) =>
                            onChangeContact(e, index, "ContactPersonName")
                          }
                          onBlur={handleBlur}
                          className="WidhtFull100"
                          margin="normal"
                          aria-describedby="contactPersonName-error"
                        />
                        {errors.contactPersonName && touched.contactPersonName && (
                          <FormHelperText
                            className="errormsg"
                            id="contactPersonName-error"
                          >
                            {errors.contactPersonName}
                          </FormHelperText>
                        )}
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <TextField
                          variant="outlined"
                          error={
                            errors.telephoneNumber && touched.telephoneNumber
                              ? true
                              : false
                          }
                          name="telephoneNumber"
                          label="Telephone Number"
                          onChange={(e) =>
                            onChangeContact(e, index, "TelephoneNumber")
                          }
                          onBlur={handleBlur}
                          className="WidhtFull100"
                          margin="normal"
                          aria-describedby="telephoneNumber-error"
                        />
                        {errors.telephoneNumber && touched.telephoneNumber && (
                          <FormHelperText
                            className="errormsg"
                            id="telephoneNumber-error"
                          >
                            {errors.telephoneNumber}
                          </FormHelperText>
                        )}
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <TextField
                          variant="outlined"
                          name="email"
                          label="Email"
                          type="email"
                          onChange={(e) => onChangeContact(e, index, "Email")}
                          onBlur={handleBlur}
                          className="WidhtFull100"
                          margin="normal"
                          aria-describedby="email-error"
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item xs={12} md={4}>
                        <TextField
                          variant="outlined"
                          error={
                            errors.department && touched.department
                              ? true
                              : false
                          }
                          name="department"
                          label="Department"
                          onChange={(e) =>
                            onChangeContact(e, index, "Department")
                          }
                          onBlur={handleBlur}
                          className="WidhtFull100"
                          margin="normal"
                          aria-describedby="department-error"
                        />
                        {errors.department && touched.department && (
                          <FormHelperText
                            className="errormsg"
                            id="department-error"
                          >
                            {errors.department}
                          </FormHelperText>
                        )}
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <TextField
                          variant="outlined"
                          error={
                            errors.jobTitle && touched.jobTitle ? true : false
                          }
                          name="jobTitle"
                          label="Job Title"
                          onChange={(e) =>
                            onChangeContact(e, index, "JobTitle")
                          }
                          onBlur={handleBlur}
                          className="WidhtFull100"
                          margin="normal"
                          aria-describedby="jobTitle-error"
                        />
                        {errors.jobTitle && touched.jobTitle && (
                          <FormHelperText
                            className="errormsg"
                            id="jobTitle-error"
                          >
                            {errors.jobTitle}
                          </FormHelperText>
                        )}
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <TextField
                          variant="outlined"
                          error={
                            errors.address && touched.address ? true : false
                          }
                          name="address"
                          label="Address"
                          onChange={(e) => onChangeContact(e, index, "Address")}
                          onBlur={handleBlur}
                          className="WidhtFull100"
                          margin="normal"
                          aria-describedby="address-error"
                        />
                        {errors.address && touched.address && (
                          <FormHelperText
                            className="errormsg"
                            id="address-error"
                          >
                            {errors.address}
                          </FormHelperText>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
                <CardActions
                  style={{ paddingLeft: 0, paddingRight: 0, marginTop: 20 }}
                >
                  <Button
                    size="medium"
                    variant="contained"
                    color="primary"
                    onClick={() => AddSuppliersContacts()}
                  >
                    Add New Contact
                  </Button>
                </CardActions>
              </Paper>
              <CardActions
                style={{ paddingLeft: 0, paddingRight: 0, marginTop: 20 }}
              >
                <Button
                  size="medium"
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Create Supplier
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
