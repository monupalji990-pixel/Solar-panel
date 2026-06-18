import React, { Suspense } from 'react';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Tooltip from '@material-ui/core/Tooltip';
import { helperMethods } from '../../../sharedUtils/globalHelper/helperMethod'
import ViewFile from '../../../sharedUtils/sharedComponents/viewFile';
import Chip from '@material-ui/core/Chip';
import AddComment from './addComment';

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
    },
    TimeStyle: {
        color: '#a2a2a2'
    }
}));

export default function viewTaskComment(props) {
    const { Comments } = props.currentTask
    const CommentData = helperMethods.reverseOrder(Comments);
    const classes = useStyles();

    return (
        <div className="app" style={{ position: "relative" }}>
            <Suspense fallback={<>Loading...</>}> {['admin', 'management', 'partner', 'sales_rep'].includes(props.slug) ? <AddComment {...props} /> : null} </Suspense>
            {CommentData && CommentData.length > 0 && CommentData.map(c => (
                <div>
                    <Grid container spacing={1} style={{ textAlign: 'center' }}>
                        <Grid item xs={12} md={12}>
                            <Chip className='ChipStyleDesign' label={String(helperMethods.checkDate(c.timestamps))} color="primary" />
                        </Grid>
                    </Grid>
                    <Card variant="outlined" className={classes.root}>
                        <CardContent className={classes.borderLeft}>
                            <Grid container spacing={1}>
                                <Grid item xs={12} md={6}>
                                    <strong>Comment </strong> <span className={classes.TimeStyle}>{helperMethods.getTimeOnly(c.timestamps)}</span>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Tooltip title={c.CommentedBy ? `${c.CommentedBy.name}` : ''}>
                                        <Avatar alt="User name" className={classes.comment_pic} src={c.CommentedBy ? `${c.CommentedBy.avatar}` : ''} />
                                    </Tooltip>
                                </Grid>
                            </Grid>
                            <Grid container spacing={1}>
                                <Grid item xs={12} md={12}>
                                    <pre>{c.Description}</pre>
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <strong>{c.History}</strong>
                                </Grid>
                                <Grid item xs={12} md={12}>
                                    <ViewFile className={classes.Spacing} attachments={c.Attachments} commentFor='admin'></ViewFile>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </div>
            ))}
        </div>
    );
};