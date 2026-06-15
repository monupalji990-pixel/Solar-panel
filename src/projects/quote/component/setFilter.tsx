import React, { useEffect } from 'react';
import { Formik } from 'formik';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Select from 'react-select';
import CardActions from '@material-ui/core/CardActions';
import Icon from '@material-ui/core/Icon';
import { useSelector } from 'react-redux';
import moment from 'moment'
import { QuoteServicesForDropdown, Months, Year } from '../../../sharedUtils/globalHelper/constantValues'
import { QuoteStatusForFilter, DataOfList } from '../../../sharedUtils/globalHelper/status'
import { selectGlobalConfig } from 'sharedUtils/sharedRedux/configuration';

export default function Filter(props) {
  const currentProps = props;
  const partnersDrop = useSelector(selectGlobalConfig).partnersDrop;
  useEffect(() => {
    props._partnerDropList();
  }, []);

  let partnerList = []
  let initPl = []
  let initDataOf = []
  let initQuoteStatus = []
  let initQuoteService = []
  let initMonth
  let initYear

  if (partnersDrop) {
    partnerList = partnersDrop.map(e => ({ label: e.name, value: e._id }));
  }
  if (props.filterData.PartnerArray !== undefined) {
    initPl = partnerList.filter(partner => {
      return props.filterData.PartnerArray.findIndex(p => {
        return p === partner.value
      }) !== -1 ? true : false;
    })
  }
  if (props.filterData.DataOfArray !== undefined) {
    initDataOf = DataOfList.filter(data => {
      return props.filterData.DataOfArray.includes(data.value);
    })
  }
  if (props.filterData.StatusArray !== undefined) {
    initQuoteStatus = QuoteStatusForFilter.filter(quote => {
      return props.filterData.StatusArray.includes(quote.value);
    })
  }
  if (props.filterData.ServicesArray !== undefined) {
    initQuoteService = QuoteServicesForDropdown.filter(service => {
      return props.filterData.ServicesArray.includes(service.value);
    })
  }
  if (props.filterData.month !== undefined) {
    initMonth = Months.find(month => month.value === props.filterData.month)
  }
  if (props.filterData.year !== undefined) {
    initYear = Year.find(year => year.value === props.filterData.year)
  }

  const ii: any = {
    partner: (props.filterData.PartnerArray !== undefined && props.filterData.PartnerArray.length > 0) ? initPl : '',
    services: (props.filterData.ServicesArray !== undefined && props.filterData.ServicesArray.length > 0) ? initQuoteService : '',
    month: props.filterData.month !== undefined ? initMonth : '',
    year: props.filterData.month !== undefined ? initYear : '',
    dataOf: (props.filterData.DataOfArray !== undefined && props.filterData.DataOfArray.length > 0) ? initDataOf : '',
    status: (props.filterData.StatusArray !== undefined && props.filterData.StatusArray.length > 0) ? initQuoteStatus : '',
    commissionStatus: props.filterData?.commissionStatus !== undefined ? props.filterData?.commissionStatus : ''
  }

  const commissionStatusList = [{ value: 'Paid', label: 'Paid' }, { value: 'Outstanding', label: 'Outstanding' }]

  return (
    <div className="app">
      <Formik
        initialValues={ii}
        enableReinitialize
        onSubmit={(values) => {
          const filterObject: any = {}
          if (values.dataOf) filterObject.DataOfArray = values.dataOf.map(v => v.value);
          if (values.partner) filterObject.PartnerArray = values.partner.map(v => v.value);
          if (values.status) filterObject.StatusArray = values.status.map(v => v.value);
          if (values.services) filterObject.ServicesArray = values.services.map(v => v.value);
          if (values.dateTo) filterObject.dateTo = moment(values.dateTo).format("YYYY-MM-DD")
          if (values.dateFrom) filterObject.dateFrom = moment(values.dateFrom).format("YYYY-MM-DD")
          if (values.month) filterObject.month = values.month.value;
          if (values.year) filterObject.year = values.year.value;
          if (values.commissionStatus) filterObject.commissionStatus = values.commissionStatus;
          props._loadingDataAction(false);
          props._filterData(filterObject);
        }}
      >
        {props => {
          const {
            values,
            touched,
            errors,
            handleBlur,
            handleSubmit,
            handleReset,
            setFieldValue,
          } = props;

          return (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>

                <Grid item xs={12} md={12}>
                  <Select
                    error={!!(errors.dataOf && touched.dataOf)}
                    id="role"
                    className="WidhtFull100"
                    placeholder="Search Data of"
                    value={values.dataOf}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="dataOf-number-error"
                    onChange={e => setFieldValue('dataOf', e)}
                    isMulti
                    name="dataOf"
                    options={DataOfList}
                    classNamePrefix="select"
                  />
                </Grid>

                {!['service_partner'].includes(currentProps.slug) ?
                  <Grid item xs={12} md={12}>
                    <Select
                      error={!!(errors.partner && touched.partner)}
                      id="role"
                      className="WidhtFull100 basic-multi-select"
                      placeholder="Partner List"
                      value={values.partner}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="partner-number-error"
                      onChange={e => setFieldValue('partner', e)}
                      isMulti
                      name="partner"
                      options={partnerList}
                      classNamePrefix="select"
                    />
                  </Grid> : null}

                <Grid item xs={12} md={12}>
                  <Select
                    error={!!(errors.services && touched.services)}
                    id="role"
                    className="WidhtFull100 basic-multi-select"
                    placeholder="Services"
                    value={values.services}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="services-number-error"
                    onChange={e => setFieldValue('services', e)}
                    isMulti
                    name="services"
                    options={QuoteServicesForDropdown}
                    classNamePrefix="select"
                  />
                </Grid>

                <Grid item xs={12} md={12}>
                  <Select
                    error={!!(errors.status && touched.status)}
                    id="role"
                    className="WidhtFull100 basic-multi-select"
                    placeholder="Quote Status"
                    value={values.status}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="status-number-error"
                    onChange={e => setFieldValue('status', e)}
                    isMulti
                    name="status"
                    options={QuoteStatusForFilter}
                    classNamePrefix="select"
                  />
                </Grid>

                {['admin', 'management', 'service_partner'].includes(currentProps.slug) ?
                  <Grid item xs={12} md={12}>
                    <Select
                      error={!!(errors.commissionStatus && touched.commissionStatus)}
                      id="role"
                      className="WidhtFull100 basic-multi-select"
                      placeholder="Commission Status"
                      value={values.commissionStatus}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="commissionStatus-number-error"
                      onChange={e => setFieldValue('commissionStatus', e)}
                      name="commissionStatus"
                      options={commissionStatusList}
                      classNamePrefix="select"
                    />
                  </Grid> : null}

                <Grid item xs={12} md={12}>
                  <Select
                    error={!!(errors.month && touched.month)}
                    id="role"
                    className="WidhtFull100 basic-multi-select"
                    placeholder="Month"
                    value={values.month}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="month-number-error"
                    onChange={e => setFieldValue('month', e)}
                    options={Months}
                    name="month"
                    classNamePrefix="select"
                  />
                </Grid>

                <Grid item xs={12} md={12}>
                  <Select
                    error={!!(errors.year && touched.year)}
                    id="role"
                    className="WidhtFull100 basic-multi-select"
                    placeholder="Year"
                    value={values.year}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="year-number-error"
                    onChange={e => setFieldValue('year', e)}
                    name="year"
                    options={Year}
                    classNamePrefix="select"
                  />
                </Grid>

                <Grid item xs={12} md={12}>
                  <CardActions
                    style={{ paddingLeft: 0, paddingRight: 0, marginTop: 20 }}
                  >
                    <Button
                      size="large"
                      variant="contained"
                      onClick={() => {
                        handleReset()
                        props.resetForm()
                        currentProps._loadingDataAction(false);
                        currentProps._filterData({});
                      }}
                    >
                      <Icon className="fa fa-refresh" />
                    </Button>
                    <Button
                      size="large"
                      variant="contained"
                      color="primary"
                      type="submit"
                    >
                      <Icon className="fa fa-filter" />
                    </Button>
                  </CardActions>
                </Grid>
              </Grid>
            </form>
          );
        }}
      </Formik>
    </div>
  );
}