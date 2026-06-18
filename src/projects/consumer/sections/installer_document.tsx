import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { DropzoneArea } from 'material-ui-dropzone';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import CardActions from '@material-ui/core/CardActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { helperMethods } from '../../../sharedUtils/globalHelper/helperMethod'
import ViewFile from '../../../sharedUtils/sharedComponents/viewFile';
import { A } from '../../../sharedUtils/globalHelper/constantValues';
import moment from 'moment';

const useStyles = makeStyles(() => ({
    DeleteIconAlign: {
        textAlign: 'right',
    }
}));

export default function InstallerDocuments(props) {

    const [startLoader, setStartLoader] = useState(false);
    const [isAddNotes, setIsAddNotes] = useState(false);
    const [fileUpload, setFileUpload] = useState('');
    const [deletedId, setDeletedId] = useState('');

    const classes = useStyles();

    if (props.isActionDone && startLoader) {
        props._isActionDone(false);
        setStartLoader(false);
        setIsAddNotes(false);
    }

    const FileUpload = (files) => {
        setFileUpload(files);
    }

    const addDocuments = (d) => {
        const ci = props.currentConsumer._id
        const data = new FormData();
        data.set('Consumer', ci);
        data.set('title', d.Title);
        for (var x = 0; x < fileUpload.length; x++) {
            data.append('Attachments', fileUpload[x])
        }
        props._addDocument(data);
    }

    const deleteAttachment = (did) => {

        let document = {
            Consumer: props.currentConsumer._id,
            did,
            type: 'documents'
        }
        setDeletedId(did);
        setStartLoader(true);
        props._deleteDocuments(document);
    }
    
    const documents = props.currentConsumer.installerDocuments ? [...props.currentConsumer.installerDocuments] : [];    

    let documentsData = documents;
    if (props.installerDocuments !== undefined && props.installerDocuments && props.installerDocuments.length > 0) {
        documentsData = props.installerDocuments;
    }
    if (documentsData) {
        documentsData = helperMethods.reverseOrder(documentsData);
    }
    return (
        <Grid container spacing={3}>
            <Grid item md={12} sm={12} container direction="row" justify="flex-end">
                <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    type="submit"
                    onClick={() => setIsAddNotes(!isAddNotes)}
                >
                    Add Document </Button>
            </Grid>
            <Grid item md={12} sm={12}>
                {isAddNotes &&
                    <Formik
                        initialValues={{
                            Title: ''
                        }}
                        onSubmit={(value) => {
                            setStartLoader(true);
                            addDocuments(value);
                        }}
                        validationSchema={Yup.object().shape({
                            Title: Yup.string().required('Title is required'),
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
                                    <Grid container spacing={3}>
                                        <Grid item md={6} xs={12}>
                                            <TextField
                                                variant="outlined"
                                                error={errors.Title && touched.Title ? true : false}
                                                name="Title"
                                                label="Title"
                                                value={values.Title}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                className="WidhtFull100"
                                                margin="normal"
                                                aria-describedby="Title-error"
                                            />
                                            {errors.Title && touched.Title && (
                                                <FormHelperText className="errormsg" id="Title-error">
                                                    {errors.Title}
                                                </FormHelperText>
                                            )}
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <DropzoneArea
                                                filesLimit={10}
                                                dropzoneText="Please Upload File From Here"
                                                useChipsForPreview
                                                maxFileSize={10000000}
                                                onChange={(e) => FileUpload(e)}
                                            />
                                        </Grid>
                                    </Grid>

                                    <CardActions
                                        style={{ paddingLeft: 0, paddingRight: 0 }}
                                    >
                                        <Button
                                            size="large"
                                            variant="contained"
                                            color="primary"
                                            type="submit"
                                            disabled={isSubmitting}
                                        >
                                            Add Document </Button> {startLoader && <CircularProgress />}
                                    </CardActions>
                                </form>
                            );
                        }}
                    </Formik>}
            </Grid>
            <Grid item xs={12} md={12}>
                {documentsData && documentsData.map(v => (
                    <Card variant="outlined" style={{ marginBottom: '10px' }}>
                        <CardContent>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={9}>
                                    {v.title && <Typography variant="body1" gutterBottom>Title: {v.title}</Typography>}
                                    {v.attachment && <><ViewFile commentFor='admin' attachments={v.attachment} ></ViewFile> </>}
                                </Grid>
                                <Grid item xs={12} md={3} className={classes.DeleteIconAlign}>
                                    <Typography variant="overline" display='block' gutterBottom>
                                        {v.timestamps ? moment(v.timestamps).format('DD-MM-YYYY hh:mm a') : ''}
                                    </Typography>
                                    <Tooltip title="Delete">
                                        <IconButton aria-label="delete">
                                            <DeleteIcon
                                                onClick={() => deleteAttachment(v._id)} />
                                            {startLoader && v._id === deletedId && < CircularProgress />}
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                ))}
            </Grid>
        </Grid>
    );
}