import React from 'react';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Tooltip from '@material-ui/core/Tooltip';
import Chip from '@material-ui/core/Chip';
import { helperMethods } from '../globalHelper/helperMethod';
import ViewFile from './viewFile';

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
    borderLeft: '2px solid #193562'
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
    fontSize: 12,
    color: '#b1b1b1'
  },

}));

export default function ViewComment(props) {
  const classes = useStyles();
  const { notesComment } = props
  let notesCommentData = notesComment
  if (props.notesComment !== undefined && props.notesComment && props.notesComment.length > 0) {
    notesCommentData = props.notesComment;
  }
  if (notesCommentData) {
    notesCommentData = helperMethods.reverseOrder(notesCommentData);
  }
  
  return (
    <div className="app fixedScrollNote" style={{ position: "relative" }}>
      {props && notesCommentData && notesCommentData.map(v => (
        <div>
          <Grid container spacing={1} style={{ textAlign: 'center' }}>
            <Grid item xs={12} md={12}>
              <Chip className='ChipStyleDesign' label={String(helperMethods.checkDate(v.timestamps))} color="primary" />
            </Grid>
          </Grid>
          <Card variant="outlined" className={classes.root}>
            <CardContent className={classes.borderLeft}>
              <Grid container spacing={1}>
                <Grid item xs={12} md={6}>
                  <strong>Comment</strong> <span className={classes.TimeStyle}>{helperMethods.getTimeOnlyNew(v.timestamps)}</span>
                </Grid>
                <Grid item xs={12} md={6}>
                  {v.addedBy && <Tooltip title={v.addedBy ? `${v.addedBy.name}` : ''}>
                    <Avatar className={classes.comment_pic} src={v.addedBy ? `${v.addedBy.avatar}` : ''} >{v.addedBy ? v.addedBy.name.charAt(0).toUpperCase() : ''}</Avatar>
                  </Tooltip>}
                  {v.CommentedBy && <Tooltip title={v.CommentedBy ? `${v.CommentedBy.name}` : ''}>
                    <Avatar className={classes.comment_pic} src={v.CommentedBy ? `${v.CommentedBy.avatar}` : ''} >{v.CommentedBy ? v.CommentedBy.name.charAt(0).toUpperCase() : ''}</Avatar>
                  </Tooltip>}
                </Grid>
              </Grid>
              <Grid container spacing={1}>
                {v.notes && < Grid item xs={12} md={12}>
                  <pre>{v.notes}</pre>
                </Grid>}
                {v.Description && <Grid item xs={12} md={12}>
                  <pre>{v.Description}</pre>
                </Grid>}
                {v.History && <Grid item xs={12} md={12}>
                  <strong>{v.History}</strong>
                </Grid>}
                <Grid item xs={12} md={12}>
                  {v.attachment && <ViewFile commentFor='admin' attachments={v.attachment} ></ViewFile>}
                  {v.Attachments && <ViewFile commentFor='admin' attachments={v.Attachments} ></ViewFile>}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};
