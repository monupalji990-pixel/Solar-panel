import {
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  Radio,
  RadioGroup,
  TextField,
} from "@material-ui/core";
import { Formik } from "formik";
import Select from "react-select";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MyDrawer from "../../../sharedUtils/sharedComponents/drawerHelper";
import {
  selectDocOptions,
  selectDocState,
  digitalDocAction,
  selectTemplateFromDigitalDoc,
  initialTemplate,
} from "../redux/digital";
import * as Yup from "yup";
import { selectCompanyState } from "projects/company/redux/company";
import { selectQuoteState } from "projects/quote/redux/quote";
import DocuSignAction from "../sections/docusignActions"
import { selectRenewalState } from "../../renewal/Redux/renewal";
import { docusignAction } from "projects/docusign/redux/docusign";

export default function AddTemplate(props) {
  const DocOption = useSelector(selectDocOptions);
  const dispatch = useDispatch();
  function handleClose() {
    dispatch(digitalDocAction.changeAddDocDrawerStatus(false));
    dispatch(digitalDocAction.changePdfStr(""));
    dispatch(docusignAction.clearDocusignRedux(null))
  }

  const ds = "1250px";

  return (
    <MyDrawer
      drawerSize={ds}
      iconName="digital-doc"
      open={DocOption.openAddDocDrawer}
      onClose={handleClose}
    >
      <CreateDocLogic {...props} />
    </MyDrawer>
  );
}

