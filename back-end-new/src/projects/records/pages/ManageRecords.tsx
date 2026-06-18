import React, { useEffect, useState } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {
  Backdrop,
  Box,
  Button,
  CardActions,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Grid,
  IconButton,
  LinearProgress,
  Snackbar,
  TextField,
  Typography,
} from "@material-ui/core";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import ApiCall from "../redux/model/record";
import CreateNewFolderIcon from "@material-ui/icons/CreateNewFolder";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import FolderItem from "../sections/folderItem";
import FileItem from "../sections/fileItem";
import { DropzoneDialog } from "material-ui-dropzone";
import axios from "axios";
import { Formik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { RecordTypes } from "sharedUtils/globalHelper/constantValues";
import NotDataImg from "../assets/no-record-found.png";

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

export function ManageRecords(props) {
  let baseURL;
  if (process.env.NODE_ENV === "development") {
    baseURL = "http://localhost:8087/api/";
  } else {
    baseURL = "/api/";
  }

  const classes = useStyles();

  useEffect(() => {
    props.setBreadCrumbs([
      {
        name: "Dashboard",
        isClickable: true,
        url: `/dashboard/${props.slug}`,
      },
      { name: "Records" },
    ]);

    // Fetch Files and Folder List
    let obj: any = {};
    obj.limit = 20;
    obj.level = 0;
    obj.skip = 0;
    obj.type = "test";
    setState((prev) => ({ ...prev, isLoading: true }));

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

  const [selectedType, setSelectedType]: any = useState(null);
  const [clearType, setClearType]: any = useState(false);

  useEffect(() => {
    if (clearType) {
      // Fetch Files and Folder List
      let obj: any = {};
      obj.limit = 20;
      obj.level = 0;
      obj.skip = 0;
      obj.type = "test";
      setState((prev) => ({ ...prev, isLoading: true }));

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
      setClearType(false);
    }
  }, [clearType]);

  const handleBackFolder = () => {
    // Fetch Files and Folder List
    setState((prev) => ({
      ...prev,
      isLoading: true,
      selectedFolder: null,
      page: 1,
    }));
    let obj: any = {};

    obj.limit = 20;
    obj.level = 0;
    obj.skip = 0;
    if (selectedType?.value) obj.type = selectedType?.value;

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

  const handleViewFolder = (data) => {
    // Fetch Files and Folder List
    setState((prev) => ({ ...prev, isLoading: true, selectedFolder: data }));
    let obj: any = {};

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

  const loadMoreData = () => {
    // Fetch Files and Folder List
    setState((prev) => ({ ...prev, isLoading: true }));
    let obj: any = {};

    obj.limit = 20;
    obj.skip = state.list.length;
    if (state.selectedFolder?._id) {
      obj.level = 1;
      obj.folder = state.selectedFolder?._id;
    } else {
      obj.level = 0;
    }
    if (selectedType?.value) obj.type = selectedType?.value;

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

  const handleClose = () => {
    setState({ ...state, fileModal: false });
  };

  function updateFileName(fileName) {
    // Split the file name into name and extension
    const [name, extension] = fileName.split(".");

    const oldFileName = state?.replacedFileData?.fileName;
    let baseName, version, date;
    if (oldFileName) {
      const [oldName, oldExtension] = oldFileName.split(".");

      // Regular expression to extract the base name and current version (if any)
      const versionRegex = /_(V\d+)_(\d{2}-\d{2}-\d{4})$/;
      const match = oldName?.match(versionRegex);

      if (match) {
        // If there's a version, extract the base name and current version
        baseName = name.slice(0, match.index);
        version = parseInt(match[1].slice(1)) + 1; // Increment the version number
      } else {
        // If no version, start with V1 and get today's date
        baseName = name;
        version = 1;
      }
    } else {
      // If no existing file, start with V1 and get today's date
      baseName = name;
      version = 1;
    }

    // Always get today's date for the new version
    const today = new Date();
    date = `${today.getDate().toString().padStart(2, "0")}-${(
      today.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${today.getFullYear()}`;

    // Construct the new file name
    const newFileName = `${baseName}_V${version}_${date}.${extension}`;

    return newFileName;
  }

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
            const percent = Math.min((loaded * 100) / total, 100);
            // ((loaded * 100) / total)
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

        uploadedURLs.push({ url: imageURL, name: updateFileName(imageName) });
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
    // finally {
    //   setState((prevState) => ({ ...prevState, uploading: false, uploadProgress: 0 }));
    // }
  };

  const updateReplaceFile = (uploadedURLs) => {
    let obj: any = [];

    if (uploadedURLs?.length > 0) {
      uploadedURLs.map((e, index) => {
        if (state.selectedFolder?._id) {
          obj.push({
            file: e.url,
            fileName: e.name,
            folder: state.selectedFolder?._id,
            type: selectedType?.value,
          });
        } else {
          obj.push({
            file: e.url,
            fileName: e.name,
            type: selectedType?.value,
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

          if (state.selectedFolder?._id) {
            dataObj.level = 1;
            dataObj.folder = state.selectedFolder?._id;
          } else {
            dataObj.level = 0;
          }
          dataObj.skip = 0;
          if (selectedType?.value) dataObj.type = selectedType?.value;

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

  const AddAllFilesToFolder = (uploadedURLs) => {
    let obj: any = [];

    if (uploadedURLs.length > 0) {
      uploadedURLs.map((e, index) => {
        if (state.selectedFolder?._id) {
          obj.push({
            file: e.url,
            fileName: e.name,
            folder: state.selectedFolder?._id,
            type: selectedType?.value,
          });
        } else {
          obj.push({
            file: e.url,
            fileName: e.name,
            type: selectedType?.value,
          });
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

        dataObj.limit = 20;

        if (state.selectedFolder?._id) {
          dataObj.level = 1;
          dataObj.folder = state.selectedFolder?._id;
        } else {
          dataObj.level = 0;
        }
        dataObj.skip = 0;
        if (selectedType?.value) dataObj.type = selectedType?.value;

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

  const handleChangeRecordType = (options) => {
    setSelectedType(options);

    // Fetch Files and Folder List
    let obj: any = {};
    obj.limit = 20;
    obj.level = 0;
    obj.skip = 0;
    if (options.value) obj.type = options.value;
    setState((prev) => ({ ...prev, isLoading: true }));

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
  };

  const customStyles = {
    control: (styles) => ({
      ...styles,
      color: "#000000",
      width: 250,
      marginRight: 15,
    }),
    placeholder: (styles) => ({ ...styles, color: "#000000" }),
    singleValue: (styles) => ({ ...styles, color: "#000000" }),
    input: (styles) => ({ ...styles, color: "#000000" }),
    option: (provided, state) => ({
      ...provided,
    }),
  };

  return (
    <React.Fragment>
      <Backdrop className={classes.backdrop} open={state.isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Back Button */}
      {state.folderBack && (
        <div className={classes.BackBtnStyle}>
          <IconButton aria-label="delete" onClick={handleBackFolder}>
            <KeyboardBackspaceIcon />
          </IconButton>
          <span>Back</span>
        </div>
      )}

      {/* Header Buttons */}
      <div className={classes.header}>
        {!state.folderBack && (
          <Select
            id="recordType"
            style={{ width: 250 }}
            placeholder="Select Type"
            value={selectedType}
            styles={customStyles}
            aria-describedby="assignee-number-error"
            onChange={(selectedOption, triggeredAction) => {
              if (triggeredAction.action === "clear") {
                setClearType(true);
                setSelectedType(null);
              } else {
                setClearType(false);
                handleChangeRecordType(selectedOption);
              }
            }}
            name="recordType"
            isClearable={true}
            options={RecordTypes}
          />
        )}

        {/* {!state.folderBack && */}
        <Button
          variant="contained"
          color="primary"
          startIcon={<CreateNewFolderIcon />}
          onClick={() => {
            if (selectedType?.value) {
              setState((prev) => ({ ...prev, createFolderDialog: true }));
            } else {
              setState((prevState) => ({
                ...prevState,
                messageShow: true,
                messageText: "Please select record type first!",
              }));
              return;
            }
          }}
        >
          Create Folder
        </Button>
        {/* } */}

        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            if (selectedType?.value) {
              setState({ ...state, fileModal: true });
            } else {
              setState((prevState) => ({
                ...prevState,
                messageShow: true,
                messageText: "Please select record type first!",
              }));
              return;
            }
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
                  type={selectedType}
                />
              ) : (
                <FileItem
                  data={e}
                  childState={setState}
                  initiaState={state}
                  type={selectedType}
                  showingFrom={props.showingFrom}
                  currentData={props.currentData}
                />
              )}
            </div>
          ))
        ) : (
          <span className={classes.NoDataStyle}>
            <img src={NotDataImg} alt="No Data Found" />
          </span>
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
            Load More
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
                newObj.folderName = value.name;
                newObj.type = selectedType?.value;
                if (state.selectedFolder?._id) {
                  newObj.folder = state.selectedFolder?._id;
                  newObj.level = 1;
                }

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
                    obj.limit = 20;
                    if (state.selectedFolder?._id) {
                      obj.level = 1;
                      obj.folder = state.selectedFolder?._id;
                    } else {
                      obj.level = 0;
                    }
                    obj.skip = 0;
                    if (selectedType?.value) obj.type = selectedType?.value;

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
                handleChange,
                handleBlur,
                handleSubmit,
                handleReset,
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
                let newObj: any = {};
                let folderId = state.selectedFolder._id;
                newObj.folderName = value.name;

                ApiCall.driveRenameFolderAPI(folderId, newObj).then(
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

                      obj.limit = 20;
                      obj.level = 0;
                      obj.skip = 0;
                      if (selectedType?.value) obj.type = selectedType?.value;

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
    </React.Fragment>
  );
}
