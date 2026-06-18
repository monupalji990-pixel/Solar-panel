import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import Grid from "@material-ui/core/Grid";
import CardActions from "@material-ui/core/CardActions";
import CircularProgress from "@material-ui/core/CircularProgress";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { DropzoneArea } from "material-ui-dropzone";
import makeStyles from "@material-ui/core/styles/makeStyles";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { helperMethods } from "../../../sharedUtils/globalHelper/helperMethod";
import {
  A,
  MeterReadingServices,
} from "../../../sharedUtils/globalHelper/constantValues";
import ViewFile from "../../../sharedUtils/sharedComponents/viewFile";

const useStyles = makeStyles(() => ({
  DeleteIconAlign: {
    textAlign: "right",
  },
}));

export default function MeterReading(props) {
  const currentProps = props;
  const [startLoader, setStartLoader] = useState(false);
  const [deletedId, setDeletedId] = useState("");
  const [isAddNotes, setIsAddNotes] = useState(false);
  const [fileUpload, setFileUpload] = useState("");
  const classes = useStyles();

  if (props.isActionDone && startLoader) {
    props._isActionDone(false);
    setStartLoader(false);
    setIsAddNotes(false);
  }

  const FileUpload = (files) => {
    setFileUpload(files);
  };

  const addMeterReadings = (d) => {
    const ci = props.currentCompany._id;
    const data = new FormData();
    data.set("CompanyID", ci);
    data.set("description", d.MeterReadingNotes);
    data.set("service_type", d.serviceType.value);
    for (var x = 0; x < fileUpload.length; x++) {
      data.append("Attachments", fileUpload[x]);
    }
    props._addMeterReading(data);
  };

  const deleteAttachment = (did) => {
    let document = {
      companyId: props.currentCompany._id,
      did,
      type: "meterReading",
    };
    setDeletedId(did);
    setStartLoader(true);
    props._deleteMeterReading(document);
  };

  const meterReading = [...props.currentCompany.meterReading];
  let meterReadingsData = meterReading;
  if (
    props.meterReadings !== undefined &&
    props.meterReadings &&
    props.meterReadings.length > 0
  ) {
    meterReadingsData = props.meterReadings;
  }
  if (meterReadingsData) {
    meterReadingsData = helperMethods.reverseOrder(meterReadingsData);
  }

  return (
    <Grid container spacing={3}>
      {["admin", "management", "partner", "sales_rep"].includes(props.slug) && (
        <Grid
          item
          md={12}
          sm={12}
          xs={12}
          container
          direction="row"
          justify="flex-end"
        >
          <Button
            size="small"
            variant="contained"
            type="submit"
            color="primary"
            onClick={() => setIsAddNotes(!isAddNotes)}
          >
            Add Meter Reading
          </Button>
        </Grid>
      )}
      <Grid item md={12} sm={12} xs={12}>
        {isAddNotes && (
          <Formik
            initialValues={{
              MeterReadingNotes: "",
              serviceType: "",
            }}
            onSubmit={(value) => {
              setStartLoader(true);
              addMeterReadings(value);
            }}
            validationSchema={Yup.object().shape({
              MeterReadingNotes: Yup.string().required("Notes is required"),
              serviceType: Yup.string().required("Service type is required"),
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
                    <Grid item md={12} sm={6} xs={12}>
                      <TextField
                        variant="outlined"
                        error={
                          errors.MeterReadingNotes && touched.MeterReadingNotes
                            ? true
                            : false
                        }
                        name="MeterReadingNotes"
                        multiline
                        rows={3}
                        label="Meter Notes..."
                        value={values.MeterReadingNotes}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="WidhtFull100"
                        margin="normal"
                        aria-describedby="MeterReadingNotes-error"
                      />
                      {errors.MeterReadingNotes && touched.MeterReadingNotes && (
                        <FormHelperText
                          className="errormsg"
                          id="MeterReadingNotes-error"
                        >
                          {errors.MeterReadingNotes}
                        </FormHelperText>
                      )}
                    </Grid>
                    <Grid item md={6} sm={12} xs={12}>
                      <Select
                        error={
                          errors.serviceType && touched.serviceType
                            ? true
                            : false
                        }
                        id="serviceType"
                        className="WidhtFull100"
                        placeholder="Select Service"
                        value={values.serviceType}
                        onChange={(e) => {
                          setFieldValue("serviceType", e);
                        }}
                        onBlur={handleBlur}
                        margin="normal"
                        aria-describedby="serviceType-number-error"
                        name="colors"
                        options={MeterReadingServices}
                        classNamePrefix="select"
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
                    <Grid item xs={12} md={6}>
                      <DropzoneArea
                        filesLimit={50}
                        dropzoneText="Please Upload File From Here"
                        useChipsForPreview
                        maxFileSize={10000000}
                        onChange={(e) => FileUpload(e)}
                      />
                    </Grid>
                  </Grid>

                  <CardActions style={{ paddingLeft: 0, paddingRight: 0 }}>
                    <Button
                      size="large"
                      variant="contained"
                      type="submit"
                      disabled={isSubmitting}
                      color="primary"
                    >
                      Add Meter Reading
                    </Button>
                    {currentProps.addMeterReadingLoading && <CircularProgress />}
                  </CardActions>
                </form>
              );
            }}
          </Formik>
        )}
      </Grid>

      <Grid item xs={12} md={12}>
        {meterReadingsData &&
          meterReadingsData.map((v) => (
            <Card variant="outlined" style={{ marginBottom: "10px" }}>
              <CardContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={10}>
                    <Typography gutterBottom>
                      Service Type: <strong>{v.service_type}</strong>
                    </Typography>
                    <Typography gutterBottom>
                      Description: {v.description}
                    </Typography>
                    {v.attachment && (
                      <>
                        <Typography gutterBottom>Attachment:</Typography>
                        <ViewFile
                          commentFor="admin"
                          attachments={v.attachment}
                        ></ViewFile>
                      </>
                    )}
                  </Grid>
                  {A.includes(props.slug) && (
                    <Grid
                      item
                      xs={12}
                      md={2}
                      className={classes.DeleteIconAlign}
                    >
                      <Tooltip title="Delete">
                        <IconButton aria-label="delete">
                          <DeleteIcon onClick={() => deleteAttachment(v._id)} />
                          {startLoader && v._id === deletedId && (
                            <CircularProgress />
                          )}
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          ))}
      </Grid>
    </Grid>
  );
}