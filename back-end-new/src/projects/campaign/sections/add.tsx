import React, { useState, useEffect, useCallback } from "react";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import Select from "react-select";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import Grid from "@material-ui/core/Grid";
import CardActions from "@material-ui/core/CardActions";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Lodash from 'lodash';
import MyDrawer from "../../../sharedUtils/sharedComponents/drawerHelper";
import { campaignAction, selectCampaignState } from "../redux/campaign";

export default function Add(props) {
    return (
        <MyDrawer
            drawerSize="960px"
            iconName="Campaign"
            open={props.open == "addCampaignDrawer"}
            onClose={props.onClose.bind(this)}
        >
            <AddLogic {...props} />
        </MyDrawer>
    );
}

function AddLogic(props) {
    useEffect(() => {
        props._slugUpdate(props);
    }, []);

    const campaignState = useSelector(selectCampaignState);
    const contctlistsState = campaignState.contactlists;

    useEffect(() => {
        if (!campaignState.isLoadingData) {
            setStartLoader(false);
        }
    }, [campaignState.isLoadingData]);

    const [startLoader, setStartLoader] = useState(false);
    const [templateOption, setTemplateOptions] = useState([]);
    const [contactlistsOption, setContactlistsOption] = useState([]);

    const dispatch = useDispatch();

    const templateState = campaignState.templates;

    function handleScolldownTemplates() {
        dispatch(campaignAction.changePagetemplateList({ skip: templateState.skip + templateState.count, limit: templateState.limit }))
    }

    useEffect(() => {
        const list = templateState.list.map(e => ({ value: e.id, label: e.name }));
        setTemplateOptions(list)

    }, [templateState.list])

    function handleScolldownContactlists() {
        dispatch(campaignAction.changePagelistContactList({ skip: contctlistsState.skip + contctlistsState.count, limit: contctlistsState.limit }))
    }

    useEffect(() => {
        const list = contctlistsState.list.map(e => ({ value: e.id, label: e.name }));
        setContactlistsOption(list)
    }, [contctlistsState.list])

    useEffect(() => {
        if (templateState.list?.length <= 0)
            dispatch(campaignAction.templateList(null));
        if (contctlistsState.list?.length <= 0)
            dispatch(campaignAction.listContactList(null));
    }, [])

    const initialValues = {
        sender: {
            name: "Edanpowerportal Limited",
            email: "admin@edanpower.co.uk"
        },
        name: '',
        templateId: null,
        subject: '',
        recipients: {
            listIds: []
        }
    };

    return (
        <div className="app">
            <div>
                <Formik
                    initialValues={initialValues}
                    onSubmit={(value, fbag) => {
                        const so = {
                            ...value,
                            recipients: { listIds: value.recipients?.listIds }
                        }

                        if (value.recipients.listIds && value.recipients.listIds.length > 0) {
                            so.recipients.listIds = value.recipients.listIds.map(e => e.value)
                        }
                        if (value.templateId) {
                            so.templateId = value.templateId?.value;
                        }

                        dispatch(campaignAction.addCampaign({ data: so, fbag }))
                    }}
                    validationSchema={Yup.object().shape({
                        name: Yup.string().required(
                            "name is required"
                        ),
                        templateId: Yup.object().required('template is required').nullable(),

                        subject: Yup.string().required("subject is required"),
                        recipients: Yup.object().shape({
                            listIds: Yup.array().required('Recipeient required')
                        })
                    })}
                >
                    {(props) => {
                        const {
                            values,
                            touched,
                            errors,
                            dirty,
                            isSubmitting,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            handleReset,
                            setFieldValue,
                        } = props;
                        return (
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            variant="outlined"
                                            error={
                                                errors.sender?.name && touched.sender?.name
                                                    ? true
                                                    : false
                                            }
                                            id="sender.name"
                                            className="WidhtFull100"
                                            label="sender name"
                                            type="text"
                                            value={values.sender?.name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            margin="normal"
                                            aria-describedby="sender.name-error"
                                            disabled
                                        />
                                        {errors.sender?.name && touched.sender?.name && (
                                            <FormHelperText
                                                className="errormsg"
                                                id="sender.name-error"
                                            >
                                                {errors.sender?.name}
                                            </FormHelperText>
                                        )}
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            variant="outlined"
                                            error={
                                                errors.sender?.email && touched.sender?.email
                                                    ? true
                                                    : false
                                            }
                                            id="sender.email"
                                            className="WidhtFull100"
                                            label="sender email"
                                            type="text"
                                            value={values.sender?.email}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            margin="normal"
                                            aria-describedby="sender.email-error"
                                            disabled
                                        />
                                        {errors.sender?.email && touched.sender?.email && (
                                            <FormHelperText
                                                className="errormsg"
                                                id="sender.email-error"
                                            >
                                                {errors.sender?.email}
                                            </FormHelperText>
                                        )}
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            variant="outlined"
                                            error={
                                                errors.name && touched.name
                                                    ? true
                                                    : false
                                            }
                                            id="name"
                                            label="Campaign Name"
                                            className="WidhtFull100"
                                            type="text"
                                            value={values.name}
                                            onChange={(e) => {
                                                handleChange(e);
                                            }}
                                            onBlur={handleBlur}
                                            margin="normal"
                                            aria-describedby="name-error"
                                        />
                                        {errors.name && touched.name && (
                                            <FormHelperText
                                                className="errormsg"
                                                id="name-error"
                                            >
                                                {errors.name}
                                            </FormHelperText>
                                        )}
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            variant="outlined"
                                            error={
                                                errors.subject && touched.subject
                                                    ? true
                                                    : false
                                            }
                                            id="subject"
                                            label="Campaign Subject"
                                            className="WidhtFull100"
                                            type="text"
                                            value={values.subject}
                                            onChange={(e) => {
                                                handleChange(e);
                                            }}
                                            onBlur={handleBlur}
                                            margin="normal"
                                            aria-describedby="subject-error"
                                        />
                                        {errors.subject && touched.subject && (
                                            <FormHelperText
                                                className="errormsg"
                                                id="subject-error"
                                            >
                                                {errors.subject}
                                            </FormHelperText>
                                        )}
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Select
                                            className={
                                                errors.templateId && touched.templateId
                                                    ? "ErrorColor"
                                                    : ""
                                            }
                                            error={
                                                errors.templateId && touched.templateId
                                                    ? true
                                                    : false
                                            }
                                            id="templateId"
                                            placeholder="Select template"
                                            value={values.templateId}
                                            onChange={(e) => {
                                                setFieldValue("templateId", e);
                                            }}
                                            onBlur={handleBlur}
                                            margin="normal"
                                            aria-describedby="templateId-error"
                                            options={templateOption}
                                            onMenuScrollToBottom={
                                                handleScolldownTemplates
                                            }
                                            isSearchable={true}
                                            isLoading={templateState.isLoading}
                                        />
                                        {errors.templateId && touched.templateId && (
                                            <FormHelperText
                                                className="errormsg"
                                                id="templateId-error"
                                            >
                                                {errors.templateId}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Select
                                            className={
                                                errors.recipients?.listIds && touched.recipients?.listIds
                                                    ? "ErrorColor"
                                                    : ""
                                            }
                                            error={
                                                errors.recipients?.listIds && touched.recipients?.listIds
                                                    ? true
                                                    : false
                                            }
                                            id="recipients.listIds"
                                            placeholder="Select Recipient List"
                                            value={values.recipients?.listIds}
                                            onChange={(e) => {
                                                setFieldValue("recipients.listIds", e);
                                            }}
                                            onBlur={handleBlur}
                                            margin="normal"
                                            aria-describedby="recipients?.listIds-error"
                                            isMulti
                                            options={contactlistsOption}
                                            onMenuScrollToBottom={
                                                handleScolldownContactlists
                                            }
                                            isSearchable={true}
                                            isLoading={contctlistsState.isLoading}
                                        />
                                        {errors.recipients?.listIds && touched.recipients?.listIds && (
                                            <FormHelperText
                                                className="errormsg"
                                                id="recipients?.listIds-error"
                                            >
                                                {errors.recipients?.listIds}
                                            </FormHelperText>
                                        )}
                                    </Grid>
                                </Grid>

                                <CardActions
                                    style={{ paddingLeft: 0, paddingRight: 0, marginTop: 20 }}
                                >
                                    <Button
                                        size="large"
                                        variant="contained"
                                        onClick={handleReset}
                                        disabled={!dirty || isSubmitting}
                                    >
                                        Reset
                                    </Button>
                                    <Button
                                        size="large"
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        Create Campaign
                                    </Button>
                                    {campaignState.isLoadingData && <CircularProgress />}
                                </CardActions>
                            </form>
                        );
                    }}
                </Formik>
            </div>
        </div>
    );
}