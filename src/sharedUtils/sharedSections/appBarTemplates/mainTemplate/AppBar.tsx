import {
  AppBar,
  Avatar,
  Button,
  Grid,
  IconButton,
  makeStyles,
  Toolbar,
  Tooltip,
  Typography,
} from "@material-ui/core";
import React, { Suspense } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  changeEditProfileDrawerStatus,
  globalConfigActions,
} from "sharedUtils/sharedRedux/configuration";
import _ from "lodash";
import { authActions } from "projects/authentication/redux/auth";
import { selectLoggedUser } from "../../../../projects/authentication/redux/auth";
import { useHistory } from "react-router-dom";
import UserIcon from "@material-ui/icons/AccountCircle";
import Logo from "../../../sharedImages/PowerPortalLogo.png";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import CalenderView from "../../../../projects/task/components/calender"
import { taskAction, selectTaskState } from "../../../../projects/task/redux/task";
import { A, ASI } from "../../../globalHelper/constantValues";
import EventNoteIcon from '@material-ui/icons/EventNote';
import TaskViewDetail from '../../../../projects/task/sections/viewTask';

const styles = makeStyles((theme) => ({
  CalIconStyle: {
    background: '#193562',
    color: '#ffffff',
    marginRight: 20,
    padding: 9,
    boxShadow: '0 0 10px rgb(25 53 98 / 68%)',
    "&:hover": {
      background: "#193562",
      color: '#ffffff',
    },
  },
  outIcon: {
    fontSize: 18,
  },
  outBtn: {
    minWidth: "inherit",
    borderRadius: "100%",
    height: 30,
    width: 30,
    padding: 0,
    borderColor: "#2f3c4e",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 100,
    background: "#FFFFFF 0% 0% no-repeat padding-box",
    boxShadow: "0px 3px 8px #00000029",
    opacity: 1,
    flexShrink: 0,
    flexDirection: "column",
    color: "black",
    padding: "0.3rem 0rem",
  },
  menuButton: {
    marginRight: 10,
  },
  hide: {
    display: "none",
  },
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
  noPaddingList: {
    padding: "0rem",
  },
  LogoStyle: {
    width: 150,
  },
  MobileBtn: {
    "@media(min-width:991px)": {
      display: "none",
    },
  },
}));

