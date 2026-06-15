import React, { useEffect, useState } from "react";
import Drawer from "@material-ui/core/Drawer";
import {
  Box,
  Button,
  CardActions,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Grid,
  IconButton,
  TextField,
  Typography,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/core";
import FolderItem from "../components/folderItem";
import FileItem from "../components/fileItem";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import CreateNewFolderIcon from "@material-ui/icons/CreateNewFolder";
import ApiCall from "../../../sharedUtils/sharedRedux/api";
import { DropzoneDialog } from "material-ui-dropzone";
import LinearProgress from "@material-ui/core/LinearProgress";
import axios from "axios";
import Snackbar from "@material-ui/core/Snackbar";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Formik } from "formik";
import * as Yup from "yup";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";

const useStyles = makeStyles((theme) => ({
  NoDataStyle: {
    width: "100%",
    textAlign: "center",
    marginTop: "40px",
  },
  main: {
    padding: 30,
  },
  drawerPaper: {
    height: "100%",
  },
  folderWrap: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
  },
  folderItem: {
    width: "12%",
    paddingTop: "15px",
    boxShadow: "0 0 9px 0px #ccc",
    textAlign: "center",
    borderRadius: "10px",
    position: "relative",
  },
  header: {
    display: "flex",
    justifyContent: "end",
    gap: "15px",
    marginBottom: "20px",
  },
  backdrop: {
    zIndex: 9999,
    color: "#fff",
  },
  BackBtnStyle: {
    position: "absolute",
  },
  LoadMoreBtn: {
    marginTop: 20,
    textAlign: "center",
  },
}));

export default function FileManager(props: any) {
  const classes = useStyles();

  return (
    <Drawer
      anchor={"bottom"}
      open={props.open == "manageFiles"}
      onClose={props.onClose.bind(this)}
      variant="temporary"
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <Grid container className={classes.main}>
        <Grid item xs={12}>
          <Button onClick={props.onClose.bind(this)} id="closeButton">
            <Chip
              color="primary"
              icon={<CloseIcon style={{ fontSize: "22px", color: "#fff" }} />}
              label={"File Manager"}
            />
          </Button>

          <FileManagerApp {...props} />
        </Grid>
      </Grid>
    </Drawer>
  );
}

