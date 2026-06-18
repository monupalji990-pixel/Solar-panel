import React from 'react';
import CloseIcon from '@material-ui/icons/Close';
import GetAppIcon from '@material-ui/icons/GetApp';
import AttachmentIcon from '@material-ui/icons/Attachment';
import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

const useStyles = makeStyles(() => ({
    Spacing: {
        marginRight: 5,
        marginBottom: 5
    },
    DocButton: {
        borderRadius: '50%',
        padding: '0',
        minWidth: '32px',
        minHeight: '30px',
    },
}));

export default function viewFile(props) {

    const classes = useStyles();
    const { onClose, selectedValue, attachments, deleteAttachment } = props;
    const [open, setOpen] = React.useState(false);
    const [fileType, setFileType] = React.useState('');
    const [fileName, setFileName] = React.useState('');
    const [fileUrl, setFileUrl] = React.useState('');


    const handleClose = () => {
        onClose(selectedValue);
    };

    const OpenModal = (file) => {
        var filename = file.match(/^.*?([^\\/.]*)[^\\/]*$/)[1];
        setOpen(true);
        setFileType('xlsx');
        setFileName(filename);
        setFileUrl(file);
    }

    const downloadAttachment = async () => {
        try {
            const typeArray = {
                'png': 'image/png',
                'jpg': 'image/jpg',
                'jpeg': 'image/jpeg',
                'pdf': 'application/pdf',
                'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            };
            const blob = await fetch(fileUrl).then(r => r.blob());
            const a = document.createElement("a");
            a.style.display = "none";
            document.body.appendChild(a);
            a.href = window.URL.createObjectURL(new Blob([blob], { type: typeArray[fileType] }));
            a.setAttribute("download", fileName);
            a.click();
            window.URL.revokeObjectURL(a.href);
            document.body.removeChild(a);
        } catch (error) {
            const link: any = document.createElement('a');
            link.href = fileUrl;
            link.download = fileUrl;
            window.open(link, "_blank");
        }

    }

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={12}>
                <React.Fragment>
                    {attachments !== undefined && attachments &&
                        <React.Fragment>
                            <Chip
                                className={classes.Spacing}
                                avatar={<Avatar><AttachmentIcon /></Avatar>}
                                label="Standard-Flat-File"
                                onClick={() => OpenModal(attachments)}
                            />
                        </React.Fragment>
                    }
                </React.Fragment>

                <Dialog
                    open={open}
                    onClose={handleClose}
                    className="dialogSize"
                    aria-labelledby="form-dialog-title">

                    <DialogContent>
                        <Grid container direction="row" justify="flex-end" className="dialogButton" item xs={12} md={12}>
                            <Button className={classes.DocButton} variant="contained" onClick={() => downloadAttachment()}><GetAppIcon /></Button>
                            <Button className={classes.DocButton} variant="contained" onClick={() => setOpen(false)}><CloseIcon /></Button>
                        </Grid>
                        {/* <object data={fileUrl}></object> */}
                        <iframe src={`https://docs.google.com/viewer?url=${fileUrl}&embedded=true`} style={{ width: '100%', height: '500px' }}></iframe>

                    </DialogContent>
                </Dialog>
            </Grid>
        </Grid>
    );
};