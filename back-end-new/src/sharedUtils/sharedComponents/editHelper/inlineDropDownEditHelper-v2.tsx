import React, { useState } from 'react';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import { Formik } from 'formik';
import EditIcon from '@material-ui/icons/Edit';
import ReactSelect from 'react-select';
import * as Yup from 'yup';

export default function app(props) {
  let myProps = props;
  const [editKey, setEditKey] = useState(props.editKey ? props.editKey : null);

  let validateIt = null;
  if (myProps.type === 'email') {
    validateIt = Yup.object().shape({
      [myProps.id]: Yup.string()
        .email()
        .required('Required'),
    });
  }
  return (
    <Formik
      initialValues={{ [myProps.id]: myProps.value }}
      onSubmit={(value, { setSubmitting, setErrors }) =>
        props.onSubmit(value, setEditKey, setSubmitting, setErrors)
      }
      validationSchema={validateIt}
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
        } = props;
        return (
          <form onSubmit={handleSubmit}>
            {editKey == 'editClicked' ? (
              <React.Fragment>
                <ReactSelect
                  error={
                    errors[myProps.id] && touched[myProps.id] ? true : false
                  }
                  className="profile-pic"
                  id={myProps.id}
                  disabled={!(editKey == 'editClicked')}
                  value={values[myProps.id]}
                  placeholder="Secondary email"
                  helperText={!errors[myProps.id] && myProps.helperText}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  margin="normal"
                />
                {errors[myProps.id] && touched[myProps.id] && (
                  <div className="input-feedback">{errors[myProps.id]}</div>
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
                {values[myProps.id]}
                <IconButton
                  onClick={() => setEditKey('editClicked')}
                  color="primary"
                  aria-label="directions"
                  size="small"
                >
                  <EditIcon />
                </IconButton>
              </React.Fragment>
            )}
          </form>
        );
      }}
    </Formik>
  );
}
