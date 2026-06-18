import React from "react";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import CloseIcon from "@material-ui/icons/Close";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { Drawer } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: "75px",
    maxWidth: "340px",
    padding: "0 20px",
  },
  FilterIcon: {
    backgroundColor: "#303f9f",
    minWidth: 44,
  },
}));

export default function app(props) {
  const classes = useStyles();

  let abc = 0;
  const doubleClickEvent = (e) => {
    abc++;
    if (abc > 1) {
      props.onClose("");
    }
    abc = 0;
  };
  const outSideClickEvent = (e) => {
    if (e.target.style.opacity == 1) {
      abc = 1;
    } else {
      abc = 0;
    }
  };
  return (
    <Drawer
      id="overflowid"
      anchor="left"
      variant="persistent"
      onClick={outSideClickEvent}
      open={props.open}
      onDoubleClick={doubleClickEvent}
    >
      <Grid container spacing={3} className={classes.root}>
        <Grid item xs={12} md={12} justify="flex-end">
          <Button
            className={classes.FilterIcon}
            onClick={props.onClose}
            id="closeButton"
          >
            <CloseIcon
              color="primary"
              style={{ fontSize: "22px", color: "#fff" }}
            ></CloseIcon>
          </Button>
          {props.children}
        </Grid>
      </Grid>
    </Drawer>
  );
}
