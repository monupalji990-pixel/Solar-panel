/* eslint-disable */
import {
  authFormSaga,
  authReducer,
  AuthSlickKey,
  selectAuthState,
} from "projects/authentication/redux/auth";
import {
  selectTaskState,
  sliceKeyTask,
  taskAction,
  taskReducer,
  taskSaga,
} from "projects/task/redux/task";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import View from "../../projects/task/sections/viewTask";
import TaskAPIs from "../../projects/task/redux/model/task";
import { useInjectReducer, useInjectSaga } from "utils/redux-injectors";
import {
  companyReducer,
  companySaga,
  sliceKeyCompany,
} from "projects/company/redux/company";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import moment from "moment";
import { TaskValueToStatus } from "sharedUtils/globalHelper/status";
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import { AlertTitle } from '@material-ui/lab';

const styles: any = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const OpenDueDateTask = (props: any) => {
  useInjectReducer({ key: AuthSlickKey, reducer: authReducer });
  useInjectSaga({ key: AuthSlickKey, saga: authFormSaga });
  useInjectReducer({ key: sliceKeyTask, reducer: taskReducer });
  useInjectSaga({ key: sliceKeyTask, saga: taskSaga });

  useInjectReducer({ key: sliceKeyCompany, reducer: companyReducer });
  useInjectSaga({ key: sliceKeyCompany, saga: companySaga });

  const [drawerIs, setDrawerIs] = useState(null);
  const [setDrawer, setSetDrawer] = useState(null);
  const [filter, setFilter] = useState({});
  const [otherData, setOtherData] = useState({});
  const [open, setOpen] = React.useState(false);
  const [taskData, setTaskData] = useState(null);
  const getUserTable = useRef(null);

  const dispatch = useDispatch();

  const userData = useSelector(selectAuthState).loggedUser;
  const taskState = useSelector(selectTaskState);

  const _closeSideBar = (payload) => dispatch(taskAction.CloseSideBar(payload));
  const _loadingDataAction = (payload) =>
    dispatch(taskAction.LoaderStart(payload));
  const _slugUpdate = (payload) => dispatch(taskAction.SlugUpdate(payload));
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

  // function setEditDrawer(data) {
  //   setSetDrawer("manageTaskDrawer");
  //   setOtherData(data);
  // }

  const openDueTask = () => {
    setSetDrawer("manageTaskDrawer");
    setOtherData(taskData);
  }

  function closeDrawer() {
    setSetDrawer(null);
  }

  const [tasksObj, setTaskObj] = useState({});

  function checkTodaysDueTask() {
    TaskAPIs.TodayDueTasks().then((response: any) => {

      if (response && response.data.length > 0) {
        const newObj = { ...tasksObj };

        response.data.map((tt) => {
          const t = new Date().getTime();
          const da = new Date(tt.DueDate);
          let newD = new Date(
            da.getFullYear(),
            da.getMonth(),
            da.getDate()
          ).getTime();

          let timeMillis =
            Number(new Date(tt.Time).getHours() * 60 * 60 * 1000) +
            Number(new Date(tt.Time).getMinutes() * 60 * 1000);
          let newTime = Number(newD + timeMillis);

          if (t - newTime < 0) {
            if (tasksObj[tt._id]) {
              window.clearTimeout(tasksObj[tt._id])
            }
            newObj[tt._id] = setTimeout(() => {
              // setEditDrawer({ _id: tt._id });
              setTaskData({ _id: tt._id });
              setOpen(true);
            }, Math.abs(t - newTime));

            setTaskObj(newObj);
          } else {
            if (tasksObj && Object.keys(tasksObj).length > 0) {
              window.clearTimeout(tasksObj[tt._id]);
              const tempObj = { ...tasksObj };
              delete tempObj[tt._id];
              setTaskObj(tempObj);
              setOpen(false);
            }
          }
        });
      }
      else if (tasksObj && Object.keys(tasksObj).length > 0) {
        Object.keys(tasksObj).map(key => {
          window.clearTimeout(tasksObj[key]);
        })
        setTaskObj({});
        setOpen(false);
      }
    });
  }
  useEffect(() => {
    if (userData?.role?.roleName) {
      checkTodaysDueTask();
    }
  }, [props.needToUpdate]);

  useEffect(() => {
    if (userData?.role?.roleName) {
      checkTodaysDueTask();
    }
  }, [taskState.TaskReminder]);


  const slugObj = {
    "Admin": "admin",
    "Management": "management",
    "Partner": "partner",
    "Sales Rep": "sales_rep",
    "Observing Partner": "observing_partner",
    "admin": "admin",
    "management": "management",
    "partner": "partner",
    "sales_rep": "sales_rep",
    "observing_partner": "observing_partner",
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const {
    Title,
    Time,
    DueDate,
    Priority,
    Status,
    Description,
  } = taskState.currentTask

  function Alert(props) {
    return <MuiAlert elevation={6} variant="standard" {...props} />;
  }

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={open}
        autoHideDuration={20000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="info">
          <AlertTitle>Task Due</AlertTitle>
          Task {Title} is due at {moment(DueDate).format('L')} {moment(Time).format('LT')} . <strong style={{ cursor: "pointer" }} onClick={() => openDueTask()}>Click Here.</strong>
        </Alert>
      </Snackbar>
      {userData?.role?.roleName && slugObj[userData?.role?.roleName] &&
        <View
          {...props}
          slug={slugObj[userData?.role?.roleName]}
          getUserTable={getUserTable}
          open={setDrawer}
          company={otherData}
          onClose={closeDrawer}
          isLoadingData={taskState.isLoadingData}
          currentTask={taskState.currentTask}
          companies={taskState.companies}
          notHideSideBar={taskState.notHideSideBar}
          _loadingDataAction={_loadingDataAction}
          _addComment={_addComment}
          _notCloseSideBar={_notCloseSideBar}
          _isLoadingData={_setIsLoadingData}
          _closeSideBar={_closeSideBar}
          task={otherData}
          _slugUpdate={_slugUpdate}
          _viewTask={_viewTask}
          _updateTask={_updateTask}
          _viewTaskId={_viewTaskId}
          _addNotes={_addComments}
          _basicAction={_basicAction}
          _sendRequest={_sendRequest}
          _companyListForDropdown={_companyListForDropdown}
          isShowDrawer={taskState.isShowDrawer}
        />
      }
    </>
  );
};
export default OpenDueDateTask;
