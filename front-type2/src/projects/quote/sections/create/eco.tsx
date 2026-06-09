import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Select from 'react-select';
import { useSelector } from 'react-redux';
import { selectLeadState } from 'projects/lead/redux/lead';
import { SubServiceOptions } from "../../../../sharedUtils/globalHelper/constantValues"
import Solar from "./eco_services/solar";
import Boilers from "./eco_services/boilers";
import UFIUnderfloor from "./eco_services/ufi";
import CavityWall from "./eco_services/cavitywall";
import { Formik } from "formik";
import * as Yup from "yup";
import CircularProgress from "@material-ui/core/CircularProgress";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

export default function Eco(props) {
  let leadServiceDataInit: any = null;

  const currentProps = props;
  const leadState = useSelector(selectLeadState);

  const [subService, setSubService]: any = useState(currentProps.RadioToggle == "company" ? ["Solar"] : []);
  const [selectedService, setSelectedService]: any = useState(currentProps.RadioToggle == "company" ? ["Solar"] : []);
  const [selectedTab, setSelectedTab]: any = React.useState(currentProps.RadioToggle == "company" ? "Solar" : "");
  const [open, setOpen] = React.useState(false);
  const [ischeckedEcoServices, setIsCheckedEcoServices] = useState([]);
  const [isShowEcoSer, setIsShowEcoSer] = useState(false);
  const [combiBoiler, setCombiBoiler] = React.useState(props.serviceDataFromLead?.subservice?.boilers?.combiBoiler || "");
  const [combiBoiler1, setCombiBoiler1] = React.useState(props.serviceDataFromLead?.subservice?.boilers?.combiBoiler1 || "");
  const [newHeatingControlState, setNewHeatingControlState] = useState(props.serviceDataFromLead?.subservice?.boilers?.newHeatingControl || "");
  const [swipeWarrantyApplied, setSwipeWarrantyApplied] = useState(props.serviceDataFromLead?.subservice?.ufiunderfloor?.swipeWarrantyApplied || "");
  const [contributionPaid, setContributionPaid] = React.useState(props.serviceDataFromLead?.subservice?.cavitywall?.contributionPaid || "");
  const [dnoApproval, setDNOApproval] = React.useState(props.serviceDataFromLead?.subservice?.solar?.dnoApproval || "No");
  const [dnoApproved, setDNOApproved] = React.useState(props.serviceDataFromLead?.subservice?.solar?.dnoApproved || "");
  const [noOfRoofs, setNoOfRoofs] = useState(props.serviceDataFromLead?.subservice?.solar?.numberOfRoofs?.length || 0);

  const handleSubService = (value) => {
    setSubService(value);

    let x = []
    value?.map((e) => {
      x.push(e.value);
    })
    setSelectedService(x);
  }

  const tabHandleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleChangeCheckbox = (service) => {
    let a = [];
    let s = service.toLowerCase();
    if (ischeckedEcoServices && ischeckedEcoServices.indexOf(s) !== -1) {
      const index = ischeckedEcoServices.indexOf(s);
      if (index > -1) {
        ischeckedEcoServices.splice(index, 1);
        a = ischeckedEcoServices;
      }
    } else {
      a = ischeckedEcoServices;
      a.push(s);
    }
    setIsCheckedEcoServices(a);
  }

  let roofsArr = []
  for (let i = 0; i < noOfRoofs; i++) {
    roofsArr.push(props.serviceDataFromLead?.subservice?.solar?.numberOfRoofs ? props.serviceDataFromLead?.subservice?.solar?.numberOfRoofs[i] : {});
  }

  if (props.serviceDataFromLead && props.serviceDataFromLead?.subservice) {
    leadServiceDataInit = {
      ...props.serviceDataFromLead?.subservice,
      numberOfRoofs: (roofsArr.length > 0 && roofsArr.length < 21) ? roofsArr : [{}],
      numberOfInverters: [{}],
      numberOfBatteries: [{}],
    };

    if (props.serviceDataFromLead?.subservice.boilers) leadServiceDataInit.boiler = { ...props.serviceDataFromLead?.subservice.boilers }
    if (props.serviceDataFromLead?.subservice.solar) leadServiceDataInit.solar = {
      roofsPanelsInstalled: props.serviceDataFromLead?.subservice?.solar?.numberOfRoofs?.length,
      ...props.serviceDataFromLead?.subservice.solar
    }
    // roofsPanelsInstalled: props.serviceDataFromLead?.subservice?.solar?.numberOfRoofs?.length,
    if (props.serviceDataFromLead?.subservice.ufiunderfloor) leadServiceDataInit.ufi = props.serviceDataFromLead?.subservice.ufiunderfloor
    if (props.serviceDataFromLead?.subservice.cavitywall) leadServiceDataInit.cwi = props.serviceDataFromLead?.subservice.cavitywall

    // if (props.serviceDataFromLead?.subservice?.solar?.numberOfRoofs) {
    //   leadServiceDataInit.numberOfRoofs = props.serviceDataFromLead?.subservice?.solar?.numberOfRoofs
    // }

    if (props.serviceDataFromLead?.subservice?.solar?.numberOfInverters) {
      leadServiceDataInit.numberOfInverters = props.serviceDataFromLead?.subservice?.solar?.numberOfInverters
    }
    if (props.serviceDataFromLead?.subservice?.solar?.numberOfBatteries) {
      leadServiceDataInit.numberOfBatteries = props.serviceDataFromLead?.subservice?.solar?.numberOfBatteries
    }
  }

  useEffect(() => {
    if (currentProps.isFromLead && leadState.singleLead.subServiceType.length > 0) {
      setSubService(
        leadState.singleLead.subServiceType.map((e) => ({
          label: e,
          value: e,
        }))
      )

      let x = []
      leadState.singleLead.subServiceType.map((e) => {
        x.push(e);
      })
      setSelectedService(x);
    }
  }, [leadState.singleLead.subServiceType])

  let initialValues: any = null

  initialValues = {
    boiler: {},
    solar: {},
    numberOfRoofs: (roofsArr.length > 0 && roofsArr.length < 21) ? roofsArr : [{}],
    numberOfInverters: [{}],
    numberOfBatteries: [{}],
    ufi: {},
    cwi: {}
  };

  const objectKeysToLowerCase = (input) => {
    if (typeof input !== 'object') return input;
    if (Array.isArray(input)) return input.map(objectKeysToLowerCase);
    return Object.keys(input).reduce(function (newObj: any, key: any) {
      let val: any = input[key];
      let newVal: any = (typeof val === 'object') && val !== null ? objectKeysToLowerCase(val) : val;
      newObj[key.split(" ").join('_').toLowerCase()] = newVal.split(" ").join('_').toLowerCase();
      return newObj;
    }, {});
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="app">
      <Formik
        enableReinitialize
        initialValues={leadServiceDataInit !== null ? leadServiceDataInit : initialValues}
        onSubmit={
          (value) => {
            let subserviceList: any = {
              solar: {
                ...value.solar,
                numberOfRoofs: value.numberOfRoofs,
                numberOfInverters: value.numberOfInverters,
                numberOfBatteries: value.numberOfBatteries,
                dnoApproval: dnoApproval,
                dnoApproved: dnoApproved,
              },
              boilers: {
                ...value.boiler,
                combiBoiler: combiBoiler,
                combiBoiler1: combiBoiler1,
                newHeatingControl: newHeatingControlState,
                manufacturer: value.manufacturer?.value,
                manufacturer1: value.manufacturer1?.value,
                model: value.model?.value,
                model1: value.model1?.value,
              },
              ufiunderfloor: {
                ...value.ufi,
                swipeWarrantyApplied: swipeWarrantyApplied,
              },
              cavitywall: {
                ...value.cwi,
                contributionPaid: contributionPaid,
              },
              esh: {},
              ftch: {},
              ewi: {},
              iwi: {},
              roominaroof: {},
              loftinsulation: {},
              batterystorage: {},
              invertor: {}
            }

            let selectSer = []
            if (currentProps.RadioToggle == "company") {
              selectSer.push('solar');
            } else {
              subService.map((c) => {
                selectSer.push(c?.value?.toLowerCase())
              })
            }

            if (selectedService && selectedService.length == 1) {
              Object.keys(subserviceList).forEach((ele, index) => {
                if (selectSer.length > 0 && selectSer.indexOf(ele) == -1) {
                  delete subserviceList[ele]
                } else {
                  subserviceList[ele]
                }
              })
            } else {
              Object.keys(subserviceList).forEach((ele, index) => {
                if (ischeckedEcoServices.length > 0 && ischeckedEcoServices.indexOf(ele) == -1) {
                  delete subserviceList[ele]
                } else {
                  subserviceList[ele]
                }
              })
            }

            if (value.saveLeadData) {
              currentProps._saveServiceData({
                id: currentProps.leadId, serviceData: {
                  eco: {
                    subservice: subserviceList,
                  }
                }, service: 'eco'
              });
            }
            else {
              if (selectedService && selectedService.length == 1) {
                if (currentProps.isFromLead) {
                  currentProps.setFieldValue('otherdata', {
                    eco: {
                      subservice: subserviceList,
                    },
                    selectedSubService: selectedTab,
                  })
                  currentProps.submitForm();
                } else {
                  props.GetServiceData({ subservice: subserviceList });
                }
              }
              else {
                setIsShowEcoSer(true);
                if (ischeckedEcoServices && ischeckedEcoServices.length > 0) {
                  if (currentProps.isFromLead) {
                    currentProps.setFieldValue('otherdata', {
                      eco: {
                        subservice: subserviceList,
                      },
                      selectedSubService: selectedTab,
                    })
                    currentProps.submitForm();
                  } else {
                    props.GetServiceData({ subservice: subserviceList });
                  }
                }
              }
            }
          }
        }
        validationSchema={Yup.object().shape({
          solar: Yup.object().shape({
            roofsPanelsInstalled: Yup.number()
              .min(1, "Minimum 1 No. of Roofs is required")
              .max(20, "Maximum 20 No. of Roofs is required"),
          }),
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
            submitForm,
          } = props;

          return (
            <form onSubmit={handleSubmit}>
              {!currentProps.isFromLead &&
                <Grid container spacing={3}>
                  <Grid item xs={12} md={12}>
                    <label style={{ margin: '10px 0', display: 'block' }}>Select Service</label>
                    {currentProps.RadioToggle == "company" ?
                      <Select
                        id="subService"
                        name="subService"
                        placeholder="Select Service"
                        label="Sub Service"
                        // value={subService}
                        defaultValue={{
                          label: 'COMMERCIAL SOLAR',
                          value: 'Solar'
                        }}
                        isDisabled={true}
                        onChange={handleSubService}
                        isMulti
                        margin="normal"
                        aria-describedby="role-number-error"
                        options={SubServiceOptions}
                      />
                      :
                      <Select
                        id="subService"
                        name="subService"
                        placeholder="Select Service"
                        label="Sub Service"
                        value={subService}
                        onChange={handleSubService}
                        isMulti
                        margin="normal"
                        aria-describedby="role-number-error"
                        options={SubServiceOptions}
                      />
                    }
                  </Grid>
                </Grid>
              }

              <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                  <Paper>
                    <Tabs
                      value={selectedTab}
                      onChange={tabHandleChange}
                      aria-label="simple tabs example"
                      textColor="primary"
                      indicatorColor="primary"
                      scrollButtons="auto"
                      variant="scrollable"
                    >
                      {subService?.length > 0 && subService.map((item, index) => (
                        <Tab label={item.label} value={item.value} />
                      ))}
                    </Tabs>
                  </Paper>

                  {(selectedTab === "Solar") && (
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={12} style={{ padding: '20px 12px' }}>
                        {selectedService.includes("Solar") &&
                          <Solar
                            {...props}
                            {...currentProps}
                            setFieldValue={setFieldValue}
                            setDNOApproved={setDNOApproved}
                            setDNOApproval={setDNOApproval}
                            dnoApproval={dnoApproval}
                            dnoApproved={dnoApproved}
                            setNoOfRoofs={setNoOfRoofs}
                          />
                        }
                      </Grid>
                    </Grid>
                  )}

                  {selectedTab === "Boilers" && (
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={12} style={{ padding: '20px 12px' }}>
                        {selectedService.includes("Boilers") &&
                          <Boilers
                            {...props}
                            {...currentProps}
                            setFieldValue={setFieldValue}
                            combiBoiler={combiBoiler}
                            combiBoiler1={combiBoiler1}
                            setCombiBoiler1={setCombiBoiler1}
                            setCombiBoiler={setCombiBoiler}
                            newHeatingControlState={newHeatingControlState}
                            setNewHeatingControlState={setNewHeatingControlState}
                          />
                        }
                      </Grid>
                    </Grid>
                  )}

                  {(selectedTab === "UfiUnderfloor") && (
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={12} style={{ padding: '20px 12px' }}>
                        {selectedService.includes("UfiUnderfloor") &&
                          <UFIUnderfloor
                            {...props}
                            {...currentProps}
                            setFieldValue={setFieldValue}
                            swipeWarrantyApplied={swipeWarrantyApplied}
                            setSwipeWarrantyApplied={setSwipeWarrantyApplied}
                          />
                        }
                      </Grid>
                    </Grid>
                  )}

                  {(selectedTab === "CavityWall") && (
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={12} style={{ padding: '20px 12px' }}>
                        {selectedService.includes("CavityWall") &&
                          <CavityWall
                            {...props}
                            {...currentProps}
                            setFieldValue={setFieldValue}
                            contributionPaid={contributionPaid}
                            setContributionPaid={setContributionPaid}
                          />
                        }
                      </Grid>
                    </Grid>
                  )}

                </Grid>
              </Grid>

              {isShowEcoSer &&
                <div style={{ padding: '20px', marginTop: 15, boxShadow: '0 0 6px #ccc', borderRadius: '5px' }}>
                  <h4>Please Confirm, Which Eco Services would you like to Create?</h4>
                  {selectedService && selectedService.length > 0 && selectedService.map((x) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="primary"
                          onClick={() => handleChangeCheckbox(x)}
                          name="ecoServices"
                        />
                      }
                      label={x}
                      value={x}
                    />
                  ))}
                </div>
              }

              <CardActions
                style={{ paddingLeft: 0, paddingRight: 0, marginTop: 20 }}
              >
                <Button
                  size="large"
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    props.setFieldValue("saveLeadData", false);
                    props.submitForm();
                  }}
                >
                  Generate Quote
                </Button>
                {currentProps.isFromLead && (
                  <Button
                    size="large"
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      props.setFieldValue("saveLeadData", true);
                      props.submitForm();
                    }}
                  >
                    Save
                  </Button>
                )}
                {leadState.isSaveLeadLoading && <CircularProgress />}
              </CardActions>
            </form>
          );
        }}
      </Formik>

      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Please add some data to create service"
        action={
          <React.Fragment>
            <IconButton size="small" aria-label="close" color="inherit" onClick={() => handleClose()}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </div>
  );
};