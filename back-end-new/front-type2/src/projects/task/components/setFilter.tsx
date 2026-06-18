import React, { useEffect } from 'react';
import { Formik } from 'formik';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Select from 'react-select';
import CardActions from '@material-ui/core/CardActions';
import Icon from '@material-ui/core/Icon';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { useSelector } from 'react-redux';
import { TaskStatus, salesTasks, AdminTasks, CommercialTask, RenewalTask } from '../../../sharedUtils/globalHelper/constantValues';
import { DataOfList } from '../../../sharedUtils/globalHelper/status'
import { selectTaskState } from '../redux/task';
import { FormControl, FormLabel, RadioGroup, Radio } from '@material-ui/core';

export default function Filter(props) {
  const taskState = useSelector(selectTaskState);
  const assigneeList = taskState.assigneeList;
  const filterData = taskState.filterData;

  useEffect(() => {
    if (['admin'].includes(props.slug)) props._assigneeList();
  }, []);

  const [checked, setChecked] = React.useState(false);

  const handleChangeCheck = event => {
    setChecked(event.target.checked);
  };

  const currentProps = props

  let al = []
  let initAl = []
  let initDataOf = []
  let initTaskStatus = []

  if (assigneeList) {
    al = assigneeList.map(e => ({ label: e.name, value: e._id }));
  }
  if (filterData.AssigneeArray !== undefined) {
    initAl = al.filter(assignee => {
      return filterData.AssigneeArray.find(a => {
        return a === assignee.value ? true : false;
      })
    })
  }
  if (filterData.DataOfArray !== undefined) {
    initDataOf = DataOfList.filter(data => {
      return filterData.DataOfArray.includes(data.value);
    })
  }
  if (filterData.TaskStatus !== undefined) {
    initTaskStatus = TaskStatus.filter(task => {
      return filterData.TaskStatus.includes(task.value);
    })
  }

  const initialValues = {
    dataOf: (filterData.DataOfArray !== undefined && filterData.DataOfArray.length > 0) ? initDataOf : null,
    assignee: (filterData.AssigneeArray !== undefined && filterData.AssigneeArray.length > 0) ? initAl : null,
    status: (filterData.TaskStatus !== undefined && filterData.TaskStatus.length > 0) ? initTaskStatus : null,
    radio: filterData && filterData.radio ? filterData.radio : null
  };

  return (
    <div className="app">
      <Formik
        initialValues={initialValues}
        enableReinitialize
        onSubmit={(values) => {
          const filterObject: any = { radio: values.radio }
          if (values.dataOf) filterObject.DataOfArray = values.dataOf.map(v => v.value);
          if (values.assignee) filterObject.AssigneeArray = values.assignee.map(v => v.value);
          if (values.status) filterObject.TaskStatus = values.status.map(v => v.value);
          if (checked) filterObject.completedBy = 1;
          props._loadingDataAction(false);
          props._filterData(filterObject);
        }}
      >
        {props => {
          const {
            values,
            touched,
            errors,
            handleBlur,
            handleSubmit,
            handleReset,
            setFieldValue,
          } = props;

          return (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                  <Select
                    error={errors.dataOf && touched.dataOf ? true : false}
                    id="role"
                    className="WidhtFull100"
                    placeholder="Search Data of"
                    value={values.dataOf}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="dataOf-number-error"
                    onChange={e => setFieldValue('dataOf', e)}
                    isMulti
                    name="dataOf"
                    options={DataOfList}
                    classNamePrefix="select"
                  />
                </Grid>

                {['admin'].includes(currentProps.slug) &&
                  <Grid item xs={12} md={12}>
                    <Select
                      error={errors.assignee && touched.assignee ? true : false}
                      id="assignee"
                      className="WidhtFull100"
                      placeholder="Choose assignee"
                      value={values.assignee}
                      onBlur={handleBlur}
                      margin="normal"
                      aria-describedby="assignee-number-error"
                      onChange={e => setFieldValue('assignee', e)}
                      isMulti
                      name="assignee"
                      options={al}
                      classNamePrefix="select"
                    />
                  </Grid>}
                <Grid item xs={12} md={12}>
                  <Select
                    error={errors.status && touched.status ? true : false}
                    id="role"
                    className="WidhtFull100"
                    placeholder="Task Status"
                    value={values.status}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="status-number-error"
                    onChange={e => setFieldValue('status', e)}
                    isMulti
                    name="status"
                    options={TaskStatus}
                    classNamePrefix="select"
                  />
                </Grid>


                <Grid item xs={12} md={12}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Select Task Type</FormLabel>
                    <RadioGroup
                      row
                      aria-label="billdate"
                      name="billdatetype"
                      value={values.radio}
                      onChange={(e => {
                        setFieldValue('radio', e.target.value);
                        if (e.target.value === 'salesTask') {
                          setFieldValue('status', salesTasks)
                        } else if (e.target.value === 'adminTask') {
                          setFieldValue('status', AdminTasks)
                        } else if (e.target.value === 'renewalTask') {
                          setFieldValue('status', RenewalTask)
                        } else {
                          setFieldValue('status', CommercialTask)
                        }
                      })}
                    >
                      <FormControlLabel
                        value="salesTask"
                        control={<Radio />}
                        label="Sales Tasks"
                      />
                      <FormControlLabel
                        value="adminTask"
                        control={<Radio />}
                        label="Admin Tasks"
                      />
                      <FormControlLabel
                        value="commercialTask"
                        control={<Radio />}
                        label="Commercial Tasks"
                      />
                      <FormControlLabel
                        value="renewalTask"
                        control={<Radio />}
                        label="Renewal Tasks"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={12}>
                  <CardActions
                    style={{ paddingLeft: 0, paddingRight: 0, marginTop: 20 }}
                  >
                    <Button
                      size="medium"
                      variant="contained"
                      onClick={() => {
                        handleReset()
                        setChecked(false);
                        currentProps._loadingDataAction(false);
                        currentProps._filterData({});
                      }}
                    >
                      <Icon className="fa fa-refresh" />
                    </Button>
                    <Button
                      size="medium"
                      variant="contained"
                      color="primary"
                      type="submit"
                    >
                      <Icon className="fa fa-filter" />
                    </Button>
                  </CardActions>
                </Grid>
              </Grid>
            </form>
          );
        }}
      </Formik>
    </div >
  );
}