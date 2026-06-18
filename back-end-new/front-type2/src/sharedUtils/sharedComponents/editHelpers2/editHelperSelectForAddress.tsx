import React, { useState } from "react";
import { Formik } from "formik";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { helperMethods } from "sharedUtils/globalHelper/helperMethod";
import Select from 'react-select'

const useStyles = makeStyles({
    editable: {
        cursor: "pointer",
        width: "100%",
    },
});

export default function app(props) {
    const myProps = props;
    const [editKey, setEditKey] = useState(props.editKey ? props.editKey : null);
    const classes = useStyles();

    return (
        <Formik
            enableReinitialize
            initialValues={{ [myProps.name]: myProps.value }}
            onSubmit={(value, { setSubmitting, setErrors }) =>
                props.onSubmit(value, setEditKey, setSubmitting, setErrors)
            }
            validationSchema={myProps.validateIt}
        >
            {(props) => {
                const {
                    values,
                    touched,
                    errors,
                    isSubmitting,
                    handleSubmit,
                    handleReset,
                } = props;

                let TobeViewed = values[myProps.name]
                if (myProps.reactSelect) {
                    TobeViewed = values[myProps.name]?.label
                }
                return (
                    <form onSubmit={handleSubmit}>
                        {editKey === "editClicked" ? (
                            <React.Fragment>
                                <Selector {...props} name={myProps.name} {...myProps} />

                                {errors[myProps.name] && touched[myProps.name] && (
                                    <div className="input-feedback">{errors[myProps.name]}</div>
                                )}
                                <React.Fragment>
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
                                            if (myProps.onCloseEdit) {
                                                myProps.onCloseEdit();
                                            } else {
                                                setEditKey(null);
                                                handleReset();
                                            }
                                        }}
                                        color="primary"
                                        aria-label="directions"
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </React.Fragment>
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                <p
                                    className={classes.editable}
                                    onClick={() => setEditKey("editClicked")}
                                >
                                    <span
                                        style={{
                                            float: "left",
                                            width: "95%",
                                            overflowWrap: "anywhere",
                                        }}
                                    >
                                        {myProps.isShowDate && myProps.isShowDate == true
                                            ? helperMethods.ConvertDate(values[myProps.name])
                                            :
                                            TobeViewed
                                        }
                                    </span>
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
                            </React.Fragment>
                        )
                        }
                    </form>
                );
            }}
        </Formik >
    );
}

function Selector(props) {

    return (
        <Select
            id="address"
            className="WidhtFull100 basic-multi-select"
            placeholder="Address"
            defaultValue={{
                label: props.values.address,
                value: props.values.address
            }}
            onChange={(e) => {
                props.setFieldValue("address", e);
                props.setLatLongFun(e.value)
            }}
            onBlur={props.handleBlur}
            margin="normal"
            aria-describedby="address-number-error"
            name="address"
            options={props.options}
            onInputChange={(e) => {
                if (e) props.setPossiblePlacesFun(e)
            }}
        />
    )
}
