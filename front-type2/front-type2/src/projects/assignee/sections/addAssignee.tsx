import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import Select from "react-select";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormHelperText from "@material-ui/core/FormHelperText";
import Grid from "@material-ui/core/Grid";
import CardActions from "@material-ui/core/CardActions";
import MyDrawer from "../../../sharedUtils/sharedComponents/drawerHelper";

export default function AddAssignee(props) {
  return (
    <MyDrawer
      drawerSize="600px"
      iconName="Assignee"
      open={props.open == "addAssigneeDrawer"}
      onClose={props.onClose.bind(this)}
    >
      <AddAssigneeLogic {...props} />
    </MyDrawer>
  );
}

function AddAssigneeLogic(props) {
  useEffect(() => {
    props._assigneeList();
  }, []);

  const [startLoader, setStartLoader] = useState(false);

  useEffect(() => {
    if (props.hideSideBar) {
      props.onClose();
      props._closeSideBar(false);
    }
  }, [props.hideSideBar]);

  let al = [];
  if (props.allAssignee) {
    const ids = props.allAssignee.map((v) => v._id);
    al = props.assigneeListForDropdown.filter((v) => ids.indexOf(v._id) === -1);
  } else {
    al = props.assigneeListForDropdown.filter((v) => v._id);
  }

  let allPl = [];
  if (al) allPl = al.map((e) => ({ label: e.name, value: e._id }));

  return (
    <div className="app">
      <Formik
        initialValues={{ Assignee: null }}
        onSubmit={(value) => {
          const a: any = {};
          if (props.showingFrom && props.showingFrom === "viewCompany")
            a.CompanyID = props.currentCompany._id;
          if (props.showingFrom && props.showingFrom === "viewConsumer")
            a.ConsumerID = props.currentConsumer._id;
          if (value.Assignee) {
            a.Assignee = value.Assignee.map((v) => v.value);
          }
          setStartLoader(true);
          props._addAssignee({ data: a, action: props.showingFrom });
        }}
      >
        {(props) => {
          const {
            values,
            touched,
            errors,
            isSubmitting,
            handleBlur,
            handleSubmit,
            setFieldValue,
          } = props;

          return (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item md={12} sm={12} xs={12}>
                  <Select
                    className={
                      errors.Assignee && touched.Assignee ? "ErrorColor" : ""
                    }
                    id="Assignee"
                    isMulti
                    placeholder="Select Assignee"
                    value={values.Assignee}
                    onChange={(e) => {
                      setFieldValue("Assignee", e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="Assignee-number-error"
                    options={allPl}
                  />
                  {errors.Assignee && touched.Assignee && (
                    <FormHelperText className="errormsg" id="Assignee-error">
                      {errors.Assignee}
                    </FormHelperText>
                  )}
                </Grid>
              </Grid>
              <CardActions
                style={{ paddingLeft: 0, paddingRight: 0, marginTop: 20 }}
              >
                <Button
                  size="medium"
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Add Assignee
                </Button>
                {startLoader && <CircularProgress />}
              </CardActions>
            </form>
          );
        }}
      </Formik>
    </div>
  );
}
