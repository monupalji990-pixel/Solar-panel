import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectLoggedUser } from "../../../../projects/authentication/redux/auth";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import _ from "lodash";
import clsx from "clsx";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import {
  selectSidebarStatus,
  globalConfigActions,
} from "../../../sharedRedux/configuration";
import Dynamicicon from "../../../sharedComponents/dynamicIcon";

const drawerWidth = 240;

const styles = makeStyles((theme) => ({
  scrollableSidebar: {
    height: "calc(100vh - 73px)",
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",

  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.standard,
    }),
    marginTop: 73,
    background: "#ffffff",
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.standard,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 5,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(7) + 0,
    },
    marginTop: 73,
    background: "#ffffff",
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(0),
  },

  menuButton: {
    marginRight: 10,
  },

  hide: {
    display: "none",
  },
  background: {
    backgroundColor: "black",
  },
  SidebarIconStyle: {
    display: "block",
  },
}));

export default function sideBar(props) {
  const classes = styles();
  const sidebarStatus = useSelector(selectSidebarStatus);

  const dispatch = useDispatch();

  return (
    <Drawer
      onMouseEnter={() => {
        if (!(sidebarStatus == "fullOpen" || sidebarStatus == "fullClose")) {
          dispatch(globalConfigActions.changeStatusOfSidebar("hoverOpen"));
        }
      }}
      onMouseLeave={() => {
        if (!(sidebarStatus === "fullOpen" || sidebarStatus === "fullClose")) {
          dispatch(globalConfigActions.changeStatusOfSidebar("hoverClose"));
        }
      }}
      variant={"permanent"}
      className={clsx(classes.drawer, {
        [classes.drawerOpen]:
          sidebarStatus == "hoverOpen" || sidebarStatus == "fullOpen",
        [classes.drawerClose]:
          sidebarStatus == "hoverClose" || sidebarStatus == "fullClose",
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]:
            sidebarStatus == "hoverOpen" || sidebarStatus == "fullOpen",
          [classes.drawerClose]:
            sidebarStatus == "hoverClose" || sidebarStatus == "fullClose",
        }),
      }}
      open={
        sidebarStatus == "fullOpen" || sidebarStatus == "hoverOpen"
          ? true
          : false
      }
    >
      <div className={classes.scrollableSidebar}>
        <Divider />
        <SidebarLogic {...props} />
      </div>
    </Drawer>
  );
}

function SidebarLogic(props) {
  const classes = styles();
  const userData = useSelector(selectLoggedUser);

  let mySideBar: any = [];

  if (userData && userData) {
    const { containers } = userData.role;
    const onlysidebar = containers.filter((v) => {
      return v.isSidebar == true && !v.noparent;
    });
    const noparent = containers.filter((v) => {
      return v.isSidebar == true && v.noparent;
    });
    mySideBar = noparent.map((v) => (
      <ListItem
        key={v._id}
        button
        onClick={() => {
          if (location.pathname == v.container) {
          } else {
            props.history.push(v.container);
          }
        }}
        selected={location.pathname == v.container}
      >
        <ListItemIcon className={classes.SidebarIconStyle}>
          <Dynamicicon icon={v.icon} />
        </ListItemIcon>
        <ListItemText className="menu_style" primary={v.name} />
      </ListItem>
    ));
  }
  return mySideBar;
}
