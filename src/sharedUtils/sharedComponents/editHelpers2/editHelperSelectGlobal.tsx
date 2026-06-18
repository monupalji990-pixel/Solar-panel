import React, { useState } from "react";
import { Formik } from "formik";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { helperMethods } from "sharedUtils/globalHelper/helperMethod";
import Select from 'react-select'
import Chip from '@material-ui/core/Chip';
import { Grid } from "@material-ui/core";

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
                    if (myProps.isMulti) {
                        TobeViewed = values[myProps.name]?.map(e => <Chip label={e.label} />)
                    } else
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
                                {
                                    myProps.clickable ? (
                                        <p
                                            className={classes.editable}
                                        >
                                            <span
                                                style={{
                                                    float: "left",
                                                    width: "95%",
                                                    overflowWrap: "anywhere",
                                                }}
                                                onClick={() => myProps.onClickFn()}
                                                onMouseOver={(e) => {
                                                    (e.target as HTMLElement).style.textDecoration =
                                                        "underline";
                                                }}
                                                onMouseLeave={(e) => {
                                                    (e.target as HTMLElement).style.textDecoration =
                                                        "none";
                                                }}
                                            >
                                                {myProps.isShowDate && myProps.isShowDate == true
                                                    ? helperMethods.ConvertDate(values[myProps.name])
                                                    :
                                                    TobeViewed
                                                }
                                            </span>
                                            <EditIcon
                                                onClick={() => setEditKey("editClicked")}
                                                style={{
                                                    width: "5%",
                                                    textAlign: "right",
                                                    fontSize: 18,
                                                    float: "right",
                                                    color: "#3f51b5",
                                                }}
                                            />
                                        </p>
                                    ) :
                                        <p
                                            className={classes.editable}
                                            onClick={() => setEditKey("editClicked")}
                                        >
                                            {
                                                myProps.isMulti ?
                                                    <Grid container
                                                        style={{
                                                            float: "left",
                                                            width: "95%",
                                                            overflowWrap: "anywhere",
                                                        }} >
                                                        {TobeViewed}
                                                    </Grid> :

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
                                            }
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
                                }
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
            id={props.name}
            className="WidhtFull100 basic-multi-select"
            placeholder={props.placeholder}
            value={props.values[props.name]}
            onChange={(e, action) => {
                props.setFieldValue(`${props.name}`, e);
            }}
            onBlur={props.handleBlur}
            margin="normal"
            aria-describedby="company-number-error"
            name={props.name}
            options={props.options}
            onMenuScrollToBottom={
                props.handleScrollDown
            }
            onInputChange={(e, { action }) => {
                if (props.isSearchable) {
                    if (action === 'input-change') {
                        props.delayedSearch({
                            search: e,
                            current: props.data?.search
                        });
                    }
                    if (action === 'menu-close') {
                        props.delayedSearch({
                            search: '',
                            current: props.data?.search
                        });
                    }
                }
            }}
            isMulti={props.isMulti}
            isSearchable={true}
            isLoading={props.data?.isLoading}
            defaultInputValue={props.data?.search}
            InputVal
        />
    )
}
