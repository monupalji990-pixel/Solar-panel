import React, { useState } from "react";
import { Formik } from "formik";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { TableRow, TableCell } from "@material-ui/core";
import * as Yup from 'yup';
import Select from 'react-select';

const useStyles = makeStyles({
    editable: {
        cursor: "pointer",
        width: "100%",
    },
});

function EditForm(props) {

    const initialValues = {
        assignee: '',
        months: ''
    }

    const classes = useStyles();

    return (
        <>
            <Formik
                initialValues={initialValues}
                onSubmit={(value, { setSubmitting, setErrors }) =>
                    props.onSubmit(value, () => { }, setSubmitting, setErrors)
                }
                validationSchema={Yup.object().shape({
                    assignee: Yup.object().required('This is Required'),
                    months: Yup.object().required('This is Required')
                })}
            >
                {(fprops) => {
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
                                        <TableCell> <strong>Asssignee</strong></TableCell>
                                        <TableCell scope="row" style={{ width: '100%' }} >
                                            <Select
                                                error={
                                                    errors.assignee &&
                                                        touched.assignee
                                                        ? true
                                                        : false
                                                }
                                                className="basic-multi-select WidhtFull100"
                                                name="assignee"
                                                value={
                                                    values.assignee
                                                }
                                                options={props.assigneeList}
                                                helperText={!errors.assignee}
                                                onChange={(e) => {
                                                    setFieldValue("assignee", e);
                                                }}
                                                onBlur={handleBlur}
                                                margin="normal"
                                            />
                                            {errors && (
                                                <div className="input-feedback">{errors['assignee']}</div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell> <strong>Task Before Months</strong></TableCell>
                                        <TableCell scope="row" style={{ width: '100%' }}>
                                            <Select
                                                error={
                                                    errors.months &&
                                                        touched.months
                                                        ? true
                                                        : false
                                                }
                                                className="basic-multi-select WidhtFull100"
                                                name="months"
                                                value={
                                                    values.months
                                                }
                                                options={props.monthsOptions}
                                                helperText={!errors.months}
                                                onChange={(e) => {
                                                    setFieldValue("months", e);
                                                }}
                                                onBlur={handleBlur}
                                                margin="normal"
                                            />
                                            {errors && (
                                                <div className="input-feedback">{errors['months']}</div>
                                            )}
                                        </TableCell>
                                    </TableRow>
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
                                </>
                            </form>
                        </>
                    )
                }}
            </Formik>
        </>
    )
}

export function Editable(props: any) {

    const [status, setStatus] = useState('view');
    const classes = useStyles();

    if (status === 'view') {
        return (
            <>
                <TableRow>
                    <TableCell> <strong>Assignee</strong></TableCell>
                    <TableCell scope="row" style={{ width: '100%' }}>{props.data?.Assignee?.name}
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
                    <TableCell> <strong>Task Before Months</strong></TableCell>
                    <TableCell scope="row" style={{ width: '100%' }}>{props.data?.beforemonths}</TableCell>
                </TableRow>
            </>
        )
    }
    return (
        <EditForm data={props.data} setStatus={setStatus} {...props} />
    )
}