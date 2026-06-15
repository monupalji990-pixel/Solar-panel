import React, { useEffect, useMemo, useState } from "react";
import { Field, FieldArray, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import CardActions from "@material-ui/core/CardActions";
import CircularProgress from "@material-ui/core/CircularProgress";
import MyDrawer from "../../../sharedUtils/sharedComponents/drawerHelper";
import { selectInvoiceState, invoiceAdminAction } from "../redux/invoiceAdmin";
import {
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  IconButton,
  InputAdornment,
  makeStyles,
  Paper,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@material-ui/core";
import Select from "react-select";
import { leadAction, selectLeadState } from "projects/lead/redux/lead";
import { helperMethods } from "sharedUtils/globalHelper/helperMethod";
import {
  itemAdminAction,
  selectItemState,
} from "projects/items/redux/itemAdmin";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import RemoveCircleIcon from "@material-ui/icons/RemoveCircle";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { TaxOptions } from "sharedUtils/globalHelper/constantValues";

const useStyles = makeStyles(() => ({}));

export default function AddItem(props) {
  return (
    <MyDrawer
      drawerSize="90vw"
      iconName="Invoice"
      open={props.open == "addInvoiceDrawer"}
      onClose={props.onClose.bind(this)}
    >
      <AddItemLogic {...props} />
    </MyDrawer>
  );
}

function AddItemLogic(props) {
  const classes = useStyles();

  const invoiceState = useSelector(selectInvoiceState);
  const leadState = useSelector(selectLeadState);
  const itemState = useSelector(selectItemState);

  const { hideSideBar } = invoiceState;
  const dispatch = useDispatch();

  const _addInvoice = (payload) =>
    dispatch(invoiceAdminAction.addInvoice(payload));
  const _closeSideBar = (payload) =>
    dispatch(invoiceAdminAction.invoiceCloseSideBar(payload));
  const _companyListForDropdown = (payload) =>
    dispatch(leadAction.CompanyListData(payload));
  const _consumerDropList = (payload) =>
    dispatch(leadAction.ConsumerList(payload));
  const _itemList = (payload) => dispatch(itemAdminAction.itemList(payload));
  const _getInvoiceCompanyList = (payload) =>
    dispatch(invoiceAdminAction.getInvoiceCompanyList(payload));
  const _isLoadingData = (payload) =>
    dispatch(invoiceAdminAction.invoiceLoaderAction(payload));
  const _itemSearch = (payload) =>
    dispatch(itemAdminAction.itemSearch(payload));

  const [startLoader, setStartLoader] = useState(false);
  const [RadioToggle, setRadioToggle] = useState("");
  const [CompanySelect, setCompanySelected] = useState("");
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [CurrentSearchText, setCurrentSearchText] = useState("");

  useEffect(() => {
    _isLoadingData(true);
    _companyListForDropdown({ limit: 10 });
    _consumerDropList({ limit: 10 });
    _itemList(null);
    _getInvoiceCompanyList({});
  }, []);

  const itemOptions = useMemo(() => {
    return (
      itemState.items?.map((item) => ({
        label: item.title,
        value: item._id,
        price: item.price,
        description: item.description,
      })) || []
    );
  }, [itemState.items, itemState.searchText]);

  const companyOptions = useMemo(() => {
    return (
      leadState.companies?.map((e) => ({
        label: e.businessName,
        value: e._id,
      })) || []
    );
  }, [leadState.companies]);

  const consumerList = useMemo(() => {
    return (
      leadState.consumers?.map((e) => ({
        label: `${e.firstName} ${e.surName}`,
        value: e._id,
      })) || []
    );
  }, [leadState.consumers]);

  const initialValues = {
    Company: null,
    Consumer: null,
    lineItems: [
      {
        itemId: null,
        title: "",
        price: 0,
        description: "",
        quantity: 0,
        totalAmount: 0,
        tax: null,
      },
    ],
    dueDate: null,
    paymentDue: null,
    discount: 0,
    discountOption: {
      label: "Percentage",
      value: "Percentage",
    },
    totalAmount: null,
  };

  if (hideSideBar) {
    props.onClose();
    _closeSideBar(false);
  }

  let dynamicValidation = Yup.object().shape({
    dueDate: Yup.date().required("Due Date is required").nullable(),
    paymentDue: Yup.date().required("Payment Due is required").nullable(),
    discount: Yup.number().required("Discount is required").nullable(),
    lineItems: Yup.array()
      .of(
        Yup.object().shape({
          title: Yup.string().required("Title is required"),
          price: Yup.number().required("Price is required"),
          quantity: Yup.number().required("Quantity is required"),
        })
      )
      .min(1, "At least one line item is required"),
  });

  const handleRadio = (event) => {
    setRadioToggle(event.target.value);
  };

  const searchInData = (event, action) => {
    if (event) setCurrentSearchText(event);
    if (event.length >= 0) {
      if (action === "company")
        _companyListForDropdown({ searchText: event, limit: 10 });
      if (action === "consumer")
        _consumerDropList({ searchText: event, limit: 10 });
      if (action === "itemId") _itemSearch({ searchText: event });
    }

    setTimeout(() => {
      setIsLoadingData(false);
    }, 1500);
  };

  const lazyLoadAPI = (event, action) => {
    setTimeout(function () {
      setIsLoadingData(false);
    }, 1000);
    if (action === "company" && leadState.companies.length <= 50)
      _companyListForDropdown({
        searchText: CurrentSearchText,
        limit: leadState.companies.length + 10,
      });
    if (action === "consumer" && leadState.consumers.length <= 50)
      _consumerDropList({
        searchText: CurrentSearchText,
        limit: leadState.consumers.length + 10,
      });
  };

  const debounceOnChange = React.useCallback(
    helperMethods.debounce(searchInData, 400),
    []
  );

  const calculateTotal = (price, quantity, taxRate = 0) => {
    const total = price * quantity;
    const taxAmount = total * (taxRate / 100);
    return total + taxAmount;
  };

  const formattedCurrency = (currency) => {
    return (
      currency &&
      currency.toLocaleString("en-GB", {
        style: "currency",
        currency: "GBP",
      })
    );
  };

  const getLineItemSubTotal = (lineItems) => {
    const subtotal = lineItems.reduce((subtotal, item) => {
      return subtotal + (item.totalAmount || 0); // Ensure totalAmount defaults to 0 if null
    }, 0);
    return formattedCurrency(subtotal); // Format the subtotal as currency
  };

  const getTotalAmount = (values) => {
    const subTotal = values.lineItems.reduce((subtotal, item) => {
      return subtotal + (item.totalAmount || 0); // Ensure totalAmount defaults to 0 if null
    }, 0);

    let discountAmount = 0;

    if (values.discountOption?.value === "Percentage") {
      // Calculate discount based on percentage
      discountAmount = subTotal * (values.discount / 100) || 0;
    } else if (values.discountOption?.value === "Flat") {
      // Apply flat discount
      discountAmount = values.discount || 0;
    }

    const totalTax = values.lineItems.reduce((totalTax, item) => {
      const taxRate = item?.tax?.value || item?.tax || 0;
      const taxAmount = item.price * item.quantity * (taxRate / 100);
      return totalTax + taxAmount;
    }, 0);

    const totalWithDiscount = subTotal + totalTax - discountAmount;
    return formattedCurrency(totalWithDiscount);
  };

  const getTotalDiscount = (values) => {
    const subTotal = values.lineItems.reduce((subtotal, item) => {
      return subtotal + (item.totalAmount || 0); // Ensure totalAmount defaults to 0 if null
    }, 0);
    let discountAmount = 0;

    // Check if discount option is 'Percentage' or 'Flat' and calculate accordingly
    if (values.discountOption?.value === "Percentage") {
      discountAmount = subTotal * (values.discount / 100) || 0;
    } else if (values.discountOption?.value === "Flat") {
      discountAmount = values.discount || 0;
    }

    return formattedCurrency(discountAmount);
  };

  const getTotalTax20 = (values) => {
    const totalTax = values.lineItems.reduce((totalTax, item) => {
      if (item.tax?.value === 20) {
        const taxRate = item?.tax?.value || 0;
        const taxAmount = item.price * item.quantity * (taxRate / 100);
        return totalTax + taxAmount;
      }
      return totalTax;
    }, 0);

    return formattedCurrency(totalTax); // Format the total tax as currency
  };

  const getTotalTax5 = (values) => {
    const totalTax = values.lineItems.reduce((totalTax, item) => {
      if (item.tax?.value === 5) {
        const taxRate = item?.tax?.value || 0;
        const taxAmount = item.price * item.quantity * (taxRate / 100);
        return totalTax + taxAmount;
      }
      return totalTax;
    }, 0);

    return formattedCurrency(totalTax); // Format the total tax as currency
  };

  if (invoiceState.isLoadingData) {
    return (
      <Grid container direction="row" justify="center" alignItems="center">
        <CircularProgress />
      </Grid>
    );
  }

  return (
    <div className="app">
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <FormControl component="fieldset">
                <FormLabel component="legend">Create Invoice Of</FormLabel>
                <RadioGroup
                  row
                  aria-label="billdate"
                  name="companyType"
                  value={CompanySelect}
                  onChange={(event) => setCompanySelected(event.target.value)}
                >
                  {invoiceState.invoiceCompany.map((c: any, index) => (
                    <FormControlLabel
                      value={c.value}
                      control={<Radio color="primary" />}
                      label={c.label}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <FormControl component="fieldset">
                <FormLabel component="legend">Create Invoice For</FormLabel>
                <RadioGroup
                  row
                  aria-label="billdate"
                  name="invoiceType"
                  value={RadioToggle}
                  onChange={(event) => handleRadio(event)}
                >
                  <FormControlLabel
                    value="2"
                    control={<Radio color="primary" />}
                    label="Create For Company"
                  />
                  <FormControlLabel
                    value="1"
                    control={<Radio color="primary" />}
                    label="Create For Consumer"
                  />
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          const obj: any = {};
          if (values.Consumer?.value) {
            obj.consumer = values.Consumer?.value;
          }
          if (values.Company?.value) {
            obj.company = values.Company?.value;
          }
          if (values.dueDate) {
            obj.dueDate = values.dueDate
              ? new Date(values.dueDate).getTime()
              : null;
          }
          if (values.paymentDue) {
            obj.paymentDue = values.paymentDue
              ? new Date(values.paymentDue).getTime()
              : null;
          }
          if (values.discount) {
            obj.discount = values.discount;
          }

          if (values.discountOption?.value) {
            obj.discountType = values.discountOption?.value;
          }

          if (CompanySelect) {
            let selectedCompany: any = invoiceState.invoiceCompany.find(
              (c: any) => c.label === CompanySelect
            );

            if (selectedCompany) {
              obj.fromCompany = selectedCompany.label;
              obj.fromAddress = selectedCompany.address;
            }
          }

          if (values.lineItems?.length > 0) {
            const subTotal = values.lineItems.reduce((subtotal, item) => {
              return subtotal + (item.totalAmount || 0); // Ensure totalAmount defaults to 0 if null
            }, 0);

            let discountAmount = 0;

            if (values.discountOption?.value === "Percentage") {
              discountAmount = subTotal * (values.discount / 100) || 0;
            } else if (values.discountOption?.value === "Flat") {
              discountAmount = values.discount || 0;
            }

            const totalTax = values.lineItems.reduce((totalTax, item) => {
              const taxRate = item?.tax?.value || item?.tax || 0;
              const taxAmount = item.price * item.quantity * (taxRate / 100);
              return totalTax + taxAmount;
            }, 0);

            const totalWithDiscount = totalTax + subTotal - discountAmount;
            obj.totalAmount = totalWithDiscount;
          }
          if (values.lineItems?.length > 0)
            obj.lineItems = values.lineItems.map((e) => ({
              ...e,
              tax: e.tax?.value || 0,
              itemId: e.itemId?.value || null,
            }));

          setStartLoader(true);
          _addInvoice(obj);
          setTimeout(() => {
            setStartLoader(false);
          }, 3000);
        }}
        validationSchema={dynamicValidation}
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
            <form onSubmit={handleSubmit} autoComplete="off">
              <Grid container spacing={3}>
                <Grid item container spacing={1} style={{ marginTop: 10 }}>
                  {RadioToggle === "1" && (
                    <Grid item md={3} sm={12} xs={12}>
                      <Select
                        error={
                          errors.Consumer && touched.Consumer ? true : false
                        }
                        id="Consumer"
                        name="Consumer"
                        placeholder="Search Consumer"
                        value={values.Consumer}
                        onChange={(e) => {
                          setFieldValue("Consumer", e);
                        }}
                        isLoading={isLoadingData}
                        styles={{
                          control: (styles) => ({ ...styles, height: "40px" }),
                        }}
                        onInputChange={(e) => {
                          setIsLoadingData(true);
                          debounceOnChange(e, "consumer");
                        }}
                        onMenuScrollToBottom={(e) => {
                          const isCallNewOne =
                            leadState.consumers.length % 10 === 0;
                          if (isCallNewOne) {
                            setIsLoadingData(true);
                            lazyLoadAPI(e, "consumer");
                          }
                        }}
                        components={{
                          LoadingIndicator() {
                            return <CircularProgress />;
                          },
                        }}
                        onBlur={handleBlur}
                        margin="normal"
                        aria-describedby="role-number-error"
                        options={consumerList}
                      />
                      {errors.Consumer && touched.Consumer && (
                        <FormHelperText
                          className="errormsg"
                          id="Consumer-error"
                        >
                          {errors.Consumer}
                        </FormHelperText>
                      )}
                    </Grid>
                  )}
                  {RadioToggle === "2" && (
                    <Grid item md={3} sm={12} xs={12}>
                      <Select
                        className={
                          errors.Company && touched.Company ? "ErrorColor" : ""
                        }
                        id="Company"
                        placeholder="Search Company"
                        value={values.Company}
                        onChange={(e) => {
                          setFieldValue("Company", e);
                        }}
                        styles={{
                          control: (styles) => ({ ...styles, height: "40px" }),
                        }}
                        onBlur={handleBlur}
                        margin="normal"
                        isLoading={isLoadingData}
                        onInputChange={(e) => {
                          setIsLoadingData(true);
                          debounceOnChange(e, "company");
                          setFieldValue("Site", "");
                          setFieldValue("Contact", "");
                        }}
                        onMenuScrollToBottom={(e) => {
                          const isCallNewOne =
                            leadState.companies.length % 10 === 0;
                          if (isCallNewOne) {
                            setIsLoadingData(true);
                            lazyLoadAPI(e, "company");
                          }
                        }}
                        components={{
                          LoadingIndicator() {
                            return <CircularProgress />;
                          },
                        }}
                        aria-describedby="role-number-error"
                        name="colors"
                        options={companyOptions}
                      />
                      {errors.Company && touched.Company && (
                        <FormHelperText className="errormsg" id="Company-error">
                          {errors.Company}
                        </FormHelperText>
                      )}
                    </Grid>
                  )}

                  <Grid item xs={12} md={2}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <Grid container justify="space-around">
                        <KeyboardDatePicker
                          variant="dialog"
                          inputVariant="outlined"
                          error={
                            errors.paymentDue && touched.paymentDue
                              ? true
                              : false
                          }
                          margin="normal"
                          id="paymentDue"
                          name="paymentDue"
                          size="small"
                          placeholder="Payment Due"
                          helperText={""}
                          allowKeyboardControl
                          className="WidhtFull100"
                          format="dd/MM/yyyy"
                          value={values.paymentDue ? values.paymentDue : ""}
                          onChange={(e) => setFieldValue("paymentDue", e)}
                          KeyboardButtonProps={{
                            "aria-label": "change date",
                          }}
                          aria-describedby="paymentDue-number-error"
                        />
                      </Grid>
                    </MuiPickersUtilsProvider>
                    {errors.paymentDue && touched.paymentDue && (
                      <FormHelperText
                        className="errormsg"
                        id="paymentDue-error"
                      >
                        {errors.paymentDue}
                      </FormHelperText>
                    )}
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <Grid container justify="space-around">
                        <KeyboardDatePicker
                          variant="dialog"
                          inputVariant="outlined"
                          error={
                            errors.dueDate && touched.dueDate ? true : false
                          }
                          margin="normal"
                          id="dueDate"
                          name="dueDate"
                          size="small"
                          placeholder="Due Date"
                          helperText={""}
                          allowKeyboardControl
                          className="WidhtFull100"
                          format="dd/MM/yyyy"
                          value={values.dueDate ? values.dueDate : ""}
                          onChange={(e) => setFieldValue("dueDate", e)}
                          KeyboardButtonProps={{
                            "aria-label": "change date",
                          }}
                          aria-describedby="dueDate-number-error"
                        />
                      </Grid>
                    </MuiPickersUtilsProvider>
                    {errors.dueDate && touched.dueDate && (
                      <FormHelperText className="errormsg" id="dueDate-error">
                        {errors.dueDate}
                      </FormHelperText>
                    )}
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <Select
                      name="discountOption"
                      className="react-select-container"
                      classNamePrefix="react-select"
                      styles={{
                        control: (styles) => ({
                          ...styles,
                          height: "40px",
                        }),
                      }}
                      placeholder=""
                      value={values.discountOption}
                      onChange={(selectedOption) => {
                        const option = selectedOption;
                        setFieldValue(`discountOption`, option);
                        setFieldValue(`discount`, 0);
                      }}
                      options={[
                        { label: "Percentage", value: "Percentage" },
                        { label: "Flat", value: "Flat" },
                      ]}
                    />
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <TextField
                      variant="outlined"
                      error={errors.discount && touched.discount ? true : false}
                      id="discount"
                      name="discount"
                      className="WidhtFull100"
                      label="Discount"
                      type="number"
                      size="small"
                      value={values.discount}
                      margin="normal"
                      aria-describedby="discount-error"
                      onBlur={handleBlur}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (values.discountOption.value === "Percentage") {
                          const cappedValue = Number(value) > 100 ? 100 : value; // Cap discount at 100
                          handleChange({
                            target: { name: "discount", value: cappedValue },
                          });
                        } else {
                          handleChange({
                            target: { name: "discount", value: value },
                          });
                        }
                      }}
                    />
                    {errors.discount && touched.discount && (
                      <FormHelperText className="errormsg" id="discount-error">
                        {errors.discount}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>

                <FieldArray name="lineItems">
                  {({ push, remove }) => (
                    <Grid item container spacing={1} style={{ marginTop: 10 }}>
                      {values.lineItems.map((lineItem, index) => (
                        <React.Fragment key={index}>
                          <Grid item xs={12} md={3} style={{ marginBottom: 5 }}>
                            <Select
                              name={`lineItems.${index}.itemId`}
                              className="react-select-container"
                              classNamePrefix="react-select"
                              styles={{
                                control: (styles) => ({
                                  ...styles,
                                  height: "40px",
                                }),
                              }}
                              placeholder="Select Item"
                              value={lineItem.itemId}
                              onChange={(selectedOption) => {
                                setFieldValue(
                                  `lineItems.${index}.itemId`,
                                  selectedOption
                                );
                                setFieldValue(
                                  `lineItems.${index}.title`,
                                  selectedOption.label
                                );
                                setFieldValue(
                                  `lineItems.${index}.price`,
                                  selectedOption.price
                                );
                                setFieldValue(
                                  `lineItems.${index}.description`,
                                  selectedOption.description
                                );
                                setFieldValue(
                                  `lineItems.${index}.totalAmount`,
                                  calculateTotal(
                                    selectedOption.price,
                                    lineItem.quantity
                                  )
                                );
                              }}
                              onInputChange={(e) => {
                                setIsLoadingData(true);
                                debounceOnChange(e, "itemId");
                              }}
                              options={itemOptions}
                              isLoading={isLoadingData}
                            />
                          </Grid>

                          <Grid item xs={12} md={2}>
                            <Field
                              as={TextField}
                              name={`lineItems.${index}.title`}
                              label="Title"
                              variant="outlined"
                              fullWidth
                              size="small"
                              onChange={(e) =>
                                setFieldValue(
                                  `lineItems.${index}.title`,
                                  e.target.value
                                )
                              }
                              value={lineItem.title}
                            />
                          </Grid>

                          <Grid item xs={12} md={1}>
                            <Field
                              as={TextField}
                              name={`lineItems.${index}.price`}
                              label="Price"
                              size="small"
                              variant="outlined"
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    £
                                  </InputAdornment>
                                ),
                              }}
                              fullWidth
                              onChange={(e) => {
                                const reg = /^-?\d*(\.\d*)?$/;
                                const value = e.target.value;

                                if (reg.test(value)) {
                                  if (value === "" || value === ".") {
                                    setFieldValue(
                                      `lineItems.${index}.price`,
                                      0
                                    );
                                    setFieldValue(
                                      `lineItems.${index}.totalAmount`,
                                      calculateTotal(0, lineItem.quantity)
                                    );
                                  } else {
                                    const price = parseFloat(value);

                                    if (price < 0) {
                                      setFieldValue(
                                        `lineItems.${index}.price`,
                                        0
                                      );
                                      setFieldValue(
                                        `lineItems.${index}.totalAmount`,
                                        calculateTotal(0, lineItem.quantity)
                                      );
                                    } else {
                                      setFieldValue(
                                        `lineItems.${index}.price`,
                                        price
                                      );
                                      setFieldValue(
                                        `lineItems.${index}.totalAmount`,
                                        calculateTotal(price, lineItem.quantity)
                                      );
                                    }
                                  }
                                } else {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }
                              }}
                              value={lineItem.price}
                            />
                          </Grid>

                          <Grid item xs={12} md={2}>
                            <Field
                              as={TextField}
                              name={`lineItems.${index}.description`}
                              label="Description"
                              variant="outlined"
                              fullWidth
                              size="small"
                              onChange={(e) =>
                                setFieldValue(
                                  `lineItems.${index}.description`,
                                  e.target.value
                                )
                              }
                              value={lineItem.description}
                            />
                          </Grid>

                          <Grid item xs={12} md={1}>
                            <Field
                              as={TextField}
                              name={`lineItems.${index}.quantity`}
                              label="Quantity"
                              variant="outlined"
                              fullWidth
                              type="number"
                              size="small"
                              value={lineItem.quantity}
                              onChange={(e) => {
                                if (e.target.value) {
                                  const quantity = parseInt(e.target.value);
                                  setFieldValue(
                                    `lineItems.${index}.quantity`,
                                    quantity
                                  );
                                  setFieldValue(
                                    `lineItems.${index}.totalAmount`,
                                    calculateTotal(lineItem.price, quantity)
                                  );
                                } else {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }
                              }}
                            />
                          </Grid>

                          <Grid item xs={12} md={1}>
                            <Select
                              name={`lineItems.${index}.tax`}
                              className="react-select-container"
                              classNamePrefix="react-select"
                              styles={{
                                control: (styles) => ({
                                  ...styles,
                                  height: "40px",
                                }),
                              }}
                              placeholder="Select Tax"
                              value={lineItem.tax}
                              onChange={(selectedOption) => {
                                const tax = selectedOption;
                                setFieldValue(`lineItems.${index}.tax`, tax);
                                // setFieldValue(
                                //   `lineItems.${index}.totalAmount`,
                                //   calculateTotal(
                                //     lineItem.price,
                                //     lineItem.quantity,
                                //     selectedOption?.value
                                //   )
                                // );
                              }}
                              options={TaxOptions}
                            />
                          </Grid>

                          <Grid item xs={12} md={1}>
                            <Field
                              as={TextField}
                              name={`lineItems.${index}.totalAmount`}
                              label="Total"
                              size="small"
                              variant="outlined"
                              fullWidth
                              InputProps={{
                                readOnly: true,
                                startAdornment: (
                                  <InputAdornment position="start">
                                    £
                                  </InputAdornment>
                                ),
                              }}
                              value={lineItem.totalAmount}
                            />
                          </Grid>

                          <Grid item xs={12} md={1}>
                            {values.lineItems.length > 1 &&
                              index === values.lineItems.length - 1 && (
                                <IconButton
                                  color="default"
                                  onClick={() => remove(index)}
                                >
                                  <RemoveCircleIcon />
                                </IconButton>
                              )}

                            {index === values.lineItems.length - 1 && (
                              <IconButton
                                color="default"
                                onClick={() =>
                                  push({
                                    itemId: null,
                                    title: "",
                                    price: 0,
                                    description: "",
                                    quantity: 0,
                                    totalAmount: 0,
                                  })
                                }
                              >
                                <AddCircleIcon />
                              </IconButton>
                            )}
                          </Grid>
                        </React.Fragment>
                      ))}
                    </Grid>
                  )}
                </FieldArray>
              </Grid>

              <TableContainer
                component={Paper}
                style={{
                  maxWidth: 300,
                  marginLeft: "auto",
                  marginTop: 20,
                  marginRight: "7rem",
                }}
              >
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Subtotal (£)</TableCell>
                      <TableCell align="right">
                        {getLineItemSubTotal(values.lineItems)}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>VAT 20%</TableCell>
                      <TableCell align="right">
                        {getTotalTax20(values)}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>VAT 5%</TableCell>
                      <TableCell align="right">
                        {getTotalTax5(values)}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>Discount</TableCell>
                      <TableCell align="right">
                        {getTotalDiscount(values)}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell>Total (£)</TableCell>
                      <TableCell align="right">
                        {getTotalAmount(values)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

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
                  Create Invoice
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
