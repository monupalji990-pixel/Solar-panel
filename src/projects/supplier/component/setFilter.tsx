import React, { } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Select from 'react-select';
import CardActions from '@material-ui/core/CardActions';
import Icon from '@material-ui/core/Icon';
import MyDrawerLeft from "../../../sharedUtils/sharedComponents/drawerHelperLeft";
import { SupplierTypeOptions } from 'sharedUtils/globalHelper/constantValues';

export default function SupplierFilter(props) {
    return (
        <MyDrawerLeft
            open={props.open == "supplierFilterDrawer" ? true : false}
            onClose={props.onClose}
        >
            <SupplierFilterLogic {...props} />
        </MyDrawerLeft>
    )
}

function SupplierFilterLogic(props) {
    const currentProps = props;

    const serviceOptions = [
        {
            value: 'Gas', label: 'Gas',
        },
        {
            value: 'Electric', label: 'Electric',
        },
        {
            value: 'Debt', label: 'Debt',
        },
        {
            value: 'Water', label: 'Water',
        },
        {
            value: 'ChipAndPin', label: 'Chip And Pin',
        },
        {
            value: 'Telecoms', label: 'Telecoms',
        },
        {
            value: 'Broadband', label: 'Broadband',
        }, {
            value: 'Energy', label: 'Energy',
        },
        {
            value: 'Funeral', label: 'Funeral',
        },
        { value: 'Mortgage', label: 'Mortgage' },
        { value: 'Waste', label: 'Waste' },
        { value: 'Insurance', label: 'Insurance' },
        { value: 'BusinessRates', label: 'BusinessRates' },
        { value: 'Renewable Energy', label: 'Renewable Energy' },
        { value: 'BankAccount', label: 'BankAccount' },
        { value: 'PhoneLine', label: 'PhoneLine' },
        { value: 'Finance', label: 'Finance' },
        { value: 'VOIP', label: 'VOIP' },
        { value: 'Mobile', label: 'Mobile' },
        { value: 'EPOS', label: 'EPOS' },
        { value: 'Marketing', label: 'Marketing' },

    ]
    return (
        <div className="app">
            <Formik
                initialValues={{ service: '', supplierType: null }}
                enableReinitialize
                onSubmit={(values) => {
                    const filterObject: any = {}
                    if (values.service) filterObject.serviceType = values.service
                    if (values.supplierType) filterObject.supplierType = values.supplierType
                    props._loadingDataAction(false);
                    props._filterData(filterObject);
                }}
                validationSchema={Yup.object().shape({})}
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
                                        id="service"
                                        isMulti
                                        className="WidhtFull100 basic-multi-select"
                                        placeholder="Service"
                                        value={values.service}
                                        margin="normal"
                                        aria-describedby="service-number-error"
                                        onChange={e => setFieldValue('service', e)}
                                        onBlur={handleBlur}
                                        name="service"
                                        options={serviceOptions}
                                        classNamePrefix="select"
                                    />
                                </Grid>

                                <Grid item xs={12} md={12}>
                                    <Select
                                        id="leadType"
                                        placeholder="Supplier Type"
                                        className="WidhtFull100 basic-multi-select"
                                        value={values.supplierType}
                                        isMulti
                                        onChange={(e) => {
                                            setFieldValue("supplierType", e);
                                        }}
                                        onBlur={handleBlur}
                                        margin="normal"
                                        aria-describedby="leadType-number-error"
                                        name="colors"
                                        options={SupplierTypeOptions}
                                    />
                                </Grid>

                                <Grid item xs={12} md={12}>
                                    <CardActions style={{ paddingLeft: 0, paddingRight: 0, marginTop: 20 }}>
                                        <Button
                                            size="large"
                                            variant="contained"
                                            onClick={() => {
                                                handleReset();
                                                props.resetForm();
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
//);