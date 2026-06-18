import React, { useState } from "react";
import { FileIcon, defaultStyles } from "react-file-icon";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import {
  Dialog,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  makeStyles,
} from "@material-ui/core";
import FileViewer from "react-file-viewer";
import CloseIcon from "@material-ui/icons/Close";
import GetAppIcon from "@material-ui/icons/GetApp";
import ApiCall from "../../../sharedUtils/sharedRedux/api";

interface Props {
  data: any;
  childState: any;
  showingFrom: any;
  currentData: any;
  initiaState: any;
}

const useStyles = makeStyles((theme) => ({
  fileNameStyle: {
    marginTop: "10px",
    display: "block",
    background: "#ededed",
    padding: "4px",
    fontSize: "14px",
    wordBreak: "break-word",
  },
  MoreMenuStyle: {
    position: "absolute",
    top: "-6px",
    right: "-9px",
  },
}));

export default function fileItem({
  data,
  childState,
  showingFrom,
  currentData,
  initiaState,
}: Props) {
  const classes = useStyles();

  let fileExtension = data.file ? data.file.split(".").pop() : "";
  // var filename = data.fileName ? data.fileName : "No File name";
  var filename = data.file ? data.file.replace(/^.*[\\/]/, "") : "";
  const [error, setError] = useState(null);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const [state, setState] = useState({
    previewDialog: false,
  });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenFilePreview = () => {
    setState((prev) => ({ ...prev, previewDialog: true }));
  };

  const onError = (e) => {
    setError("Error loading file. Please try again.");
  };

  const handleDownloadFile = () => {
    fetch(data.file)
      .then((response) => response.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        link.click();
      })
      .catch((error) => console.error("Error downloading file:", error));
  };

  const handleDeleteFile = () => {
    setAnchorEl(null);
    try {
      let obj: any = {};
      if (showingFrom === "Consumer") {
        obj.Consumer = currentData._id;
      }
      if (showingFrom === "Company") {
        obj.Company = currentData._id;
      }
      childState((prev) => ({ ...prev, isLoading: true }));

      ApiCall.deleteDriveFileAPI(data._id).then((response: any) => {
        if (response.success) {
          childState((prev) => ({
            ...prev,
            messageShow: true,
            messageText: response.message,
          }));

          // Fetch Files and Folder List
          let obj: any = {};
          if (showingFrom === "Consumer") {
            obj.Consumer = currentData._id;
          }
          if (showingFrom === "Company") {
            obj.Company = currentData._id;
          }

          obj.limit = 20;
          if (initiaState.selectedFolder?._id) {
            obj.folder = initiaState.selectedFolder?._id;
          }
          if (initiaState.selectedFolder?._id) {
            obj.level = 1;
          } else {
            obj.level = 0;
          }
          obj.skip = 0;

          ApiCall.driveListAPI(obj).then((response: any) => {
            if (response.success) {
              childState((prev) => ({
                ...prev,
                isLoading: false,
                list: response.data,
              }));
            } else {
              childState((prev) => ({ ...prev, isLoading: false }));
            }
          });
        } else {
          if (response.message) {
            childState((prev) => ({
              ...prev,
              isLoading: false,
              messageShow: true,
              messageText: response.message,
            }));
          } else {
            childState((prev) => ({ ...prev, isLoading: false }));
          }
        }
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleReplaceFile = () => {
    childState((prev) => ({
      ...prev,
      fileModal: true,
      isReplaceTrue: true,
      replacedFileData: data,
    }));
    setAnchorEl(null);
  };

  return (
    <span>
      <span className={classes.MoreMenuStyle}>
        <IconButton
          aria-label="more"
          aria-controls="long-menu"
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleReplaceFile}>Replace</MenuItem>
          <MenuItem onClick={handleOpenFilePreview}>Preview</MenuItem>
          <MenuItem onClick={handleDownloadFile}>Download</MenuItem>
          <MenuItem onClick={handleDeleteFile}>Delete</MenuItem>
        </Menu>
      </span>
      <div style={{ width: "35%", margin: "0 auto" }}>
        <FileIcon extension={fileExtension} {...defaultStyles[fileExtension]} />
      </div>
      <span className={classes.fileNameStyle}>{filename}</span>

      {/* Preview File Dialog */}

      <Dialog
        open={state.previewDialog}
        disableBackdropClick={true}
        onClose={() => setState((prev) => ({ ...prev, previewDialog: false }))}
        aria-labelledby="alert-dialog-title"
        maxWidth="lg" // Set the max width of the Dialog
        fullWidth // Make the Dialog full-width
      >
        {/* <img src={data.file} /> */}
        <DialogTitle id="customized-dialog-title" style={{ paddingBottom: 0 }}>
          Preview
          <IconButton
            style={{ float: "right" }}
            aria-label="close"
            onClick={() =>
              setState((prev) => ({ ...prev, previewDialog: false }))
            }
          >
            <CloseIcon />
          </IconButton>
          <IconButton
            style={{ float: "right" }}
            aria-label="close"
            onClick={handleDownloadFile}
          >
            <GetAppIcon />
          </IconButton>
        </DialogTitle>
        <div
          style={{
            width: "800px",
            height: "600px",
            margin: "0 auto",
            overflow: "hidden",
          }}
        >
          {error && <div>{error}</div>}
          <FileViewer
            fileType={fileExtension}
            filePath={data.file}
            onError={onError}
          />
        </div>
      </Dialog>
    </span>
  );
}
