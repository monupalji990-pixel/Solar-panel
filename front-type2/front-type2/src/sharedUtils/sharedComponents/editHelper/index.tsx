import React from "react";
import ViewComponent from "./viewComponent";
import EditComponent from "./editComponent";
import validation from "./validation";
import Button from "@material-ui/core/Button";
import { Formik } from "formik";
import propTypes from "prop-types";
import { Grid, Tooltip } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";

export default function InlineEditHelper(myProps) {
  const props: any = myProps;
  const [status, setStatus] = React.useState("view");
  if (status == "view") {
    return (
      <>
        <p
          style={{ margin: "0", cursor: "pointer", textTransform: "none" }}
          onClick={() => setStatus("edit")}
        >
          <ViewComponent {...props} />

          <EditIcon
            onClick={() => setStatus("edit")}
            style={{
              textAlign: "right",
              fontSize: 18,
              float: myProps.editType == "image" ? "none" : "right",
              // color: "#2f3c4e",
              color: myProps.editType == "image" ? "#2f3c4e" : "#2f3c4e",
            }}
          />
        </p>
      </>
    );
  } else {
    return (
      <Formik
        initialValues={{ [props.id]: props.value }}
        onSubmit={(value, { setSubmitting, resetForm, setErrors }) => {
          props.onSubmit(value, setStatus, setSubmitting, setErrors, resetForm);
        }}
        validationSchema={validation(props)}
      >
        {(fProps) => {
          return (
            <form
              onSubmit={fProps.handleSubmit}
              style={{
                display: myProps.editType == "image" ? "block" : "inline-flex",
              }}
            >
              <EditComponent
                fProps={fProps}
                {...props}
                changeStatus={setStatus}
              />
            </form>
          );
        }}
      </Formik>
    );
  }
}

InlineEditHelper.propTypes = {
  editC: propTypes.any,
  editType: propTypes.oneOf([
    "textBox",
    "select",
    "number",
    "radio",
    "checkbox",
    "image",
  ]),
  viewC: propTypes.any,
  options: propTypes.any,
  viewType: propTypes.oneOf(["text", "chip", "image", "array"]),
  validation: propTypes.any,
  onSubmit: propTypes.func,
  value: propTypes.any,
  valueShow: propTypes.string,
  id: propTypes.string,
  name: propTypes.string,
  onChangeImg: propTypes.any,
};
