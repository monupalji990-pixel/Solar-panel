import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import DueTaskPopup from '../../../sharedUtils/sharedComponents/dueDateTask';

const useStyles = makeStyles({
  iconStyle: {
    fontSize: 52,
    color: '#193562',
    backgroundColor: 'rgb(25 53 98 / 17%)',
    borderRadius: 50,
    marginRight: 10,
    padding: 10,
    border: '4px solid rgb(241 241 241)',
  },
  MainCard: {
    position: 'relative'
  },
  card: {
    cursor: 'pointer'
  },
  card_icon: {
    position: 'absolute',
    right: '20px',
    bottom: '20px'
  },
  card_title: {
    fontWeight: 600,
    textTransform: "uppercase",
    color: '#ffffff'
  },
  card_body_title: {
    fontWeight: 900,
    fontSize: '1.7rem',
    color: '#ffffff'
  },
  card_body_subtitle: {
    color: '#19b159',
    textTransform: 'capitalize',
    fontWeight: 400,
  },
  imgStyle: {
    width: 35
  },
  darkCard: {
    background: '#272E48'
  },
  darkText: {
    color: '#ffffff'
  }
});


export default function PartnerDashboard(props) {

  const classes = useStyles();
  const [isShowModel, setIsShowModel] = useState(false);

  const { tabs, history, dynamicComponent } = props

  const DueDateTask = () => {
    props._DueDateTask();
  }

  const ViewDueTasks = (id) => {
    history.push(`/task/partner/view?dt=${id}`)
  }

  const { location, dueTask } = props;
  const popup = new URLSearchParams(location.search).get('due');

  useEffect(() => {
    if (popup) {
      DueDateTask()
    } else {
      setIsShowModel(false);
    }
  }, []);

  if (dueTask !== undefined && dueTask && dueTask.length > 0 && !isShowModel && popup) {
    setIsShowModel(true);
  }

  return (
    <React.Fragment>
      <Grid container spacing={3}>
        {isShowModel ? <DueTaskPopup {...props} isShowModel ViewDueTasks={(id) => ViewDueTasks(id)}></DueTaskPopup> : null}
        {tabs && tabs.partner.map(t => (
          <Grid item md xs={12}>
            <Card className={classes.darkCard} style={{ cursor: 'pointer' }} onClick={() => history.push(t.onClick)}>
              <CardContent className={classes.MainCard}>
                <Grid className={classes.card_icon}>
                  <img src={t.icon} className={classes.imgStyle} alt="Icons" />
                </Grid>
                <Grid>
                  <Typography className={classes.card_title} variant="body2">{t.first}</Typography>
                </Grid>
                <Grid>
                  <Typography variant="h6" className={classes.card_body_title}>{t.second}</Typography>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </React.Fragment>
  );
}