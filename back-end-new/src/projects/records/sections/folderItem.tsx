import React from "react";
import FolderIcon from "../assets/folder.png";
import {
  Dialog,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  makeStyles,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import ApiCall from "../redux/model/record";
import CloseIcon from "@material-ui/icons/Close";
import FolderListDialog from "./folderListDialog";

const useStyles = makeStyles((theme) => ({
  MoreMenuStyle: {
    position: "absolute",
    top: "-6px",
    right: "-9px",
  },
  fileNameStyle: {
    marginTop: "10px",
    display: "block",
    background: "#ededed",
    padding: "4px",
    fontSize: "14px",
    wordBreak: "break-word",
    cursor: "pointer",
  },
}));

interface Props {
  data: any;
  handleViewFolder: any;
  state: any;
  childState: any;
  currentData: any;
  showingFrom: any;
  type: any;
}

export default function folderItem({
  data,
  handleViewFolder,
  state,
  childState,
  showingFrom,
  currentData,
  type,
}: Props) {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [fileDialog, setFileDialog] = React.useState(false);

  const [msgState, setMsgState] = React.useState({
    messageShow: false,
    messageText: "",
  });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteFolder = () => {
    setAnchorEl(null);
    try {
      childState((prev) => ({ ...prev, isLoading: true }));

      ApiCall.deleteDriveFolderAPI(data._id).then((response: any) => {
        if (response.success) {
          childState((prev) => ({
            ...prev,
            messageShow: true,
            messageText: response.message,
          }));

          // Fetch Files and Folder List
          let obj: any = {};
          obj.limit = 20;
          obj.level = 0;
          obj.skip = 0;
          if (type?.value) obj.type = type?.value;

          ApiCall.driveListAPI(obj).then((res: any) => {
            if (res.success) {
              childState((prev) => ({
                ...prev,
                isLoading: false,
                list: res.data,
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

  const handleCloseMsg = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setMsgState((prevState) => ({
      ...prevState,
      messageShow: false,
      messageText: "",
    }));
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
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              setFileDialog(true);
            }}
          >
            Move
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleViewFolder(data);
              setAnchorEl(null);
            }}
          >
            Open
          </MenuItem>
          <MenuItem
            onClick={() => {
              childState({
                ...state,
                renameFolderDialog: true,
                selectedFolder: data,
              });
              setAnchorEl(null);
            }}
          >
            Rename Folder
          </MenuItem>
          <MenuItem onClick={handleDeleteFolder}>Delete</MenuItem>
        </Menu>
      </span>
      <div
        onClick={() => {
          handleViewFolder(data);
          setAnchorEl(null);
        }}
        style={{
          cursor: "pointer",
        }}
      >
        <img src={FolderIcon} alt="Folder Image" style={{ width: "42%" }} />
      </div>
      <span
        onClick={() => {
          handleViewFolder(data);
          setAnchorEl(null);
        }}
        className={classes.fileNameStyle}
      >
        {data.folderName || "N/A"}
      </span>

      <Dialog
        open={fileDialog}
        disableBackdropClick={true}
        onClose={() => setFileDialog(false)}
        aria-labelledby="alert-dialog-title"
        maxWidth="md"
        fullWidth
      >
        {/* <img src={data.file} /> */}
        <DialogTitle id="customized-dialog-title" style={{ paddingBottom: 0 }}>
          Move "{data.folderName}"
          <IconButton
            style={{ float: "right" }}
            aria-label="close"
            onClick={() => setFileDialog(false)}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <div>
          <FolderListDialog
            newState={state}
            childState={childState}
            type={type}
            currentFolder={data._id}
            setFileDialog={setFileDialog}
            setMsgState={setMsgState}
          />
        </div>
      </Dialog>

      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={msgState.messageShow}
        autoHideDuration={5000}
        message={msgState.messageText}
        onClose={handleCloseMsg}
      />
    </span>
  );
}
