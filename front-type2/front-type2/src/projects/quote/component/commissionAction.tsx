import { Grid, TableCell, TableRow, Typography } from '@material-ui/core';
import React, { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import OnTextEditInput from "../../../sharedUtils/sharedComponents/editHelpers2/onTextEditHelper";
import { selectQuoteState } from '../redux/quote';
import * as Yup from 'yup';
import Lodash from 'lodash';
import { Editable } from './Commissionform';
import Select from 'react-select'

export function CommissionAction(mprops) {
    const currentQoute = useSelector(selectQuoteState).currentQuote;

    const simpleEdit = (value, closeEdit, setSubmitting) => {
        const so: any = {
            quoteId: currentQoute?._id
        }
        if (value.commissionPercentage) {
            so.commissionPercentage = value.commissionPercentage
            so.commissionPrice = value.commissionPrice;
        };

        if (value.commissionPrice) so.commissionPrice = value.commissionPrice;
        if (value.commissionStatus) {
            so.commissionStatus = value.commissionStatus?.value;
        } else {
            so.commissionStatus = 'Outstanding';
        }

        mprops._isLoadingData(true, mprops.type);
        mprops._editQuote(so, mprops.type);
        setSubmitting(false);
    };

    const [price, setPrice] = useState(currentQoute?.commissionPrice);
    function calculatePrice(d) {
        let price = 0;
        price = Number(currentQoute?.quotePrice) * Number(d) / 100;
        setPrice(price)
    }

    const delayedCalc = useCallback(
        Lodash.debounce(query => calculatePrice(query), 500),
        [],
    );

    return (
        <>
            <Grid container >
                <Typography style={{ fontWeight: 600, fontSize: '1.4rem' }}> Commission</Typography>
            </Grid>
            <Grid container spacing={4}>

                <Grid item xs={12}>
                    <Editable onSubmit={simpleEdit} />
                </Grid>

                <Grid item xs={12}>
                    <TableRow>
                        <TableCell> <strong>Commission Status</strong></TableCell>
                        {['admin', 'management'].includes(mprops.slug) ?
                            <TableCell component="th" scope="row" style={{ width: '100%' }}>
                                <OnTextEditInput
                                    name="commissionStatus"
                                    value={
                                        {
                                            value: currentQoute?.commissionStatus ? currentQoute?.commissionStatus : 'Outstanding',
                                            label: currentQoute?.commissionStatus ? currentQoute?.commissionStatus : 'Outstanding'
                                        }
                                    }
                                    onSubmit={simpleEdit}
                                    validateIt={Yup.object().shape({
                                        commissionStatus: Yup.string().required('Required'),
                                    })}
                                    reactSelect={true}
                                >
                                    {props => {
                                        return (
                                            <>
                                                <Select
                                                    error={
                                                        props.errors.commissionStatus &&
                                                            props.touched.commissionStatus
                                                            ? true
                                                            : false
                                                    }
                                                    className="basic-multi-select WidhtFull100"
                                                    name="commissionStatus"
                                                    value={props.values.commissionStatus}
                                                    options={[{ value: 'Paid', label: 'Paid' }, { value: 'Outstanding', label: 'Outstanding' }]}
                                                    helperText={!props.errors.commissionStatus}
                                                    onChange={(e) => {
                                                        props.setFieldValue("commissionStatus", e);
                                                    }}
                                                    onBlur={props.handleBlur}
                                                    margin="normal"
                                                />
                                            </>
                                        );
                                    }}
                                </OnTextEditInput>
                            </TableCell> :
                            <TableCell component="th" scope="row" style={{ width: '100%' }}>
                                {currentQoute?.commissionStatus}
                            </TableCell>
                        }
                        <TableCell />
                    </TableRow>
                </Grid>
            </Grid>
        </>
    )
}


export function CommissionActionView(mprops) {
    const currentQoute = useSelector(selectQuoteState).currentQuote;

    return (
        <>
            <Grid container>
                <Typography style={{ fontWeight: 600, fontSize: '1.4rem' }}> Commission</Typography>
            </Grid>
            <Grid container spacing={4}>

                <Grid item xs={12}>

                    <TableRow>
                        <TableCell> <strong>Percentage</strong></TableCell>

                        <TableCell component="th" scope="row" style={{ width: '100%' }}>{currentQoute?.commissionPercentage}
                        </TableCell>

                    </TableRow>
                    <TableRow>
                        <TableCell> <strong>Price</strong></TableCell>
                        <TableCell component="th" scope="row" style={{ width: '100%' }}>{currentQoute?.commissionPrice} &#163;</TableCell>
                    </TableRow>
                </Grid>

                <Grid item xs={12}>
                    <TableRow>
                        <TableCell> <strong>Commission Status</strong></TableCell>

                        <TableCell component="th" scope="row" style={{ width: '100%' }}>
                            {currentQoute?.commissionStatus}
                        </TableCell>

                        <TableCell />
                    </TableRow>
                </Grid>
            </Grid>
        </>
    )
}




