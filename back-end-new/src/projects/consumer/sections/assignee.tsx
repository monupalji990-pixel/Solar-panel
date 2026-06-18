import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import FormHelperText from "@material-ui/core/FormHelperText";
import CardActions from "@material-ui/core/CardActions";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function assignee(props) {
  useEffect(() => {
    props._assigneeList();
  }, []);

  const [startLoader, setStartLoader] = useState(false);

  useEffect(() => {
    if (props.consumerState.success) {
      setStartLoader(false);
    }
  }, [props.consumerState.success]);

  const initialValues = {
    Assignee: null,
  };

  let contactList = [];
  if (props.assigneeList && props.assigneeList.length > 0) {
    contactList = props.assigneeList.map((e) => ({
      label: e.name,
      value: e._id,
    }));
  }

  return (
    <div className="app">
      <Formik
        initialValues={initialValues}
        onSubmit={(value, actions) => {
          const a: any = {};
          a.ConsumerID = props.addedConsumer._id;
          if (value.Assignee) {
            a.Assignee = value.Assignee.map((v) => v.value);
          }
          if (a.ConsumerID === undefined) {
            actions.setErrors({
              Assignee: "Please create a consumer first",
            });
          } else {
            setStartLoader(true);
            props._addAssignee(a);
            actions.resetForm();
          }
        }}
        validationSchema={Yup.object().shape({
          Assignee: Yup.string().required("Assignee is required").nullable(),
        })}
      >
        {(props) => {
          const {
            values,
            touched,
            errors,
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
                <Grid item xs={12} md={6}>
                  <Select
                    className={
                      errors.Assignee && touched.Assignee ? "ErrorColor" : ""
                    }
                    id="Assignee"
                    placeholder="Add Assignee"
                    value={values.Assignee}
                    isMulti
                    onChange={(e) => {
                      setFieldValue("Assignee", e);
                    }}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="Assignee-error"
                    name="colors"
                    options={contactList}
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
