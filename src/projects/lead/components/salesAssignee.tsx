import React, { useEffect } from 'react';
import { Formik } from 'formik';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Select from 'react-select';
import CardActions from '@material-ui/core/CardActions';
import { leadOptions } from '../../../sharedUtils/globalHelper/constantValues'
import { useSelector } from 'react-redux';
import { selectLeadState } from '../redux/lead';

export default function SalesAssignee(props) {
  const salesRepListForDropdown  = useSelector(selectLeadState).salesRepListForDropdown;

  useEffect(() => {
    if (salesRepListForDropdown && salesRepListForDropdown.length < 1) props._salesRepList();
  }, []);

  let AssigneeList = []
  if (salesRepListForDropdown) {
    AssigneeList = salesRepListForDropdown.map(e => ({ label: e.name, value: e._id }));
  }

  return (
    <div className="app">
      <Formik
        initialValues={{
          assignee: null,
          status: null
        }}
        onSubmit={(values) => {
          const sendingObject: any = {}
          if (values.assignee) sendingObject.assignee = values.assignee.value;
          if (values.status) sendingObject.status = values.status.value;
          if (props.leadIds) sendingObject.leadIds = props.leadIds
          props._loadingDataAction(false);
          props._addSalesRepAssignee(sendingObject);
          props.setShowSearch(0);
          props.onClose();
        }}
      >
        {props => {
          const {
            values,
            touched,
            errors,
            dirty,
            isSubmitting,
            handleChange,
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
                    error={errors.assignee && touched.assignee}
                    id="role"
                    className="WidhtFull100 basic-multi-select"
                    placeholder="Assignee List"
                    value={values.assignee}
                    margin="normal"
                    aria-describedby="assignee-number-error"
                    onChange={e => setFieldValue('assignee', e)}
                    onBlur={handleBlur}
                    name="assignee"
                    options={AssigneeList}
                    classNamePrefix="select"
                  />
                </Grid>

                <Grid item xs={12} md={12}>
                  <Select
                    error={errors.status && touched.status}
                    id="role"
                    className="WidhtFull100 basic-multi-select"
                    placeholder="Lead Status"
                    value={values.status}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="status-number-error"
                    onChange={e => setFieldValue('status', e)}
                    name="status"
                    options={leadOptions}
                    classNamePrefix="select"
                  />
                </Grid>

                <Grid item xs={12} md={12}>
                  <CardActions
                    style={{ paddingLeft: 0, paddingRight: 0, marginTop: 20 }}
                  >
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      type="submit"
                    >
                      Add Assignee
                    </Button>
                  </CardActions>
                </Grid>
              </Grid>
            </form>
          );
        }}
      </Formik>
    </div>
  );
}