import React from 'react';
import { Formik } from 'formik';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Select from 'react-select';
import CardActions from '@material-ui/core/CardActions';
import Icon from '@material-ui/core/Icon';
import TextField from '@material-ui/core/TextField';
import { HeadlineStatusOptions, LESStatusOptions } from "../../../sharedUtils/globalHelper/constantValues";

export default function Filter(props) {

    const currentProps = props;

    const initialValues = {
        businessName: '',
        supplierName: '',
        QuoteID: '',
        meterNumber: '',
        lesStatus: null,
        contractStatus: null,
    };

    return (
        <div className="app">
            <Formik
                initialValues={initialValues}
                enableReinitialize
                onSubmit={(values) => {
                    try {
                        const obj = {}
                        if (values.businessName) obj["company.businessName"] = values.businessName
                        if (values.supplierName) obj["supplier.supplierName"] = values.supplierName
                        if (values.meterNumber) obj["meterNumber"] = values.meterNumber
                        if (values.QuoteID) obj["quote.QuoteID"] = values.QuoteID
                        if (values.contractStatus) obj["contractStatus"] = values.contractStatus.value
                        if (values.lesStatus) obj["lesStatus"] = values.lesStatus.value

                        props._filterData(obj);
                    } catch (error) {
                        console.log("error in filter =>>>>", error)
                    }
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
                        handleChange,
                    } = props;

                    return (
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        variant="outlined"
                                        error={errors.businessName && touched.businessName ? true : false}
                                        name="businessName"
                                        label="Business Name"
                                        id="company.businessName"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className="WidhtFull100"
                                        value={values.businessName}
                                        margin="normal"
                                        aria-describedby="title-error"
                                    />
                                </Grid>

                                <Grid item xs={12} md={3}>
                                    <TextField
                                        variant="outlined"
                                        error={errors.supplierName && touched.supplierName ? true : false}
                                        name="supplierName"
                                        label="Supplier Name"
                                        id="supplierName"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className="WidhtFull100"
                                        value={values.supplierName}
                                        margin="normal"
                                        aria-describedby="title-error"
                                    />
                                </Grid>

                                <Grid item xs={12} md={3}>
                                    <TextField
                                        variant="outlined"
                                        error={errors.meterNumber && touched.meterNumber ? true : false}
                                        name="meterNumber"
                                        label="MPAN/MPRN"
                                        className="WidhtFull100"
                                        value={values.meterNumber}
                                        margin="normal"
                                        id="meterNumber"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        aria-describedby="title-error"
                                    />
                                </Grid>

                                <Grid item xs={12} md={3}>
                                    <TextField
                                        variant="outlined"
                                        error={errors.QuoteID && touched.QuoteID ? true : false}
                                        name="QuoteID"
                                        label="QuoteID"
                                        className="WidhtFull100"
                                        id="QuoteID"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.QuoteID}
                                        margin="normal"
                                        aria-describedby="title-error"
                                    />
                                </Grid>

                                <Grid item xs={12} md={3}>
                                    <Select
                                        variant="outlined"
                                        id="lesStatus"
                                        isClearable
                                        placeholder="LES Status"
                                        value={values.lesStatus}
                                        onChange={(e) => {
                                            setFieldValue("lesStatus", e);
                                        }}
                                        onBlur={handleBlur}
                                        margin="normal"
                                        aria-describedby="lesStatus-number-error"
                                        name="colors"
                                        options={LESStatusOptions}
                                    />
                                </Grid>

                                <Grid item xs={12} md={3}>
                                    <Select
                                        variant="outlined"
                                        id="contractStatus"
                                        isClearable
                                        placeholder="Headline Status"
                                        value={values.contractStatus}
                                        onChange={(e) => {
                                            setFieldValue("contractStatus", e);
                                        }}
                                        onBlur={handleBlur}
                                        margin="normal"
                                        aria-describedby="contractStatus-number-error"
                                        name="colors"
                                        options={HeadlineStatusOptions}
                                    />
                                </Grid>


                                <Grid item xs={12} md={12}>
                                    <CardActions
                                        style={{ paddingLeft: 0, paddingRight: 0, marginTop: 0, marginBottom: 20 }}
                                    >
                                        <Button
                                            size="medium"
                                            variant="contained"
                                            onClick={() => {
                                                handleReset()
                                                currentProps._filterData({});
                                            }}
                                        >
                                            <Icon className="fa fa-refresh" /> Reset
                                        </Button>
                                        <Button
                                            size="medium"
                                            variant="contained"
                                            color="primary"
                                            type="submit"
                                        >
                                            <Icon className="fa fa-filter" /> Filter
                                        </Button>
                                    </CardActions>
                                </Grid>
                            </Grid>
                        </form>
                    );
                }}
            </Formik>
        </div >
    );
}
//);