import React, { useState } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import CardActions from '@material-ui/core/CardActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { helperMethods } from '../../../sharedUtils/globalHelper/helperMethod'
import { AMPS } from '../../../sharedUtils/globalHelper/constantValues';

const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(1),
    },
    comment_pic: {
        margin: 'auto',
        marginRight: 'inherit',
        width: '30px',
        height: '30px'
    },
    borderLeft: {
        borderLeft: '2px solid'
    },
    SpacingRight: {
        marginRight: '10px'
    },
    SpacingLeft: {
        marginLeft: '10px'
    },
    Spacing: {
        paddingTop: '10px',
    }
}));

export default function addNotes(props) {

    const [startLoader, setStartLoader] = useState(false);
    const [isAddNotes, setIsAddNotes] = useState(false);

    const classes = useStyles();

    if (props.isActionDone && isAddNotes) {
        props._isActionDone(false);
        setStartLoader(false);
        setIsAddNotes(false);
    }

    const { Notes } = props.currentConsumer

    let notesData = Notes

    if (props.notes !== undefined && props.notes && props.notes.length > 0) {
        notesData = props.notes;
    }

    if (notesData) {
        notesData = helperMethods.reverseOrder(notesData);
    }

    return (
        <Grid container spacing={3}>
            {AMPS.includes(props.slug) &&
                <Grid item md={12} sm={12} container direction="row" justify="flex-end">
                    <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        type="submit"
                        onClick={() => setIsAddNotes(!isAddNotes)}
                    >
                        Add Notes </Button>
                </Grid>}
            <Grid item md={12} sm={12}>
                {isAddNotes &&
                    <Formik
                        initialValues={{
                            notes: ''
                        }}
                        onSubmit={(value) => {
                            let updateObject = {
                                ConsumerID: props.currentConsumer._id,
                                notes: value.notes,
                            };
                            setStartLoader(true);
                            props._addNotes(updateObject)
                        }}
                        validationSchema={Yup.object().shape({
                            notes: Yup.string().required('Note is required'),
                        })}
                    >
                        {props => {
                            const {
                                values,
                                touched,
                                errors,
                                handleChange,
                                handleBlur,
                                handleSubmit,
                            } = props;

                            return (
                                <form onSubmit={handleSubmit}>
                                    <Grid item md={12} sm={12}>
                                        <TextField
                                            variant="outlined"
                                            error={errors.notes && touched.notes ? true : false}
                                            name="notes"
                                            multiline
                                            rows={3}
                                            label="Notes..."
                                            value={values.notes}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className="WidhtFull100"
                                            margin="normal"
                                            aria-describedby="notes-error"
                                        />
                                        {errors.notes && touched.notes && (
                                            <FormHelperText className="errormsg" id="notes-error">
                                                {errors.notes}
                                            </FormHelperText>
                                        )}
                                    </Grid>

                                    <CardActions
                                        style={{ paddingLeft: 0, paddingRight: 0 }}
                                    >
                                        <Button
                                            size="large"
                                            variant="contained"
                                            color="primary"
                                            type="submit"
                                        // disabled={isSubmitting}
                                        >
                                            Add Notes </Button> {startLoader && <CircularProgress />}
                                    </CardActions>
                                </form>
                            );
                        }}
                    </Formik>}
            </Grid>

            {notesData && notesData.map(v => (
                <Grid item xs={12} md={12}>
                    <Card variant="outlined">
                        <CardContent>
                            <Grid container spacing={1}>
                                <Grid item xs={12} md={9} className={classes.comment_pic}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        <strong>Added on</strong> <span>{helperMethods.ConvertDateAndTime(v.timestamps)}</span>
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <Tooltip title={v.addedBy ? `${v.addedBy.name}` : ''}>
                                        <Avatar alt="User name" className={classes.comment_pic} src='' />
                                    </Tooltip>
                                </Grid>
                            </Grid>
                            {v.addedBy !== undefined ? v.addedBy.name : null}
                            <pre>
                                {v.notes}
                            </pre>
                        </CardContent>
                    </Card>
                </Grid>
            ))}

        </Grid>

    );
}