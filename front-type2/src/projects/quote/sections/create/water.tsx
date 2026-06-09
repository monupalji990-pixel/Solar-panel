import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Select from 'react-select';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ContractLengthOption } from '../../../../sharedUtils/globalHelper/constantValues'
import { helperMethods } from '../../../../sharedUtils/globalHelper/helperMethod';
import { useSelector } from 'react-redux';
import { selectLeadState } from 'projects/lead/redux/lead';

export default function Water(props) {
  let leadServiceDataInit: any = null;

  const currentProps = props;
  const [startLoader, setStartLoader] = useState(false);
  const leadState = useSelector(selectLeadState);
  let supplierList = []
  if (props.suppliers) {
    supplierList = helperMethods.specificServiceSupplier(props.suppliers, 'Water', 'add')
  }

  if ( props.serviceDataFromLead && Object.keys(props.serviceDataFromLead).length > 1) {
    leadServiceDataInit = { ...props.serviceDataFromLead };
    leadServiceDataInit.current_supplier = supplierList.filter((sup) => {
      if (sup.value == leadServiceDataInit.SupplerID)
        return sup
    })[0];
    leadServiceDataInit.previous_contract_length = { label: leadServiceDataInit.previous_contract_length, value: leadServiceDataInit.previous_contract_length };
    leadServiceDataInit.contract_length = { label: leadServiceDataInit.contract_length, value: leadServiceDataInit.contract_length };

    leadServiceDataInit.SewageSpid = leadServiceDataInit.SewageSpid === null ? props.isSiteData?.SewageSpid : leadServiceDataInit.SewageSpid
    leadServiceDataInit.WaterCorespId = leadServiceDataInit.WaterCorespId === null ? props.isSiteData?.WaterCorespId : leadServiceDataInit.WaterCorespId
    leadServiceDataInit.WaterMeterSN = leadServiceDataInit.WaterMeterSN === null ? props.isSiteData?.WaterMeterSN : leadServiceDataInit.WaterMeterSN
  }

  const ii: any = {
    saveLeadData: false,
    current_supplier: '',
    previous_contract_length: '',
    contract_length: '',
    contract_start_date: '',
    contract_end_date: '',
    previous_contract_start_date: '',
    SewageSpid: props.isSiteData?.SewageSpid,
    WaterCorespId: props.isSiteData?.WaterCorespId,
    WaterMeterSN: props.isSiteData?.WaterMeterSN,
  }
  return (
    <div className="app">
      <Formik
        initialValues={leadServiceDataInit !== null ? leadServiceDataInit : ii}
        onSubmit={(value) => {
          let qu: any = {};
          let SupplerID = ''
          if (value.accountNumber) qu.accountNumber = value.accountNumber
          if (value.current_supplier) SupplerID = value.current_supplier.value
          if (value.previous_contract_length) qu.previous_contract_length = value.previous_contract_length.value;
          if (value.contract_length) qu.contract_length = value.contract_length.value;
          if (value.contract_start_date) {
            qu.contract_start_date = new Date(value.contract_start_date).getTime()
          } else {
            qu.contract_start_date = new Date().getTime()
          }
          if (value.contract_end_date) qu.contract_end_date = new Date(value.contract_end_date).getTime();
          if (value.previous_contract_start_date) {
            qu.previous_contract_start_date = new Date(value.previous_contract_start_date).getTime();
          } else {
            qu.previous_contract_start_date = new Date().getTime();
          }
          if (value.WaterCorespId) qu.WaterCorespId = value.WaterCorespId
          if (value.CoreSpidRates) qu.CoreSpidRates = value.CoreSpidRates
          if (value.SewageSpid) qu.SewageSpid = value.SewageSpid
          if (value.SewageApidRates) qu.SewageApidRates = value.SewageApidRates
          if (value.WaterRenewalDate) qu.WaterRenewalDate = new Date(value.WaterRenewalDate).getTime();
          if (value.WaterMeterSN) qu.WaterMeterSN = value.WaterMeterSN
          if (value.WaterAnnualSpend) qu.WaterAnnualSpend = value.WaterAnnualSpend
          if (value.WaterDiscount) qu.WaterDiscount = value.WaterDiscount
          if (value.saveLeadData) {
            qu.SupplerID = SupplerID;
            currentProps._saveServiceData({ id: currentProps.leadId, serviceData: { water: qu }, service: 'water' });
          } else {
            if (currentProps.isFromLead) {
              currentProps.setFieldValue('otherdata', {
                water: qu,
                Supplier: SupplerID
              })
              currentProps.submitForm();
            } else {
              props.GetServiceData(qu, SupplerID);
            }
          }
        }}
        validationSchema={Yup.object().shape({
          current_supplier: Yup.string().required('Supplier is required'),
          previous_contract_length: Yup.string().required('Current Contract Length is required'),
          contract_length: Yup.string().required('Preferred Contract Length is required'),
          contract_start_date: Yup.string().required('Contract start date is required'),
          contract_end_date: Yup.string().required('Contract end date is required'),
          previous_contract_start_date: Yup.string().required('Previous contract start date is required'),
        })}
      >
        {props => {
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
            submitForm
          } = props;

          return (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Select
                    className={errors.current_supplier && touched.current_supplier ? 'ErrorColor' : ''}
                    id="current_supplier"
                    name="current_supplier"
                    placeholder="Current Supplier"
                    value={values.current_supplier}
                    onChange={e => { setFieldValue('current_supplier', e) }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="role-number-error"
                    options={supplierList}
                  />
                  {errors.current_supplier && touched.current_supplier && (
                    <FormHelperText className="errormsg" id="current_supplier-error">
                      {errors.current_supplier}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    error={errors.WaterCorespId && touched.WaterCorespId ? true : false}
                    name="WaterCorespId"
                    label="Water corespid"
                    value={values.WaterCorespId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="WaterCorespId-error"
                    className="WidhtFull100"
                  />
                  {errors.WaterCorespId && touched.WaterCorespId && (
                    <FormHelperText className="errormsg" id="WaterCorespId-error">
                      {errors.WaterCorespId}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    error={errors.CoreSpidRates && touched.CoreSpidRates ? true : false}
                    name="CoreSpidRates"
                    label="Core spid rates"
                    value={values.CoreSpidRates}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="CoreSpidRates-error"
                    className="WidhtFull100"
                  />
                  {errors.CoreSpidRates && touched.CoreSpidRates && (
                    <FormHelperText className="errormsg" id="CoreSpidRates-error">
                      {errors.CoreSpidRates}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <TextField
                    variant="outlined"
                    error={errors.SewageSpid && touched.SewageSpid ? true : false}
                    name="SewageSpid"
                    label="Sewage Spid"
                    value={values.SewageSpid}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="SewageSpid-error"
                    className="WidhtFull100"
                  />
                  {errors.SewageSpid && touched.SewageSpid && (
                    <FormHelperText className="errormsg" id="SewageSpid-error">
                      {errors.SewageSpid}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    variant="outlined"
                    error={errors.SewageApidRates && touched.SewageApidRates ? true : false}
                    name="SewageApidRates"
                    label="Sewage apid rates"
                    value={values.SewageApidRates}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="SewageApidRates-error"
                    className="WidhtFull100"
                  />
                  {errors.SewageApidRates && touched.SewageApidRates && (
                    <FormHelperText className="errormsg" id="SewageApidRates-error">
                      {errors.SewageApidRates}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    variant="outlined"
                    error={errors.WaterMeterSN && touched.WaterMeterSN ? true : false}
                    name="WaterMeterSN"
                    label="Water meter SN"
                    value={values.WaterMeterSN}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="WaterMeterSN-error"
                    className="WidhtFull100"
                  />
                  {errors.WaterMeterSN && touched.WaterMeterSN && (
                    <FormHelperText className="errormsg" id="WaterMeterSN-error">
                      {errors.WaterMeterSN}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={3}>
                  <TextField
                    variant="outlined"
                    error={errors.WaterAnnualSpend && touched.WaterAnnualSpend ? true : false}
                    name="WaterAnnualSpend"
                    label="Water annual spend"
                    value={values.WaterAnnualSpend}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="WaterAnnualSpend-error"
                    className="WidhtFull100"
                  />
                  {errors.WaterAnnualSpend && touched.WaterAnnualSpend && (
                    <FormHelperText className="errormsg" id="WaterAnnualSpend-error">
                      {errors.WaterAnnualSpend}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Select
                    className={errors.previous_contract_length && touched.previous_contract_length ? 'ErrorColor' : ''}
                    id="previous_contract_length"
                    name="previous_contract_length"
                    placeholder="Current contract length"
                    value={values.previous_contract_length}
                    onChange={e => { setFieldValue('previous_contract_length', e) }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="role-number-error"
                    options={ContractLengthOption}
                  />
                  {errors.previous_contract_length && touched.previous_contract_length && (
                    <FormHelperText className="errormsg" id="previous_contract_length-error">
                      {errors.previous_contract_length}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-around">
                      <KeyboardDatePicker
                        variant="dialog"
                        inputVariant="outlined"
                        error={errors.previous_contract_start_date && touched.previous_contract_start_date ? true : false}
                        margin="normal"
                        id="previous_contract_start_date"
                        label="Current Contract End Date"
                        allowKeyboardControl
                        className="WidhtFull100"
                        format="dd/MM/yyyy"
                        value={values.previous_contract_start_date ? values.previous_contract_start_date : null}
                        onChange={e => setFieldValue('previous_contract_start_date', e)}
                        KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }}
                        aria-describedby="previous_contract_start_date-number-error"
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                  {errors.previous_contract_start_date && touched.previous_contract_start_date && (
                    <FormHelperText className="errormsg" id="previous_contract_start_date-error">
                      {errors.previous_contract_start_date}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Select
                    className={errors.contract_length && touched.contract_length ? 'ErrorColor' : ''}
                    id="contract_length"
                    name="contract_length"
                    placeholder="Preferred contract length"
                    value={values.contract_length}
                    onChange={e => { setFieldValue('contract_length', e) }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="role-number-error"
                    options={ContractLengthOption}
                  />
                  {errors.contract_length && touched.contract_length && (
                    <FormHelperText className="errormsg" id="contract_length-error">
                      {errors.contract_length}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} md={4}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-around">
                      <KeyboardDatePicker
                        variant="dialog"
                        inputVariant="outlined"
                        error={errors.contract_start_date && touched.contract_start_date ? true : false}
                        margin="normal"
                        id="contract_start_date"
                        name="contract_start_date"
                        label="Preferred Contract Start Date"
                        allowKeyboardControl
                        className="WidhtFull100"
                        format="dd/MM/yyyy"
                        value={values.contract_start_date ? values.contract_start_date : null}
                        onChange={e => setFieldValue('contract_start_date', e)}
                        KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }}
                        aria-describedby="contract_start_date-number-error"
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                  {errors.contract_start_date && touched.contract_start_date && (
                    <FormHelperText className="errormsg" id="contract_start_date-error">
                      {errors.contract_start_date}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12} md={4}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-around">
                      <KeyboardDatePicker
                        variant="dialog"
                        inputVariant="outlined"
                        error={!!(errors.contract_end_date && touched.contract_end_date)}
                        margin="normal"
                        id="contract_end_date"
                        label="Preferred Contract end date"
                        allowKeyboardControl
                        format="dd/MM/yyyy"
                        value={values.contract_end_date ? values.contract_end_date : null}
                        onChange={e => setFieldValue('contract_end_date', e)}
                        className="WidhtFull100"
                        KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }}
                        aria-describedby="contract_end_date-error"
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                  {errors.contract_end_date && touched.contract_end_date && (
                    <FormHelperText className="errormsg" id="contract_end_date-error">
                      {errors.contract_end_date}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    variant="outlined"
                    error={errors.WaterDiscount && touched.WaterDiscount ? true : false}
                    name="WaterDiscount"
                    label="Water discount"
                    value={values.WaterDiscount}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="WaterDiscount-error"
                    className="WidhtFull100"
                  />
                  {errors.WaterDiscount && touched.WaterDiscount && (
                    <FormHelperText className="errormsg" id="WaterDiscount-error">
                      {errors.WaterDiscount}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-around">
                      <KeyboardDatePicker
                        variant="dialog"
                        inputVariant="outlined"
                        error={errors.WaterRenewalDate && touched.WaterRenewalDate ? true : false}
                        margin="normal"
                        id="WaterRenewalDate"
                        name="WaterRenewalDate"
                        label="Water renewal date"
                        allowKeyboardControl
                        className="WidhtFull100"
                        format="dd/MM/yyyy"
                        value={values.WaterRenewalDate ? values.WaterRenewalDate : null}
                        onChange={e => setFieldValue('WaterRenewalDate', e)}
                        KeyboardButtonProps={{
                          'aria-label': 'change date',
                        }}
                        aria-describedby="WaterRenewalDate-number-error"
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                  {errors.WaterRenewalDate && touched.WaterRenewalDate && (
                    <FormHelperText className="errormsg" id="WaterRenewalDate-error">
                      {errors.WaterRenewalDate}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>

              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    variant="outlined"
                    error={errors.accountNumber && touched.accountNumber ? true : false}
                    label="Account Number"
                    name="accountNumber"
                    value={values.accountNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="accountNumber-error"
                    className="WidhtFull100"
                  />
                  {errors.accountNumber && touched.accountNumber && (
                    <FormHelperText className="errormsg" id="accountNumber-error">
                      {errors.accountNumber}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>

              <CardActions
                style={{ paddingLeft: 0, paddingRight: 0, marginTop: 20 }}
              >
                <Button
                  size="large"
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    props.setFieldValue('saveLeadData', false);
                    props.submitForm();
                  }}
                // type="submit"
                // disabled={isSubmitting}
                >
                  Generate Quote
                </Button>{" "}
                {currentProps.isFromLead && <Button
                  size="large"
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    props.setFieldValue('saveLeadData', true);
                    props.submitForm();
                  }}
                // disabled={isSubmitting}
                >
                  Save
                </Button>}
                {leadState.isSaveLeadLoading && <CircularProgress />}

              </CardActions>
            </form>
          );
        }}
      </Formik>
    </div >
  );
};