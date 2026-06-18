import React, { Suspense } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import DeleteIcon from '@material-ui/icons/Delete';
import DeleteTables from '../sections/deleteTables';

const useStyles = makeStyles({
  iconStyle: {
    fontSize: 32,
    color: '#6592d9',
  },
  MainCard: {
    position: 'relative',
  },
  card: {
    cursor: 'pointer',
  },
  card_icon: {
    position: 'absolute',
    right: '20px',
    bottom: '20px',
  },
  card_title: {
    fontWeight: 600,
    textTransform: 'uppercase',
    color: '#272E48'
  },
  card_body_title: {
    fontWeight: 900,
    fontSize: '1.7rem',
    color: '#272E48'
  },
  card_body_subtitle: {
    color: '#19b159',
    textTransform: 'capitalize',
    fontWeight: 400,
  },
  imgStyle: {
    width: 35,
  },
  darkCard: {
    background: '#272E48'
  },
  darkText: {
    color: '#ffffff'
  }
});

export default function AdminDashboard(props) {
  const classes = useStyles();
  const [showDelete, setShowDelete] = React.useState(false);

  let deleteRequestTotalCount = (props.deleteCount?.companyCount + props.deleteCount?.consumerCount + props.deleteCount?.leadCount + props.deleteCount?.quoteCount + props.deleteCount?.renewalCount + props.deleteCount?.taskCount)

  return (
    <>
      <Grid container spacing={3}>
        {props.tabs &&
          props.tabs.admin.map(t => (
            <Grid item md xs={12}>
              <Card
                // className={classes.darkCard}
                style={{ cursor: 'pointer' }}
                onClick={() => props.history.push(t.onClick)}
              >
                <CardContent className={classes.MainCard}>
                  <Grid className={classes.card_icon}>
                    <img
                      src={t.icon}
                      className={classes.imgStyle}
                      alt="Icons"
                    />
                  </Grid>
                  <Grid>
                    <Typography className={classes.card_title} variant="body2">
                      {t.first}
                    </Typography>
                  </Grid>
                  <Grid>
                    <Typography
                      variant="h6"
                      className={classes.card_body_title}
                    >
                      {t.second}
                    </Typography>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}

        <Grid item md xs={12}>
          <Card
            // className={classes.darkCard}
            style={{ cursor: 'pointer' }}
            onClick={() => setShowDelete(!showDelete)}
          >
            <CardContent
              className={classes.MainCard}
            // style={{ minHeight: 62, display: 'flex', alignItems: 'center' }}
            >
              <Grid className={classes.card_icon}>
                <DeleteIcon className={classes.iconStyle} />
              </Grid>
              <Grid>
                <Typography className={classes.card_title} variant="body2">
                  Delete Request
                </Typography>
              </Grid>
              <Grid>
                <Typography
                  variant="h6"
                  className={classes.card_body_title}
                >
                  {deleteRequestTotalCount || 0}
                </Typography>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {showDelete && (
        <Suspense fallback={<></>}>
          <DeleteTables {...props} OnlyDeleteData></DeleteTables>
        </Suspense>
      )}
    </>
  );
}
