/*
 * GithubRepoForm Slice
 *
 * Here we define:
 * - The shape of our container's slice of Redux store,
 * - All the actions which can be triggered for this slice, including their effects on the store.
 *
 * Note that, while we are using dot notation in our reducer, we are not actually mutating the state
 * manually. Under the hood, we use immer to apply these updates to a new copy of the state.
 * Please see https://immerjs.github.io/immer/docs/introduction for more information.
 *
 */
import {
  call,
  put,
  select,
  takeLatest,
  delay,
  cancelled,
} from "redux-saga/effects";
import { PayloadAction, createSelector, IdSelector } from "@reduxjs/toolkit";
import { createSlice } from "utils/@reduxjs/toolkit";
import { RootState } from "types";
import backendApi from "./model/task";
import { globalConfigActions } from "../../../sharedUtils/sharedRedux/configuration";
import { helperMethods } from "sharedUtils/globalHelper/helperMethod";

export interface task {
  calendarData: any;
  currentTask: any;
  currentTaskDoc: any;
  count: number;
  taskCount: number;
  limit: number;
  page: number;
  hideSideBar: boolean;
  remote: boolean;
  searchText: string;
  sort: string;
  sortType: string;
  slug: string;
  isLoadingData: boolean;
  tasks: any;
  assigneeList: any;
  filterData: any;
  OnlyDeleteData: boolean;
  notHideSideBar: boolean;
  dueTask: boolean;
  taskId: string;
  companies: any;
  leads: any;
  quotes: any;
  companyId: string;
  consumerId: string;
  quoteId: string;
  leadId: string;
  companyListForDropdown: any;
  selectedCompany: any;
  todaysTask: string;
  isShowDrawer: any;
  editRemote: any;
  currentDueTask: any;
  TaskReminder: any;
  taskStates: any;
  loadingStats: boolean;
  assigneeId: any;
  taskAssignee: any;
  assigneeTaskId: any;
  loadingStats2: boolean;
  isLoadingForCalTask: boolean;
  localCalendarData: any;
  slotInfo: any;
  taskData: any;
  tasksBoard: any;
  taskUpdatedData: any;
  viewTaskDashboard: any;
  showingFrom: String,
  isActionDone: boolean;
  deleteRequestCount: any;
}
export type ContainerState = task;

export const initialState: ContainerState = {
  calendarData: [],
  tasks: [],
  currentTask: {},
  currentTaskDoc: {},
  count: -1,
  taskCount: -1,
  limit: 10,
  page: 1,
  remote: false,
  hideSideBar: false,
  notHideSideBar: false,
  dueTask: false,
  searchText: "",
  sort: "DueDate",
  sortType: "asc",
  isLoadingData: false,
  slug: "",
  taskId: "",
  companies: [],
  leads: [],
  quotes: [],
  companyId: "",
  consumerId: "",
  quoteId: "",
  leadId: "",
  filterData: {},
  taskData: {},
  companyListForDropdown: [],
  assigneeList: [],
  OnlyDeleteData: false,
  selectedCompany: [],
  todaysTask: "",
  isShowDrawer: "hide",
  editRemote: false,
  currentDueTask: null,
  TaskReminder: 0,
  taskStates: [],
  loadingStats: false,
  assigneeId: '',
  taskAssignee: '',
  assigneeTaskId: '',
  loadingStats2: false,
  isLoadingForCalTask: false,
  localCalendarData: {},
  slotInfo: {},
  tasksBoard: [],
  taskUpdatedData: false,
  viewTaskDashboard: {},
  showingFrom: '',
  isActionDone: false,
  deleteRequestCount: null,
};

