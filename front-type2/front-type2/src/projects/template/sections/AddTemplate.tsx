import {
  Button,
  CircularProgress,
  Divider,
  FormHelperText,
  Grid,
  Paper,
  TextField,
} from "@material-ui/core";
import { Formik } from "formik";
import Select from "react-select";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MyDrawer from "../../../sharedUtils/sharedComponents/drawerHelper";
import {
  selectTemplateOptions,
  selectTemplateState,
  templateAction,
} from "../redux/template";
import { DropzoneArea } from "material-ui-dropzone";
import { keyframes } from "styled-components";
import {
  mapOptions,
  mapOptionsForService,
  serviceOptions,
} from "sharedUtils/globalHelper/constantValues";

export default function AddTemplate(props) {
  const templateOptions = useSelector(selectTemplateOptions);
  const dispatch = useDispatch();
  function handleClose() {
    dispatch(templateAction.changeAddTemplateDrawerStatus(false));
    handleFileRemoved();
  }
  function handleFileRemoved() {
    dispatch(templateAction.getFieldsOfPdfSuccess([]));
  }
  const ds =
    props.showingFrom &&
      ["viewCompany", "viewQuote", "viewLead", "viewConsumer"].includes(
        props.showingFrom
      )
      ? "960px"
      : "960px";

  return (
    <MyDrawer
      drawerSize={ds}
      iconName="Template"
      open={templateOptions.openAddTemplateDrawer}
      onClose={handleClose}
    >
      <AddTemplateLogic {...props} handleFileRemoved={handleFileRemoved} />
    </MyDrawer>
  );
}

