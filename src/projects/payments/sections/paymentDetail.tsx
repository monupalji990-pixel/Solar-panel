import React from "react";
import { useDispatch } from "react-redux";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TableContainer from "@material-ui/core/TableContainer";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import moment from 'moment'

const useStyles = makeStyles(() => ({
  ViewActionBtn: {
    background: "#193562",
    width: "26px",
    height: "26px",
    borderRadius: 3,
    padding: "3px",
    color: "#ffffff",
    "&:hover": {
      background: "#193562",
    },
    boxShadow: "0 5px 15px 0 rgba(58, 122, 254, 0.2)",
  },
  DeleteActionBtn: {
    background: "#ef4d56 ",
    width: "26px",
    height: "26px",
    borderRadius: 3,
    padding: "3px",
    color: "#ffffff",
    "&:hover": {
      background: "#ef4d56 ",
    },
    boxShadow: "0 5px 15px 0 rgba(58, 122, 254, 0.2)",
  },
  IconSize: {
    fontSize: "1rem",
  },
  CountBtnStyle: {
    minWidth: "200px",
    textAlign: "center",
    "@media(max-width:480px)": {
      minWidth: "auto",
      display: "block",
      padding: 15,
    },
  },
}));

export default function leadList(props) {

  const dispatch = useDispatch();

  const CurrentProps = props;
  const classes = useStyles();

  const projectContractVal =
    props.detail?.service === "Gas" ?
      ((props.detail?.gasAq ? props.detail?.gasAq : 0) *
        (props.detail?.quoteId?.contractLength ? Number(props.detail?.quoteId?.contractLength.match(/\d+/)[0]) : 0) * props.detail?.uplift) / 100
      :
      ((props.detail?.electricAq?.unitDaykWh ? props.detail?.electricAq?.unitDaykWh : 0) +
        (props.detail?.electricAq?.unitNightkWH ? props.detail?.electricAq?.unitNightkWH : 0) +
        (props.detail?.electricAq?.unitWkdkWh ? props.detail?.electricAq?.unitWkdkWh : 0)
        * Number(props.detail?.quoteId?.contractLength.match(/\d+/)[0]) * props.detail?.uplift) / 100

  return (
    <Grid item md={12} xs={12}>
      <TableContainer component={Paper}>
        <Table aria-label="caption table" >
          <TableBody>
            <TableRow>
              <TableCell>
                <strong>Projected Live Commission</strong>
              </TableCell>
              <TableCell>
                {props.data?.totalCommission || '0'}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <strong>Projected Contract Value</strong>
              </TableCell>
              <TableCell>
                {projectContractVal}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <strong>Total Commissions Recieved</strong>
              </TableCell>
              <TableCell>
                {props.data?.totalSalesRepCommission || '0'}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <strong>Total Commission Paid Against</strong>
              </TableCell>
              <TableCell>
                {props.data?.totalPaidCommission || '0'}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <strong>Amount Paid</strong>
              </TableCell>
              <TableCell>
                {props.data?.latestSupplierTransaction || '0'}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <strong>Date Paid</strong>
              </TableCell>
              <TableCell>
                {moment(props.data?.latestSupplierDate).format('YYYY-MM-DD') || '-'}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <strong>Uplift</strong>
              </TableCell>
              <TableCell>
                {props.detail?.uplift}
              </TableCell>
            </TableRow>

          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
}
