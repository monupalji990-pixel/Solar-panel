import React, { useState } from "react";
import { Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import Grid from "@material-ui/core/Grid";
import CardActions from "@material-ui/core/CardActions";
import CircularProgress from "@material-ui/core/CircularProgress";
import MyDrawer from "../../../sharedUtils/sharedComponents/drawerHelper";
import { selectItemState, itemAdminAction } from "../redux/itemAdmin";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  HeaderStyle: {
    position: "absolute",
    top: 30,
    display: "flex",
    justifyContent: "center",
    width: "57%",
    marginLeft: "17%",
    "@media(max-width:480px)": {
      right: 0,
      width: "34%",
      top: 12,
    },
  },
}));

export default function AddItem(props) {
  return (
    <MyDrawer
      drawerSize="600px"
      iconName="Item"
      open={props.open == "addItemDrawer"}
      onClose={props.onClose.bind(this)}
    >
      <AddItemLogic {...props} />
    </MyDrawer>
  );
}

function AddItemLogic(props) {
  const classes = useStyles();

  const itemState = useSelector(selectItemState);
  const { hideSideBar } = itemState;
  const dispatch = useDispatch();

  const _addItem = (payload) => dispatch(itemAdminAction.addItem(payload));
  const _closeSideBar = (payload) =>
    dispatch(itemAdminAction.itemCloseSideBar(payload));

  const [startLoader, setStartLoader] = useState(false);

  const initialValues = {
    title: '',
    description: '',
    price: ''
  };

  if (hideSideBar) {
    props.onClose();
    _closeSideBar(false);
  }

  let dynamicValidation = Yup.object().shape({
    title: Yup.string().required("Name is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.number().required("Price is required"),
  });

  return (
    <div className="app" >
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          const obj: any = { ...values }
          setStartLoader(true);
          _addItem(obj);
          setTimeout(() => {
            setStartLoader(false);
          }, 3000);
        }}
        validationSchema={dynamicValidation}
      >
        {(props) => {
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
            <form onSubmit={handleSubmit} autoComplete="off">
              <Grid container spacing={3}>
                <div className={classes.HeaderStyle}>
                  <h1 style={{ fontSize: 22 }}>
                    Add Item
                  </h1>
                </div>
                <Grid item xs={12} md={12}>
                  <TextField
                    variant="outlined"
                    error={!!(errors.title && touched.title)}
                    id="title"
                    className="WidhtFull100"
                    label="Title"
                    type="text"
                    value={values.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="name-error"
                  />
                  {errors.title && touched.title && (
                    <FormHelperText className="errormsg" id="name-error">
                      {errors.title}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={12}>
                  <TextField
                    variant="outlined"
                    error={!!(errors.description && touched.description)}
                    id="description"
                    className="WidhtFull100"
                    label="Description"
                    type="text"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="description-error"
                  />
                  {errors.description && touched.description && (
                    <FormHelperText className="errormsg" id="description-error">
                      {errors.description}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} md={12}>
                  <TextField
                    variant="outlined"
                    error={!!(errors.price && touched.price)}
                    id="price"
                    className="WidhtFull100"
                    label="Price"
                    type="number"
                    value={values.price}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    margin="normal"
                    aria-describedby="price-error"
                  />
                  {errors.price && touched.price && (
                    <FormHelperText className="errormsg" id="price-error">
                      {errors.price}
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
                  onClick={handleReset}
                  disabled={!dirty || isSubmitting}
                >
                  Reset
                </Button>
                <Button
                  size="medium"
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Add Item
                </Button>
                {startLoader && <CircularProgress />}
              </CardActions>
            </form>
          );
        }}
      </Formik>
    </div >
  );
}