function AddTemplateLogic(props) {
  const dispatch = useDispatch();

  function handleFileUpload(files: any) {
    console.log("files", files);

    if (files && files.length > 0) {
      const data = new FormData();
      for (let x = 0; x < files.length; x++) {
        data.append("template", files[x]);
      }
      dispatch(templateAction.changeTemplatePdfTobeUpload(data));
      dispatch(templateAction.getFieldsOfPdf(data));
    }
  }

  const templateState = useSelector(selectTemplateState);

  const openForm =
    templateState.fieldsOfPdf && templateState.fieldsOfPdf.length > 0;

  const mapper = {};
  if (openForm) {
    templateState.fieldsOfPdf.forEach((ele) => {
      mapper[ele.name] = "";
    });
  }

  const initialValues = {
    template: templateState.templatePdfTobeUpload,
    templateName: "",
    type: null,
    mapper: mapper,
    serviceType: { value: "company", label: "company" },
  };

  const typeOptions = [
    { value: "LOA", label: "LOA" },
    { value: "CONTRACT", label: "CONTRACT" },
  ];

  return (
    <>
      <Grid container spacing={3} justify="center">
        <Grid item xs={8}>
          <DropzoneArea
            filesLimit={1}
            dropzoneText="Please Upload PDF File From Here"
            useChipsForPreview
            maxFileSize={10000000}
            onChange={handleFileUpload}
            onDelete={props.handleFileRemoved}
          />
        </Grid>
        {openForm == true ? (
          <Grid item xs={12}>
            <Formik
              enableReinitialize
              initialValues={initialValues}
              onSubmit={(values) => {
                const newMapper = {};

                Object.keys(values.mapper).forEach((key) => {
                  newMapper[key] = values.mapper[key]["value"];
                });
                const newVal = {
                  ...values,
                  mapper: JSON.stringify(newMapper),
                  type: values.type.value,
                  serviceType: values.serviceType.value,
                };
                const formObj = new FormData();
                Object.keys(newVal).forEach((key) => {
                  if (key === "template") {
                    formObj.append("template", newVal[key].get("template"));
                  } else {
                    formObj.append(key, newVal[key]);
                  }
                });
                dispatch(templateAction.createTemplate(formObj));
              }}
            >
              {({
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
              }) => {
                return (
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          variant="outlined"
                          error={
                            errors.templateName && touched.templateName
                              ? true
                              : false
                          }
                          id="templateName"
                          name="templateName"
                          className="WidhtFull100"
                          label="Template Name"
                          value={values.templateName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          margin="normal"
                          aria-describedby="templateName-error"
                        />
                        {errors.templateName && touched.templateName && (
                          <FormHelperText
                            className="errormsg"
                            id="templateName-error"
                          >
                            {errors.templateName}
                          </FormHelperText>
                        )}
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Select
                          className={
                            errors.type && touched.type ? "ErrorColor" : ""
                          }
                          variant="outlined"
                          id="type"
                          name="type"
                          placeholder="Type"
                          onBlur={handleBlur}
                          onChange={(e) => {
                            setFieldValue("type", e);
                            if (e.value === "LOA")
                              setFieldValue("serviceType", {
                                value: "company",
                                label: "company",
                              });
                            else setFieldValue("serviceType", null);
                          }}
                          value={values.type}
                          margin="normal"
                          aria-describedby="type-error"
                          options={typeOptions}
                        />
                        {errors.type && touched.type && (
                          <FormHelperText className="errormsg" id="type-error">
                            {errors.type}
                          </FormHelperText>
                        )}
                      </Grid>

                      {values.type?.value === "CONTRACT" ? (
                        <Grid item xs={12}>
                          <Select
                            className={
                              errors.type && touched.type ? "ErrorColor" : ""
                            }
                            variant="outlined"
                            id="serviceType"
                            name="serviceType"
                            placeholder="serviceType"
                            onBlur={handleBlur}
                            onChange={(e) => {
                              setFieldValue("serviceType", e);
                            }}
                            value={values.serviceType}
                            margin="normal"
                            aria-describedby="serviceType-error"
                            options={serviceOptions}
                          />
                          {errors.serviceType && touched.serviceType && (
                            <FormHelperText
                              className="errormsg"
                              id="serviceType-error"
                            >
                              {errors.serviceType}
                            </FormHelperText>
                          )}
                        </Grid>
                      ) : null}

                      <Grid item xs={6}>
                        <p>
                          {" "}
                          <b>Form Field Detected</b>
                        </p>
                      </Grid>
                      <Grid item xs={6}>
                        <b>Options</b>
                      </Grid>

                      <Grid item xs={12}>
                        <Divider light />
                      </Grid>

                      {Object.keys(values.mapper).map((key) => {
                        return (
                          <>
                            {console.log("service type", values.serviceType)}
                            <Grid item xs={6} alignItems="center" container>
                              <p>{key}</p>
                            </Grid>
                            <Grid item xs={6}>
                              <Select
                                className={
                                  errors.mapper &&
                                    errors.mapper[key] &&
                                    touched.mapper[key]
                                    ? "ErrorColor"
                                    : ""
                                }
                                variant="outlined"
                                id={`mapper[${key}]`}
                                name={`mapper[${key}]`}
                                onBlur={handleBlur}
                                onChange={(e) => {
                                  setFieldValue(`mapper[${key}]`, e);
                                }}
                                value={values.mapper[key]}
                                margin="normal"
                                aria-describedby="type-error"
                                options={
                                  mapOptionsForService[
                                  values.serviceType?.value
                                  ]
                                }
                              />
                              {errors.mapper &&
                                errors.mapper[key] &&
                                touched.mapper[key] && (
                                  <FormHelperText
                                    className="errormsg"
                                    id="mapper-error"
                                  >
                                    {errors.mapper[key]}
                                  </FormHelperText>
                                )}
                            </Grid>
                          </>
                        );
                      })}
                      {/* </Grid> */}
                      <Grid item xs={6}>
                        <Button
                          size="large"
                          variant="contained"
                          color="primary"
                          type="submit"
                          disabled={isSubmitting}
                        >
                          Create Template
                        </Button>
                      </Grid>
                      <Grid item xs={6}>
                        {templateState.isLoadingData && <CircularProgress />}
                      </Grid>
                    </Grid>
                  </form>
                );
              }}
            </Formik>
          </Grid>
        ) : null}
      </Grid>
    </>
  );
}
