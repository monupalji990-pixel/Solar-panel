import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import "../assets/taskBoard.css";
import Select from "react-select";
import { selectTaskState, taskAction } from "../../task/redux/task";
import { useSelector, useDispatch } from "react-redux";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import CircularProgress from "@material-ui/core/CircularProgress";
import SyncIcon from "@material-ui/icons/Sync";
import Button from "@material-ui/core/Button";

export default function TaskBoardHeader(props) {
  const dispatch = useDispatch();

  const taskState = useSelector(selectTaskState);
  const assigneeList = taskState.assigneeList;

  const [selectedAssignee, setSelectedAssignee]: any = useState([]);

  const _assigneeList = (payload) =>
    dispatch(taskAction.assigneeListOfTask(payload));
  const _slugUpdate = (payload) => dispatch(taskAction.SlugUpdate(payload));
  const _filterData = (payload) =>
    dispatch(taskAction.FilterDataForTaskBoard(payload));

  useEffect(() => {
    _assigneeList(null);
    _slugUpdate(props);
  }, []);

  let assigneeOptions = [];
  if (assigneeList) {
    assigneeOptions = assigneeList.map((e) => ({
      label: e.name,
      value: e._id,
    }));
  }

  const handleChangeAssignee = (options) => {
    setSelectedAssignee(options);
    props.setTaskAssignee(options);
    const filterObject: any = {};
    if (options.value) filterObject.Assignee = options.value;
    filterObject.status =
      props.taskRoles && props.taskRoles.map((x) => x.value);
    props._loadingDataAction(false);
    _filterData(filterObject);
  };

  const customStyles = {
    control: (styles) => ({ ...styles, color: "#000000" }),
    placeholder: (styles) => ({ ...styles, color: "#000000" }),
    singleValue: (styles) => ({ ...styles, color: "#000000" }),
    input: (styles) => ({ ...styles, color: "#000000" }),
  };

  const refreshBoard = () => {
    const filterObject: any = {};
    filterObject.status =
      props.taskRoles && props.taskRoles.map((x) => x.value);
    props._loadingDataAction(false);
    _filterData(filterObject);
  };

  return (
    <>
      <div className="task_board_header">
        <Grid container spacing={3} style={{ alignItems: "center" }}>
          <Grid item>
            <span className="task_board_title">Task Board</span>
          </Grid>

          <Grid item className="task_board_head_radio">
            <FormControl component="fieldset">
              <RadioGroup
                row
                aria-label="role-wise-task"
                name="role-wise-task"
                onChange={(e) => {
                  props.handleChangeTaskRadio(e.target.value);
                }}
                defaultValue="commercial_task"
              >
                <FormControlLabel
                  value="commercial_task"
                  control={<Radio color="primary" />}
                  label="Commercial"
                />
                <FormControlLabel
                  value="admin_task"
                  control={<Radio color="primary" />}
                  label="Admin"
                />
                <FormControlLabel
                  value="complaint_task"
                  control={<Radio color="primary" />}
                  label="Complaints"
                />
                <FormControlLabel
                  value="sales_task"
                  control={<Radio color="primary" />}
                  label="Sales"
                />
                <FormControlLabel
                  value="renewal_task"
                  control={<Radio color="primary" />}
                  label="Renewal"
                />
                <FormControlLabel
                  value="developer_task"
                  control={<Radio color="primary" />}
                  label="Developer"
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid item md={2} sm={12} xs={12}>
            <Select
              id="assignee"
              styles={customStyles}
              className="WidhtFull100"
              placeholder="Select Assignee"
              value={selectedAssignee}
              margin="normal"
              aria-describedby="assignee-number-error"
              onChange={handleChangeAssignee}
              name="assignee"
              isClearable={true}
              options={assigneeOptions}
              classNamePrefix="select"
            />
          </Grid>

          {/* <Grid item md={2} sm={12} xs={12}>
                        <Select
                            id="status"
                            styles={customStyles}
                            className="WidhtFull100"
                            placeholder="Status"
                            value={selectedStatus}
                            margin="normal"
                            aria-describedby="status-number-error"
                            onChange={handleChangeStatus}
                            name="status"
                            isMulti
                            options={TaskStatus}
                            classNamePrefix="select"
                        />
                    </Grid> */}
          {/* 
                    <Grid item className="task_board_page" style={{ marginLeft: 'auto' }}>
                        <span className="page-icon" onClick={props.handlePrevPage}
                            style={
                                {
                                    cursor: props.taskLimit <= 1 ? 'not-allowed' : 'pointer',
                                    pointerEvents: props.taskLimit <= 1 ? 'all' : 'auto',
                                }
                            }>
                            <LeftArrow />
                        </span>
                        <span className="task_pages">{props.taskLimit}</span>
                        <span className="page-icon" onClick={props.handleNextPage}
                            style={
                                {
                                    cursor: props.count !== -1 ? 'not-allowed' : 'pointer',
                                    pointerEvents: props.count !== -1 ? 'all' : 'auto',
                                }
                            }>
                            <RightArrow />
                        </span>
                    </Grid> */}

          <Grid item style={{ marginLeft: "auto" }}>
            <Button
              color="primary"
              onClick={refreshBoard}
              style={{ minWidth: "auto" }}
            >
              <SyncIcon />
            </Button>
          </Grid>

          {!props.loader && (
            <Grid item>
              <CircularProgress />
            </Grid>
          )}
        </Grid>
      </div>
    </>
  );
}