function FileManagerApp(props) {
  const classes = useStyles();
  let baseURL;
  if (process.env.NODE_ENV === "development") {
    baseURL = "http://localhost:8087/api/";
  } else {
    baseURL = "/api/";
  }

  const [state, setState] = useState({
    fileModal: false,
    uploading: false, // Add a state to track uploading status
    uploadProgress: 0, // Add a state to track upload progress
    messageShow: false,
    messageText: "",
    isLoading: false,
    list: [],
    page: 1,
    isNext: false,
    createFolderDialog: false,
    submitLoader: false,
    folderBack: false,
    renameFolderDialog: false,
    selectedFolder: null,
    uploadedImageURLs: [],
    isReplaceTrue: false,
    replacedFileData: null,
  });

  useEffect(() => {
    // Fetch Files and Folder List
    setState((prev) => ({ ...prev, isLoading: true }));
    let obj: any = {};
    if (props.showingFrom === "Consumer") {
      obj.Consumer = props.currentData._id;
    }
    if (props.showingFrom === "Company") {
      obj.Company = props.currentData._id;
    }

    obj.limit = 20;
    obj.level = 0;
    obj.skip = 0;

    ApiCall.driveListAPI(obj).then((response: any) => {
      if (response.success) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          list: response.data,
          isNext: response.isNext,
        }));
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    });
  }, []);

  const updateReplaceFile = (uploadedURLs) => {
    let obj: any = [];

    if (uploadedURLs?.length > 0) {
      uploadedURLs.map((e, index) => {
        if (state.selectedFolder?._id) {
          obj.push({
            file: e.url,
            fileName: e.name,
            folder: state.selectedFolder?._id,
          });
        } else {
          obj.push({
            file: e.url,
            fileName: e.name,
          });
        }
      });
    }

    ApiCall.driveRenameFolderAPI(state.replacedFileData?._id, obj[0]).then(
      (response: any) => {
        if (response.success) {
          setState((prevState) => ({
            ...prevState,
            uploading: false,
            uploadProgress: 0,
            messageShow: true,
            messageText: "File Replaced Successfully!",
            isReplaceTrue: false,
            replacedFileData: null,
          }));

          // Fetch Files and Folder List
          setState((prev) => ({
            ...prev,
            isLoading: true,
            isReplaceTrue: false,
            replacedFileData: null,
          }));
          let dataObj: any = {};

          dataObj.limit = 20;
          if (props.showingFrom === "Consumer") {
            dataObj.Consumer = props.currentData._id;
          }
          if (props.showingFrom === "Company") {
            dataObj.Company = props.currentData._id;
          }
          if (state.selectedFolder?._id) {
            dataObj.level = 1;
            dataObj.folder = state.selectedFolder?._id;
          } else {
            dataObj.level = 0;
          }
          dataObj.skip = 0;

          ApiCall.driveListAPI(dataObj).then((response: any) => {
            if (response.success) {
              setState((prev) => ({
                ...prev,
                isLoading: false,
                list: response.data,
                isNext: response.isNext,
                isReplaceTrue: false,
                replacedFileData: null,
              }));
            } else {
              setState((prev) => ({ ...prev, isLoading: false }));
            }
          });
        }
      }
    );
  };

  const handleSave = async (files) => {
    const uploadedURLs = [];
    let successfullyUploadedCount = 0;

    setState((prevState) => ({
      ...prevState,
      uploading: true,
      fileModal: false,
    }));

    try {
      for (const file of files) {
        // Send files to your API for upload
        const data = new FormData();
        data.append("image", file);

        const config = {
          onUploadProgress: function (progressEvent) {
            const { loaded, total } = progressEvent;
            const percent = (loaded * 100) / total;
            setState((prevState) => ({
              ...prevState,
              uploadProgress: Math.round(percent),
            }));
          },
        };

        const response = await axios.post(`${baseURL}upload`, data, {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
          ...config,
        });

        const imageURL = response.data?.data?.image[0]?.location;
        const imageName = response.data?.data?.image[0]?.originalname;

        uploadedURLs.push(imageURL);
        successfullyUploadedCount += 1;
      }
      setState((prevState) => ({
        ...prevState,
        uploadedImageURLs: uploadedURLs,
      }));

      if (successfullyUploadedCount === files.length && !state.isReplaceTrue) {
        AddAllFilesToFolder(uploadedURLs);
      }

      if (state.isReplaceTrue) {
        updateReplaceFile(uploadedURLs);
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      // Handle error if the upload fails
      setState((prevState) => ({
        ...prevState,
        uploading: false,
        uploadProgress: 0,
      }));
    }
  };

  const AddAllFilesToFolder = (uploadedURLs) => {
    let obj: any = [];
    if (uploadedURLs.length > 0) {
      uploadedURLs.map((e, index) => {
        if (props.showingFrom === "Consumer") {
          if (state.selectedFolder?._id) {
            obj.push({
              Consumer: props.currentData._id,
              file: e,
              folder: state.selectedFolder?._id,
            });
          } else {
            obj.push({
              Consumer: props.currentData._id,
              file: e,
            });
          }
        } else {
          if (state.selectedFolder?._id) {
            obj.push({
              Company: props.currentData._id,
              file: e,
              folder: state.selectedFolder?._id,
            });
          } else {
            obj.push({
              Company: props.currentData._id,
              file: e,
            });
          }
        }
      });
    }

    ApiCall.driveAddFileAPI(obj).then((response: any) => {
      if (response.success) {
        setState((prevState) => ({
          ...prevState,
          uploading: false,
          uploadProgress: 0,
          messageShow: true,
          messageText: "File Uploaded Successfully!",
        }));

        // Fetch Files and Folder List
        setState((prev) => ({ ...prev, isLoading: true }));
        let dataObj: any = {};
        if (props.showingFrom === "Consumer") {
          dataObj.Consumer = props.currentData._id;
        }
        if (props.showingFrom === "Company") {
          dataObj.Company = props.currentData._id;
        }

        dataObj.limit = 20;

        if (state.selectedFolder?._id) {
          dataObj.level = 1;
          dataObj.folder = state.selectedFolder?._id;
        } else {
          dataObj.level = 0;
        }
        dataObj.skip = 0;

        ApiCall.driveListAPI(dataObj).then((response: any) => {
          if (response.success) {
            setState((prev) => ({
              ...prev,
              isLoading: false,
              list: response.data,
              isNext: response.isNext,
            }));
          } else {
            setState((prev) => ({ ...prev, isLoading: false }));
          }
        });
      }
    });
  };

  const handleClose = () => {
    setState({ ...state, fileModal: false });
  };

  const LinearProgressWithLabel = (props) => {
    return (
      <Box display="flex" alignItems="center">
        <Box width="100%" mr={1}>
          <LinearProgress variant="determinate" {...props} />
        </Box>
        <Box minWidth={35}>
          <Typography variant="body2" color="textSecondary">{`${Math.round(
            props.value
          )}%`}</Typography>
        </Box>
      </Box>
    );
  };

  const handleCloseMsg = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setState((prevState) => ({
      ...prevState,
      messageShow: false,
      messageText: "",
    }));
  };

  const handleViewFolder = (data) => {
    // Fetch Files and Folder List
    setState((prev) => ({ ...prev, isLoading: true, selectedFolder: data }));
    let obj: any = {};
    if (props.showingFrom === "Consumer") {
      obj.Consumer = props.currentData._id;
    }
    if (props.showingFrom === "Company") {
      obj.Company = props.currentData._id;
    }

    obj.folder = data._id;
    obj.limit = 20;
    obj.level = 1;
    obj.skip = 0;

    ApiCall.driveListAPI(obj).then((response: any) => {
      if (response.success) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          list: response.data,
          folderBack: true,
          isNext: response.isNext,
        }));
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    });
  };

  const handleBackFolder = () => {
    // Fetch Files and Folder List
    setState((prev) => ({
      ...prev,
      isLoading: true,
      selectedFolder: null,
      page: 1,
    }));
    let obj: any = {};
    if (props.showingFrom === "Consumer") {
      obj.Consumer = props.currentData._id;
    }
    if (props.showingFrom === "Company") {
      obj.Company = props.currentData._id;
    }

    obj.limit = 20;
    obj.level = 0;
    obj.skip = 0;

    ApiCall.driveListAPI(obj).then((response: any) => {
      if (response.success) {
        setState({
          ...state,
          isLoading: false,
          list: response.data,
          folderBack: false,
          selectedFolder: null,
          isNext: response.isNext,
          page: 1,
        });
      } else {
        setState((prev) => ({ ...prev, isLoading: false, page: 1 }));
      }
    });
  };

  const loadMoreData = () => {
    // Fetch Files and Folder List
    setState((prev) => ({ ...prev, isLoading: true }));
    let obj: any = {};
    if (props.showingFrom === "Consumer") {
      obj.Consumer = props.currentData._id;
    }
    if (props.showingFrom === "Company") {
      obj.Company = props.currentData._id;
    }

    obj.limit = 20;
    obj.skip = state.list.length;
    if (state.selectedFolder?._id) {
      obj.level = 1;
      obj.folder = state.selectedFolder?._id;
    } else {
      obj.level = 0;
    }

    ApiCall.driveListAPI(obj).then((response: any) => {
      if (response.success) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          list: [...state.list, ...response.data],
          isNext: response.isNext,
          page: state.page + 1,
        }));
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    });
  };

  return (
    <React.Fragment>
      <Backdrop className={classes.backdrop} open={state.isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {state.folderBack && (
        <div className={classes.BackBtnStyle}>
          <IconButton aria-label="delete" onClick={handleBackFolder}>
            <KeyboardBackspaceIcon />
          </IconButton>
          <span>Back</span>
        </div>
      )}

      <div className={classes.header}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<CreateNewFolderIcon />}
          onClick={() =>
            setState((prev) => ({ ...prev, createFolderDialog: true }))
          }
        >
          Create Folder
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setState({ ...state, fileModal: true });
          }}
          startIcon={<CloudUploadIcon />}
        >
          Upload Files
        </Button>
      </div>

      {/* Display loading indicator while uploading */}
      {state.uploading && (
        <div>
          <p>Uploading...</p>
          <LinearProgressWithLabel value={state.uploadProgress} />
        </div>
      )}

      <div className={classes.folderWrap}>
        {state.list.length > 0 ? (
          state.list.map((e, index) => (
            <div key={index} className={classes.folderItem}>
              {e.folderName ? (
                <FolderItem
                  data={e}
                  handleViewFolder={handleViewFolder}
                  state={state}
                  childState={setState}
                  showingFrom={props.showingFrom}
                  currentData={props.currentData}
                />
              ) : (
                <FileItem
                  data={e}
                  childState={setState}
                  initiaState={state}
                  showingFrom={props.showingFrom}
                  currentData={props.currentData}
                />
              )}
            </div>
          ))
        ) : (
          <span className={classes.NoDataStyle}>No Data Found</span>
        )}
      </div>

      {state.isNext && (
        <div className={classes.LoadMoreBtn}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={loadMoreData}
          >
            View More
          </Button>
        </div>
      )}

      {/* File Upload DropzoneDialog Component */}
      <DropzoneDialog
        cancelButtonText={"cancel"}
        submitButtonText={"submit"}
        maxFileSize={500000000}
        open={state.fileModal}
        onClose={handleClose}
        onSave={handleSave}
        showPreviewsInDropzone={true}
        showPreviews={false}
        useChipsForPreview={true}
        filesLimit={100}
      />

      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={state.messageShow}
        autoHideDuration={5000}
        message={state.messageText}
        onClose={handleCloseMsg}
      />

      {/* Create New Folder Component */}

      <Dialog
        open={state.createFolderDialog}
        disableBackdropClick={true}
        fullWidth={true}
        maxWidth={"sm"}
        onClose={() =>
          setState((prev) => ({ ...prev, createFolderDialog: false }))
        }
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle id="alert-dialog-title">Create New Folder</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={{
              name: "",
            }}
            onSubmit={(value) => {
              try {
                setState((prev) => ({ ...prev, submitLoader: true }));
                let newObj: any = {};
                if (props.showingFrom === "Consumer") {
                  newObj.Consumer = props.currentData._id;
                }
                if (props.showingFrom === "Company") {
                  newObj.Company = props.currentData._id;
                }
                if (state.selectedFolder?._id) {
                  newObj.folder = state.selectedFolder?._id;
                  newObj.level = 1;
                }

                newObj.folderName = value.name;

                ApiCall.driveAddFolderAPI(newObj).then((response: any) => {
                  if (response.success) {
                    setState((prev) => ({
                      ...prev,
                      submitLoader: false,
                      messageShow: true,
                      messageText: response.message,
                      createFolderDialog: false,
                    }));

                    // Fetch Files and Folder List
                    setState((prev) => ({ ...prev, isLoading: true }));
                    let obj: any = {};
                    if (props.showingFrom === "Consumer") {
                      obj.Consumer = props.currentData._id;
                    }
                    if (props.showingFrom === "Company") {
                      obj.Company = props.currentData._id;
                    }

                    obj.limit = 20;
                    if (state.selectedFolder?._id) {
                      obj.level = 1;
                      obj.folder = state.selectedFolder?._id;
                    } else {
                      obj.level = 0;
                    }
                    obj.skip = 0;

                    ApiCall.driveListAPI(obj).then((response: any) => {
                      if (response.success) {
                        setState((prev) => ({
                          ...prev,
                          isLoading: false,
                          list: response.data,
                        }));
                      } else {
                        setState((prev) => ({ ...prev, isLoading: false }));
                      }
                    });
                  } else {
                    setState((prev) => ({ ...prev, submitLoader: false }));
                  }
                });
              } catch (error) {
                console.log("error", error);
              }
            }}
            validationSchema={Yup.object().shape({
              name: Yup.string()
                .nullable()
                .required("Please enter a folder name"),
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
                  <TextField
                    variant="outlined"
                    error={!!(errors.name && touched.name)}
                    label="Folder Name"
                    name="name"
                    className="WidhtFull100"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="name-error"
                    size="small"
                  />
                  {errors.name && touched.name && (
                    <FormHelperText className="errormsg" id="name-error">
                      {errors.name}
                    </FormHelperText>
                  )}

                  <CardActions style={{ marginTop: 20 }}>
                    <Button
                      size="medium"
                      variant="contained"
                      type="reset"
                      onClick={() => {
                        setState((prev) => ({
                          ...prev,
                          createFolderDialog: false,
                        }));
                        handleReset();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="medium"
                      variant="contained"
                      color="primary"
                      type="submit"
                    >
                      Create
                    </Button>
                    {state.submitLoader && <CircularProgress />}
                  </CardActions>
                </form>
              );
            }}
          </Formik>
        </DialogContent>
      </Dialog>

      {/* Re-Name Folder Component */}

      <Dialog
        open={state.renameFolderDialog}
        disableBackdropClick={true}
        fullWidth={true}
        maxWidth={"sm"}
        onClose={() =>
          setState((prev) => ({ ...prev, renameFolderDialog: false }))
        }
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle id="alert-dialog-title">Rename Folder</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={{
              name: "",
            }}
            onSubmit={(value) => {
              try {
                setState((prev) => ({ ...prev, submitLoader: true }));
                let obj: any = {};
                let folderId = state.selectedFolder._id;
                if (props.showingFrom === "Consumer") {
                  obj.Consumer = props.currentData._id;
                }
                if (props.showingFrom === "Company") {
                  obj.Company = props.currentData._id;
                }

                obj.folderName = value.name;

                ApiCall.driveRenameFolderAPI(folderId, obj).then(
                  (response: any) => {
                    if (response.success) {
                      setState((prev) => ({
                        ...prev,
                        submitLoader: false,
                        messageShow: true,
                        messageText: response.message,
                        renameFolderDialog: false,
                      }));

                      // Fetch Files and Folder List
                      setState((prev) => ({ ...prev, isLoading: true }));
                      let obj: any = {};
                      if (props.showingFrom === "Consumer") {
                        obj.Consumer = props.currentData._id;
                      }
                      if (props.showingFrom === "Company") {
                        obj.Company = props.currentData._id;
                      }

                      obj.limit = 20;
                      obj.level = 0;
                      obj.skip = 0;

                      ApiCall.driveListAPI(obj).then((response: any) => {
                        if (response.success) {
                          setState((prev) => ({
                            ...prev,
                            isLoading: false,
                            list: response.data,
                          }));
                        } else {
                          setState((prev) => ({ ...prev, isLoading: false }));
                        }
                      });
                    } else {
                      setState((prev) => ({ ...prev, submitLoader: false }));
                    }
                  }
                );
              } catch (error) {
                console.log("error", error);
              }
            }}
            validationSchema={Yup.object().shape({
              name: Yup.string()
                .nullable()
                .required("Please enter a folder name"),
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
                  <TextField
                    variant="outlined"
                    error={!!(errors.name && touched.name)}
                    label="Folder Name"
                    name="name"
                    className="WidhtFull100"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="name-error"
                    size="small"
                  />
                  {errors.name && touched.name && (
                    <FormHelperText className="errormsg" id="name-error">
                      {errors.name}
                    </FormHelperText>
                  )}

                  <CardActions style={{ marginTop: 20 }}>
                    <Button
                      size="medium"
                      variant="contained"
                      type="reset"
                      onClick={() => {
                        setState((prev) => ({
                          ...prev,
                          renameFolderDialog: false,
                        }));
                        handleReset();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="medium"
                      variant="contained"
                      color="primary"
                      type="submit"
                    >
                      Submit
                    </Button>
                    {state.submitLoader && <CircularProgress />}
                  </CardActions>
                </form>
              );
            }}
          </Formik>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
