import React, { useEffect, useState } from "react";
import Board from "react-trello";
import "../assets/taskBoard.css";
import { selectTaskState, taskAction } from "../../task/redux/task";
import { useSelector, useDispatch } from "react-redux";
import {
  StatusCodeColor,
  StatusFontCodeColor,
} from "../../../sharedUtils/globalHelper/status";
import TaskBoardHeader from "../components/taskBoard_header";
import {
  salesTasks,
  AdminTasks,
  CommercialTask,
  RenewalTask,
  ComplaintTask,
  DeveloperTask,
} from "../../../sharedUtils/globalHelper/constantValues";
import moment from "moment";
import TaskApi from "../../task/redux/model/task";

export default function TaskBoard(props) {
  const dispatch = useDispatch();
  const taskState = useSelector(selectTaskState);
  const assigneeList = taskState.assigneeList;
  const taskBoardData = taskState.tasksBoard;
  const PER_PAGE = 1;

  const [selectedTaskRole, setSelectedTaskRole] = useState("commercial_task");
  const [taskLimit, setTaskLimit] = useState(1);
  const [taskIsNext, setTaskIsNext] = useState(true);
  const [taskAssignee, setTaskAssignee]: any = useState({});

  const _assigneeList = (payload) =>
    dispatch(taskAction.assigneeListOfTask(payload));
  const _taskBoard = (payload) => dispatch(taskAction.TaskBoardList(payload));
  const _slugUpdate = (payload) => dispatch(taskAction.SlugUpdate(payload));
  const _listLimit = (payload) => dispatch(taskAction.ChangeLimit(payload));
  const _nextPage = (payload) => dispatch(taskAction.NewPage(payload));
  const _loadingDataAction = (payload) =>
    dispatch(taskAction.LoaderStart(payload));

  useEffect(() => {
    _assigneeList(null);
    _slugUpdate(props);
    // _listLimit({ limit: 50 });
  }, []);

  useEffect(() => {
    let data = [];
    if (selectedTaskRole === "admin_task") {
      AdminTasks &&
        AdminTasks.map((e) => {
          data.push(e.value);
        });
    } else if (selectedTaskRole === "sales_task") {
      salesTasks &&
        salesTasks.map((e) => {
          data.push(e.value);
        });
    } else if (selectedTaskRole === "renewal_task") {
      RenewalTask &&
        RenewalTask.map((e) => {
          data.push(e.value);
        });
    } else if (selectedTaskRole === "complaint_task") {
      ComplaintTask &&
        ComplaintTask.map((e) => {
          data.push(e.value);
        });
    } else if (selectedTaskRole === "developer_task") {
      DeveloperTask &&
        DeveloperTask.map((e) => {
          data.push(e.value);
        });
    } else {
      CommercialTask &&
        CommercialTask.map((e) => {
          data.push(e.value);
        });
    }
    _loadingDataAction(false);
    _taskBoard({ status: data });
  }, [selectedTaskRole]);

  // let taskRoles = selectedTaskRole === 'admin_task' ? AdminTasks : salesTasks;

  let taskRoles;
  if (selectedTaskRole === "admin_task") {
    taskRoles = AdminTasks;
  } else if (selectedTaskRole === "sales_task") {
    taskRoles = salesTasks;
  } else if (selectedTaskRole === "renewal_task") {
    taskRoles = RenewalTask;
  } else if (selectedTaskRole === "complaint_task") {
    taskRoles = ComplaintTask;
  } else if (selectedTaskRole === "developer_task") {
    taskRoles = DeveloperTask;
  } else {
    taskRoles = CommercialTask;
  }

  const taskCards = (status) => {
    let newData = [];

    Object.keys(taskBoardData).length > 0 &&
      Object.keys(taskBoardData).forEach((x) => {
        let data = taskBoardData[x];
        data.map((f) => {
          if (x == status.value) {
            newData.push({
              id: f._id,
              title: f.Title,
              label: moment(f.DueDate).format("DD-MM-YYYY"),
              description: f.Description,
              tags: [
                {
                  bgcolor: "transparent",
                  color: "#000000",
                  title: f.Assignee?.name,
                },
                {
                  bgcolor: StatusCodeColor[f.Priority],
                  color: StatusFontCodeColor[f.Priority],
                  title: f.Priority,
                },
                {
                  bgcolor: f.Company
                    ? "rgba(25,53,98,.08)"
                    : "rgba(34, 166, 179,.08)",
                  color: f.Company ? "#193562" : "#22a6b3",
                  title: f.Company
                    ? f.Company?.businessName
                    : f.Consumer?.firstName + f.Consumer?.surName,
                },
              ],
            });
          }
        });
      });
    return newData;
  };

  const [updatedTaskData, setUpdatedTaskData]: any = useState({
    lanes:
      taskRoles &&
      taskRoles.map((status) => ({
        id: status.value,
        title: status.label,
        label: "",
        cards: taskCards(status),
        currentPage: 1,
      })),
  });

  useEffect(() => {
    setUpdatedTaskData({
      lanes:
        taskRoles &&
        taskRoles.map((status) => ({
          id: status.value,
          title: status.label,
          label: "",
          cards: taskCards(status),
          currentPage: 1,
        })),
    });
  }, [taskBoardData]);

  const handleDragEnd = (
    cardId,
    sourceLaneId,
    targetLaneId,
    position,
    cardDetails
  ) => {
    const obj: any = {};

    if (cardDetails.id && cardDetails.laneId) {
      obj.Status = cardDetails.laneId;
      obj.TaskID = cardDetails.id;
      obj.slugUser = props.slug;
    }

    props._updateTask(obj);
  };

  const handleChangeTaskRadio = (radio) => {
    setSelectedTaskRole(radio);
  };

  const handleNextPage = () => {
    let x = taskLimit;
    const h = { ...taskState };
    if (taskState.count === -1) {
      h.page = x + 1;
      setTaskLimit(taskLimit + 1);
      _loadingDataAction(false);
      _nextPage(h);
    }
  };

  const handlePrevPage = () => {
    let x = taskLimit;
    const h = { ...taskState };
    if (taskLimit > 1) {
      h.page = x - 1;
      setTaskLimit(taskLimit - 1);
      _loadingDataAction(false);
      _nextPage(h);
    }
  };

  const handleCardDrawer = (cardId) => {
    props.setEditDrawer(cardId);
  };

  const delayedPromise = (durationInMs, resolutionPayload) => {
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve(resolutionPayload);
      }, durationInMs);
    });
  };

  const generateCards = (requestedPage = 1, laneId) => {
    if (!taskIsNext) {
      return delayedPromise(2000, []);
    }

    const cards = [];

    let fetchedItems = (requestedPage - 1) * PER_PAGE;

    const obj: any = {};

    if (laneId) obj.status = laneId;
    if (fetchedItems) obj.page = fetchedItems;
    obj.slug = props.slug;
    obj.limit = 10;
    if (taskAssignee.value) obj.assignee = taskAssignee.value;

    TaskApi.taskListData(obj).then((response: any) => {
      if (response.success) {
        Object.keys(response.data) &&
          Object.keys(response.data).map((e) => {
            response.data[e].map((f) => {
              cards.push({
                id: f._id,
                title: f.Title,
                label: moment(f.DueDate).format("DD-MM-YYYY"),
                description: f.Description,
                tags: [
                  {
                    bgcolor: "transparent",
                    color: "#000000",
                    title: f.Assignee?.name,
                  },
                  {
                    bgcolor: StatusCodeColor[f.Priority],
                    color: StatusFontCodeColor[f.Priority],
                    title: f.Priority,
                  },
                  {
                    bgcolor: f.Company?.businessName
                      ? "rgba(25,53,98,.08)"
                      : "rgba(34, 166, 179,.08)",
                    color: f.Company?.businessName ? "#193562" : "#22a6b3",
                    title: f.Company
                      ? f.Company?.businessName
                      : f.Consumer?.firstName + f.Consumer?.surName,
                  },
                ],
              });
            });
          });
        setTaskIsNext(response.hasNext);
      }
    });
    return cards;
  };

  const onLaneScroll = (requestedPage, laneId) => {
    let newCards = generateCards(requestedPage, laneId);
    return delayedPromise(2000, newCards);
  };

  return (
    <div className="app task_board_new">
      <TaskBoardHeader
        {...props}
        selectedTaskRole={selectedTaskRole}
        taskLimit={taskLimit}
        setTaskLimit={setTaskLimit}
        handleChangeTaskRadio={handleChangeTaskRadio}
        loader={taskState.remote}
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
        count={taskState.count}
        _loadingDataAction={_loadingDataAction}
        _listLimit={_listLimit}
        taskRoles={taskRoles}
        setTaskAssignee={setTaskAssignee}
      />

      <Board
        data={updatedTaskData}
        draggable
        handleDragEnd={handleDragEnd}
        onLaneScroll={onLaneScroll}
        hideCardDeleteIcon={true}
        onCardClick={handleCardDrawer}
        style={{
          height: "78vh",
        }}
      />
    </div>
  );
}
