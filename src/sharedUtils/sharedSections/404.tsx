import React from "react";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  notFoundStyle: {
    height: "90vh",
  },
  maintitle: {
    fontSize: "15vw",
    fontWeight: 900,
    letterSpacing: "42px",
    fontFamily: "cursive",
    color: "rgb(255 158 177 / 50%)",
    margin: 0,
    transform: "translate(0%, -10%) skew(0deg) rotate(-0deg)",
    textShadow: "1px 4px 6px #e6e2df, 0 0 0 #66303a, 1px 4px 6px #e6e2df",
    "@media(max-width:480px)": {
      fontSize: "22vw",
      marginLeft: "3rem",
    },
  },
  texttitle: {
    fontSize: "95px",
    fontWeight: 600,
    fontFamily: "cursive",
    letterSpacing: "10px",
    textTransform: "uppercase",
    color: "rgb(255 158 177 / 50%)",
    transform: "translate(0%, -10%) skew(0deg) rotate(-0deg)",
    textShadow: "1px 4px 6px #e6e2df, 0 0 0 #66303a, 1px 4px 6px #e6e2df",
    "@media(max-width:480px)": {
      marginLeft: "1rem",
      fontSize: "51px",
      textAlign: "center",
    },
  },
  buttonStyle: {
    // boxShadow: '2px 3px 1px #000000',
  },
}));

function NotFound(props) {
  const classes = useStyles();

  return (
    <Grid
      container
      direction="column"
      justify="center"
      alignItems="center"
      className={classes.notFoundStyle}
    >
      <Typography variant="h1" className={classes.maintitle} gutterBottom>
        404
      </Typography>

      <Typography className={classes.texttitle} variant="h2" gutterBottom>
        Not Found
      </Typography>

      <Button
        variant="contained"
        className={classes.buttonStyle}
        color="primary"
      >
        <Link
          to="/dashboard/admin"
          style={{ color: "#fff", textDecoration: "none" }}
        >
          Back To Home
        </Link>
      </Button>
    </Grid>
  );
}

export default NotFound;
