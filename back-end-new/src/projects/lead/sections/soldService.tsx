import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import Grid from "@material-ui/core/Grid";
import Select from "react-select";
import CardActions from "@material-ui/core/CardActions";
import FormHelperText from "@material-ui/core/FormHelperText";
import Gas from "../../quote/sections/create/gas";
import Electric from "../../quote/sections/create/electric";
import Water from "../../quote/sections/create/water";
import ChipPin from "../../quote/sections/create/chipandpin";
import Telecoms from "../../quote/sections/create/telecoms";
import Broadband from "../../quote/sections/create/broadband";
import SolarPaid from "../../quote/sections/create/solarpaid";
import Energy from "../../quote/sections/create/energy";
import Waste from "../../quote/sections/create/waste";
import Insurance from "../../quote/sections/create/insurance";
import BusinessRates from "../../quote/sections/create/businessRates";
import Eco from "../../quote/sections/create/eco";
import TelecomAndBroadband from "../../quote/sections/create/teleBroad"
import { useEffect } from "react";
import { subServiceMapperObject } from "../../../sharedUtils/globalHelper/constantValues";

export default function SoldService(props) {
  // Sold servies action under the lead action tab
  const currentProps = props;
  const _id = props?.singleLead?._id
  const serviceType = props?.singleLead?.serviceType

  const [isPriceForGas, setIsPriceForGas]: any = useState({});
  const [isPriceForElec, setIsPriceForElec]: any = useState({});

  useEffect(() => {
    if (props.showingFrom === 'priceModule') {
      if (props.details?.localData?.serviceType === 'electric')
        setIsPriceForElec(props.details);
      else if (props.details?.localData?.serviceType === 'gas') {
        setIsPriceForGas(props.details);
      }
    }
  }, [props.showingFrom])

  let dropServices = [];
  if (serviceType) {
    dropServices = serviceType.map((e) => ({ label: e, value: e }));
  }

  function getServiceForm(serviceName, setFieldValue, submitForm, suppliers, singleLead) {
    let postcode;
    let email = null;
    let contact = null;
    let serviceDataFromLead = null;

    if (singleLead.Site && singleLead.Site.postcode) {
      postcode = singleLead.Site.postcode;
      if (singleLead.Contact && singleLead.Contact.email && singleLead.Contact.mobile) {
        email = singleLead.Contact.email;
        contact = singleLead.Contact.mobile;
      }
    } else if (singleLead.Consumer && singleLead.Consumer.postcode) {
      postcode = singleLead.Consumer.postcode;
    }

    switch (serviceName) {
      case "Gas": return <Gas isPriceData={isPriceForGas} showingFrom={props.showingFrom} isSiteData={singleLead?.Site?.gas} isFromLead={true} setFieldValue={setFieldValue} submitForm={submitForm} suppliers={suppliers} SitePostcode={postcode} _saveServiceData={props._saveServiceData} leadId={_id} serviceDataFromLead={(props.singleLead.serviceData && props.singleLead.serviceData.gas) !== undefined ? props.singleLead.serviceData.gas : null} />;
      // case "Debt": return <Debt isSiteData={singleLead?.Site?.debt} isFromLead={true} setFieldValue={setFieldValue} submitForm={submitForm} suppliers={suppliers} SitePostcode={postcode} _saveServiceData={props._saveServiceData} leadId={_id} serviceDataFromLead={(props.singleLead.serviceData && props.singleLead.serviceData.debt) !== undefined ? props.singleLead.serviceData.debt : null} />;
      case "TelecomAndBroadband": return <TelecomAndBroadband isSiteData={singleLead?.Site?.telecomandbroadband} isFromLead={true} setFieldValue={setFieldValue} submitForm={submitForm} suppliers={suppliers} SitePostcode={postcode} _saveServiceData={props._saveServiceData} leadId={_id} serviceDataFromLead={(props.singleLead.serviceData && props.singleLead.serviceData.telecomandbroadband) !== undefined ? props.singleLead.serviceData.telecomandbroadband : null} />;
      case "Electric": return <Electric isPriceData={isPriceForElec} showingFrom={props.showingFrom} isSiteData={singleLead?.Site?.electric} isFromLead={true} setFieldValue={setFieldValue} submitForm={submitForm} suppliers={suppliers} _saveServiceData={props._saveServiceData} leadId={_id} serviceDataFromLead={(props.singleLead.serviceData && props.singleLead.serviceData.electric) !== undefined ? props.singleLead.serviceData.electric : null} />
      case "Water": return <Water isSiteData={singleLead?.Site?.water} isFromLead={true} setFieldValue={setFieldValue} submitForm={submitForm} suppliers={suppliers} _saveServiceData={props._saveServiceData} leadId={_id} serviceDataFromLead={(props.singleLead.serviceData && props.singleLead.serviceData.water) !== undefined ? props.singleLead.serviceData.water : null} />
      case "ChipAndPin": return <ChipPin isSiteData={singleLead?.Site?.chipandpin} isFromLead={true} setFieldValue={setFieldValue} submitForm={submitForm} suppliers={suppliers} _saveServiceData={props._saveServiceData} leadId={_id} serviceDataFromLead={(props.singleLead.serviceData && props.singleLead.serviceData.chipAndPin) !== undefined ? props.singleLead.serviceData.chipAndPin : null} />
      case "Telecoms": return <Telecoms isFromLead={true} setFieldValue={setFieldValue} submitForm={submitForm} suppliers={suppliers} _saveServiceData={props._saveServiceData} leadId={_id} serviceDataFromLead={(props.singleLead.serviceData && props.singleLead.serviceData.telecoms) !== undefined ? props.singleLead.serviceData.telecoms : null} />
      case "Broadband": return <Broadband isFromLead={true} setFieldValue={setFieldValue} submitForm={submitForm} suppliers={suppliers} _saveServiceData={props._saveServiceData} leadId={_id} serviceDataFromLead={(props.singleLead.serviceData && props.singleLead.serviceData.broadband) !== undefined ? props.singleLead.serviceData.broadband : null} />
      case "Energy": return <Energy isFromLead={true} setFieldValue={setFieldValue} submitForm={submitForm} suppliers={suppliers} _saveServiceData={props._saveServiceData} leadId={_id} serviceDataFromLead={(props.singleLead.serviceData && props.singleLead.serviceData.energy) !== undefined ? props.singleLead.serviceData.energy : null} />
      // case "Funeral": return <Funeral isFromLead={true} setFieldValue={setFieldValue} submitForm={submitForm} suppliers={suppliers} _saveServiceData={props._saveServiceData} leadId={_id} serviceDataFromLead={(props.singleLead.serviceData && props.singleLead.serviceData.funeral) !== undefined ? props.singleLead.serviceData.funeral : null} />
      // case "Mortgage": return <Mortgage isFromLead={true} setFieldValue={setFieldValue} submitForm={submitForm} suppliers={suppliers} _saveServiceData={props._saveServiceData} leadId={_id} serviceDataFromLead={(props.singleLead.serviceData && props.singleLead.serviceData.mortgage) !== undefined ? props.singleLead.serviceData.mortgage : null} />
      case "Waste": return <Waste isFromLead={true} setFieldValue={setFieldValue} submitForm={submitForm} suppliers={suppliers} _saveServiceData={props._saveServiceData} leadId={_id} serviceDataFromLead={(props.singleLead.serviceData && props.singleLead.serviceData.waste) !== undefined ? props.singleLead.serviceData.waste : null} />
      case "Insurance": return <Insurance isFromLead={true} setFieldValue={setFieldValue} submitForm={submitForm} suppliers={suppliers} email={email} contact={contact} _saveServiceData={props._saveServiceData} leadId={_id} serviceDataFromLead={(props.singleLead.serviceData && props.singleLead.serviceData.insurance) !== undefined ? props.singleLead.serviceData.insurance : null} />
      case "BusinessRates": return <BusinessRates isFromLead={true} setFieldValue={setFieldValue} submitForm={submitForm} suppliers={suppliers} _saveServiceData={props._saveServiceData} leadId={_id} serviceDataFromLead={(props.singleLead.serviceData && props.singleLead.serviceData.businessrates) !== undefined ? props.singleLead.serviceData.businessrates : null} />
      case "Eco": return <Eco isFromLead={true} setFieldValue={setFieldValue} submitForm={submitForm} suppliers={suppliers} _saveServiceData={props._saveServiceData} leadId={_id} serviceDataFromLead={(props.singleLead.serviceData && props.singleLead.serviceData.eco) !== undefined ? props.singleLead.serviceData.eco : null} />
      case "PaidSolar": return <SolarPaid isFromLead={true} setFieldValue={setFieldValue} submitForm={submitForm} suppliers={suppliers} _saveServiceData={props._saveServiceData} leadId={_id} serviceDataFromLead={(props.singleLead.serviceData && props.singleLead.serviceData.paidsolar) !== undefined ? props.singleLead.serviceData.paidsolar : null} />
    }
  }

  return (
    <Grid item xs={12} md={12} style={{ marginTop: 10 }} className='SoldServiceSection'>
      <Formik
        initialValues={{
          service: null,
          otherdata: null
        }}
        onSubmit={(values, { resetForm }) => {
          let obj: any = {};
          let subServiceTypeArray = [...props?.singleLead?.subServiceType];
          obj.id = _id;

          if (values.service) {

            const st = [...serviceType];

            obj.serviceType = values.service.value;

            const index = st.indexOf(values.service.value);
            if (!Object.keys(values.otherdata).includes('eco') && index > -1) {
              st.splice(index, 1);
            } else {
              const subIndex = subServiceTypeArray.indexOf(values.otherdata?.selectedSubService);
              if (subIndex > -1) {
                subServiceTypeArray.splice(subIndex, 1)
                if (subServiceTypeArray.length === 0) {
                  let serviceIdx = st.indexOf(values.service.value);
                  st.splice(serviceIdx, 1);
                }
              }
            }
            props.setDefaultSSValues(
              st.map((v) => ({
                label: v.split(" ").join(""),
                value: v.split(" ").join(""),
              }))
            );
            obj.serviceTypeArray = st;
          }
          obj.serviceData = values.otherdata;
          obj.Supplier = values.otherdata.Supplier;

          if (props.singleLead?.serviceType.includes('PaidSolar') || props.singleLead?.serviceType.includes('Eco')) {
            if (props.singleLead?.Company?.lat || props.singleLead?.Consumer?.lat) obj.lat = props.singleLead?.Company?.lat || props.singleLead?.Consumer?.lat
            if (props.singleLead?.Company?.lon || props.singleLead?.Consumer?.lon) obj.lon = props.singleLead?.Company?.lon || props.singleLead?.Consumer?.lon
          }

          if (values?.otherdata?.eco?.subservice) {
            let selectedSer = values.otherdata.eco.subservice
            let x = []
            Object.keys(selectedSer).forEach((ele) => {
              x.push(subServiceMapperObject[ele])

              const sIndex = subServiceTypeArray.indexOf(subServiceMapperObject[ele]);
              if (sIndex > -1) {
                subServiceTypeArray.splice(sIndex, 1);
              }
            })
            obj.soldSubServiceTypeArray = x
          }

          if (values?.otherdata?.eco) {
            obj.subServiceTypeArray = subServiceTypeArray
          }

          delete values.otherdata.Supplier;
          if (props.singleLead.Contact)
            obj.User = [props.singleLead.Contact._id];

          delete obj.serviceData.selectedSubService;

          props._soldService(obj);

          setTimeout(function () {
            resetForm();
          }, 3000);
        }}
        validationSchema={Yup.object().shape({
          service: Yup.string().required("Service is Required"),
        })}
      >
        {(props) => {
          const {
            values,
            touched,
            errors,
            handleBlur,
            handleSubmit,
            handleReset,
            setFieldValue,
            submitForm
          } = props;

          return (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                  <Select
                    error={errors.service && touched.service ? true : false}
                    id="service"
                    className="WidhtFull100"
                    placeholder="Services"
                    value={values.service}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="service-number-error"
                    onChange={(e) => {
                      setFieldValue("service", e)
                    }
                    }
                    name="service"
                    options={dropServices}
                    classNamePrefix="select"
                  />
                  {errors.service && touched.service && (
                    <FormHelperText className="errormsg" id="service-error">
                      {errors.service}
                    </FormHelperText>
                  )}
                </Grid>
                {values.service == null ? null : getServiceForm(values.service.label, setFieldValue, submitForm, currentProps.suppliers, currentProps.singleLead)}
                <Grid item xs={12} md={12}>
                  <CardActions
                    style={{
                      paddingLeft: 0,
                      paddingRight: 0,
                      marginTop: 0,
                    }}
                  >
                  </CardActions>
                </Grid>
              </Grid>
            </form>
          );
        }}
      </Formik>
    </Grid>
  );
}
