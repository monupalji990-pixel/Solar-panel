import React, { useState } from "react";
import axios from "axios";
import * as Yup from "yup";
import { Formik } from "formik";
import Select from "react-select";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { DropzoneArea } from "material-ui-dropzone";
import FormHelperText from "@material-ui/core/FormHelperText";
import Paper from "@material-ui/core/Paper";
import Icon from "@material-ui/core/Icon";
import { helperMethods } from "../../../sharedUtils/globalHelper/helperMethod";
import {
  CompanyImportExportTypes,
  ImportExportServiceTypes,
  ConsumerType,
  OnlyCompany,
} from "../../../sharedUtils/globalHelper/constantValues";
import APIs from "../redux/model/importExport";
import Mapping from "./mapping";
import { LoadingIndicator } from "sharedUtils/sharedComponents/LoadingIndicator";

const useStyles = makeStyles({
  Spacing: {
    padding: "11px",
  },
  SpacingBottom: {
    marginBottom: "2em",
  },
  ImportSpacing: {
    padding: "5px",
  },
  TitleSpacing: {
    marginBottom: "1rem",
    "@media(max-width:480px)": {
      marginBottom: "0rem",
    },
  },
});

export default function ImportExport(props) {
  const classes = useStyles();
  const [constHeaderArray, setConstHeaderArray] = useState([]);
  const [isOpenMap, setIsOpenMap] = useState(false);
  const [startLoader, setStartLoader] = useState(false);
  const [isImport, setIsImport] = useState("");
  const [fileUpload, setFileUpload] = useState(null);

  const exportData = (exportType, type) => {
    // export any csv file
    APIs.exportFile(exportType, type).then((resp: any) => {
      const a = document.createElement("a");
      document.body.appendChild(a);
      const blob = new Blob([resp], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      if (["quote", "renewal"].includes(type)) {
        a.download = `${exportType}-${type}.csv`;
      } else {
        a.download = `${exportType}.csv`;
      }
      a.click();
      window.URL.revokeObjectURL(url);
      setStartLoader(false);
      props._enableFeedback(`${exportType} data exported successfully`);
    });
  };

  const importData = (importType, type) => {
    // import any csv file and download log-detail file
    const promises = [];
    fileUpload.forEach((f) => {
      const data = new FormData();
      data.append("CSV", f);
      promises.push(
        axios.post(`${helperMethods.URLCreator()}import/regUser/saveCsv`, data)
      );
    });

    Promise.all(promises).then((result) => {
      APIs.importFile(importType, type, result[0].data.fileName).then(
        (response: any) => {
          if (response.success) {
            setStartLoader(false);
            setIsImport("");
            if (type === "company") {
              APIs.downloadLogFile(null).then((resp2) => {
                const a = document.createElement("a");
                document.body.appendChild(a);
                // a.style = "display: none";
                const blob = new Blob([resp2 as BlobPart], {
                  type: "text/csv",
                });
                const url = window.URL.createObjectURL(blob);
                a.href = url;
                a.download = `LOG-DETAIL.csv`;
                a.click();
                window.URL.revokeObjectURL(url);
                props._enableFeedback(`
                  Company data ${response.insert}/${response.total},
                  Contact data ${response.insertContact}/${response.total},
                  Site data ${response.insertSite}/${response.total},
                  Lead data ${response.insertLead}/${response.total}, imported successfully`);
              });
            } else {
              props._enableFeedback(
                `${importType} data ${response.insert}/${response.total} imported successfully`
              );
            }
          }
        }
      );
    });
  };

  const importMappingData = (data,type) => {
    // const importType = "consumer";
    const importType = type;

    setIsOpenMap(false);
    setIsImport(`import-${importType}`);
    setStartLoader(true);
    APIs.importMappingFile(importType, data).then((response: any) => {
      if (response.success) {
        setStartLoader(false);
        setIsImport("");
        if(importType === "company"){
          props._enableFeedback(`
                  Company data ${response.insert}/${response.total},
                  Contact data ${response.insertContact}/${response.total},
                  Site data ${response.insertSite}/${response.total},
                  Lead data ${response.insertLead}/${response.total}, imported successfully`);
        }else{
          props._enableFeedback(
            `${importType} data ${response.insert}/${response.total} imported successfully`
          );

        }
      }
    });
  };

  const mappingData = (type) => {
    // mapping array for consumer
    if(type == "consumer"){

      setConstHeaderArray([
        "TITLE",
        "FIRSTNAME",
        "SURNAME",
        "EMAIL",
        "ADDRESSONE",
        "ADDRESSTWO",
        "TOWN",
        "CITY",
        "POSTCODE",
        "TELEPHONENUMBER",
        "MOBILE",
        "DOB",
        "BANKNAME",
        "SORTCODE",
        "ACCOUNTNUMBER",
        "ADDITIONALFIELDONE",
        "ADDITIONALFIELDTWO",
      ]);
    }
    if(type == "company"){
      setConstHeaderArray([
        "BUSINESSNAME",
        "ADDRESSLINE1",
        "ADDRESSLINE2",
        "TOWN",
        "COUNTY",
        "POSTCODE",
        "REGISTRATIONNUMBER",
        "VATNUMBER",
        "GATEWAYNUMBER",
        "BUSINESSSECTOR",
        "BANKNAME",
        "BANKACCOUNTNUMBER",
        "BANKSORTCODE",
        "WEBSITE",
        "CREDITSCORE",
        // "CREDITSCOREDATE",
        "COMPANYTYPE",
        "NAME",
        "MOBILENUMBER",
        "EMAIL",
        "SITENAME",
        "SITEADDRESS",
        "SITETOWN",
        "SITECITY",
        "SITECOUNTY",
        "SITEPOSTCODE",                   
        "MPRN",
        "Gas_Current_Contract_End_Date",
        "Gas_Supplier",
        "Gas_Aq",
        "MPAN",
        "PC",
        "MTC",
        "LLF",
        "Electric_Current_Contract_End_Date",
        "Electric_Supplier",
        "UnitDayKWH",
        "UnitNightKWH",
        "UnitEveWkd",
        "UnitWinterKWH",
        "MIDNUMBER",
        "ChipAndPin_Current_Contract_End_Date"
      ]);
    }
    // setIsImport("");
    setIsOpenMap(true);
  };
  function handleActionChange(value: string) {
    setIsImport(value);
    setIsOpenMap(false);
    setStartLoader(false);
  }
  return (
    <React.Fragment>
      <Grid container spacing={3}>
        <Grid item lg={3} md={6} sm={6} xs={12}>
          <Card className={classes.SpacingBottom}>
            <CardContent>
              <Grid
                container
                spacing={3}
                justify="center"
                alignItems="center"
                className={classes.ImportSpacing}
              >
                <Grid item md={6} sm={12} xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Company
                  </Typography>
                </Grid>
                <Grid item md={6} xs={12} container spacing={1}>
                  <Grid item>
                    <Button
                      variant="contained"
                      //className={classes.TitleSpacing}
                      onClick={() => handleActionChange("import-company")}
                      size="medium"
                      color="primary"
                    >
                      <Icon className="fa fa-upload" /> Import
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="outlined"
                      onClick={() => handleActionChange("export-company")}
                      size="medium"
                      color="primary"
                    >
                      <Icon className="fa fa-download" /> Export
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {isImport === "import-company" && (
            <Formik
              initialValues={{
                importType: null,
                file_upload: null,
              }}
              onSubmit={(values, actions) => {
                if (fileUpload.length < 1) {
                  actions.setErrors({
                    file_upload: "CSV file is required",
                  });
                  actions.setSubmitting(false);
                } else {
                  actions.setErrors({});
                  mappingData("company");
                }
              }}
              validationSchema={Yup.object().shape({
                importType: Yup.string().required("Field is Required"),
              })}
            >
              {(props) => {
                return (
                  <form onSubmit={props.handleSubmit}>
                    <Card>
                      <CardContent>
                        <Typography
                          variant="h6"
                          className={classes.TitleSpacing}
                        >
                          Import Data
                        </Typography>
                        <Grid container spacing={3}>
                          <Grid item md={12} xs={12}>
                            <Select
                              className={
                                props.errors.importType &&
                                props.touched.importType
                                  ? "ErrorColor"
                                  : ""
                              }
                              variant="outlined"
                              id="importType"
                              name="importType"
                              placeholder="Choose Type"
                              onChange={(e) => {
                                props.setFieldValue("importType", e);
                              }}
                              value={props.values.importType}
                              onBlur={props.handleBlur}
                              margin="normal"
                              aria-describedby="importType-error"
                              options={OnlyCompany}
                            />
                            {props.errors.importType &&
                              props.touched.importType && (
                                <FormHelperText
                                  className="errormsg"
                                  id="importType-error"
                                >
                                  {props.errors.importType}
                                </FormHelperText>
                              )}
                          </Grid>

                          <Grid item md={12} xs={12}>
                            <DropzoneArea
                              filesLimit={1}
                              acceptedFiles={[".csv"]}
                              dropzoneText="Please upload CSV from here"
                              useChipsForPreview
                              dropzoneClass={
                                props.errors.file_upload &&
                                props.touched.file_upload
                                  ? "ErrorColorDropzone"
                                  : ""
                              }
                              maxFileSize={10000000}
                              onChange={(e) => setFileUpload(e)}
                            />
                            {props.errors.file_upload &&
                              props.touched.file_upload && (
                                <FormHelperText
                                  className="errormsg"
                                  id="file_upload-error"
                                >
                                  {props.errors.file_upload}
                                </FormHelperText>
                              )}
                          </Grid>
                        </Grid>
                      </CardContent>
                      <CardContent style={{ padding: 0, textAlign: "center" }}>
                        <Grid
                          container
                          className={classes.Spacing}
                          alignItems="center"
                        >
                          <Grid item xs={5}>
                            <Button
                              variant="contained"
                              size="medium"
                              color="primary"
                              type="submit"
                            >
                              Mapping
                            </Button>
                          </Grid>

                          <Grid item xs={5}>
                            <Button
                              variant="outlined"
                              size="medium"
                              color="primary"
                              onClick={() => {
                                setIsImport("");
                                setStartLoader(false);
                              }}
                            >
                              Cancel
                            </Button>
                          </Grid>
                          <Grid item xs={1}>
                            {startLoader && (
                              <LoadingIndicator small color="#1976d2" />
                            )}
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </form>
                );
              }}
            </Formik>
          )}

          {isImport === "export-company" && (
            <Formik
              initialValues={{
                importType: null,
              }}
              onSubmit={(values) => {
                setStartLoader(true);
                exportData(values.importType.value, "company");
              }}
              validationSchema={Yup.object().shape({
                importType: Yup.string().required("Field is Required"),
              })}
            >
              {(props) => {
                return (
                  <form onSubmit={props.handleSubmit}>
                    <Grid
                      container
                      spacing={3}
                      component={Paper}
                      style={{ width: "100%", margin: "0 auto" }}
                    >
                      <Grid item md={12} xs={12}>
                        <Typography variant="h6">Export Data</Typography>
                      </Grid>

                      <Grid item md={12} xs={12}>
                        <Select
                          className={
                            props.errors.importType && props.touched.importType
                              ? "ErrorColor"
                              : ""
                          }
                          variant="outlined"
                          id="importType"
                          name="importType"
                          placeholder="Choose Type"
                          onChange={(e) => {
                            props.setFieldValue("importType", e);
                          }}
                          value={props.values.importType}
                          onBlur={props.handleBlur}
                          margin="normal"
                          aria-describedby="importType-error"
                          options={CompanyImportExportTypes}
                        />
                        {props.errors.importType && props.touched.importType && (
                          <FormHelperText
                            className="errormsg"
                            id="importType-error"
                          >
                            {props.errors.importType}
                          </FormHelperText>
                        )}
                      </Grid>
                      <Grid
                        container
                        spacing={3}
                        className={classes.Spacing}
                        alignItems="center"
                      >
                        <Grid item xs={5} style={{ textAlign: "center" }}>
                          <Button
                            variant="contained"
                            size="medium"
                            color="primary"
                            type="submit"
                          >
                            Export{" "}
                          </Button>{" "}
                        </Grid>
                        <Grid item xs={5} style={{ textAlign: "center" }}>
                          <Button
                            variant="outlined"
                            size="medium"
                            color="primary"
                            onClick={() => {
                              handleActionChange("");
                              setStartLoader(false);
                            }}
                          >
                            Cancel
                          </Button>
                        </Grid>
                        <Grid item xs={1}>
                          {startLoader && (
                            <LoadingIndicator small color="#1976d2" />
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  </form>
                );
              }}
            </Formik>
          )}
        </Grid>

        <Grid item lg={3} md={6} sm={6} xs={12}>
          <Card className={classes.SpacingBottom}>
            <CardContent>
              <Grid
                container
                spacing={3}
                justify="center"
                alignItems="center"
                className={classes.ImportSpacing}
              >
                <Grid item md={6} xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Quote
                  </Typography>
                </Grid>
                <Grid item md={6} xs={12} container spacing={1}>
                  <Grid item>
                    <Button
                      variant="contained"
                      onClick={() => handleActionChange("import-quote")}
                      size="medium"
                      color="primary"
                    >
                      <Icon className="fa fa-upload" /> Import
                    </Button>
                  </Grid>

                  <Grid item>
                    <Button
                      variant="outlined"
                      onClick={() => handleActionChange("export-quote")}
                      size="medium"
                      color="primary"
                    >
                      <Icon className="fa fa-download" /> Export
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {isImport === "import-quote" && (
            <Formik
              initialValues={{
                importType: null,
                file_upload: "",
              }}
              onSubmit={(values, actions) => {
                if (fileUpload.length < 1) {
                  actions.setErrors({
                    file_upload: "CSV file is required",
                  });
                  actions.setSubmitting(false);
                } else {
                  actions.setErrors({});
                  actions.setSubmitting(false);
                  setStartLoader(true);
                  importData(values.importType.value, "quote");
                }
              }}
              validationSchema={Yup.object().shape({
                importType: Yup.string().required("Field is Required"),
              })}
            >
              {(props) => {
                return (
                  <form onSubmit={props.handleSubmit}>
                    <Card>
                      <CardContent>
                        <Typography
                          variant="h6"
                          gutterBottom
                          className={classes.TitleSpacing}
                        >
                          Import Data
                        </Typography>
                        <Grid container spacing={3}>
                          <Grid item md={12} xs={12}>
                            <Select
                              className={
                                props.errors.importType &&
                                props.touched.importType
                                  ? "ErrorColor"
                                  : ""
                              }
                              variant="outlined"
                              id="importType"
                              name="importType"
                              placeholder="Choose Type"
                              onChange={(e) => {
                                props.setFieldValue("importType", e);
                              }}
                              value={props.values.importType}
                              onBlur={props.handleBlur}
                              margin="normal"
                              aria-describedby="importType-error"
                              options={ImportExportServiceTypes}
                            />
                            {props.errors.importType &&
                              props.touched.importType && (
                                <FormHelperText
                                  className="errormsg"
                                  id="importType-error"
                                >
                                  {props.errors.importType}
                                </FormHelperText>
                              )}
                          </Grid>

                          <Grid item md={12} xs={12}>
                            <DropzoneArea
                              filesLimit={1}
                              acceptedFiles={[".csv"]}
                              dropzoneText="Please upload CSV from here"
                              dropzoneClass={
                                props.errors.file_upload &&
                                props.touched.file_upload
                                  ? "ErrorColorDropzone"
                                  : ""
                              }
                              useChipsForPreview
                              maxFileSize={10000000}
                              onChange={(e) => setFileUpload(e)}
                            />
                            {props.errors.file_upload &&
                              props.touched.file_upload && (
                                <FormHelperText
                                  className="errormsg"
                                  id="file_upload-error"
                                >
                                  {props.errors.file_upload}
                                </FormHelperText>
                              )}
                          </Grid>
                        </Grid>
                      </CardContent>
                      <CardContent style={{ padding: 0, textAlign: "center" }}>
                        <Grid
                          container
                          className={classes.Spacing}
                          alignItems="center"
                        >
                          <Grid item xs={5}>
                            <Button
                              variant="contained"
                              size="medium"
                              color="primary"
                              type="submit"
                            >
                              Import
                            </Button>
                          </Grid>

                          <Grid item xs={5}>
                            <Button
                              variant="outlined"
                              size="medium"
                              color="primary"
                              onClick={() => {
                                handleActionChange("");
                                setStartLoader(false);
                              }}
                            >
                              Cancel
                            </Button>
                          </Grid>
                          <Grid item xs={1}>
                            {startLoader && (
                              <LoadingIndicator small color="#1976d2" />
                            )}
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </form>
                );
              }}
            </Formik>
          )}

          {isImport === "export-quote" && (
            <Formik
              initialValues={{
                importType: null,
              }}
              onSubmit={(values) => {
                setStartLoader(true);
                exportData(values.importType.value, "quote");
              }}
              validationSchema={Yup.object().shape({
                importType: Yup.string().required("Field is Required"),
              })}
            >
              {(props) => {
                return (
                  <form onSubmit={props.handleSubmit}>
                    <Grid
                      container
                      spacing={3}
                      component={Paper}
                      style={{ width: "100%", margin: "0 auto" }}
                    >
                      <Grid item md={12} xs={12}>
                        <Typography variant="h6">Export Data</Typography>
                      </Grid>
                      <Grid item md={12} xs={12}>
                        <Select
                          className={
                            props.errors.importType && props.touched.importType
                              ? "ErrorColor"
                              : ""
                          }
                          variant="outlined"
                          id="importType"
                          name="importType"
                          placeholder="Choose Type"
                          onChange={(e) => {
                            props.setFieldValue("importType", e);
                          }}
                          value={props.values.importType}
                          onBlur={props.handleBlur}
                          margin="normal"
                          aria-describedby="importType-error"
                          options={ImportExportServiceTypes}
                        />
                        {props.errors.importType && props.touched.importType && (
                          <FormHelperText
                            className="errormsg"
                            id="importType-error"
                          >
                            {props.errors.importType}
                          </FormHelperText>
                        )}
                      </Grid>
                      <Grid
                        container
                        spacing={3}
                        className={classes.Spacing}
                        alignItems="center"
                      >
                        <Grid item xs={5} style={{ textAlign: "center" }}>
                          <Button
                            variant="contained"
                            size="medium"
                            color="primary"
                            type="submit"
                          >
                            Export
                          </Button>
                        </Grid>
                        <Grid item xs={5} style={{ textAlign: "center" }}>
                          <Button
                            variant="outlined"
                            size="medium"
                            color="primary"
                            onClick={() => {
                              handleActionChange("");
                              setStartLoader(false);
                            }}
                          >
                            Cancel
                          </Button>
                        </Grid>
                        <Grid item xs={1}>
                          {startLoader && (
                            <LoadingIndicator small color="#1976d2" />
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  </form>
                );
              }}
            </Formik>
          )}
        </Grid>

        <Grid item lg={3} md={6} sm={6} xs={12}>
          <Card className={classes.SpacingBottom}>
            <CardContent>
              <Grid
                container
                spacing={3}
                justify="center"
                alignItems="center"
                className={classes.ImportSpacing}
              >
                <Grid item md={6} xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Renewal
                  </Typography>
                </Grid>
                <Grid item md={6} xs={12} container spacing={1}>
                  <Grid item>
                    <Button
                      variant="contained"
                      onClick={() => handleActionChange("import-renewal")}
                      size="medium"
                      color="primary"
                    >
                      <Icon className="fa fa-upload" /> Import
                    </Button>
                  </Grid>

                  <Grid item>
                    <Button
                      variant="outlined"
                      onClick={() => handleActionChange("export-renewal")}
                      size="medium"
                      color="primary"
                    >
                      <Icon className="fa fa-download" /> Export
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {isImport === "import-renewal" && (
            <Formik
              initialValues={{
                importType: null,
                file_upload: "",
              }}
              onSubmit={(values, actions) => {
                if (fileUpload.length < 1) {
                  actions.setErrors({
                    file_upload: "CSV file is required",
                  });
                  actions.setSubmitting(false);
                } else {
                  actions.setErrors({});
                  actions.setSubmitting(false);
                  setStartLoader(true);
                  importData(values.importType.value, "renewal");
                }
              }}
              validationSchema={Yup.object().shape({
                importType: Yup.string().required("Field is Required"),
              })}
            >
              {(props) => {
                return (
                  <form onSubmit={props.handleSubmit}>
                    <Card>
                      <CardContent>
                        <Typography
                          variant="h6"
                          gutterBottom
                          className={classes.TitleSpacing}
                        >
                          Import Data
                        </Typography>
                        <Grid container spacing={3}>
                          <Grid item md={12} xs={12}>
                            <Select
                              className={
                                props.errors.importType &&
                                props.touched.importType
                                  ? "ErrorColor"
                                  : ""
                              }
                              variant="outlined"
                              id="importType"
                              name="importType"
                              placeholder="Choose Type"
                              onChange={(e) => {
                                props.setFieldValue("importType", e);
                              }}
                              value={props.values.importType}
                              onBlur={props.handleBlur}
                              margin="normal"
                              aria-describedby="importType-error"
                              options={ImportExportServiceTypes}
                            />
                            {props.errors.importType &&
                              props.touched.importType && (
                                <FormHelperText
                                  className="errormsg"
                                  id="importType-error"
                                >
                                  {props.errors.importType}
                                </FormHelperText>
                              )}
                          </Grid>

                          <Grid item md={12} xs={12}>
                            <DropzoneArea
                              filesLimit={1}
                              acceptedFiles={[".csv"]}
                              dropzoneText="Please upload CSV from here"
                              dropzoneClass={
                                props.errors.file_upload &&
                                props.touched.file_upload
                                  ? "ErrorColorDropzone"
                                  : ""
                              }
                              useChipsForPreview
                              maxFileSize={10000000}
                              onChange={(e) => setFileUpload(e)}
                            />
                            {props.errors.file_upload &&
                              props.touched.file_upload && (
                                <FormHelperText
                                  className="errormsg"
                                  id="file_upload-error"
                                >
                                  {props.errors.file_upload}
                                </FormHelperText>
                              )}
                          </Grid>
                        </Grid>
                      </CardContent>
                      <CardContent style={{ padding: 0, textAlign: "center" }}>
                        <Grid
                          container
                          className={classes.Spacing}
                          alignItems="center"
                        >
                          <Grid item xs={5}>
                            <Button
                              variant="contained"
                              size="medium"
                              color="primary"
                              type="submit"
                            >
                              Import{" "}
                            </Button>{" "}
                          </Grid>

                          <Grid item xs={5}>
                            <Button
                              variant="outlined"
                              size="medium"
                              color="primary"
                              onClick={() => {
                                handleActionChange("");
                                setStartLoader(false);
                              }}
                            >
                              Cancel{" "}
                            </Button>
                          </Grid>
                          <Grid item xs={1}>
                            {startLoader && (
                              <LoadingIndicator small color="#1976d2" />
                            )}
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </form>
                );
              }}
            </Formik>
          )}

          {isImport === "export-renewal" && (
            <Formik
              initialValues={{
                importType: null,
              }}
              onSubmit={(values) => {
                setStartLoader(true);
                exportData(values.importType.value, "renewal");
              }}
              validationSchema={Yup.object().shape({
                importType: Yup.string().required("Field is Required"),
              })}
            >
              {(props) => {
                return (
                  <form onSubmit={props.handleSubmit}>
                    <Grid
                      container
                      spacing={3}
                      component={Paper}
                      style={{ width: "100%", margin: "0 auto" }}
                    >
                      <Grid item md={12} xs={12}>
                        <Typography variant="h6">Export Data</Typography>
                      </Grid>

                      <Grid item md={12} xs={12}>
                        <Select
                          className={
                            props.errors.importType && props.touched.importType
                              ? "ErrorColor"
                              : ""
                          }
                          variant="outlined"
                          id="importType"
                          name="importType"
                          placeholder="Choose Type"
                          onChange={(e) => {
                            props.setFieldValue("importType", e);
                          }}
                          value={props.values.importType}
                          onBlur={props.handleBlur}
                          margin="normal"
                          aria-describedby="importType-error"
                          options={ImportExportServiceTypes}
                        />
                        {props.errors.importType && props.touched.importType && (
                          <FormHelperText
                            className="errormsg"
                            id="importType-error"
                          >
                            {props.errors.importType}
                          </FormHelperText>
                        )}
                      </Grid>

                      <Grid
                        container
                        spacing={3}
                        className={classes.Spacing}
                        alignItems="center"
                      >
                        <Grid item xs={5} style={{ textAlign: "center" }}>
                          <Button
                            variant="contained"
                            size="medium"
                            color="primary"
                            type="submit"
                          >
                            Export{" "}
                          </Button>{" "}
                        </Grid>
                        <Grid item xs={5} style={{ textAlign: "center" }}>
                          <Button
                            variant="outlined"
                            size="medium"
                            color="primary"
                            onClick={() => {
                              handleActionChange("");
                              setStartLoader(false);
                            }}
                          >
                            Cancel{" "}
                          </Button>
                        </Grid>
                        <Grid item xs={1}>
                          {startLoader && (
                            <LoadingIndicator small color="#1976d2" />
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  </form>
                );
              }}
            </Formik>
          )}
        </Grid>

        <Grid item lg={3} md={6} sm={6} xs={12}>
          <Card className={classes.SpacingBottom}>
            <CardContent>
              <Grid
                container
                spacing={3}
                justify="center"
                alignItems="center"
                className={classes.ImportSpacing}
              >
                <Grid item md={6} xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Consumer
                  </Typography>
                </Grid>
                <Grid item md={6} xs={12} container spacing={1}>
                  <Grid item>
                    <Button
                      variant="contained"
                      onClick={() => handleActionChange("import-consumer")}
                      size="medium"
                      color="primary"
                    >
                      <Icon className="fa fa-upload" /> Import
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        handleActionChange("export-consumer");
                        setIsOpenMap(false);
                      }}
                      size="medium"
                      color="primary"
                    >
                      <Icon className="fa fa-download" /> Export
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {isImport === "import-consumer" && (
            <Formik
              initialValues={{
                importType: "",
                file_upload: "",
              }}
              onSubmit={(values, actions) => {
                if (fileUpload.length < 1) {
                  actions.setErrors({
                    file_upload: "Field is Required",
                  });
                } else {
                  actions.setErrors({});
                  mappingData("consumer");
                }
              }}
              validationSchema={Yup.object().shape({
                importType: Yup.string().required("Field is Required"),
              })}
            >
              {(props) => {
                return (
                  <form onSubmit={props.handleSubmit}>
                    <Card>
                      <CardContent>
                        <Typography
                          variant="h6"
                          gutterBottom
                          className={classes.TitleSpacing}
                        >
                          Import Data
                        </Typography>
                        <Grid container spacing={3}>
                          <Grid item md={12} xs={12}>
                            <Select
                              className={
                                props.errors.importType &&
                                props.touched.importType
                                  ? "ErrorColor"
                                  : ""
                              }
                              variant="outlined"
                              id="importType"
                              name="importType"
                              placeholder="Choose Type"
                              onChange={(e) => {
                                props.setFieldValue("importType", e);
                              }}
                              value={props.values.importType}
                              onBlur={props.handleBlur}
                              margin="normal"
                              aria-describedby="importType-error"
                              options={ConsumerType}
                            />
                            {props.errors.importType &&
                              props.touched.importType && (
                                <FormHelperText
                                  className="errormsg"
                                  id="importType-error"
                                >
                                  {props.errors.importType}
                                </FormHelperText>
                              )}
                          </Grid>

                          <Grid item md={12} xs={12}>
                            <DropzoneArea
                              filesLimit={1}
                              acceptedFiles={[".csv"]}
                              dropzoneText="Please upload CSV from here"
                              useChipsForPreview
                              dropzoneClass={
                                props.errors.file_upload &&
                                props.touched.file_upload
                                  ? "ErrorColorDropzone"
                                  : ""
                              }
                              maxFileSize={10000000}
                              onChange={(e) => setFileUpload(e)}
                            />
                            {props.errors.file_upload &&
                              props.touched.file_upload && (
                                <FormHelperText
                                  className="errormsg"
                                  id="file_upload-error"
                                >
                                  {props.errors.file_upload}
                                </FormHelperText>
                              )}
                          </Grid>
                        </Grid>
                      </CardContent>
                      <CardContent style={{ padding: 0, textAlign: "center" }}>
                        <Grid
                          container
                          className={classes.Spacing}
                          alignItems="center"
                        >
                          <Grid item xs={5}>
                            <Button
                              variant="contained"
                              size="medium"
                              color="primary"
                              type="submit"
                            >
                              Mapping
                            </Button>
                          </Grid>

                          <Grid item xs={5}>
                            <Button
                              variant="outlined"
                              size="medium"
                              color="primary"
                              onClick={() => {
                                handleActionChange("");
                                setStartLoader(false);
                              }}
                            >
                              Cancel
                            </Button>
                          </Grid>
                          <Grid item xs={1}>
                            {startLoader && (
                              <LoadingIndicator small color="#1976d2" />
                            )}
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </form>
                );
              }}
            </Formik>
          )}

          {isImport === "export-consumer" && (
            <Formik
              initialValues={{
                importType: null,
              }}
              onSubmit={(values) => {
                setStartLoader(true);
                exportData(values.importType.value, "consumer");
              }}
              validationSchema={Yup.object().shape({
                importType: Yup.string().required("Field is Required"),
              })}
            >
              {(props) => {
                return (
                  <form onSubmit={props.handleSubmit}>
                    <Card>
                      <CardContent>
                        <Typography
                          variant="h6"
                          gutterBottom
                          className={classes.SpacingBottom}
                        >
                          Export Data
                        </Typography>
                        <Grid container spacing={3}>
                          <Grid item md={12} xs={12}>
                            <Select
                              className={
                                props.errors.importType &&
                                props.touched.importType
                                  ? "ErrorColor"
                                  : ""
                              }
                              variant="outlined"
                              id="importType"
                              name="importType"
                              placeholder="Choose Type"
                              onChange={(e) => {
                                props.setFieldValue("importType", e);
                              }}
                              value={props.values.importType}
                              onBlur={props.handleBlur}
                              margin="normal"
                              aria-describedby="importType-error"
                              options={ConsumerType}
                            />
                            {props.errors.importType &&
                              props.touched.importType && (
                                <FormHelperText
                                  className="errormsg"
                                  id="importType-error"
                                >
                                  {props.errors.importType}
                                </FormHelperText>
                              )}
                          </Grid>
                        </Grid>

                        <Grid
                          container
                          spacing={3}
                          className={classes.Spacing}
                          alignItems="center"
                        >
                          <Grid item xs={5}>
                            <Button
                              variant="contained"
                              size="medium"
                              color="primary"
                              type="submit"
                            >
                              Export
                            </Button>
                          </Grid>
                          <Grid item xs={5}>
                            <Button
                              variant="outlined"
                              size="medium"
                              color="primary"
                              onClick={() => {
                                handleActionChange("");
                                setStartLoader(false);
                              }}
                            >
                              Cancel
                            </Button>
                          </Grid>
                          <Grid item xs={1}>
                            {startLoader && (
                              <LoadingIndicator small color="#1976d2" />
                            )}
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </form>
                );
              }}
            </Formik>
          )}
        </Grid>
        {isOpenMap && (
          <Grid item md={12} xs={12}>
            <Mapping
              {...props}
              importType={isImport}
              fileData={fileUpload[0]}
              constHeaderArray={constHeaderArray}
              importMappingData={(data,type) => importMappingData(data,type)}
              setIsOpenMap={setIsOpenMap}
            />
          </Grid>
        )}
      </Grid>
    </React.Fragment>
  );
}