export default function UserAppBar(props) {
  const userData = useSelector(selectLoggedUser);
  const [, setAnchorEl] = React.useState(null);
  const classes = styles();
  const dispatch = useDispatch();
  const [] = React.useState("");
  const editProfileDrawer = useSelector(changeEditProfileDrawerStatus);
  const [setDrawerCal, setSetDrawerCal] = React.useState("");
  const [drawerIs, setDrawerIs] = React.useState(null);
  const [taskData, setTaskData] = React.useState(null);
  const [taskViewDrawer, setViewTaskDrawer] = React.useState(null);


  const history = useHistory();
  const taskState = useSelector(selectTaskState);
  const _taskCalendarData = (payload) => dispatch(taskAction.TaskCalendarData(payload));
  const _closeSideBar = (payload) => dispatch(taskAction.CloseSideBar(payload));
  const _slugUpdate = (payload) => dispatch(taskAction.SlugUpdate(payload));
  const _loadingDataAction = (payload) =>
    dispatch(taskAction.LoaderStart(payload));
  const _basicAction = (payload) => dispatch(taskAction.BasicActions(payload));

  const _addComments = (payload) => dispatch(taskAction.addComment(payload));

  const _notCloseSideBar = (payload) =>
    dispatch(taskAction.notCloseSideBar(payload));

  const _setIsLoadingData = (payload) =>
    dispatch(taskAction.setIsLoadingData(payload));
  const _viewTask = (payload) => dispatch(taskAction.viewTask(payload));

  const _sendRequest = (payload) => dispatch(taskAction.sendRequest(payload));

  const _addComment = (payload) => dispatch(taskAction.addComment(payload));

  const _companyListForDropdown = (payload) =>
    dispatch(taskAction.dropdownCompanyList(payload));

  const _updateTask = (payload) => dispatch(taskAction.updateTask(payload));
  const _viewTaskId = (payload) => dispatch(taskAction.viewTaskId(payload));

  const setViewCalDrawer = () => {
    setSetDrawerCal("manageCalender");
  }

  function closeDrawerCal() {
    setSetDrawerCal(null);
  }

  const closeTaskDrawer=()=>{
    setViewTaskDrawer(null);
  }

  const taskClickEvent = (data) => {
    setTaskData(data);
    setViewTaskDrawer('viewTaskDetail')
  }

  return (
    <AppBar className={classes.appBar} position="fixed">
      <Toolbar>
        <span
          onClick={() => {
            if (userData.role.roleName == "depotAdmin") {
              history.push("/dashboard/depotAdmin");
            } else {
              history.push("/dashboard/admin");
            }
          }}
          style={{ cursor: "pointer" }}
        >
          <img
            className={classes.LogoStyle}
            src={Logo}
            alt="Edan Power Portal"
          />
        </span>

        <Grid
          style={{
            margin: "0 1rem 0 auto ",
            display: "flex",
            alignItems: "center",
          }}
        >
          {!(ASI.includes(userData?.role?.roleName)) &&
            <IconButton onClick={() => setViewCalDrawer()} color="primary" className={classes.CalIconStyle}>
              <EventNoteIcon />
            </IconButton>
          }
          <Typography
            style={{
              flexGrow: 1,
              color: "#000000",
              fontSize: 16,
              textTransform: "capitalize",
              fontWeight: 600,
            }}
            noWrap
          >
            {userData ? userData.name : ""}
          </Typography>
          <Suspense fallback={<></>}>
          </Suspense>
          <IconButton
            onClick={() =>
              dispatch(
                globalConfigActions.changeStatusEditProfileDrawer(
                  editProfileDrawer ? false : true
                )
              )
            }
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
          >
            {userData && userData.avatar != "" ? (
              <Avatar
                id="img"
                alt="Remy Sharp"
                src={userData ? userData.avatar : ""}
              />
            ) : (
              <UserIcon />
            )}
          </IconButton>
          <Logout {...props} />
        </Grid>
      </Toolbar>
      {drawerIs}

      {setDrawerCal === "manageCalender" ? (
        <CalenderView
          {...props}
          showingFrom="appBar"
          calendarData={taskState.calendarData}
          localCalendarData={taskState.localCalendarData}
          open={setDrawerCal}
          onClose={closeDrawerCal}
          _taskCalendarData={_taskCalendarData}
          taskClickEvent={taskClickEvent}
          isLoadingForCalTask={taskState.isLoadingForCalTask}
        />
      ) : (
        ""
      )}

      {taskViewDrawer === "viewTaskDetail" ? (
        <TaskViewDetail
          {...props}
          open={setDrawerCal}
          task={taskData}
          onClose={closeTaskDrawer}
          _taskCalendarData={_taskCalendarData}
          isLoadingData={taskState.isLoadingData}
          currentTask={taskState.currentTask}
          companies={taskState.companies}
          notHideSideBar={taskState.notHideSideBar}
          _loadingDataAction={_loadingDataAction}
          _addComment={_addComment}
          _notCloseSideBar={_notCloseSideBar}
          _isLoadingData={_setIsLoadingData}
          _closeSideBar={_closeSideBar}
          _slugUpdate={_slugUpdate}
          _viewTask={_viewTask}
          _updateTask={_updateTask}
          _viewTaskId={_viewTaskId}
          _addNotes={_addComments}
          _basicAction={_basicAction}
          _sendRequest={_sendRequest}
          _companyListForDropdown={_companyListForDropdown}
        />
      ) : (
        ""
      )}
    </AppBar>
  );
}

const Logout = (props) => {
  const dispatch = useDispatch();
  const Logout = () => {
    dispatch(authActions.logout(props));
  };
  const classes = styles();
  return (
    <div className={classes.MobileBtn}>
      <Grid item>
        <Tooltip title="Log out">
          <Button
            onClick={Logout}
            className={classes.outBtn}
            color="primary"
            variant="outlined"
          >
            <ExitToAppIcon className={classes.outIcon} />
          </Button>
        </Tooltip>
      </Grid>
    </div>
  );
};
