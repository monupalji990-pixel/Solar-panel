import React from "react";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  notFoundStyle: {
    height: "100vh",
  },
  maintitle: {
    fontSize: "220px",
    fontWeight: 600,
    letterSpacing: "42px",
    fontFamily: "cursive",
    color: "#000",
    margin: 0,
  },
  texttitle: {
    fontSize: "95px",
    fontWeight: 600,
    fontFamily: "cursive",
    color: "#000",
  },
  buttonStyle: {
  },
}));

const NotAuthorized = (props) => {
  const classes = useStyles();
  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      className={classes.notFoundStyle}
    >
      <Typography
        variant="h1"
        className={classes.maintitle}
        component="h2"
        gutterBottom
      >
        403
      </Typography>

      <Typography className={classes.texttitle} variant="h2" gutterBottom>
        Not Authorized
      </Typography>

      <Button
        variant="contained"
        className={classes.buttonStyle}
        color="primary"
      >
        <Link to="/dashboard/admin/view" style={{ color: "#fff" }}>
          Back To Home
        </Link>
      </Button>
    </Grid>
  );
};

export default NotAuthorized;