function CreateDocLogic(props) {
  const dispatch = useDispatch();

  function handleFileUpload(files: any) {
    if (files && files.length > 0) {
      const data = new FormData();
      for (let x = 0; x < files.length; x++) {
        data.append("template", files[x]);
      }
    }
  }

  const docState = useSelector(selectDocState);

  const typeOptions = [
    { value: "LOA", label: "LOA" },
    { value: "CONTRACT", label: "CONTRACT" },
  ];

  const mapOptions = [
    { value: "businessName", label: "businessName" },
    { value: "firstLine", label: "firstLine" },
    { value: "secondLine", label: "secondLine" },
    { value: "postcode", label: "postcode" },
    { value: "NA", label: "NA" },
  ];

  const template = useSelector(selectTemplateFromDigitalDoc);
  const [templateOptions, setTemplateOptions] = useState([]);

  useEffect(() => {
    if (template.templateList && template.templateList.length > 0) {
      const newArr = [];
      template.templateList.forEach((ele) => {
        newArr.push({
          value: ele._id,
          label: ele.templateName,
        });
      });
      setTemplateOptions(newArr);
    }
  }, [template]);

  useEffect(() => {
    let type = "CONTRACT";
    if (props.showingFrom === "viewCompany") {
      type = "LOA";
    }
    dispatch(digitalDocAction.changeTemplateListType(type));
    dispatch(digitalDocAction.getListOfTemplate(type));
  }, []);

  function _changeTemplateSkipDown() {
    if (template.isNext) {
      dispatch(
        digitalDocAction.templateListChangelimit({
          limit: template.limit + initialTemplate.limit,
        })
      );
    }
  }

  function handleSelection(data, setFieldError) {
    if (props.showingFrom === "viewCompany") {
      if (data.siteId) {
        dispatch(digitalDocAction.createDoc(data));
      }
      setFieldError("site", "Please select site");
    } else {
      dispatch(digitalDocAction.createDoc(data));
    }
  }

  const company = useSelector(selectCompanyState);
  const quote = useSelector(selectQuoteState);
  const renewalState = useSelector(selectRenewalState);

  let currentModuleObj = {};

  const formInitialVal: any = {};

  if (props.showingFrom == "viewQuote") {
    formInitialVal.quoteId = quote?.currentQuote?._id;
    formInitialVal.type = "quote";
    currentModuleObj = quote.currentQuote;
  } else if (props.showingFrom == "viewCompany") {
    formInitialVal.companyId = company?.currentCompany?._id;
    formInitialVal.type = "company";
    currentModuleObj = { ...company.currentCompany, Company: { _id: company?.currentCompany?._id } };
  }
  else if (props.showingFrom == "viewRenewal") {
    formInitialVal.renewalId = renewalState?.currentQuote?._id;
    formInitialVal.type = "renewal";
    currentModuleObj = renewalState.currentQuote;
  }

  function base64ToArrayBuffer(data) {
    var bString = window.atob(data);
    var bLength = bString.length;
    var bytes = new Uint8Array(bLength);
    for (var i = 0; i < bLength; i++) {
      var ascii = bString.charCodeAt(i);
      bytes[i] = ascii;
    }
    return bytes;
  }

  const downloadAttachment = async (fileData, fileType, fileName) => {
    try {
      const typeArray = {
        png: "image/png",
        jpg: "image/jpg",
        jpeg: "image/jpeg",
        pdf: "application/pdf",
        xlsx:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      };
      const blob = fileData;
      const a = document.createElement("a");
      a.style.display = "none";
      document.body.appendChild(a);
      a.href = window.URL.createObjectURL(
        new Blob([blob as ArrayBuffer], { type: typeArray[fileType] })
      );
      a.setAttribute("download", fileName);
      a.click();
      window.URL.revokeObjectURL(a.href);
      document.body.removeChild(a);
    } catch (error) { }
  };

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={{
          Template: null,
          filename: "",
          mode: "Manual",
          site: null,
        }}
        onSubmit={(value) => {
          dispatch(
            digitalDocAction.savePdf({
              ...formInitialVal,
              templateId: value.Template.value,
              data: docState.pdfStr,
              filename: value.filename,
              contentType: "application/pdf",
              mode: value.mode,
            })
          );
          if (value?.mode !== "Verbal")
            downloadAttachment(
              base64ToArrayBuffer(docState.pdfStr),
              "pdf",
              `${value.filename}`
            );
        }}
        validationSchema={Yup.object().shape({
          filename: Yup.string().required("filename is required").nullable(),
          Template: Yup.object({
            value: Yup.string().required("please select the template"),
          })
            .required("please select the template")
            .nullable(),
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
            setFieldError,
          } = Iprops;

          function handleModelChange(e) {
            setFieldValue("mode", e.currentTarget.value);
            dispatch(docusignAction.clearDocusignRedux(null))

          }
          return (
            <form onSubmit={handleSubmit}>
              <Grid item xs={12}>
                <FormControl>
                  <RadioGroup
                    row
                    aria-label="mode"
                    name="Mode"
                    value={values.mode}
                    onChange={handleModelChange}
                  >
                    <FormControlLabel
                      value="Verbal"
                      control={<Radio />}
                      label="Verbal"
                    />
                    <FormControlLabel
                      value="Manual"
                      control={<Radio />}
                      label="Manual"
                    />
                    <FormControlLabel
                      value="DocuSign"
                      control={<Radio />}
                      label="DocuSign"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              {values.mode === "Manual" ? (
                <Grid item xs={12}>
                  <Manualview
                    formikProps={Iprops}
                    handleSelection={handleSelection}
                    _changeTemplateSkipDown={_changeTemplateSkipDown}
                    templateOptions={templateOptions}
                    formInitialVal={formInitialVal}
                    showingFrom={props.showingFrom}
                  />
                </Grid>
              ) : null}
              {values.mode === "Verbal" ? (
                <Grid item xs={12}>
                  <VerbalView
                    formikProps={Iprops}
                    handleSelection={handleSelection}
                    _changeTemplateSkipDown={_changeTemplateSkipDown}
                    templateOptions={templateOptions}
                    formInitialVal={formInitialVal}
                    showingFrom={props.showingFrom}
                  />
                </Grid>
              ) : null}
              {values.mode === "DocuSign" &&
                <Grid item xs={12}>
                  <DocuSignAction company={company} {...props}
                    currentModuleObj={currentModuleObj}
                    typeValues={formInitialVal}
                  />
                </Grid>
              }
            </form>
          );
        }}
      </Formik>
    </>
  );
}

