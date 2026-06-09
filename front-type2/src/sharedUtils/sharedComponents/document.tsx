import React, { useState, lazy, Suspense } from "react";
import { Formik } from "formik";
import Grid from "@material-ui/core/Grid";
import Select from "react-select";
import * as Yup from "yup";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CircularProgress from "@material-ui/core/CircularProgress";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import FormHelperText from "@material-ui/core/FormHelperText";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import InputAdornment from "@material-ui/core/InputAdornment";
import { DropzoneDialog } from "material-ui-dropzone";
import ImageIcon from "@material-ui/icons/Image";
import Chip from "@material-ui/core/Chip";
import { helperMethods } from "../globalHelper/helperMethod";
import { TaskStatus, TaskValueToStatus } from "../globalHelper/constantValues";

const ViewDocument = lazy(() => import("./viewDocument"));

const useStyles = makeStyles(() => ({
  root: {
    maxWidth: 400,
  },
  marginSpacing: {
    marginTop: 10,
    marginBottom: 5,
  },
  paddingSpacing: {
    padding: 15,
  },
}));

export default function Documents(props) {
  const currentProps = props;
  const classes = useStyles();
  const [startLoader, setStartLoader] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [fileUpload, setFileUpload] = useState(null);
  const [CommentLine, setCommentLine] = useState(true);

  const handleOpenDialog = (setFieldValue) => {
    setOpenDialog(true);
  };

  const handleRemoveFile = (chip: any) => {
    setFileUpload((chips: any) => chips.filter((e) => e !== chip));
  };

  return (
    <div className="app">
      <Grid>
        <Grid>
          <Grid item md={12} xs={12}>
            <>
              <Grid
                container
                component={Paper}
                className={classes.marginSpacing}
              >
                {CommentLine === true && showCommentBox === false && (
                  <Grid item md={12} xs={12} className={classes.paddingSpacing}>
                    <TextField
                      id="standard-multiline-flexible"
                      multiline
                      rowsMax={4}
                      value="Enter Title"
                      className="WidhtFull100 commentInputStyle"
                      InputProps={{
                        readOnly: true,
                      }}
                      style={{ border: 0 }}
                      onClick={() => setShowCommentBox(true)}
                    />
                  </Grid>
                )}
                {showCommentBox === true && (
                  <Grid item md={12} xs={12} className={classes.paddingSpacing}>
                    <Formik
                      initialValues={{
                        notes: "",
                        Status: null,
                        ReminderType: null,
                        attach: null,
                      }}
                      onSubmit={(values, errors) => {

                        const data = new FormData();
                        data.set("description", values.notes);
                        if (fileUpload && fileUpload.length > 0) {
                          for (let x = 0; x < fileUpload.length; x++) {
                            data.append("Attachments", fileUpload[x]);
                          }
                        }
                        if (currentProps.isShowStatus && values.Status) {
                          data.set(
                            "Status",
                            values.Status ? values.Status.value : ""
                          );
                          const ns = values.Status.value;
                          if (Number(currentProps.Status) !== Number(ns)) {
                            const History = helperMethods.CreateStatusHistory(
                              TaskValueToStatus[currentProps.Status],
                              TaskValueToStatus[ns]
                            );
                            data.set("History", History);
                          }
                        }
                        props.addDocument(data, values);
                        setStartLoader(true);
                        setTimeout(function () {
                          setShowCommentBox(false);
                          setStartLoader(false);
                          setFileUpload("");
                        }, 3000);
                      }}
                      validationSchema={Yup.object().shape({
                        notes: Yup.string().required(
                          "The Message text is empty."
                        ),
                        attach: Yup.array().required("Document is required").nullable(),
                      })}
                    >
                      {(props) => {
                        const {
                          values,
                          touched,
                          errors,
                          isSubmitting,
                          handleChange,
                          handleBlur,
                          handleSubmit,
                          setFieldValue,
                        } = props;
                       
                        return (
                          <form onSubmit={handleSubmit}>
                            <Grid item md={12} sm={12}>
                              <TextField
                                variant="outlined"
                                error={!!(errors.notes && touched.notes)}
                                name="notes"
                                multiline
                                rows={3}
                                value={values.notes}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="WidhtFull100"
                                margin="normal"
                                aria-describedby="notes-error"
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="start">
                                      <Tooltip
                                        onClick={() =>
                                          handleOpenDialog(setFieldValue)
                                        }
                                        title="Upload Files"
                                      >
                                        <IconButton>
                                          <AttachFileIcon />
                                        </IconButton>
                                      </Tooltip>
                                    </InputAdornment>
                                  ),
                                }}
                              />
                              {errors.notes && touched.notes && (
                                <FormHelperText
                                  className="errormsg"
                                  id="notes-error"
                                >
                                  {errors.notes}
                                </FormHelperText>
                              )}
                              {errors.attach && touched.attach && (
                                <FormHelperText
                                  className="errormsg"
                                  id="attach-error"
                                >
                                  {errors.attach}
                                </FormHelperText>
                              )}
                            </Grid>
                            <div>
                              <Dropzone
                                openDialog={openDialog}
                                setFieldValue={setFieldValue}
                                setOpenDialog={setOpenDialog}
                                setFileUpload={setFileUpload}
                              />
                            </div>
                            {currentProps.isShowStatus && (
                              <Grid
                                item
                                xs={12}
                                md={12}
                                className={classes.marginSpacing}
                              >
                                <Select
                                  variant="outlined"
                                  error={!!(errors.Status && touched.Status)}
                                  placeholder="Status"
                                  onBlur={handleBlur}
                                  onChange={(e) => setFieldValue("Status", e)}
                                  margin="normal"
                                  aria-describedby="ReminderType-error"
                                  name="Status"
                                  options={TaskStatus}
                                />
                                {errors.ReminderType && touched.ReminderType && (
                                  <FormHelperText
                                    className="errormsg"
                                    id="ReminderType-error"
                                  >
                                    {errors.ReminderType}
                                  </FormHelperText>
                                )}
                              </Grid>
                            )}

                            <Grid item md={12} sm={12}>
                              {fileUpload !== undefined &&
                                fileUpload &&
                                fileUpload.map((e, i) => (
                                  <React.Fragment key={i.key}>
                                    <Chip
                                      style={{
                                        marginBottom: "5px",
                                        marginTop: "15px",
                                        marginRight: "5px",
                                      }}
                                      avatar={<ImageIcon></ImageIcon>}
                                      label={e.name}
                                      onDelete={(chip) => {
                                        handleRemoveFile(chip);
                                      }}
                                    />
                                  </React.Fragment>
                                ))}
                            </Grid>

                            <CardActions
                              style={{ paddingLeft: 0, paddingRight: 0 }}
                            >
                              <Button
                                size="small"
                                variant="contained"
                                color="primary"
                                disabled={isSubmitting}
                                type="submit"
                              >
                                SEND{" "}
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                color="primary"
                                onClick={() => {
                                  setShowCommentBox(false);
                                  setFileUpload(null);
                                }}
                              >
                                CANCEL{" "}
                              </Button>{" "}
                              {startLoader && <CircularProgress />}
                            </CardActions>
                          </form>
                        );
                      }}
                    </Formik>
                  </Grid>
                )}
              </Grid>
              <Grid container>
                <Grid item md={12} xs={12}>
                  <Suspense fallback={<></>}>
                    <ViewDocument
                      {...props}
                      documents={currentProps.documents}
                      deleteAttachment={(id) => props.deleteAttachment(id)}
                    />
                  </Suspense>
                </Grid>
              </Grid>
            </>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

function Dropzone(props) {
  return (
    <DropzoneDialog
      maxFileSize={500000000}
      filesLimit={10}
      open={props.openDialog}
      onClose={() => props.setOpenDialog(false)}
      onSave={(file) => {
        props.setOpenDialog(false);
        props.setFieldValue("attach", file);
        props.setFileUpload(file);
      }}
      showPreviews
      showFileNamesInPreview
    />
  );
}
