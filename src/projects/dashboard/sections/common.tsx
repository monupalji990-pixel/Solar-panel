import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { connect, useDispatch, useSelector } from "react-redux";
import DashboardForAdmin from "../pages/dashboardForAdmin";
import DashboardForManagement from "../pages/dashboardForManagement";
import DashboardForPartner from "../pages/dashboardForPartner";
import DashboardForSalesRep from "../pages/dashboardForSalesRep";
import LeadIcon from "../../../sharedUtils/sharedImages/navIcon/lead.svg";
import Quote from "../../../sharedUtils/sharedImages/navIcon/document.svg";
import Task from "../../../sharedUtils/sharedImages/navIcon/task.svg";
import Renewal from "../../../sharedUtils/sharedImages/navIcon/renewal.svg";
import { selectTaskState, taskAction } from "projects/task/redux/task";
import { leadAction, selectLeadState } from "projects/lead/redux/lead";
import { quoteAction, selectQuoteState } from "projects/quote/redux/quote";
import {
  renewalAction,
  selectRenewalState,
} from "projects/renewal/Redux/renewal";
import {
  globalConfigActions,
  selectGlobalConfig,
} from "sharedUtils/sharedRedux/configuration";
import { companyAction } from "projects/company/redux/company";
import TaskFilterList from "../sections/taskFilter"
import UserLists from "../sections/usersList"
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Common as LeadList } from "../../lead/pages/Common";
import { selectAuthState } from "projects/authentication/redux/auth";
import { io } from 'socket.io-client';
import UserListsOffline from "../sections/usersListOffline";
import UserApi from "../../users/redux/model/userAdmin"
import AppointmentMatrix from "../sections/appointmentMatrix";