/**
 *  *********************  REDUX ACTIONS && REDUCERS ******************    
 */

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    List(state, action: PayloadAction<any | null>) {
      state.showingFrom = action.payload?.showingFrom
      if (action.payload?.filterData)
        state.filterData = action.payload.filterData
    },
    ListSuccess(state, action: PayloadAction<any>) {

      const checkTwoWeekDate = (e) => {
        let d = new Date(e.createdAt).getTime()
        let twoWeekdate = new Date(d + 12096e5);
        let twoWeekISO = new Date(twoWeekdate).toISOString()
        let newDate = new Date().toISOString()

        let twoWeekdateTime = new Date(d + 12096e5).getTime();
        let fourWeekdate = new Date(twoWeekdateTime + 12096e5);

        let fourWeekISO = new Date(fourWeekdate).toISOString()

        if (e.Priority == 'High') {
          return '#135DD8'
        } else if (newDate < twoWeekISO) {
          return 'rgb(97 231 95)'
        } else if (newDate < fourWeekISO) {
          return 'rgb(249 173 76)'
        } else {
          return 'rgb(231 95 95)'
        }
      }

      state.tasks = action.payload?.data?.map((e) => {
        return {
          _id: e._id,
          customTaskId: e.customTaskId || '-',
          isWeekDate: e.Status === "1010" ? false : checkTwoWeekDate(e),
          title: e.Title && e.Title !== undefined ? e.Title : "",
          company:
            e.Company && e.Company !== undefined ? e.Company.businessName : "",
          Consumer:
            e.Consumer && e.Consumer !== undefined
              ? `${e.Consumer.firstName} ${e.Consumer.surName}`
              : "",
          priority: e.Priority && e.Priority !== undefined ? e.Priority : "",
          taskDueDate: helperMethods.ConvertDate(e.DueDate),
          createdAt: helperMethods.ConvertDate(e.createdAt),
          assignee:
            e.Assignee && e.Assignee !== undefined ? e.Assignee.name : "",
          observers:
            e.Observer && e.Observer !== undefined
              ? helperMethods.formatObjectToString(e.Observer, "name")
              : null,
          taskStatus: e.Status && e.Status !== undefined ? e.Status : "",
          Description: e.Description ? e.Description : '-',
        };
      });
      state.remote = true;
    },
    ListFailure(state, action: PayloadAction<any>) { },

    TaskBoardList(state, action: PayloadAction<any>) {

    },
    TaskBoardListSuccess(state, action: PayloadAction<any>) {
      state.tasksBoard = action.payload?.data;
      state.remote = true;
    },
    TaskBoardListFailure(state, action: PayloadAction<any>) { },

    TaskBoardListUpdated(state, action: PayloadAction<any>) {
      state.taskUpdatedData = true;
    },

    NewPage(state, action: PayloadAction<{ page: number }>) {
      state.page = action.payload.page;
    },
    NewPageSuccess(state, action: PayloadAction<{ page: number }>) { },
    NewPageFailure(state, action: PayloadAction<{ page: number }>) { },
    TaskSlotDetails(state, action: PayloadAction<any | null>) {
      state.slotInfo = action.payload;
    },
    TaskCalendarData(state, action: PayloadAction<any | null>) {
      state.isLoadingForCalTask = true;
      state.localCalendarData = action.payload;
    },
    TaskCalendarDataSuccess(state, action: PayloadAction<any>) {
      state.calendarData = action.payload.data.map((e) => {
        return {
          _id: e._id,
          title: e.Title,
          start: helperMethods.mergeDateTime(e.DueDate, e.Time),
          end: helperMethods.mergeDateTime(e.DueDate, e.Time),
        }
      })
      state.isLoadingForCalTask = false;
    },
    TaskCalendarDataFailure(state, action: PayloadAction<any>) {
      state.isLoadingForCalTask = false;
    },
    LoaderStart(state, action: PayloadAction<any>) {
      state.remote = action.payload;
      state.page = 1;
    },
    Search(state, action: PayloadAction<{ searchText: string }>) {
      state.searchText = action.payload.searchText;
    },
    Sort(state, action: PayloadAction<any>) {
      state.sort = action.payload.sort;
      state.sortType = action.payload.sortType;
    },
    ChangeLimit(state, action: PayloadAction<{ limit: number; page: number }>) {
      state.limit = action.payload.limit;
    },
    CloseSideBar(state, action: PayloadAction<any>) {
      state.hideSideBar = action.payload;
    },
    notCloseSideBar(state, action: PayloadAction<any>) {
      state.notHideSideBar = action.payload;
    },
    taskIsActionDone(state, action: PayloadAction<any>) {
      state.isActionDone = action.payload;
    },
    addTask(state, action: PayloadAction<any>) {
      state.isLoadingData = true;
    },
    addTaskSuccess(state, action: PayloadAction<any>) {
      state.isLoadingData = false;
    },
    addTaskFailure(state, action: PayloadAction<any>) {
      state.isLoadingData = false;
    },
    updateTask(state, action: PayloadAction<any>) {
      state.editRemote = false;
    },
    addComment(state, action: PayloadAction<any>) {
    },
    viewTaskId(state, action: PayloadAction<any>) {
      state.taskId = action.payload;
    },
    singleCompany(state, action: PayloadAction<any>) {
    },
    singleCompanySuccess(state, action: PayloadAction<any>) {
      state.selectedCompany = action.payload.data;
    },

    currentTaskData(state, action: PayloadAction<any>) {
      state.currentTask = action.payload.data;
    },
    currentTaskDocumentsData(state, action: PayloadAction<any>) {
      state.currentTaskDoc = action.payload.data;
    },
    SlugUpdate(state, action: PayloadAction<any>) {
      state.slug = action.payload.slug;
      state.companyId = action.payload.company
        ? action.payload.company._id
        : "";
      state.consumerId = action.payload.consumer
        ? action.payload.consumer._id
        : "";
      state.quoteId = action.payload.quote ? action.payload.quote._id : "";
      state.leadId = action.payload.lead ? action.payload.lead._id : "";
      state.searchText = "";
      state.OnlyDeleteData =
        action.payload.OnlyDeleteData !== undefined ? true : false;
    },

    viewTask(state, action: PayloadAction<any>) { },
    viewTaskSuccess(state, action: PayloadAction<any>) { },
    assigneeListOfTask(state, action: PayloadAction<any>) { },
    assigneeListOfTaskSuccess(state, action: PayloadAction<any>) {
      state.assigneeList = action.payload.data;
    },
    setIsLoadingData(state, action: PayloadAction<any>) {
      state.isLoadingData = action.payload;
    },
    AddNotes(state, action: PayloadAction<any>) { },

    FilterData(state, action: PayloadAction<any>) {
      state.filterData = action.payload;
    },
    FilterDataForTaskBoard(state, action: PayloadAction<any>) {
      state.filterData = action.payload;
    },
    LoadMoreTask(state, action: PayloadAction<any>) {
      state.taskData = action.payload;
      state.page = action.payload.page;
    },

    dropdownCompanyList(state, action: PayloadAction<any>) { },
    dropdownCompanyListSuccess(state, action: PayloadAction<any>) {
      state.companies = action.payload.data;
    },
    dropdownLeadList(state, action: PayloadAction<any>) { },
    dropdownLeadListSuccess(state, action: PayloadAction<any>) {
      state.leads = action.payload.data;
    },
    dropdownQuoteList(state, action: PayloadAction<any>) { },
    dropdownQuoteListSuccess(state, action: PayloadAction<any>) {
      state.quotes = action.payload.data;
    },

    deleteTask(state, action: PayloadAction<any>) { },

    sendRequest(state, action: PayloadAction<any>) { },
    actionOnDeleteReq(state, action: PayloadAction<any>) { },
    BasicActions(state, action: PayloadAction<any>) {
      if (action.payload.sidebar !== undefined)
        state.hideSideBar = action.payload.sidebar;
      if (action.payload.remote !== undefined)
        state.remote = action.payload.remote;
      if (action.payload.notHideSideBar !== undefined)
        state.notHideSideBar = action.payload.notHideSideBar;
      if (action.payload.isLoadingData !== undefined)
        state.isLoadingData = action.payload.isLoadingData;
      if (action.payload.selectedCompany !== undefined)
        state.selectedCompany = action.payload.selectedCompany;
      if (action.payload.taskCount !== undefined)
        state.taskCount = action.payload.taskCount;
      if (action.payload.count !== undefined)
        state.count = action.payload.count;
      if (action.payload.dueTask !== undefined)
        state.dueTask = action.payload.dueTask;
      if (action.payload.todaysTask !== undefined)
        state.todaysTask = action.payload.todaysTask;
      if (action.payload.isShowDrawer !== undefined)
        state.isShowDrawer = action.payload.isShowDrawer;
    },
    Count(state, action: PayloadAction<any | null>) { },
    CountSuccesss(state, action: PayloadAction<any | null>) { },

    DeleteRequestCount(state, action: PayloadAction<any | null>) { },
    DeleteRequestCountSuccesss(state, action: PayloadAction<any | null>) {
      state.deleteRequestCount = action.payload.data
    },

    currentDueTask(state, action: PayloadAction<any>) {
    },
    changeTaskReminder(state, action: PayloadAction<any>) {
      state.TaskReminder = Math.random();
    },
    TaskStates(state, action: PayloadAction<any | null>) { },
    TaskStatesSuccesss(state, action: PayloadAction<any | null>) {
      state.taskStates = action.payload.data;
      state.loadingStats = true;
    },
    AssigneeFilter(state, action: PayloadAction<any | null>) {
      state.assigneeId = action.payload.assigneeId;
    },
    viewBasicTasks(state, action: PayloadAction<any | null>) {
      state.loadingStats2 = false;
      state.assigneeTaskId = action.payload.assigneeTaskId;
    },
    viewBasicTasksSuccess(state, action: PayloadAction<any | null>) {
      state.loadingStats2 = true;
      state.taskAssignee = action.payload.data;
    },
    OpenDahboardTaskViews(state, action: PayloadAction<any | null>) {
      state.viewTaskDashboard = action.payload;
    },
    taskAddDocument(state, action: PayloadAction<any>) { },
    taskDeleteDocument(state, action: PayloadAction<any>) { },
  },
});

