import React, { useState } from "react";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import RadioGroup from "@material-ui/core/RadioGroup";
import ReactSelect from "react-select";
import CheckBox from "./inlineCheckbox";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import { Avatar, Grid, makeStyles } from "@material-ui/core";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

const useStyles = makeStyles({
  avatar: {
    margin: 10,
  },
  bigAvatar: {
    margin: 0,
    width: 150,
    height: 150,
    cursor: "pointer",
    borderRadius: "100%",
    border: "solid 3px #3f51b5",
  },
});

export default function EditComponent(myProps): JSX.Element {
  const htmlCode: any[] = [];
  const props: any = myProps;

  if (props.editC) {
    htmlCode.push(<props.editC {...props}></props.editC>);
  } else if (props.editType) {
    if (props.editType == "textBox") {
      htmlCode.push(<DefaultTextEditor {...props} />);
    }
    if (props.editType == "select") {
      htmlCode.push(<DefaultSelectEditor {...props} />);
    }
    if (props.editType == "number") {
      htmlCode.push(<DefaultNumberEditor {...props} />);
    }
    if (props.editType == "radio") {
      htmlCode.push(<DefaultRadioEditor {...props} />);
    }
    if (props.editType == "checkbox") {
      htmlCode.push(<DefaultCheckboxEditor {...props} />);
    }
    if (props.editType == "image") {
      htmlCode.push(<DefaultImageEditor {...props} />);
    }
  }

  const x = htmlCode[0];
  htmlCode.push(
    <>
      <IconButton
        type="submit"
        disabled={props.fProps.isSubmitting}
        color="primary"
        aria-label="directions"
      >
        <CheckIcon />
      </IconButton>
      <IconButton
        type="button"
        onClick={() => {
          props.changeStatus("view");
        }}
        color="primary"
        aria-label="directions"
      >
        <CloseIcon />
      </IconButton>
    </>
  );
  {
    props.editType == "image"
      ? htmlCode.push(
          <IconButton
            onClick={() => {
              props.fProps.setFieldValue(props.id, null);
            }}
            type="button"
            color="primary"
            aria-label="directions"
          >
            <DeleteForeverIcon
              style={{
                cursor: "pointer",
                marginLeft: props.editType == "image" ? "" : "auto",
                alignSelf: "center",
                color: "red",
              }}
            />
          </IconButton>
        )
      : "";
  }
  return (
    <>
      {htmlCode.map((x) => (
        <>{x}</>
      ))}
    </>
  );
}
function DefaultTextEditor(props) {
  console.log(props);
  return (
    <div>
      <TextField
        name={props.id}
        type={props.editType}
        onChange={props.fProps.handleChange}
        error={
          !!(props.fProps.errors[props.id] && props.fProps.touched[props.id])
        }
        value={props.fProps.values[props.id]}
      />
      <FormHelperText className="errormsg" id={props.id}>
        {props.fProps.errors[props.id]}
      </FormHelperText>
    </div>
  );
}
function DefaultNumberEditor(props) {
  console.log(props);
  return (
    <div>
      <TextField
        name={props.id}
        type={props.editType}
        onChange={props.fProps.handleChange}
        error={
          !!(props.fProps.errors[props.id] && props.fProps.touched[props.id])
        }
        value={props.fProps.values[props.id]}
      />
      <FormHelperText className="errormsg" id={props.id}>
        {props.fProps.errors[props.id]}
      </FormHelperText>
    </div>
  );
}
function DefaultSelectEditor(props) {
  return (
    <div>
      <ReactSelect
        id={props.id}
        name={props.id}
        placeholder={props.placeholder}
        error={
          !!(props.fProps.errors[props.id] && props.fProps.touched[props.id])
        }
        value={props.fProps.values[props.id]}
        onChange={(e) => props.fProps.setFieldValue(props.id, e)}
        options={props.options}
        margin="normal"
      />
      <FormHelperText className="errormsg" id={props.id}>
        {props.fProps.errors[props.id]}
      </FormHelperText>
    </div>
  );
}

function DefaultRadioEditor(props) {
  console.log(props);
  return (
    <RadioGroup
      name={props.id}
      value={props.fProps.values[props.id]}
      onChange={props.fProps.handleChange}
      row
    >
      {props.options}
    </RadioGroup>
  );
}

function DefaultCheckboxEditor(props) {
  return <CheckBox {...props} />;
}

function DefaultImageEditor(props) {
  const classes = useStyles();
  const pId = props.id;
  const mvalue = { ...props.fProps.values };

  const fileChange = (
    <>
      <input
        style={{
          display: "none",
        }}
        type="file"
        onChange={(e) => {
          props.onChangeImg(e, props.fProps.setFieldValue),
            props.fProps.submitForm;
        }}
        id={props.id}
        name="image_uploads"
        accept=".jpg, .jpeg, .png"
      />
      <label htmlFor={props.id}>
        <Avatar
          id="fileupload2"
          alt="Remy Sharp"
          src={mvalue[pId]}
          className={classes.bigAvatar}
          // onClick={imageChange}
        />
      </label>
    </>
  );
  
  return <div>{fileChange}</div>;
}
