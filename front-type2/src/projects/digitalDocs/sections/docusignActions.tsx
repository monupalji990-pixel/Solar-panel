import React, { useState, useEffect, useCallback } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import FormHelperText from "@material-ui/core/FormHelperText";
import CircularProgress from "@material-ui/core/CircularProgress";
import Lodash from 'lodash';
import {
  docusignAction,
  selectDocusignState,
  sliceKeyDocusign,
  docusignSaga,
  docusignReducer,
  selectRecipientOption,
} from "../../docusign/redux/docusign";
import { useInjectReducer, useInjectSaga } from "utils/redux-injectors";
import { ViewAudit } from "../../docusign/components/ViewAudit";
import { Button, TextField } from "@material-ui/core";
import { mapOptionsForService, AutoFill } from "sharedUtils/globalHelper/constantValues";
import { selectCompanyState } from "projects/company/redux/company";
import moment from 'moment';

const useStyles = makeStyles(() => ({
  Spacing: {
    marginTop: "10px",
    width: "100%",
  },
  TypoSpace: {
    marginBottom: 25,
  },
  PaddingSpace: {
    padding: "20px",
  },
}));

export default function DocusignActions(props) {
  const classes = useStyles();
  const docusign_state = useSelector(selectDocusignState);
  const [step, setStep] = useState(0);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [textTabs, setTextTabs] = useState(docusign_state.tabs?.textTabs.map((t) => ({ tabLabel: t.tabLabel, value: '', selector: '' })));

  useInjectReducer({ key: sliceKeyDocusign, reducer: docusignReducer });
  useInjectSaga({ key: sliceKeyDocusign, saga: docusignSaga });

  const dispatch = useDispatch();

  let templateOptions = [];
  if (docusign_state.templateList["envelopeTemplates"])
    templateOptions = docusign_state.templateList["envelopeTemplates"].map(
      (template) => {
        return {
          label: template.name,
          value: template.templateId,
          emailSubject: template.emailSubject,
        };
      }
    );

  const _listTemplates = (payload) =>
    dispatch(docusignAction.templateList(payload));
  const _viewTemplateRecipients = (payload) =>
    dispatch(docusignAction.viewTemplate(payload));
  const _sendEnvelope = (payload) =>
    dispatch(docusignAction.sendEnvelope(payload));
  const _getRecipientOptions = (payload) =>
    dispatch(docusignAction.getRecipientOptions(payload));
  const _changePage = (payload) =>
    dispatch(docusignAction.recipientOptionChangeLimit(payload));
  useEffect(() => {
    _listTemplates({ slug: props.slug });
  }, []);


  function _changeTemplateSkipDown() {
    const skip = Number(docusign_state.templateListSkip);
    const limit = Number(docusign_state.templateList["resultSetSize"]);
    const totalSetSize = Number(docusign_state.templateList["totalSetSize"]);
    const endPosition = Number(docusign_state.templateList["endPosition"]);

    if (endPosition < totalSetSize - 1) {
      dispatch(
        docusignAction.changeTemplateListSkip({
          slug: props.slug,
          skip: docusign_state.templateList["envelopeTemplates"].length,
        })
      );
    }
  }

  function _changeTemplateSkipUp() {
    const skip = Number(docusign_state.templateListSkip);
    const limit = Number(docusign_state.templateList["resultSetSize"]);
    if (skip >= limit)
      dispatch(
        docusignAction.changeTemplateListSkip({
          slug: props.slug,
          skip: skip - limit,
        })
      );
  }

  function handleSearchRecipient(payload) {
    dispatch(docusignAction.recipientOptionSearch(payload));
  }

  const delayedQuery = useCallback(
    Lodash.debounce((payload) => {
      if (payload.search && payload.search.length > 2)
        handleSearchRecipient(payload);
    }, 500),
    []
  );

  let AutoFillMap = null;
  if (props.showingFrom == "viewCompany") {
    AutoFillMap = AutoFill['company']
  }
  const ValueObj = { ...props.currentModuleObj };  

  if (props.showingFrom == "viewQuote") {
    if (props.currentModuleObj.serviceType == 'Eco') {
      AutoFillMap = AutoFill['COMMERCIAL' + props.currentQuote.serviceType]
    } else {
      AutoFillMap = AutoFill[props.currentQuote.serviceType]
    }
  }

  if (props.showingFrom === 'viewRenewal') {
    if (props.renewal.serviceType == 'Eco') {
      AutoFillMap = AutoFill['COMMERCIAL' + props.renewal.serviceType]
    } else {
      AutoFillMap = AutoFill[props?.renewal?.serviceType]
    }
  }

  useEffect(() => {
    const textTabsNew = docusign_state.tabs?.textTabs.map(e => {
      if (props.showingFrom === 'viewQuote' || props.showingFrom === 'viewRenewal') {
        const ind1 = AutoFillMap && AutoFillMap.findIndex(ele => ele.datalabel.toLowerCase() == e.tabLabel.trim().toLowerCase())

        if (ind1 >= 0) {
          const path = AutoFillMap[ind1].portal;

          const val = Lodash.get(ValueObj, path);
          let finalval = '';
          if (AutoFillMap[ind1].date && AutoFillMap[ind1].date === true) {
            finalval = moment(val).format('DD/MM/YYYY')
          } else {
            if (Array.isArray(val) === true && val?.length > 0) {
              finalval = val.join();
            } else {
              finalval = val;
            }
          }

          const optionValue = props.currentModuleObj.serviceType == 'Eco' ?
            mapOptionsForService['COMMERCIAL' + props.currentModuleObj?.serviceType] : mapOptionsForService[props.currentModuleObj?.serviceType];
          const selector = optionValue.find((e) => e.value === path)
          return { tabLabel: e.tabLabel, value: finalval, selector: selector }
        }
        return { tabLabel: e.tabLabel, value: '', selector: '' }
      }
      return { tabLabel: e.tabLabel, value: '', selector: '' }
    })
    setTextTabs(textTabsNew);
  }, [docusign_state.tabs?.textTabs])


  function changeTextTab(setFieldValue) {
    const textTabsNew = docusign_state.tabs?.textTabs.map(e => {
      if (props.showingFrom === 'viewQuote' || props.showingFrom === 'viewRenewal') {
        return { tabLabel: e.tabLabel, value: '', selector: '' }
      }

      if (props.showingFrom == "viewCompany") {
        const ind = AutoFillMap.findIndex(ele => ele.datalabel.toLowerCase() == e.tabLabel.trim().toLowerCase())
        if (ind >= 0) {
          const path = AutoFillMap[ind].portal;

          const val = Lodash.get(ValueObj, path);

          let finalval = '';
          if (AutoFillMap[ind].date && AutoFillMap[ind].date === true) {
            finalval = moment(val).format('DD/MM/YYYY')
          } else {
            if (Array.isArray(val) === true && val?.length > 0) {
              finalval = val.join();
            } else {
              finalval = val;
            }
          }
          const optionValue = mapOptionsForService['company'];
          const selector = optionValue.find((e) => e.value === path)
          return { tabLabel: e.tabLabel, value: finalval, selector: selector }
        }
        return { tabLabel: e.tabLabel, value: '', selector: '' }
      }
      return { tabLabel: e.tabLabel, value: '', selector: '' }
    });
    setFieldValue('textTabs', textTabsNew)
  }

  let dynamicRecipientsInit: any = {
    textTabs: textTabs,
    Site: null
  };

  docusign_state.currentTemplate.forEach((role) => {
    dynamicRecipientsInit[role] = "";
  });

  const recipientOption = useSelector(selectRecipientOption);
  let companyId = "";
  let supplierId = "";

  const moduleOption = [
    { value: "user", label: "user" },
  ];

  if (props.currentModuleObj?.Company && props.currentModuleObj?.Company._id) {
    companyId = props.currentModuleObj?.Company._id;
    moduleOption.push({ value: "company", label: "company" });
  }
  if (props.currentModuleObj?.Supplier && props.currentModuleObj?.Supplier._id) {
    supplierId = props.currentModuleObj?.Supplier._id;
    moduleOption.push({ value: "supplier", label: "supplier" })
  }
  if (props.currentModuleObj?.Consumer && props.currentModuleObj?.Consumer._id) {
    companyId = props.currentModuleObj?.Consumer._id;
    moduleOption.push({ value: "consumer", label: "consumer" });
  }
  let consumerEmail = "";
  if (props.currentModuleObj?.Consumer && props.currentModuleObj?.Consumer.email) {
    consumerEmail = props.currentModuleObj?.Consumer.email;
  }

  const dynamicValidSchema = {};
  for (const key of Object.keys(dynamicRecipientsInit)) {
    if (key == 'Site' && props.showingFrom == 'viewQuote' || props.showingFrom === 'viewRenewal') {
      dynamicValidSchema[key] = Yup.object()
        .nullable();
    }
    else if (key === 'textTabs') {
    } else
      dynamicValidSchema[key] = Yup.object()
        .required(`this is required`)
        .nullable();
  }

  const company = useSelector(selectCompanyState);
  let siteOption = [];

  if (company.currentCompany?.Site && company.currentCompany?.Site.length > 0) {
    siteOption = company.currentCompany?.Site?.map((e) => ({
      value: e._id,
      label: e.siteName,
    }));
  }

  let mapOptionsList = []

  if (props.currentModuleObj.serviceType == 'Eco') {
    mapOptionsList = mapOptionsForService['COMMERCIAL' + props.currentModuleObj?.serviceType]
  } else if (props.showingFrom === 'viewQuote' || props.showingFrom === 'viewRenewal') {
    mapOptionsList = mapOptionsForService[props.currentModuleObj?.serviceType]
  } else {
    mapOptionsList = mapOptionsForService['company']
  }

  return (
    <>
      {docusign_state.loading === false ? (
        <div className={classes.Spacing}>
          <Formik
            initialValues={{
              Template: null,
              recipients: [],
            }}
            onSubmit={(value) => {
            }}
            validationSchema={Yup.object().shape({
            })}
          >
            {(Iprops) => {
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
                submitForm,
                validateForm,
              } = Iprops;

              return (
                <form onSubmit={handleSubmit}>
                  <Grid item md={12} sm={12} xs={12}>
                    <Select
                      className={errors && errors.Template ? "ErrorColor" : ""}
                      id="Template"
                      name="Template"
                      placeholder="Search templates"
                      value={values.Template}
                      onChange={(e) => {
                        _viewTemplateRecipients({
                          slug: props.slug,
                          tempId: e.value,
                          // companyId: props.company,
                          supplierId: "",
                        });
                        setFieldValue("Template", e);
                        setSelectedTemplateId({
                          tempId: e.value,
                          emailSubject: e.emailSubject,
                        });
                        setStep(1);
                      }}
                      onBlur={handleBlur}
                      isLoading={docusign_state.templateListLoading}
                      onMenuScrollToBottom={(e) => {
                        _changeTemplateSkipDown();
                      }}
                      components={{
                        LoadingIndicator() {
                          return <CircularProgress />;
                        },
                      }}
                      margin="normal"
                      aria-describedby="role-number-error"
                      options={templateOptions}
                    />
                    <FormHelperText className="errormsg" id="supplier-error">
                      {errors.Template}
                    </FormHelperText>
                  </Grid>
                  <Grid></Grid>
                  <Grid>{isSubmitting && <CircularProgress />}</Grid>
                </form>
              );
            }}
          </Formik>

          <Formik
            initialValues={dynamicRecipientsInit}
            enableReinitialize
            onSubmit={(values) => {
              let recipients = [];
              Object.keys(values).forEach((v, i) => {
                if (v == 'textTabs' || v == 'Site') {
                  return;
                }
                else {
                  if (String(v).toLocaleLowerCase() === 'edanpower')
                    recipients.push({
                      email: values[v].value,
                      roleName: v,
                      name: values[v].value,
                      tabs: {
                        textTabs: values['textTabs'].map(val => ({ tabLabel: val.tabLabel, value: val.value }))
                      }
                    });
                  else
                    recipients.push({
                      email: values[v].value,
                      roleName: v,
                      name: values[v].value,
                    });
                }
              });

              if (props.showingFrom)
                _sendEnvelope({
                  slug: props.slug,
                  tempId: selectedTemplateId.tempId,
                  recipients: recipients,
                  emailSubject: selectedTemplateId.emailSubject,
                  ...props.typeValues
                });

            }}
            validationSchema={Yup.object().nullable().shape(dynamicValidSchema)}
          >
            {({
              handleChange,
              values,
              errors,
              handleBlur,
              setFieldValue,
            }) => (
              <>
                {docusign_state.currentTemplate.length > 0 &&
                  docusign_state.dynamicRoleFieldsLoading == false ? (
                  <Form>
                    {/* {docusign_state.dynamicRoleFieldsLoading == false ? ( */}
                    <Grid item xs={12} md={12} container spacing={2}>
                      <Grid item xs={12} md={12} style={{ paddingTop: 20 }}>
                        <strong> Recipient Email Address</strong>
                      </Grid>
                      {docusign_state.currentTemplate.map((role) => {
                        return (
                          <>
                            <Grid item xs={12}>
                              {role}:
                            </Grid>
                            <Grid item xs={3}>
                              <Select
                                className={
                                  errors && errors.Template ? "ErrorColor" : ""
                                }
                                id="module"
                                name="module"
                                placeholder="select module"
                                value={{
                                  value: recipientOption[role]["module"],
                                  label: recipientOption[role]["module"],
                                }}
                                // value={{ value: "", label: "" }}
                                onChange={(e) => {
                                  dispatch(
                                    docusignAction.recipientModuleChange({
                                      recipient: role,
                                      module: e.value,
                                    })
                                  );
                                  setFieldValue(role, null);
                                  if (e.value == "consumer") {
                                    setFieldValue(role, {
                                      value: consumerEmail,
                                      label: consumerEmail,
                                    });
                                  }
                                  if (e.value == "company" && companyId)
                                    _getRecipientOptions({
                                      recipient: role,
                                      module: e.value,
                                      companyId: companyId,
                                      supplierId: "",
                                    });
                                  else if (e.value == "supplier" && supplierId)
                                    _getRecipientOptions({
                                      recipient: role,
                                      module: e.value,
                                      supplierId: supplierId,
                                      companyId: "",
                                    });
                                  else {
                                    _getRecipientOptions({
                                      recipient: role,
                                      module: e.value,
                                      supplierId: "",
                                      companyId: "",
                                    });
                                  }
                                }}
                                onBlur={handleBlur}
                                margin="normal"
                                options={moduleOption}
                              />
                            </Grid>
                            <Grid item xs={9}>
                              <Select
                                options={recipientOption[role].options}
                                isLoading={recipientOption[role].isLoading}
                                className={
                                  errors && errors[role] ? "ErrorColor" : ""
                                }
                                id={role}
                                name={role}
                                placeholder="recipients"
                                value={
                                  recipientOption[role]["module"] == "consumer"
                                    ? {
                                      value: consumerEmail,
                                      label: consumerEmail,
                                    }
                                    : values[role]
                                }
                                onChange={(e) => {
                                  setFieldValue(role, e);
                                }}
                                isDisabled={
                                  recipientOption[role]["module"] ==
                                  "consumer" ||
                                  !recipientOption[role]["module"]
                                }
                                onBlur={handleBlur}
                                isSearchable={true}
                                onInputChange={(e) => {
                                  delayedQuery({
                                    recipient: role,
                                    search: e,
                                    module: recipientOption[role]["module"],
                                  });
                                }}
                                onMenuScrollToBottom={(e) => {
                                  _changePage({
                                    recipient: role,
                                    skip:
                                      recipientOption[role]["skip"] +
                                      recipientOption[role]["limit"],
                                    module: recipientOption[role]["module"],
                                  });
                                }}
                                components={{
                                  LoadingIndicator() {
                                    return <CircularProgress />;
                                  },
                                }}
                                margin="normal"
                              />
                              <FormHelperText>
                                {errors[role] ? errors[role] : ""}
                              </FormHelperText>
                            </Grid>
                          </>
                        );
                      })}
                    </Grid>

                    <Grid item xs={12} md={12} style={{ padding: '20px 0' }}>
                      <strong> Text Tabs : </strong>
                    </Grid>

                    <Grid container spacing={1}>
                      <Grid item xs={12} md={6}>

                        {props.showingFrom === "viewCompany" ? (
                          <>
                            <Select
                              id="Site"
                              name="Site"
                              placeholder="Search Sites"
                              value={values.site}
                              onChange={(e) => {
                                setFieldValue("Site", e);
                                ValueObj.Site = props.currentModuleObj?.Site.find(site => site._id == e.value);
                                changeTextTab(setFieldValue);
                              }}
                              onBlur={handleBlur}
                              components={{
                                LoadingIndicator() {
                                  return <CircularProgress />;
                                },
                              }}
                              margin="normal"
                              aria-describedby="role-number-error"
                              options={siteOption}
                            />
                            <FormHelperText
                              className="errormsg"
                              id={`Site`}
                            >
                              <ErrorMessage
                                name={`Site`}
                              />
                            </FormHelperText>
                          </>
                        ) : null}
                      </Grid>
                      {values.textTabs?.map((e, ind) =>
                        <Grid item xs={12} container spacing={1} alignItems="center">
                          <Grid item xs={3}>
                            {e?.tabLabel}
                          </Grid>
                          <Grid item xs={3}>
                            <TextField
                              variant="outlined"
                              id={`textTabs.${ind}[value]`}
                              name={`textTabs.${ind}[value]`}
                              className="WidhtFull100"
                              value={e.value}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              margin="normal"
                              aria-describedby="textTabs[ind]-error"
                            />
                            <FormHelperText
                              className="errormsg"
                              id={`textTabs[${ind}]-error`}
                            >
                              <ErrorMessage
                                name={`textTabs.${ind}[value]`}
                              />
                            </FormHelperText>

                          </Grid>
                          <Grid item xs={6}>
                            <Select
                              id={`textTabs.${ind}[selector]`}
                              name={`textTabs.${ind}[selector]`}
                              value={e.selector}
                              onChange={(e) => {
                                const path = e.value
                                const val = Lodash.get(ValueObj, path);
                                if (val) {
                                  if (e.date && e.date === true) {
                                    setFieldValue(`textTabs.${ind}[value]`, moment(val).format('DD/MM/YYYY'));
                                  } else {
                                    if (Array.isArray(val) === true && val?.length > 0) {
                                      setFieldValue(`textTabs.${ind}[value]`, val.join());
                                    } else {
                                      setFieldValue(`textTabs.${ind}[value]`, val);
                                    }
                                  }
                                  setFieldValue(`textTabs.${ind}[selector]`, e);
                                } else {
                                  setFieldValue(`textTabs.${ind}[value]`, "");
                                }
                              }}
                              options={mapOptionsList}
                            />
                          </Grid>
                        </Grid>
                      )}

                    </Grid>

                    <Button
                      size="medium"
                      type="submit"
                      variant="contained"
                      color="primary"
                      style={{ margin: "10px 10px 10px 0" }}
                    >
                      Send Envelope
                    </Button>
                  </Form>
                ) : (
                  docusign_state.dynamicRoleFieldsLoading == true && (
                    <div
                      style={{
                        width: "100%",
                        marginTop: 10,
                        textAlign: "center",
                      }}
                    >
                      Loading...
                    </div>
                  )
                )}
              </>
            )}
          </Formik>
        </div>
      ) : (
        <Grid
          container
          direction="row"
          id="last"
          justify="center"
          alignItems="center"
          style={{ paddingTop: 20 }}
        >
          <CircularProgress />
        </Grid>
      )}
      <ViewAudit />
    </>
  );
}

