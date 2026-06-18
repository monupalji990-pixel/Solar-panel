import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Grid from "@material-ui/core/Grid";
import MyDrawer from "../../../sharedUtils/sharedComponents/drawerHelper";
import * as Yup from "yup";
import Select from "react-select";
import {
  paymentAction,
} from "../redux/payments";
import { AM } from "../../../sharedUtils/globalHelper/constantValues"; // export default connect(
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import OnTextEditInput from "../../../sharedUtils/sharedComponents/editHelpers2/onTextEditHelper";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import { paymentTypeOptions } from "../../../sharedUtils/globalHelper/constantValues";
import {
  assigneeAction,
  selectAssigneeState,
} from "../../assignee/redux/assignee";
import moment from "moment";

export default function EditPaymentHistory(props) {
  const ds = "750px";
  return (
    <MyDrawer
      drawerSize={ds}
      iconName="Payment"
      open={props.open == "editPayment" ? true : false}
      onClose={props.onClose.bind(this)}
      {...props}
    >
      <EditPaymentHistoryLogic {...props} />
    </MyDrawer>
  );
}

function EditPaymentHistoryLogic(props) {

  const assigneeState = useSelector(selectAssigneeState);

  const _editHistoryPayment = (payload) =>
    dispatch(paymentAction.editHistoryPayment(payload));
  const _assigneeList = (payload) => dispatch(assigneeAction.list(payload));

  const dispatch = useDispatch();

  React.useEffect(() => {
    _assigneeList({});
  }, [])

  const {
    amount,
    comment,
    commissionType,
    date,
    paymentType,
    percentage,
    totalCommissionAmount,
    user,
    _id,
  } = props.data?.data

  const simpleEdit = (value, closeEdit, setSubmitting) => {

    const initValue = {
      comment: comment,
      type: "commissionPayment",
      paymentType: paymentType,
    }

    const obj: any = { ...initValue }
    const data: any = {
      supplierId: props?.data?.sqId?.supplierId,
      quoteId: props?.data?.sqId?.quoteId,
    }
    const paymentId = _id;

    if (props.data?.paymentId) obj.paymentHistoryId = props.data?.paymentId
    if (paymentId) obj.paymentId = paymentId
    if (value.comment) obj.comment = value.comment
    if (value?.paymentType) obj.paymentType = value?.paymentType
    obj.type = "commissionPayment"

    const newObj = {
      obj: obj,
      data: data
    }

    _editHistoryPayment(newObj);
    closeEdit(null);
    setSubmitting(false);
    props.onClose(true);
  }

  return (
    <div>
      <Grid container spacing={2} className="txt-uppercase">
        <TableContainer component={Paper}>
          <Table aria-label="caption table">
            <TableBody>
              <TableRow>
                <TableCell>
                  <strong>Date</strong>
                </TableCell>
                <TableCell component="th" scope="row">
                  {moment(date).format("DD/MM/YYYY")}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>User</strong>
                </TableCell>

                <TableCell component="th" scope="row">
                  {user}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Status</strong>
                </TableCell>
                {AM.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="paymentType"
                      value={paymentType ? paymentType : "-"}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        paymentType: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <Select
                            className={
                              props.errors.paymentType && props.touched.paymentType
                                ? "ErrorColor"
                                : ""
                            }
                            variant="outlined"
                            id="paymentType"
                            placeholder="Select Status"
                            value={{
                              label: props.values.paymentType,
                              value: props.values.paymentType
                            }}
                            onChange={(e) => {
                              props.setFieldValue("paymentType", e.value);
                            }}
                            onBlur={props.handleBlur}
                            margin="normal"
                            aria-describedby="paymentType-number-error"
                            name="paymentType"
                            options={paymentTypeOptions}
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell>
                    {paymentType || "-"}
                  </TableCell>
                )}
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Commission Type</strong>
                </TableCell>
                <TableCell>
                  {commissionType || "-"}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Amount</strong>
                </TableCell>

                <TableCell component="th" scope="row">
                  {amount}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Percentage</strong>
                </TableCell>

                <TableCell component="th" scope="row">
                  {percentage}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Total Commision</strong>
                </TableCell>

                <TableCell component="th" scope="row">
                  {totalCommissionAmount}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>
                  <strong>Note</strong>
                </TableCell>
                {AM.includes(props.slug) ? (
                  <TableCell component="th" scope="row">
                    <OnTextEditInput
                      name="comment"
                      value={comment ? comment : 'N/A'}
                      onSubmit={simpleEdit}
                      validateIt={Yup.object().shape({
                        comment: Yup.string().required("Required"),
                      })}
                    >
                      {(props) => {
                        return (
                          <TextField
                            error={
                              props.errors.comment && props.touched.comment
                                ? true
                                : false
                            }
                            name="comment"
                            value={props.values.comment}
                            onChange={props.handleChange}
                            onBlur={props.handleBlur}
                            margin="normal"
                          />
                        );
                      }}
                    </OnTextEditInput>
                  </TableCell>
                ) : (
                  <TableCell component="th" scope="row">
                    {comment}
                  </TableCell>
                )}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </div>
  );
}
