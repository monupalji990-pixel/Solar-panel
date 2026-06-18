import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import * as Yup from "yup";
import Select from "react-select";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import OnTextEditInput from "../../../sharedUtils/sharedComponents/editHelpers2/onTextEditHelper";
import { selectAssigneeState } from "projects/assignee/redux/assignee";
import { selectQuoteState } from "../redux/quote";

const useStyles = makeStyles((theme) => ({
  Spacing: {
    marginTop: "10px",
    marginBottom: "10px",
  },
  TypoSpace: {
    padding: "10px",
  },
}));

export default function Assignee(props) {
  const classes = useStyles();
  const [selectedAssigneeId, setSelectedAssigneeId] = useState("");

  const Assignee = props.currentQuote?.Assignee || '';
  let AssigneeName = Assignee ? Assignee.name : "";
  const assigneeState = useSelector(selectAssigneeState);

  const quoteState = useSelector(selectQuoteState);

  const [AssigneeOptions, setAssigneeOptions] = useState([]);

  useEffect(() => {
    let AssigneeOptions1 = [];

    if (quoteState.currentQuote?.Company?.Assignee)
      AssigneeOptions1 = quoteState.currentQuote?.Company?.Assignee;
    if (quoteState.currentQuote?.Consumer?.Assignee)
      AssigneeOptions1 = quoteState.currentQuote?.Consumer?.Assignee;
    setAssigneeOptions(AssigneeOptions1)
  }, [quoteState.currentQuote])

  const [assigneeList, setAssigneeList] = useState([]);
  useEffect(() => {
    let tempArr = []
    AssigneeOptions.filter((s) => {
      if (s.isActive !== 0)
        tempArr.push({
          label: s.name,
          value: s.name,
          id: s._id
        })
    })

    setAssigneeList(tempArr)
  }, [AssigneeOptions])

  const simpleEdit = (value, closeEdit, setSubmitting,) => {
    const updateAssignee = {
      QuoteID: props.currentQuote._id,
      Assignee: selectedAssigneeId,
    };
    props._isLoadingData(true);
    props._updateAssignee(updateAssignee);
    if (!props.isLoadingData) {
      closeEdit(null);
    }
    setSubmitting(false);
  };

  return (
    <Grid container spacing={3} className={classes.Spacing}>
      <Grid item xs={12} md={12}>
        <Paper>
          <Typography variant="h6" className={classes.TypoSpace} gutterBottom>
            Assignee
          </Typography>
          <TableContainer component={Paper}>
            <Table aria-label="caption table">
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="AssigneeName"
                      label="Select Assignee"
                      value={AssigneeName}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        AssigneeName: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <Select
                            error={
                              props.errors.AssigneeName &&
                                props.touched.AssigneeName
                                ? true
                                : false
                            }
                            className="basic-multi-select WidhtFull100"
                            name="AssigneeName"
                            value={{
                              label: props.values.AssigneeName,
                              value: props.values.AssigneeName,
                            }}
                            options={assigneeList}
                            helperText={!props.errors.AssigneeName}
                            onChange={(e) => {
                              props.setFieldValue("AssigneeName", e.value);
                              setSelectedAssigneeId(e.id);
                            }}
                            onBlur={props.handleBlur}
                            margin="normal"
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Grid>
    </Grid>
  );
}