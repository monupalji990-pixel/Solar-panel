import React from "react";
import Drawer from "@material-ui/core/Drawer";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import CloseIcon from "@material-ui/icons/Close";
import Chip from "@material-ui/core/Chip";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  MainContainer: {
    padding: "0 2rem",
  },
  containClass: {
    background: "#FFFFFF 0% 0% no-repeat padding-box",
    boxShadow: "0px 3px 6px #00000029",
    borderRadius: "20px",
  },
  cardHeader: {
    padding: "0.5rem",
    backgroundColor: "#383838",
    borderRadius: "20px 20px 0px 0px ",
    color: "#FFFFFF",
    boxShadow: "0px 3px 6px #00000029",
  },
  drClassPaper: {
    overflow: "hidden",
  },
  drClassPaperScrollable: {
    overflowX: "hidden",
  },
  ResponsiveDrawer: {
    "@media(min-width:481px) and (max-width:1249px)": {
      width: "92vw !important",
      padding: "0 !important",
      margin: 0,
    },
    "@media(max-width:480px)": {
      width: "84vw !important",
      padding: "0 !important",
      margin: 0,
    },
  },
}));

export default function app(props: any) {
  let abc = 0;
  const doubleClickEvent = (e) => {
    abc++;
    if (abc > 1) {
      props.onClose("");
    }
    abc = 0;
  };
  const outSideClickEvent = (e) => {
    if (props.isShowDrawer === "hide") {
      return;
    }
    if (e.target.style && e.target.style.opacity == 1) {
      abc = 1;
    } else {
      abc = 0;
    }
  };
  const dWidth = props.drawerWidth ? props.drawerWidth : "950px";
  const scroll = props.isScrollable == true ? "scroll" : "hidden";
  const dStyle = props.drawerStyle ? props.drawerStyle : {};
  const classes = useStyles();
  return (
    <Drawer
      anchor={props.anchor ? props.anchor : "right"}
      onClick={outSideClickEvent}
      open={Boolean(props.open)}
      onDoubleClick={doubleClickEvent}
      style={dStyle}
      classes={{
        paper: classes.drClassPaperScrollable,
      }}
    >
      <Grid
        className={classes.ResponsiveDrawer}
        style={{ width: props.drawerSize, padding: 30 }}
        container
        spacing={3}
      >
        <Grid item xs={12}>
          {props.isShowDrawer === "hide" ? (
            <Chip
              color="secondary"
              label="Please update Due date or Time of this task to active close button to this task"
            />
          ) : (
            <Button onClick={props.onClose} id="closeButton">
              <Chip
                color="primary"
                icon={<CloseIcon style={{ fontSize: "22px", color: "#fff" }} />}
                label={props.iconName ? props.iconName : ""}
              />
            </Button>
          )}
          {props.children}
        </Grid>
      </Grid>
    </Drawer>
  );
}
