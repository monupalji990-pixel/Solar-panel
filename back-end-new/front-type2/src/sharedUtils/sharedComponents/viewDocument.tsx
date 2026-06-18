import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Tooltip from '@material-ui/core/Tooltip';
import Chip from '@material-ui/core/Chip';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { helperMethods } from '../globalHelper/helperMethod';
import ViewFile from './viewFile';
import { A } from '../globalHelper/constantValues';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(1),
    position: 'relative'
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
  DeleteIconAlign: {
    position: 'absolute',
    right: '1px',
    bottom: '0',
  }
}));

export default function ViewDocuments(props) {
  const classes = useStyles();
  const { documents } = props
  const [startLoader, setStartLoader] = useState(false);
  const [deletedId, setDeletedId] = useState('');
  let documentsData = documents
  if (props.documents !== undefined && props.documents && props.documents.length > 0) {
    documentsData = props.documents;
  }
  if (documentsData) {
    documentsData = helperMethods.reverseOrder(documentsData);
  }
  return (
    <div className="app fixedScrollNote" style={{ position: "relative" }}>
      {props && documentsData && documentsData.map(v => (
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
                  <strong>Document:</strong> <span className={classes.TimeStyle}> {helperMethods.getTimeOnly(v.timestamps)}</span>
                </Grid>
                <Grid item xs={12} md={6}>
                  {v.addedBy && <Tooltip title={v.addedBy ? `${v.addedBy.name}` : ''}>
                    <Avatar className={classes.comment_pic} src={v.addedBy ? `${v.addedBy.avatar}` : ''} >{v.addedBy ? v.addedBy.name.charAt(0).toUpperCase() : ''}</Avatar>
                  </Tooltip>}
                </Grid>
              </Grid>
              <Grid container spacing={1}>
                <Grid item xs={12} md={12}>
                  <pre>{v.title} </pre>
                </Grid>
                <Grid item xs={12} md={12}>
                  {v.attachment && <ViewFile commentFor='admin' attachments={v.attachment} ></ViewFile>}
                  {v.Attachments && <ViewFile commentFor='admin' attachments={v.Attachments} ></ViewFile>}
                </Grid>
                {A.includes(props.slug) && <Grid item xs={12} md={2} className={classes.DeleteIconAlign}>
                  <Tooltip title="Delete">
                    <IconButton aria-label="delete">
                      <DeleteIcon
                        onClick={() => {
                          props.deleteAttachment(v._id);
                          setDeletedId(v._id);
                          setStartLoader(true);
                          setTimeout(function () { setDeletedId(''); setStartLoader(false); }, 3000)
                        }} />
                      {startLoader && v._id === deletedId && <CircularProgress />}
                    </IconButton>
                  </Tooltip>
                </Grid>}
              </Grid>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};
