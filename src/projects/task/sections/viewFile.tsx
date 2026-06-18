import React from "react";
import CloseIcon from "@material-ui/icons/Close";
import GetAppIcon from "@material-ui/icons/GetApp";
import DeleteForever from "@material-ui/icons/DeleteForever";
import AttachmentIcon from "@material-ui/icons/Attachment";
import Button from "@material-ui/core/Button";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Chip from "@material-ui/core/Chip";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import API from "../../users/redux/model/userAdmin";

const useStyles = makeStyles(() => ({
  Spacing: {
    marginRight: 5,
    marginBottom: 5,
  },
  DocButton: {
    borderRadius: "50%",
    padding: "0",
    minWidth: "40px",
    minHeight: "38px",
  },
}));

export default function viewFile(props) {
  const classes = useStyles();
  const { onClose, selectedValue, attachments, deleteAttachment } = props;
  const [open, setOpen] = React.useState(false);
  const [fileType, setFileType] = React.useState("");
  const [fileName, setFileName] = React.useState("");
  const [fileUrl, setFileUrl] = React.useState("");
  const [
    isFileDownloadInProgress,
    setIsFileDownloadInProgress,
  ] = React.useState(false);

  const downloadFileTypes = ["xlsx", "csv"];

  const handleClose = () => {
    onClose(selectedValue);
  };

  const OpenModal = (file) => {
    let attachmentFilename = file?.split('/').pop()
    let attachmentExtension = file?.split('.').pop()

    let ft = "";
    if (attachmentExtension === "application/pdf") {
      ft = "pdf";
    } else if (
      attachmentExtension ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      attachmentExtension === "application/vnd.ms-excel"
    ) {
      ft = "xlsx";
    } else if (attachmentExtension === "text/csv") {
      ft = "csv";
    } else {
      ft = "png";
    }
    setOpen(true);
    setFileType(ft);
    setFileName(attachmentFilename);
    setFileUrl(file);
  };

  const downloadAttachment = async () => {
    try {
      setIsFileDownloadInProgress(true);
      const typeArray = {
        png: "image/png",
        jpg: "image/jpg",
        jpeg: "image/jpeg",
        pdf: "application/pdf",
        xlsx:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      };
      const blob = await API.downloadFile(fileUrl);
      setIsFileDownloadInProgress(false);
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
    } catch (error) {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = fileUrl;
      window.open(fileUrl, "_blank");
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <React.Fragment>
          {attachments !== undefined &&
            attachments && (
              <React.Fragment>
                <Chip
                  className={classes.Spacing}
                  avatar={
                    <Avatar>
                      <AttachmentIcon />
                    </Avatar>
                  }
                  label={attachments?.split('/').pop()}
                  onClick={() => OpenModal(attachments)}
                />
              </React.Fragment>
            )}
        </React.Fragment>

        <Dialog
          open={open}
          onClose={handleClose}
          className="dialogSize"
          aria-labelledby="form-dialog-title"
        >
          <DialogContent>
            <Grid
              container
              direction="row"
              justify="flex-end"
              className="dialogButton"
              item
              xs={12}
              md={12}
            >
              {['admin', 'Admin'].includes(props.slug) && (
                <Button
                  className={classes.DocButton}
                  variant="contained"
                  onClick={() => deleteAttachment(fileName)}
                >
                  <DeleteForever />
                </Button>
              )}
              <Button
                className={classes.DocButton}
                variant="contained"
                disabled={isFileDownloadInProgress}
                onClick={() => downloadAttachment()}
              >
                {isFileDownloadInProgress ? (
                  <CircularProgress />
                ) : (
                  <GetAppIcon />
                )}
              </Button>
              <Button
                className={classes.DocButton}
                variant="contained"
                onClick={() => setOpen(false)}
              >
                <CloseIcon />
              </Button>
            </Grid>

            {downloadFileTypes.includes(fileType) ? (
              <div style={{ position: "absolute", top: "50%", left: "32%" }}>
                <h3>Please Download File to View Data!</h3>
              </div>
            ) : (
              <object data={fileUrl}></object>
            )}
          </DialogContent>
        </Dialog>
      </Grid>
    </Grid>
  );
}
