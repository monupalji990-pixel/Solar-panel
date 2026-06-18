import React, { useState } from "react";
import { Formik } from "formik";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { helperMethods } from "sharedUtils/globalHelper/helperMethod";

const useStyles = makeStyles({
  editable: {
    cursor: "pointer",
    width: "100%",
  },
});

export default function app(props) {
  const myProps = props;
  const [editKey, setEditKey] = useState(props.editKey ? props.editKey : null);

  const classes = useStyles();

  return (
    <Formik
      enableReinitialize
      initialValues={{ [myProps.name]: myProps.value }}
      onSubmit={(value, { setSubmitting, setErrors }) => {
        props.onSubmit(value, setEditKey, setSubmitting, setErrors)
      }
      }
      validationSchema={myProps.validateIt}
    >
      {(props) => {
        const {
          values,
          touched,
          errors,
          isSubmitting,
          handleSubmit,
          handleReset,
          setFieldValue
        } = props;

        let TobeViewed = values[myProps.name]
        if (myProps.reactSelect) {
          TobeViewed = values[myProps.name]?.label
        }
        if (myProps.switch) {
          TobeViewed = values[myProps.name] ? myProps.ShowOnChecked : myProps.showOnUnCheck
        }

        return (
          <form onSubmit={handleSubmit}>
            {editKey === "editClicked" ? (
              <React.Fragment>
                <myProps.children {...props} name={myProps.name} fprops={props}>
                </myProps.children>
                {errors[myProps.name] && touched[myProps.name] && (
                  <div className="input-feedback">{errors[myProps.name]}</div>
                )}
                <React.Fragment>
                  <IconButton
                    type="submit"
                    disabled={isSubmitting}
                    color="primary"
                    aria-label="directions"
                  >
                    <CheckIcon />
                  </IconButton>
                  <IconButton
                    type="button"
                    onClick={() => {
                      if (myProps.onCloseEdit) {
                        myProps.onCloseEdit();
                      } else {
                        setEditKey(null);
                        handleReset();
                      }
                    }}
                    color="primary"
                    aria-label="directions"
                  >
                    <CloseIcon />
                  </IconButton>
                </React.Fragment>
              </React.Fragment>
            ) : (
              <React.Fragment>
                {
                  myProps.clickable ? (
                    <p
                      className={classes.editable}
                    >
                      <span
                        style={{
                          float: "left",
                          width: "95%",
                          overflowWrap: "anywhere",
                        }}
                        onClick={() => myProps.onClickFn()}
                        onMouseOver={(e) => {
                          (e.target as HTMLElement).style.textDecoration =
                            "underline";
                        }}
                        onMouseLeave={(e) => {
                          (e.target as HTMLElement).style.textDecoration =
                            "none";
                        }}
                      >
                        {myProps.isShowDate && myProps.isShowDate == true
                          ? helperMethods.ConvertDate(values[myProps.name])
                          :
                          TobeViewed
                        }
                      </span>
                      <EditIcon
                        onClick={() => setEditKey("editClicked")}
                        style={{
                          width: "5%",
                          textAlign: "right",
                          fontSize: 18,
                          float: "right",
                          color: "#3f51b5",
                        }}
                      />
                    </p>
                  ) :
                    <p
                      className={classes.editable}
                      onClick={() => setEditKey("editClicked")}
                    >
                      <span
                        style={{
                          float: "left",
                          width: "95%",
                          overflowWrap: "anywhere",
                        }}
                      >
                        {myProps.isShowDate && myProps.isShowDate == true
                          ? helperMethods.ConvertDate(values[myProps.name])
                          :
                          TobeViewed
                        }
                      </span>
                      <EditIcon
                        style={{
                          width: "5%",
                          textAlign: "right",
                          fontSize: 18,
                          float: "right",
                          color: "#3f51b5",
                        }}
                      />
                    </p>
                }
              </React.Fragment>
            )
            }
          </form>
        );
      }}
    </Formik >
  );
}
