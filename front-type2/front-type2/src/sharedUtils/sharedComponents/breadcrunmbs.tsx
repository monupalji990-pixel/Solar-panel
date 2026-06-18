import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import { selectBreadCrumb } from '../sharedRedux/configuration'
import { useSelector } from 'react-redux';

const useStyles = makeStyles(theme => ({
  root: {
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  paper: {
    padding: theme.spacing(0.1, 1),
    'margin-bottom': '10px',
  },
  // Darkpaper: {
  //   padding: theme.spacing(0.1, 1),
  //   'margin-bottom': '10px',
  //   background: '#272E48',
  //   color: '#ffffff'
  // },
  // darkText: {
  //   color: '#ffffff'
  // }
}));


export default function SimpleBreadcrumbs(props) {
  const classes = useStyles();
  const breadcrumb = useSelector(selectBreadCrumb)
  let opt = breadcrumb.map((e, i) => {
    if (e.isClickable) {
      return (
        <Link key={i} color="inherit" href={e.url}>
          {e.name}
        </Link>
      );
    } else {
      return <Typography key={i} color="textPrimary">{e.name}</Typography>;
    }
  });

  return (
    <div className={classes.root}>
      <Paper elevation={0} className={classes.paper}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
        >
          {opt}
        </Breadcrumbs>
      </Paper>
    </div>
  );
}
