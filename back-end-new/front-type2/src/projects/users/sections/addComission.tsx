import React, { useState } from "react";
import { Formik } from "formik";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import Grid from "@material-ui/core/Grid";
import CardActions from "@material-ui/core/CardActions";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function CommissionLogic() {

    const [startLoader, setStartLoader] = useState(false);

    const initialValues = {
        commission: ''
    };

    return (
        <div className="app">
            <Formik
                initialValues={initialValues}
                onSubmit={() => {
                }}
                validationSchema={Yup.object().shape({
                    commission: Yup.string().required('Commission is required')
                })}
            >
                {(props) => {
                    const {
                        values,
                        touched,
                        errors,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                    } = props;

                    return (
                        <form onSubmit={handleSubmit} autoComplete="off">
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={12}>
                                    <TextField
                                        variant="outlined"
                                        error={!!(errors.commission && touched.commission)}
                                        id="commission"
                                        className="WidhtFull100"
                                        label="Commission"
                                        type="commission"
                                        value={values.commission}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        margin="normal"
                                        aria-describedby="commission-error"
                                    />
                                    {errors.commission && touched.commission && (
                                        <FormHelperText className="errormsg" id="commission-error">
                                            {errors.commission}
                                        </FormHelperText>
                                    )}
                                </Grid>
                            </Grid>
                            <CardActions
                                style={{ paddingLeft: 0, paddingRight: 0, marginTop: 20 }}
                            >
                                <Button
                                    size="medium"
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                >
                                    Submit
                                </Button>
                                {startLoader && <CircularProgress />}
                            </CardActions>
                        </form>
                    );
                }}
            </Formik>
        </div >
    );
}