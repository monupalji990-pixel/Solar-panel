import React, { useState, lazy, Suspense } from 'react';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import CardActions from '@material-ui/core/CardActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import Select from 'react-select';
import { helperMethods } from '../../../sharedUtils/globalHelper/helperMethod'
import { TaskStatus, TaskValueToStatus } from '../../../sharedUtils/globalHelper/constantValues';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import InputAdornment from '@material-ui/core/InputAdornment';
import { DropzoneDialog } from 'material-ui-dropzone';
import ImageIcon from '@material-ui/icons/Image';
import Chip from '@material-ui/core/Chip';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const useStyles = makeStyles(() => ({
    marginSpacing: {
        marginTop: 10,
        marginBottom: 5
    },
    paddingSpacing: {
        padding: 15
    },
    CommentStatusField: {
        width: '100%',
    }
}));

export default function addComment(props) {

    const classes = useStyles();

    const [startLoader, setStartLoader] = useState(false);
    const [showActions, setShowActions] = useState<any>('');
    const [selectedNoteTabs, setselectedNoteTabs] = React.useState('comment');
    const [showCommentBox, setShowCommentBox] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [fileUpload, setFileUpload] = useState(null);
    const [CommentLine, setCommentLine] = useState(true);

    if (props.notHideSideBar && startLoader) {
        props._notCloseSideBar(false);
        setStartLoader(false);
        setShowActions(false);
    }

    const FileUpload = (file) => {
        setFileUpload(file);
    }

    const tabHandleChangeNote = (event, newValue) => {
        setselectedNoteTabs(newValue);
    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
    }
    const handleOpenDialog = () => {
        setOpenDialog(true);
    }

    const handleSaveFile = (files) => {
        setFileUpload(files);
        setOpenDialog(false);
    }

    return (
        <div className="app">
            <Grid item md={12} xs={12}>
                <Paper>
                    <Tabs className="notesTabStyle" variant="scrollable" scrollButtons="auto" value={selectedNoteTabs} onChange={tabHandleChangeNote} aria-label="simple tabs example">
                        <Tab label="Comment" value="comment" />
                    </Tabs>
                </Paper>

                {selectedNoteTabs === 'comment' &&
                    <>
                        <Grid container component={Paper} className={classes.marginSpacing}>
                            {CommentLine === true && showCommentBox === false &&
                                <Grid item md={12} xs={12} className={classes.paddingSpacing}>
                                    <TextField
                                        id="standard-multiline-flexible"
                                        multiline
                                        rowsMax={4}
                                        value="Leave a comment..."
                                        className="WidhtFull100 commentInputStyle"
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        style={{ border: 0 }}
                                        onClick={() => setShowCommentBox(true)}
                                    />
                                </Grid>
                            }
                            {showCommentBox === true &&
                                <Grid item md={12} xs={12} className={classes.paddingSpacing}>
                                    <Formik
                                        initialValues={{
                                            Comment: '',
                                            Status : null,
                                            ReminderType : null
                                        }}
                                        onSubmit={(values, { resetForm }) => {
                                            const data = new FormData()
                                            const taskId = props.currentTask._id
                                            data.set('TaskID', taskId);
                                            data.set('Description', values.Comment);
                                            if (values.Status) {
                                                data.set('Status', values.Status ? values.Status.value : '');
                                                let ns = values.Status.value
                                                if (Number(props.currentTask.Status) !== Number(ns)) {
                                                    let History = helperMethods.CreateStatusHistory(
                                                        TaskValueToStatus[props.currentTask.Status],
                                                        TaskValueToStatus[ns],
                                                    );
                                                    data.set('History', History);
                                                }
                                            }
                                            for (var x = 0; x < fileUpload.length; x++) {
                                                data.append('Attachments', fileUpload[x])
                                            }
                                            setStartLoader(true);
                                            props._addComment(data)
                                            resetForm();
                                        }}
                                        validationSchema={Yup.object().shape({
                                            Comment: Yup.string().required('The Message text is empty.'),
                                        })}
                                    >
                                        {props => {
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
                                                    <Grid item md={12} sm={12}>
                                                        <TextField
                                                            variant="outlined"
                                                            error={!!(errors.Comment && touched.Comment)}
                                                            name="Comment"
                                                            multiline
                                                            rows={3}
                                                            value={values.Comment}
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            className="WidhtFull100"
                                                            margin="normal"
                                                            aria-describedby="Comment-error"
                                                            InputProps={{
                                                                endAdornment: (
                                                                    <InputAdornment position="start">
                                                                        <Tooltip onClick={() => handleOpenDialog()} title="Upload Files">
                                                                            <IconButton>
                                                                                <AttachFileIcon />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    </InputAdornment>
                                                                ),
                                                            }}
                                                        />
                                                        {errors.Comment && touched.Comment && (
                                                            <FormHelperText className="errormsg" id="Comment-error">
                                                                {errors.Comment}
                                                            </FormHelperText>
                                                        )}
                                                    </Grid>

                                                    <Grid item xs={12} md={12} className={classes.marginSpacing}>
                                                        <Select
                                                            variant="outlined"
                                                            error={errors.Status && touched.Status ? true : false}
                                                            className={classes.CommentStatusField}
                                                            placeholder="Status"
                                                            onBlur={handleBlur}
                                                            onChange={e => setFieldValue('Status', e)}
                                                            margin="normal"
                                                            aria-describedby="ReminderType-error"
                                                            name="Status"
                                                            options={TaskStatus}
                                                           // className="basic-multi-select"
                                                            classNamePrefix="select"
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

                                                    <Grid item md={12} sm={12}>
                                                        {fileUpload !== undefined && fileUpload &&
                                                            fileUpload.map((file) =>
                                                                <React.Fragment>
                                                                    <Chip
                                                                        style={{ marginBottom: '5px', marginTop: '15px', marginRight: '5px' }}
                                                                       // className={classes.Spacing}
                                                                        avatar={<ImageIcon></ImageIcon>}
                                                                        label={file.name}
                                                                    />
                                                                </React.Fragment>
                                                            )
                                                        }
                                                    </Grid>

                                                    <CardActions
                                                        style={{ paddingLeft: 0, paddingRight: 0 }}
                                                    >
                                                        <Button
                                                            size="small"
                                                            variant="contained"
                                                            color="primary"
                                                            type="submit"
                                                        >
                                                            SEND </Button>  {startLoader && <CircularProgress />}

                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            color="primary"
                                                            onClick={() => setShowCommentBox(false)}
                                                        >
                                                            CANCEL </Button>
                                                    </CardActions>
                                                </form>
                                            );
                                        }}
                                    </Formik>
                                </Grid>
                            }
                        </Grid>
                    </>
                }
            </Grid>

            {/* File Upload Dialog box */}

            <DropzoneDialog
                fullWidth
                maxWidth="md"
                filesLimit={8}
                open={openDialog}
                onSave={handleSaveFile}
                acceptedFiles={['image/jpeg', 'image/png', 'image/bmp', '.pdf', '.csv', '.mp4', '.mp3', '.mkv', '.mov', '.ts']}
                showPreviews
                maxFileSize={500000000}
                onClose={handleCloseDialog}
            />
        </div>
    );
}