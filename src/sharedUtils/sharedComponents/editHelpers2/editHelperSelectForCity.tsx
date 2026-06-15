import React, { useState } from "react";
import { Formik } from "formik";
import { useDispatch } from "react-redux";
import { useInjectReducer, useInjectSaga } from "utils/redux-injectors";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { helperMethods } from "sharedUtils/globalHelper/helperMethod";
import Select from 'react-select'
import Chip from '@material-ui/core/Chip';
import CircularProgress from "@material-ui/core/CircularProgress";
import {
    userAdminAction,
    UserAdminReducer, sliceKeyUserAdmin,
    userAdminSaga,
} from "../../../projects/users/redux/userAdmin";

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
                                    <p
                                        className={classes.editable}
                                        onClick={() => setEditKey("editClicked")}
                                    >
                                        {
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
    useInjectReducer({ key: sliceKeyUserAdmin, reducer: UserAdminReducer });
    useInjectSaga({ key: sliceKeyUserAdmin, saga: userAdminSaga });

    const [isLoadingData, setIsLoadingData] = useState(false);
    const [CurrentSearchText, setCurrentSearchText] = useState("");
    const dispatch = useDispatch();

    const _cityListForDropdown = (payload) => dispatch(userAdminAction.cityListForDropdown(payload));

    const searchInData = (event, action) => {
        if (event) setCurrentSearchText(event);

        setTimeout(function () {
            setIsLoadingData(false);
        }, 1000);

        if (event.length >= 0) {
            if (action === "city")
                _cityListForDropdown({
                    searchText: event,
                    limit: props.data.cities.length + 10,
                });
        }
    };

    const debounceOnChange = React.useCallback(
        helperMethods.debounce(searchInData, 400),
        []
    );

    const lazyLoadAPI = (event, action) => {
        setTimeout(function () {
            setIsLoadingData(false);
        }, 1000);

        if (action === "city" && props.data.cities.length <= 50)
            _cityListForDropdown({
                searchText: CurrentSearchText,
                limit: props.data.cities.length + 10,
            });
    };
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
            aria-describedby="city-error"
            name={props.name}
            options={props.options}
            // onMenuScrollToBottom={(e) => {
            //     const isCallNewOne = props.data.cities.length % 10 === 0;
            //     if (isCallNewOne) {
            //         setIsLoadingData(true);
            //         lazyLoadAPI(e, "city");
            //     }
            // }}
            // onInputChange={(e) => {
            //     setIsLoadingData(true);
            //     debounceOnChange(e, "city");
            // }}
            components={{
                LoadingIndicator() {
                    return <CircularProgress />;
                },
            }}
            isMulti={props.isMulti}
            isLoading={isLoadingData}
        />
    )
}