function Manualview({
  formikProps,
  handleSelection,
  _changeTemplateSkipDown,
  templateOptions,
  formInitialVal,
  showingFrom,
}) {
  const docState = useSelector(selectDocState);
  const company = useSelector(selectCompanyState);

  let siteOption = [];

  if (company.currentCompany?.Site && company.currentCompany?.Site.length > 0) {
    siteOption = company.currentCompany?.Site?.map((e) => ({
      value: e._id,
      label: e.siteName,
    }));
  }

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
    setFieldError,
  } = formikProps;
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Select
            id="Template"
            name="Template"
            placeholder="Search templates"
            value={values.Template}
            onChange={(e) => {
              setFieldValue("Template", e);
              handleSelection(
                {
                  templateId: e.value,
                  ...formInitialVal,
                  siteId: values.site?.value,
                },
                setFieldError
              );
            }}
            onBlur={handleBlur}
            isLoading={docState.template.isLoading}
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
          {errors.Template && touched.Template && (
            <FormHelperText className="errormsg" id="Template-error">
              {errors.Template}
            </FormHelperText>
          )}
        </Grid>
        {showingFrom === "viewCompany" ? (
          <Grid item xs={4}>
            <Select
              id="Site"
              name="Site"
              placeholder="Search Sites"
              value={values.site}
              onChange={(e) => {
                setFieldValue("site", e);
                handleSelection(
                  {
                    templateId: values.Template?.value,
                    ...formInitialVal,
                    siteId: e.value,
                  },
                  setFieldError
                );
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
            {errors.site && (
              <FormHelperText className="errormsg" id="site-error">
                {errors.site}
              </FormHelperText>
            )}
          </Grid>
        ) : null}

        <Grid item xs={4}>
          <TextField
            variant="outlined"
            id="filename"
            name="filename"
            className="WidhtFull100"
            label="File Name"
            value={values.filename}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="filename-error"
          />
          {errors.filename && touched.filename && (
            <FormHelperText className="errormsg" id="filename-error">
              {errors.filename}
            </FormHelperText>
          )}
        </Grid>
        {docState.pdfStr ? (
          <Grid item>
            <Grid container justify="flex-end">
              <Button
                size="large"
                variant="contained"
                color="primary"
                type="submit"
                disabled={isSubmitting}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        ) : null}
        {docState.isLoadingData ? (
          <Grid item xs={12} justify="center" style={{ display: "flex" }}>
            {docState.isLoadingData && <CircularProgress />}
          </Grid>
        ) : null}
        <Grid item xs={12}>
          {docState.pdfStr ? (
            <object
              style={{
                height: "750px",
                width: "100%",
                ...(docState.isLoadingData && {
                  pointerEvents: "none",
                  opacity: "0.4",
                }),
              }}
              data={`data:application/pdf;base64,${docState.pdfStr}#toolbar=0&navpanes=0`}
              type="application/pdf"
            ></object>
          ) : null}
        </Grid>
      </Grid>
    </>
  );
}

function VerbalView({
  formikProps,
  handleSelection,
  _changeTemplateSkipDown,
  templateOptions,
  formInitialVal,
  showingFrom,
}) {
  const docState = useSelector(selectDocState);
  const company = useSelector(selectCompanyState);

  let siteOption = [];
  if (company.currentCompany?.Site && company.currentCompany?.Site.length > 0) {
    siteOption = company.currentCompany?.Site?.map((e) => ({
      value: e._id,
      label: e.siteName,
    }));
  }
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
    setFieldError,
  } = formikProps;
  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Select
            id="Template"
            name="Template"
            placeholder="Search templates"
            value={values.Template}
            onChange={(e) => {
              setFieldValue("Template", e);
              handleSelection(
                {
                  templateId: e.value,
                  ...formInitialVal,
                },
                setFieldError
              );
            }}
            onBlur={handleBlur}
            isLoading={docState.template.isLoading}
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
          {errors.Template && touched.Template && (
            <FormHelperText className="errormsg" id="Template-error">
              {errors.Template}
            </FormHelperText>
          )}
        </Grid>
        {showingFrom === "viewCompany" ? (
          <Grid item xs={4}>
            <Select
              id="Site"
              name="Site"
              placeholder="Search Sites"
              value={values.site}
              onChange={(e) => {
                setFieldValue("site", e);
                handleSelection(
                  {
                    templateId: values.Template?.value,
                    ...formInitialVal,
                    siteId: e.value,
                  },
                  setFieldError
                );
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
            {errors.site && (
              <FormHelperText className="errormsg" id="site-error">
                {errors.site}
              </FormHelperText>
            )}
          </Grid>
        ) : null}
        <Grid item xs={4}>
          <TextField
            variant="outlined"
            id="filename"
            name="filename"
            className="WidhtFull100"
            label="File Name"
            value={values.filename}
            onChange={handleChange}
            onBlur={handleBlur}
            margin="normal"
            aria-describedby="filename-error"
          />
          {errors.filename && touched.filename && (
            <FormHelperText className="errormsg" id="filename-error">
              {errors.filename}
            </FormHelperText>
          )}
        </Grid>
        {docState.pdfStr ? (
          <Grid item>
            <Grid container justify="flex-end">
              <Button
                size="large"
                variant="contained"
                color="primary"
                type="submit"
                disabled={isSubmitting}
              >
                Save
              </Button>
            </Grid>
          </Grid>
        ) : null}
        {docState.isLoadingData ? (
          <Grid item xs={12} justify="center" style={{ display: "flex" }}>
            {docState.isLoadingData && <CircularProgress />}
          </Grid>
        ) : null}

        <Grid item xs={12}>
          {docState.pdfStr ? (
            <object
              style={{
                height: "750px",
                width: "100%",
                ...(docState.isLoadingData && {
                  pointerEvents: "none",
                  opacity: "0.4",
                }),
              }}
              data={`data:application/pdf;base64,${docState.pdfStr}`}
              type="application/pdf"
            ></object>
          ) : null}
        </Grid>
      </Grid>
    </>
  );
}