export const {
  actions: taskAction,
  reducer: taskReducer,
  name: sliceKeyTask,
} = taskSlice;

/**
 *  *********************  REDUX SELECTOR ******************    
 */

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.task || initialState;

export const selectTaskState = createSelector([selectDomain], (State) => State);

/**
 *  *********************  SAGA SECTION ******************    
 */
export const getState = (state: RootState) => state.task;

export function* taskList(props: any) {
  try {
    const i = yield select(getState);

    const apiResponse = yield backendApi.taskList(i);
    const count =
      apiResponse.data.length < i.limit
        ? (i.page - 1) * i.limit + apiResponse.data.length
        : -1;

    yield put(taskAction.BasicActions({ count }));
    yield put(taskAction.ListSuccess(apiResponse));
  } catch (error) {
    yield put(taskAction.ListSuccess([]));
  } finally {
    if (yield cancelled()) {
      console.log("in finally cancelled");
    }
  }
}

export function* TaskBoardListReq(props: any) {
  try {

    const apiResponse = yield backendApi.taskBoardList(props.payload);

    yield put(taskAction.TaskBoardListSuccess(apiResponse));
  } catch (error) {
    yield put(taskAction.TaskBoardListSuccess([]));
  } finally {
    if (yield cancelled()) {
      console.log("in finally cancelled");
    }
  }
}