export function Common(props) {

  const [socket, setSocket] = useState(null);
  const [userList, setUserList] = useState([]);
  const [offLineUserList, setOffLineUserList] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const taskCount = useSelector(selectTaskState).taskCount;
  const taskState = useSelector(selectTaskState);
  const leadCount = useSelector(selectLeadState).leadCount;
  const deleteCount = useSelector(selectTaskState).deleteRequestCount;
  const quoteCount = useSelector(selectQuoteState).quoteCount;
  const renewalCount = useSelector(selectRenewalState).renewalCount;
  const GlobalConfigState = useSelector(selectGlobalConfig);
  const authStates = useSelector(selectAuthState);

  const dispatch = useDispatch();

  const _taskStats = (payload) => dispatch(taskAction.TaskStates(payload));
  const _taskCount = (payload) => dispatch(taskAction.Count(payload));
  const _deleteRequestCount = (payload) => dispatch(taskAction.DeleteRequestCount(payload));
  const _leadCount = (payload) => dispatch(leadAction.Count(payload));
  const _quoteCount = (payload) => dispatch(quoteAction.Count(payload));
  const _renewalCount = (payload) => dispatch(renewalAction.Count(payload));
  const _slugUpdate = (payload) => dispatch(taskAction.SlugUpdate(payload));
  const _AssigneeFilter = (payload) => dispatch(taskAction.AssigneeFilter(payload));
  const _assigneeList = (payload) =>
    dispatch(taskAction.assigneeListOfTask(payload));
  const _updateCompanySlug = (payload) => dispatch(companyAction.SlugUpdate(payload));

  const _DueDateTask = (payload) =>
    dispatch(globalConfigActions.dueDateTask(payload));

  let socketURL = ''

  if (window.location?.origin == 'https://thepowerportal.co.uk') {
    socketURL = 'https://thepowerportal.co.uk'
  }
  else if (process.env.NODE_ENV === "development") {
    socketURL = 'http://localhost:4000'
  } else {
    socketURL = 'https://stage.thepowerportal.co.uk'
  }
  
  useEffect(() => {
    const newSocket: any = io(socketURL, {
      transports: ['websocket'],
    })

    newSocket.on('connect', () => {
    })

    newSocket.on("error", (error: any) => {
      console.log("socket error", error);
    })

    setSocket(newSocket);
    // return () => newSocket.close();
  }, [])

  useEffect(() => {
    if (socket !== null) {
      socket.emit('get_list', '')
      socket.on('user_list', (data) => {
        setUserList(data);
      })
    }
  }, [socket?.connected]);


  const socketAuthStatus = authStates?.isSocketStatus

  useEffect(() => {
    if (socket !== null) {
      socket.emit('idle', { status: socketAuthStatus });

    }
  }, [socketAuthStatus]);

  if (socket !== null) {
    socket.on('user_list_change', (data) => {
      setUserList(data);
    });
  }

  useEffect(() => {
    if (props.slug) _updateCompanySlug({ slug: props.slug });
  }, []);

  useEffect(() => {
    _taskCount(null);
    _leadCount({ slug: props.slug });
    _quoteCount(null);
    _deleteRequestCount(null);
    _renewalCount(null);
    props.setBreadCrumbs([
      {
        name: "Dashboard",
        isClickable: true,
        url: `/dashboard/${props.slug}`,
      },
    ]);
  }, []);

  const [drawerIs, setDrawerIs] = useState(null);
  const [selectedTab, setSelectedTab] = React.useState("lead");
  const [selectedTabUser, setSelectedTabUser] = React.useState("online");

  const tabHandleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const tabHandleChangeUser = (event, newValue) => {
    setSelectedTabUser(newValue);
    if (newValue == 'offline') {
      setLoading(true);

      let obj: any = {}
      obj.skip = 0;
      obj.limit = 100;
      UserApi.offlineUserListAPI(obj).then((res: any) => {
        if (res.success) {
          setOffLineUserList(res.data)

          setTimeout(() => {
            setLoading(false);
          }, 500)
        } else {
          dispatch(globalConfigActions.enableFeedback(res.message));
          setOffLineUserList([])
          setTimeout(() => {
            setLoading(false);
          }, 500)
        }
      });
    }
  };

  const tabs = {
    // dashboard tabes data in array
    admin: [
      {
        first: "Leads",
        second: leadCount == -1 ? "0" : leadCount,
        icon: LeadIcon,
        onClick: "/lead/admin/view",
      },
      {
        first: "Quotes",
        second: quoteCount == -1 ? "0" : quoteCount,
        icon: Quote,
        onClick: "/quote/admin/view",
      },
      {
        first: "Tasks",
        second: taskCount == -1 ? "0" : taskCount,
        icon: Task,
        onClick: "/task/admin/view",
      },
      {
        first: "Renewals",
        second: renewalCount == -1 ? "0" : renewalCount,
        icon: Renewal,
        onClick: "/renewal/admin/view",
      },
    ],
    management: [
      {
        first: "Leads",
        second: leadCount == -1 ? "0" : leadCount,
        icon: LeadIcon,
        onClick: "/lead/management/view",
      },
      {
        first: "Quotes",
        second: quoteCount == -1 ? "0" : quoteCount,
        icon: Quote,
        onClick: "/quote/management/view",
      },
      {
        first: "Renewal",
        second: renewalCount == -1 ? "0" : renewalCount,
        icon: Renewal,
        onClick: "/renewal/management/view",
      },
    ],
    partner: [
      {
        first: "Quotes",
        second: "History",
        icon: Quote,
        onClick: "/quote/partner/view",
      },
      {
        first: "New",
        second: "Lead",
        icon: LeadIcon,
        onClick: "/lead/partner/view?add=true",
      },
      {
        first: "Existing",
        second: "Companies",
        icon: Renewal,
        onClick: "/company/partner/view",
      },
      {
        first: "Create",
        second: "Quote",
        icon: Quote,
        onClick: "/quote/partner/view?add=true",
      },
    ],
    sales: [
      {
        first: "Create",
        second: "Quote",
        icon: Quote,
        onClick: "/quote/sales_rep/view?add=true",
      },
      {
        first: "Quotes",
        second: "History",
        icon: LeadIcon,
        onClick: "/quote/sales_rep/view",
      },
    ],
  };


  return (
    <>
      <Helmet>
        <title>Dashboard</title>
        <meta name="description" content="A Edan Power CRM Portal" />
      </Helmet>

      {props.slug === "admin" && (
        <DashboardForAdmin
          {...props}
          tabs={tabs}
          dueTask={GlobalConfigState.dueTask}
          _DueDateTask={_DueDateTask}
          deleteCount={deleteCount}
        />
      )}
      {props.slug === "management" && (
        <DashboardForManagement
          {...props}
          tabs={tabs}
          dueTask={GlobalConfigState.dueTask}
          _DueDateTask={_DueDateTask}
        />
      )}
      {props.slug === "partner" && (
        <DashboardForPartner
          {...props}
          tabs={tabs}
          dueTask={GlobalConfigState.dueTask}
          _DueDateTask={_DueDateTask}
        />
      )}
      {props.slug === "sales_rep" && (
        <DashboardForSalesRep
          {...props}
          tabs={tabs}
          dueTask={GlobalConfigState.dueTask}
          _DueDateTask={_DueDateTask}
        />
      )}
      {props.slug === "admin" && (
        <div style={{ marginTop: '2rem' }}>
          <Paper>
            <Tabs
              value={selectedTab}
              onChange={tabHandleChange}
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab label="Leads" value="lead" />
              <Tab label="Tasks" value="task" />
              <Tab label="Users" value="users" />
              <Tab label="Appointment Matrix" value="appointment_matrix" />
            </Tabs>
          </Paper>

          {selectedTab == 'lead' &&
            <LeadList {...props} isFrom="Dashboard" />
          }

          {selectedTab == 'task' &&
            <TaskFilterList
              {...props}
              _taskStats={_taskStats}
              taskState={taskState}
              _slugUpdate={_slugUpdate}
              _assigneeList={_assigneeList}
              _AssigneeFilter={_AssigneeFilter}
            />
          }

          {selectedTab == 'users' &&
            <React.Fragment>
              <Tabs
                value={selectedTabUser}
                onChange={tabHandleChangeUser}
                textColor="primary"
                indicatorColor="primary"
              >
                <Tab label="Online (Logged In)" value="online" />
                <Tab label="Offline (Not Logged In)" value="offline" />
              </Tabs>

              {selectedTabUser == 'online' &&
                <UserLists
                  userList={userList}
                  authStates={authStates}
                  {...props}
                />
              }

              {selectedTabUser == 'offline' &&
                <UserListsOffline
                  isLoading={isLoading}
                  offLineUserList={offLineUserList}
                  authStates={authStates}
                  {...props}
                />
              }
            </React.Fragment>
          }

          {selectedTab === 'appointment_matrix' &&
            <AppointmentMatrix {...props} />
          }
        </div>
      )}

      {(props.slug === "management" || props.slug === "partner") && (
        <AppointmentMatrix {...props} />
      )}
      {drawerIs}
    </>
  );
}