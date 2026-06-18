import React, { useState, useCallback } from "react";
import { Formik } from "formik";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { TableRow, TableCell, TextField } from "@material-ui/core";
import Lodash from 'lodash';
import { useSelector } from "react-redux";
import { selectQuoteState } from "../redux/quote";

const useStyles = makeStyles({
    editable: {
        cursor: "pointer",
        width: "100%",
    },
});

function CommissionForm(props) {
    const initialValues = {
        commissionPercentage: props.data?.commissionPercentage || '',
        commissionPrice: props.data?.commissionPrice || ''
    }
    const classes = useStyles();

    function calculatePrice(d, setFieldValue) {
        let price = 0;
        price = Number(props.data?.quotePrice) * Number(d) / 100;
        setFieldValue('commissionPrice', price)
    }

    const delayedCalc = useCallback(
        Lodash.debounce((query, setFieldValue) => calculatePrice(query, setFieldValue), 500),
        [],
    );

    return (
        <>
            <Formik
                initialValues={initialValues}
                onSubmit={(value, { setSubmitting, setErrors }) =>
                    props.onSubmit(value, () => { }, setSubmitting, setErrors)
                }
            >
                {
                    (fprops) => {
                        const {
                            values,
                            touched,
                            errors,
                            isSubmitting,
                            handleSubmit,
                            handleReset,
                            setFieldValue,
                            handleChange,
                            handleBlur,
                            submitForm
                        } = fprops;

                        return (
                            <>
                                <form onSubmit={handleSubmit}>
                                    <>
                                        <TableRow>
                                            <TableCell> <strong>Percentage</strong></TableCell>
                                            <TableCell component="th" scope="row">
                                                <TextField
                                                    type='number'
                                                    error={errors.commissionPercentage && touched.commissionPercentage ? true : false}
                                                    className="profile-pic"
                                                    name="commissionPercentage"
                                                    value={values.commissionPercentage}
                                                    onChange={(v: any) => {
                                                        handleChange(v);
                                                        delayedCalc(v.target.value, setFieldValue);
                                                    }}
                                                    helperText={!errors.commissionPercentage}
                                                    onBlur={handleBlur}
                                                    margin="normal"
                                                />

                                                <>
                                                    <IconButton
                                                        type="submit"
                                                        disabled={isSubmitting}
                                                        color="primary"
                                                        aria-label="directions"
                                                    >
                                                        <CheckIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        type="button"
                                                        onClick={() => {
                                                            if (props.onCloseEdit) {
                                                                props.onCloseEdit();
                                                            } else {
                                                                props.setStatus('view');
                                                                handleReset();
                                                            }
                                                        }}
                                                        color="primary"
                                                        aria-label="directions"
                                                    >
                                                        <CloseIcon />
                                                    </IconButton>
                                                </>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell> <strong>Price (&#163;)</strong></TableCell>
                                            <TableCell component="th" scope="row">{values.commissionPrice}</TableCell>
                                        </TableRow>
                                        {errors && (
                                            <div className="input-feedback">{errors['commissionPercentage']} {errors['commissionPrice']}</div>
                                        )}
                                    </>
                                </form>
                            </>
                        )
                    }
                }
            </Formik>
        </>
    )
}

export function Editable(props) {

    const [status, setStatus] = useState('view');
    const classes = useStyles();
    const currentQoute = useSelector(selectQuoteState).currentQuote;


    if (status === 'view') {
        return (<>
            <TableRow>
                <TableCell><strong>Percentage</strong></TableCell>
                <TableCell component="th" scope="row" style={{ width: '100%' }}>{currentQoute?.commissionPercentage}
                    <p
                        className={classes.editable}
                        onClick={() => setStatus('edit')}
                    >
                        <EditIcon
                            style={{
                                width: "5%",
                                textAlign: "right",
                                fontSize: 18,
                                float: "right",
                                color: "#3f51b5",
                            }}
                        />
                    </p>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell> <strong>Price (&#163;)</strong></TableCell>
                <TableCell component="th" scope="row" style={{ width: '100%' }}>{currentQoute?.commissionPrice}
                    <p
                        className={classes.editable}
                        onClick={() => setStatus('editPrice')}
                    >
                        <EditIcon
                            style={{
                                width: "5%",
                                textAlign: "right",
                                fontSize: 18,
                                float: "right",
                                color: "#3f51b5",
                            }}
                        />
                    </p>
                </TableCell>
            </TableRow>
        </>)
    }
    else if (status === 'editPrice') {
        return (
            <CommissionFormPriceEdit data={currentQoute} setStatus={setStatus} {...props} />
        )
    }
    return (
        <CommissionForm data={currentQoute} setStatus={setStatus} {...props} />
    )
}

function CommissionFormPriceEdit(props) {
    const initialValues = {
        commissionPercentage: props.data?.commissionPercentage || '',
        commissionPrice: props.data?.commissionPrice || ''
    }
    const classes = useStyles();

    function calculatePercent(d, setFieldValue) {
        let percent = 0;
        if (props.data?.quotePrice != 0)
            percent = Number(d) * 100 / Number(props.data?.quotePrice);
        setFieldValue('commissionPercentage', percent)
    }

    const delayedCalc = useCallback(
        Lodash.debounce((query, setFieldValue) => calculatePercent(query, setFieldValue), 500),
        [],
    );

    return (
        <>
            <Formik
                initialValues={initialValues}
                onSubmit={(value, { setSubmitting, setErrors }) =>
                    props.onSubmit(value, () => { }, setSubmitting, setErrors)
                }
            >
                {
                    (fprops) => {
                        const {
                            values,
                            touched,
                            errors,
                            isSubmitting,
                            handleSubmit,
                            handleReset,
                            setFieldValue,
                            handleChange,
                            handleBlur,
                            submitForm
                        } = fprops;

                        return (
                            <>
                                <form onSubmit={handleSubmit}>
                                    <>
                                        <TableRow>
                                            <TableCell> <strong>Percentage </strong></TableCell>
                                            <TableCell component="th" scope="row">
                                                {values.commissionPercentage}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell> <strong>Price (&#163;)</strong></TableCell>
                                            <TableCell component="th" scope="row">
                                                <TextField
                                                    type='number'
                                                    error={errors.commissionPrice && touched.commissionPrice ? true : false}
                                                    className="profile-pic"
                                                    name="commissionPrice"
                                                    value={values.commissionPrice}
                                                    onChange={(v: any) => {
                                                        handleChange(v);
                                                        delayedCalc(v.target.value, setFieldValue);
                                                    }}
                                                    helperText={!errors.commissionPrice}
                                                    onBlur={handleBlur}
                                                    margin="normal"
                                                />

                                                <>
                                                    <IconButton
                                                        type="submit"
                                                        disabled={isSubmitting}
                                                        color="primary"
                                                        aria-label="directions"
                                                    >
                                                        <CheckIcon />
                                                    </IconButton>
                                                    <IconButton
                                                        type="button"
                                                        onClick={() => {
                                                            if (props.onCloseEdit) {
                                                                props.onCloseEdit();
                                                            } else {
                                                                props.setStatus('view');
                                                                handleReset();
                                                            }
                                                        }}
                                                        color="primary"
                                                        aria-label="directions"
                                                    >
                                                        <CloseIcon />
                                                    </IconButton>
                                                </>
                                            </TableCell>
                                        </TableRow>
                                        {errors && (
                                            <div className="input-feedback">{errors['commissionPercentage']} {errors['commissionPrice']}</div>
                                        )}
                                    </>
                                </form>
                            </>
                        )
                    }
                }
            </Formik>
        </>
    )
}