function* addTask(props) {
  try {
    const i = yield select(getState);

    const apiResponse = yield backendApi.addTask(i, props.payload);
    yield put(globalConfigActions.startLoader(null));
    if (apiResponse.success) {
      yield put(globalConfigActions.enableFeedback("Task Created Successfully."));
      yield put(taskAction.LoaderStart(false));
      yield put(taskAction.List({ showingFrom: props.showingFrom }));
      yield put(taskAction.addTaskSuccess({}));
    } else {
      yield put(globalConfigActions.enableFeedback("Task Creation failed."));
      yield put(taskAction.addTaskFailure({}));
    }
    yield put(taskAction.BasicActions({ isLoadingData: false }));
    yield put(taskAction.LoaderStart(false));

    yield put(globalConfigActions.endLoader(null));
  } catch (error) {
    yield put(globalConfigActions.enableFeedback("something went wrong"));
  }
}

function* updateTask(props) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.updateTask(i, props.payload);
    if (apiResponse.success && (props.payload.DueDate || props.payload.Time)) {
      yield put(taskAction.changeTaskReminder(null))
    }
    if (apiResponse.success) {
      yield put(taskAction.TaskBoardListUpdated(null));
    }
    yield put(globalConfigActions.enableFeedback("Task updated successfully"));
    yield put(taskAction.BasicActions({ notHideSideBar: true }));

    yield put(taskAction.currentTaskData(apiResponse));

    yield put(taskAction.BasicActions({ isLoadingData: false }));

    const fieldArray = [
      "Title",
      "Priority",
      "DueDate",
      "Assignee",
      "Observer",
      "Status",
    ];
    if (
      helperMethods.isCallNextApi(fieldArray, props.payload) &&
      props.payload.slugUser
    ) {
      yield taskList(null);
    }
    if (
      helperMethods.isCallNextApi(["DueDate", "Time"], props.payload) &&
      props.payload.slugUser
    ) {
      yield put(taskAction.BasicActions({ isShowDrawer: "show" }));
    }
  } catch (error) {
    [];
  }
}

