import React, { useState, useEffect, Suspense } from "react";
import { Formik } from "formik";
import { connect, useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import makeStyles from "@material-ui/core/styles/makeStyles";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import CardActions from "@material-ui/core/CardActions";
import CircularProgress from "@material-ui/core/CircularProgress";
import { selectSupplierState, supplierAction } from "../redux/supplier";
import {
  AM,
  SupplierServices,
  SupplierTypeOptions,
} from "../../../sharedUtils/globalHelper/constantValues";
import OnTextEditInput from "../../../sharedUtils/sharedComponents/editHelpers2/onTextEditHelper";
import MyDrawer from "../../../sharedUtils/sharedComponents/drawerHelper";
import Documents from "../../.././sharedUtils/sharedComponents/document";
import { Common as ContactSection } from "./contact/loadable/Common";
import { Common as QuoteList } from "../../quote/loadable/Common";
import { Common as HistoryTable } from "../../history/pages/Common";
import StandardFlatFile from '../sections/standardFlatFiles'
import UploadFlatFiles from '../sections/uploadFile'
import AuthApi from '../redux/model/supplier';
import { globalConfigActions } from "../../../sharedUtils/sharedRedux/configuration";
import Avatar from '@material-ui/core/Avatar';
import Select from "react-select";
import ChipInput from 'material-ui-chip-input'

const useStyles = makeStyles(() => ({
  formControl: {
    minWidth: "100%",
  },
  Spacing: {
    padding: "12px",
  },
  MarginSpacing: {
    marginTop: "30px",
    marginBottom: "30px",
  },
  logoStyle: {
    width: '100%',
    border: '1px solid #999999',
    borderRadius: 3,
    padding: 5,
    objectFit: 'cover',
  },
  imgBlock: {
    minWidth: 150,
    height: 120,
    display: 'inline-flex'
  },
  uploadInput: {
    width: '100%',
    border: '1px solid #999',
    padding: 10,
    borderRadius: 5,
  }
}));

export default function ManageSupplier(props) {
  return (
    <MyDrawer
      drawerSize="80vw"
      iconName="Supplier"
      open={props.open === "manageSupplierDrawer"}
      onClose={props.onClose.bind(this)}
    >
      <ViewSupplierLogic {...props} />
    </MyDrawer>
  );
}

function ViewSupplierLogic(props) {
  const supplierState = useSelector(selectSupplierState);

  const { hideSideBar, isLoadingData } = { ...supplierState };
  const currentSupplier = { ...supplierState.currentSupplier };
  const dispatch = useDispatch();

  const _viewSupplier = (payload) =>
    dispatch(supplierAction.viewSupplierReq(payload));
  const _isLoadingData = (payload) =>
    dispatch(supplierAction.supplierLoaderAction(payload));
  const _updateSupplier = (payload) =>
    dispatch(supplierAction.updateSupplier(payload));
  const _addDocument = (payload) =>
    dispatch(supplierAction.supplierAddDocument(payload));
  const _deleteDocuments = (payload) =>
    dispatch(supplierAction.supplierDeleteDocument(payload));
  const _resetInitialValues = (payload) =>
    dispatch(supplierAction.resetInitialValues(payload));

  const currentProps = props;
  const { supplierName, logo, supplierType, products } = currentSupplier;

  const classes = useStyles();
  const [selectedTab, setSelectedTab] = React.useState("supplier");
  const { serviceType } = currentSupplier;
  const [serviceArray, setServiceArray] = useState([]);
  const [dummyOne, setDummyOne] = useState("hello");
  const [newUserPic, setNewUserPic] = React.useState('');
  const [initialProducts, setInitialProducts] = useState(products || []);

  useEffect(() => {
    _isLoadingData(true);
    _viewSupplier(props);
    setDummyOne("changedAgain");
  }, []);

  useEffect(() => {
    setInitialProducts(products);
  }, [products])

  const tabHandleChange = (event, newValue) => {
    setSelectedTab(newValue);
    // _resetInitialValues({});
  };

  const simpleEdit = (data) => {
    const supplier: any = {};
    if (newUserPic) supplier.logo = newUserPic
    supplier.supplier_id = currentSupplier._id;
    if (data !== undefined && data.supplierName)
      supplier.supplierName = data.supplierName;
    supplier.serviceType = serviceArray;
    if (initialProducts.length > 0) supplier.products = initialProducts;
    if (data.supplierType) supplier.supplierType = data.supplierType
    _isLoadingData(true);
    _updateSupplier({ supplier });
  };

  if (
    !isLoadingData &&
    currentSupplier !== undefined &&
    currentSupplier &&
    dummyOne === "changedAgain"
  ) {
    setServiceArray(currentSupplier.serviceType);
    setDummyOne(Math.random().toString(36).substring(7));
  }

  const addServiceInArray = (service) => {
    let a: any = [];
    if (serviceArray && serviceArray.findIndex((e) => e == service) != -1) {
      a = [...serviceArray];
      a = a.filter((x) => x != service);
    } else {
      a = [...serviceArray, service];
    }
    setServiceArray(a);
  };

  if (isLoadingData) {
    return (
      <Grid container direction="row" justify="center" alignItems="center">
        <CircularProgress />
      </Grid>
    );
  }

  const addDocument = (data, v) => {
    data.append("id", currentSupplier._id);
    _addDocument(data);
  };

  const deleteAttachment = (did) => {
    const document = {
      supplier_id: currentSupplier._id,
      did,
      type: "documents",
    };
    _deleteDocuments(document);
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

  const removeLogo = () => {

    if (logo) {
      AuthApi.removeSupplierLogo({ supplierId: currentSupplier._id, logo: logo }).then((response: any) => {
        if (response.success) {
          dispatch(globalConfigActions.enableFeedback("Logo removed successfully."));
        }
        _viewSupplier(props);

      });
    }
  }

  const handleChangeProducts = (chip) => {
    setInitialProducts(chip)
  }

  return (
    <div className="app">
      <Formik initialValues={{}} onSubmit={() => { }}>
        {(props) => {
          const { handleSubmit } = props;

          return (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                  <Paper>
                    <Tabs
                      value={selectedTab}
                      onChange={tabHandleChange}
                      textColor="primary"
                      indicatorColor="primary"
                      scrollButtons="auto"
                      variant="scrollable"
                    >
                      <Tab label="Supplier" value="supplier" />
                      <Tab label="Contacts" value="contact" />
                      <Tab label="Quotes" value="quote" />
                      <Tab label="Documents" value="documents" />
                      <Tab label="History" value="history" />
                      <Tab label="Generate Standard Flat Files" value="flatFiles" />
                      <Tab label="Upload Standard Flat Files" value="uploadFile" />
                    </Tabs>
                  </Paper>
                </Grid>

                {selectedTab === "supplier" && (
                  <>
                    <Paper className={classes.Spacing}>

                      <Grid container>
                        {logo ?
                          <>
                            <Grid item xs={12} md={3}>
                              <div className={classes.imgBlock}>
                                <img src={logo} className={classes.logoStyle} />
                              </div>
                              <div style={{ overflow: 'auto' }}></div>
                              <Button
                                size="small"
                                variant="contained"
                                color="primary"
                                type="submit"
                                onClick={removeLogo}
                              >
                                Remove Logo
                              </Button>
                            </Grid>
                          </>
                          :
                          <>
                            <Grid item xs={12} md={4}>
                              <label style={{ marginBottom: 10, display: 'block' }}>Upload New Logo</label>
                              <TextField
                                id="logo"
                                name="logo"
                                inputProps={{ accept: 'image/x-png,image/jpg,image/jpeg' }}
                                // accept="image/*"
                                type="file"
                                className={classes.uploadInput}
                                onChange={uploadImage}
                                margin="normal"
                                aria-describedby="logo-error"
                              />
                            </Grid>
                          </>
                        }

                      </Grid>

                      <Grid item md={6} xs={12} sm={12}>
                        <TableContainer>
                          <Table aria-label="caption table">
                            <TableBody>
                              <TableRow>
                                <TableCell>
                                  {" "}
                                  <strong>Supplier Name</strong>
                                </TableCell>
                                {AM.includes(currentProps.slug) ? (
                                  <TableCell>
                                    <OnTextEditInput
                                      name="supplierName"
                                      value={supplierName}
                                      onSubmit={simpleEdit}
                                      validateIt={Yup.object().shape({
                                        supplierName: Yup.string().required(
                                          "Required"
                                        ),
                                      })}
                                    >
                                      {(props) => {
                                        return (
                                          <TextField
                                            error={
                                              !!(
                                                props.errors.supplierName &&
                                                props.touched.supplierName
                                              )
                                            }
                                            name="supplierName"
                                            value={props.values.supplierName}
                                            helperText={
                                              !props.errors.supplierName
                                            }
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                          />
                                        );
                                      }}
                                    </OnTextEditInput>
                                  </TableCell>
                                ) : (
                                  <TableCell> {supplierName}</TableCell>
                                )}
                              </TableRow>

                              <TableRow>
                                <TableCell>
                                  <strong>Supplier Type</strong>
                                </TableCell>
                                {AM.includes(currentProps.slug) ? (
                                  <TableCell component="th" scope="row">
                                    <OnTextEditInput
                                      name="supplierType"
                                      value={supplierType}
                                      onSubmit={simpleEdit}
                                      validateIt={Yup.object().shape({
                                        supplierType: Yup.string()
                                          .required("Supplier Type is required")
                                          .nullable(),
                                      })}
                                    >
                                      {(props) => (
                                        <Grid item>
                                          <Select
                                            id="supplierType"
                                            className="WidhtFull100 basic-multi-select"
                                            placeholder="Supplier Type"
                                            value={{
                                              label: props.values.supplierType,
                                              value: props.values.supplierType,
                                            }}
                                            onChange={(e) => {
                                              props.setFieldValue("supplierType", e.value);
                                            }}
                                            onBlur={props.handleBlur}
                                            margin="normal"
                                            aria-describedby="supplierType-number-error"
                                            name="supplierType"
                                            options={SupplierTypeOptions}
                                          />
                                        </Grid>
                                      )}
                                    </OnTextEditInput>
                                  </TableCell>
                                ) : (
                                  <TableCell> {supplierType}</TableCell>
                                )}
                              </TableRow>

                              <TableRow>
                                <TableCell>
                                  <strong>Products</strong>
                                </TableCell>
                                <TableCell>
                                  <ChipInput
                                    defaultValue={initialProducts}
                                    onChange={(chips) => handleChangeProducts(chips)}
                                    placeholder="Enter products here"
                                    fullWidth={true}
                                  />
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
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
                                    disabled={!AM.includes(currentProps.slug)}
                                    defaultChecked={
                                      serviceArray !== undefined &&
                                      (serviceArray.includes(s.value) ||
                                        !!serviceArray.includes(s.name))
                                    }
                                    onClick={(e) => addServiceInArray(s.value)}
                                  />
                                }
                                label={s.name}
                                value={s.value}
                              />
                            </React.Fragment>
                          ))}
                        </Paper>
                      </Grid>

                      {AM.includes(currentProps.slug) && (
                        <CardActions
                          style={{
                            paddingLeft: 0,
                            paddingRight: 0,
                            marginTop: 20,
                          }}
                        >
                          <Button
                            size="medium"
                            variant="contained"
                            color="primary"
                            type="submit"
                            onClick={() => simpleEdit({})}
                          >
                            Update Supplier
                          </Button>
                        </CardActions>
                      )}
                    </Paper>
                  </>
                )}
              </Grid>
            </form>
          );
        }}
      </Formik>

      {selectedTab === "contact" && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Suspense fallback={<></>}>
              <ContactSection {...currentProps} showingFrom="viewSupplier" />
            </Suspense>
          </Grid>
        </Grid>
      )}

      {selectedTab === "quote" && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <QuoteList {...props} type="quote" showingFrom="viewSupplier" />
          </Grid>
        </Grid>
      )}

      {selectedTab === "documents" && (
        <Suspense fallback={<>Loading...</>}>
          <Documents
            {...props}
            addDocument={(e, v) => addDocument(e, v)}
            documents={currentSupplier.documents}
            deleteAttachment={(did) => deleteAttachment(did)}
          ></Documents>
        </Suspense>
      )}
      {selectedTab === "history" && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Suspense fallback={<>Loading...</>}>
              <HistoryTable {...props} historyFor="Supplier"></HistoryTable>
            </Suspense>
          </Grid>
        </Grid>
      )}

      {selectedTab === "flatFiles" && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Suspense fallback={<>Loading...</>}>
              <StandardFlatFile {...props} />
            </Suspense>
          </Grid>
        </Grid>
      )}

      {selectedTab === "uploadFile" && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Suspense fallback={<>Loading...</>}>
              <UploadFlatFiles {...props} />
            </Suspense>
          </Grid>
        </Grid>
      )}
    </div>
  );
}