function* addComment(props) {
  try {
    const i = yield select(getState);
    yield backendApi.addComment(i, props.payload);
    yield put(taskAction.notCloseSideBar(true));
    yield put(taskAction.viewTask(null));
  } catch (error) {
    [];
  }
}

function* viewTask(props) {
  try {
    yield put(globalConfigActions.startLoader(null));
    const i = yield select(getState);
    const apiResponse = yield backendApi.viewTask(i);

    yield put(taskAction.currentTaskData(apiResponse));
    yield put(taskAction.setIsLoadingData(false));
    yield put(globalConfigActions.endLoader(null));
  } catch (error) {
    [];
  }
}

function* singleCompanyDetail(props) {
  try {
    const apiResponse = yield backendApi.singleCompanyDetail(props.payload);
    yield put(taskAction.singleCompanySuccess(apiResponse));
  } catch (error) {
    [];
  }
}

function* deleteTask(props) {
  try {
    yield put(globalConfigActions.startLoader(null));
    const i = yield select(getState);
    yield backendApi.deleteTask(i, props.payload);
    yield put(globalConfigActions.enableFeedback("task deleted Successfully"));
    yield put(taskAction.CloseSideBar(true));
    yield put(taskAction.List({ showingFrom: props.showingFrom }));
  } catch (error) {
    [];
  }
}

function* companyListForDropdown(props) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.companyListForDropdownTemp(
      i,
      props.payload
    );

    yield put(taskAction.dropdownCompanyListSuccess(apiResponse));
  } catch (error) {
    [];
  }
}

function* leadListForDropdown(props) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.leadListForDropdownTask(
      i,
      props.payload
    );
    yield put(taskAction.dropdownLeadListSuccess(apiResponse));
  } catch (error) {
    yield put(taskAction.dropdownLeadListSuccess([]));
  }
}

function* quoteListForDropdown() {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.quoteListForDropdown();
    yield put(taskAction.dropdownQuoteListSuccess(apiResponse));
  } catch (error) {
    yield put(taskAction.dropdownQuoteListSuccess([]));
  }
}

function* assigneeList() {
  try {
    const apiResponse = yield backendApi.assigneeList(null);

    yield put(taskAction.assigneeListOfTaskSuccess(apiResponse));
  } catch (error) {
    [];
  }
}

function* Count() {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.taskCount(i);
    yield put(taskAction.BasicActions({ taskCount: apiResponse.count }));
  } catch (error) {
    yield put(taskAction.BasicActions({ taskCount: 0 }));
  }
}


function* DeleteRequestCountSaga() {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.deleteRequestCountAPI(i);
    yield put(taskAction.DeleteRequestCountSuccesss(apiResponse));
  } catch (error) {
    yield put(taskAction.DeleteRequestCountSuccesss(null));
  }
}

function* sendRequest(props) {
  try {
    const i = yield select(getState);
    yield backendApi.sendRequest(i, props.payload);

    yield put(taskAction.viewTaskId(props.payload.TaskID));
    yield viewTask(null);
  } catch (error) { }
}

function* actionOnSelectData(props) {
  try {
    const i = yield select(getState);

    yield put(taskAction.BasicActions({ remote: false }));

    yield backendApi.actionOnSelectData(i, props.payload);
    yield (globalConfigActions.enableFeedback(`Task delete request ${props.payload.action}ed`));

    yield put(taskAction.BasicActions({ status: true }));
    yield put(taskAction.List({ showingFrom: props.showingFrom }));
    yield put(taskAction.BasicActions({ remote: false }));
  } catch (error) {
    [];
  }
}

function* TodayDueTasks() {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.TodayDueTasks();

    yield put(taskAction.BasicActions({ todaysTask: apiResponse.data }));
  } catch (error) {
    yield put(taskAction.BasicActions({ todaysTask: "" }));
  }
}

function* taskStates(props: any) {
  try {
    const i = yield select(getState);

    const apiResponse = yield backendApi.taskStats(i);

    yield put(taskAction.TaskStatesSuccesss(apiResponse));
  } catch (error) {
    console.log(error);
    yield put(taskAction.TaskStatesSuccesss([]));
  }
}
function* viewBasicTasks(props: any) {
  try {
    const i = yield select(getState);

    const apiResponse = yield backendApi.viewBasisTasksAPI(i);

    yield put(taskAction.viewBasicTasksSuccess(apiResponse));
  } catch (error) {
    console.log(error);
    yield put(taskAction.viewBasicTasksSuccess([]));
  }
}

function* calendarTaskReq(props) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.calendarTasksAPI(props.payload);
    if (apiResponse)
      yield put(taskAction.TaskCalendarDataSuccess(apiResponse));
  } catch (error) {
    yield put(taskAction.TaskCalendarDataFailure([]));
  }
}

function* addDocument(props) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.addDocument(props.payload);
    yield put(taskAction.taskIsActionDone(true));
    yield put(
      globalConfigActions.enableFeedback("Document added Successfully")
    );

    yield put(taskAction.currentTaskDocumentsData(apiResponse));
  } catch (error) {
    [];
  }
}

function* deleteDocument(props) {
  try {
    const i = yield select(getState);
    const apiResponse = yield backendApi.deleteDocument(props.payload);
    yield put(
      globalConfigActions.enableFeedback("Document deleted successfully")
    );
    yield put(taskAction.taskIsActionDone(true));
    yield put(taskAction.currentTaskDocumentsData(apiResponse));
  } catch (error) {
    [];
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* taskSaga() {
  // Watches for loadRepos actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(taskAction.List.type, taskList);
  yield takeLatest(taskAction.TaskStates.type, taskStates);
  yield takeLatest(taskAction.AssigneeFilter.type, taskStates);
  yield takeLatest(taskAction.FilterData.type, taskList);
  yield takeLatest(taskAction.FilterDataForTaskBoard.type, TaskBoardListReq);
  yield takeLatest(taskAction.LoadMoreTask.type, taskList);
  yield takeLatest(taskAction.NewPage.type, taskList);
  yield takeLatest(taskAction.ChangeLimit.type, taskList);
  yield takeLatest(taskAction.Search.type, taskList);
  yield takeLatest(taskAction.Sort.type, taskList);
  yield takeLatest(taskAction.viewBasicTasks.type, viewBasicTasks);
  yield takeLatest(taskAction.addTask.type, addTask);
  yield takeLatest(taskAction.addComment.type, addComment);
  yield takeLatest(taskAction.updateTask.type, updateTask);
  yield takeLatest(taskAction.viewTask.type, viewTask);
  yield takeLatest(taskAction.deleteTask.type, deleteTask);
  yield takeLatest(taskAction.assigneeListOfTask.type, assigneeList);
  yield takeLatest(taskAction.Count.type, Count);
  yield takeLatest(taskAction.DeleteRequestCount.type, DeleteRequestCountSaga);
  yield takeLatest(taskAction.sendRequest.type, sendRequest);
  yield takeLatest(taskAction.actionOnDeleteReq.type, actionOnSelectData);
  yield takeLatest(taskAction.currentDueTask.type, TodayDueTasks);
  yield takeLatest(taskAction.singleCompany.type, singleCompanyDetail);
  yield takeLatest(taskAction.dropdownCompanyList.type, companyListForDropdown);
  yield takeLatest(taskAction.dropdownLeadList.type, leadListForDropdown);
  yield takeLatest(taskAction.dropdownQuoteList.type, quoteListForDropdown);
  yield takeLatest(taskAction.TaskCalendarData.type, calendarTaskReq)
  yield takeLatest(taskAction.TaskBoardList.type, TaskBoardListReq)
  yield takeLatest(taskAction.taskAddDocument.type, addDocument);
  yield takeLatest(taskAction.taskDeleteDocument.type, deleteDocument);
}
