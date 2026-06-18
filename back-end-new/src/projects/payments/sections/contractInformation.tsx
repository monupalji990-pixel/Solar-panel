import React from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TableContainer from "@material-ui/core/TableContainer";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Select from 'react-select';
import {
  PaymentStatus, StatusCodeColor, LESStatus,
  StatusFontCodeColor,
} from '../../../sharedUtils/globalHelper/status'
import moment from "moment";
import OnTextEditInput from "../../../sharedUtils/sharedComponents/editHelpers2/onTextEditHelper";
import { HeadlineStatusOptions, LESStatusOptions } from "../../../sharedUtils/globalHelper/constantValues";

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

  const editDetail = (data) => {
    let obj: any = {};
    const supplierId = props?.data?.supplierId
    const quoteId = props?.data?.quoteId
    if (data.lesStatus) obj.lesStatus = data.lesStatus.value;
    if (data.contractStatus) obj.contractStatus = data.contractStatus.value;
    if (supplierId) obj.supplierId = supplierId
    if (quoteId) obj.quoteId = quoteId
    props._editPayments(obj);
  }

  return (
    <Grid item md={12} xs={12}>
      <TableContainer component={Paper}>
        <Table aria-label="caption table" >
          <TableBody>
            <TableRow>
              <TableCell>
                <strong>Contract Reference</strong>
              </TableCell>
              <TableCell>
                {props.detail?.quoteId?.QuoteID}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <strong>Partner Name</strong>
              </TableCell>
              <TableCell>
                EDANPOWER LIMITED
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <strong>Contract Processed Date</strong>
              </TableCell>
              <TableCell>
                {moment(props.detail?.contractAcceptDate).format('YYYY-MM-DD')}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <strong>Supplier</strong>
              </TableCell>
              <TableCell>
                {props.detail?.supplierId?.supplierName}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <strong>Business Name</strong>
              </TableCell>
              <TableCell>
                {props.detail?.companyId?.businessName}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <strong>Postcode</strong>
              </TableCell>
              <TableCell>
                {props.detail?.service === "Gas" ?
                  props.detail?.quoteId?.service?.gas?.postcode ? props.detail?.quoteId?.service?.gas?.postcode : '-'
                  :
                  props.detail?.quoteId?.service?.electric?.postcode ? props.detail?.quoteId?.service?.electric?.postcode : '-'
                }
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <strong>Product</strong>
              </TableCell>
              <TableCell>
                {props.detail?.service}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <strong>Term</strong>
              </TableCell>
              <TableCell>
                {props.detail?.quoteId?.contractLength}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <strong>Meter Number</strong>
              </TableCell>
              <TableCell>
                {props.detail?.service === "Gas" ?
                  props.detail?.quoteId?.service?.gas?.meterNumber ? props.detail?.quoteId?.service?.gas?.meterNumber : '-'
                  :
                  props.detail?.quoteId?.service?.electric?.meterNumber ? props.detail?.quoteId?.service?.electric?.meterNumber : '-'
                }
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <strong>Estimated Annual Usage</strong>
              </TableCell>
              <TableCell>
                {props.detail?.service === "Gas" ?
                  props.detail?.gasAq
                  :
                  (props.detail?.electricAq?.unitDaykWh ? props.detail?.electricAq?.unitDaykWh : 0) +
                  (props.detail?.electricAq?.unitNightkWH ? props.detail?.electricAq?.unitNightkWH : 0) +
                  (props.detail?.electricAq?.unitWkdkWh ? props.detail?.electricAq?.unitWkdkWh : 0)
                }
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <strong>Proposed Contract Start Date</strong>
              </TableCell>
              <TableCell>
                {moment(props.detail?.contractAcceptDate).format('YYYY-MM-DD')}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <strong>Supplier Status</strong>
              </TableCell>
              <TableCell>
                {props.detail?.supplierId ? (props.detail?.supplierId.status ? 'Active' : '-' ) : '-'}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <strong>LES Status</strong>
              </TableCell>
              <TableCell>
                <OnTextEditInput
                  name="lesStatus"
                  value={props.detail?.lesStatus ? LESStatus[props.detail?.lesStatus] : "-"}
                  onSubmit={editDetail}
                  validateIt={Yup.object().shape({
                    lesStatus: Yup.string()
                      .required("LES Status is required")
                      .nullable(),
                  })}
                >
                  {(props) => (
                    <Grid item>
                      <Select
                        id="lesStatus"
                        className="WidhtFull100 basic-multi-select"
                        placeholder="LES Status"
                        value={props.values.lesStatus}
                        onChange={(e) => {
                          props.setFieldValue("lesStatus", e);
                        }}
                        onBlur={props.handleBlur}
                        margin="normal"
                        aria-describedby="lesStatus-number-error"
                        name="lesStatus"
                        options={LESStatusOptions}
                      />
                    </Grid>
                  )}
                </OnTextEditInput>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <strong>Headline Status</strong>
              </TableCell>
              <TableCell>
                <OnTextEditInput
                  name="contractStatus"
                  value={PaymentStatus[props.detail?.contractStatus]}
                  onSubmit={editDetail}
                  validateIt={Yup.object().shape({
                    contractStatus: Yup.string()
                      .required("Headline Status is required")
                      .nullable(),
                  })}
                >
                  {(props) => (
                    <Grid item>
                      <Select
                        id="contractStatus"
                        className="WidhtFull100 basic-multi-select"
                        placeholder="Headline Status"
                        value={props.values.contractStatus}
                        onChange={(e) => {
                          props.setFieldValue("contractStatus", e);
                        }}
                        onBlur={props.handleBlur}
                        margin="normal"
                        aria-describedby="contractStatus-number-error"
                        name="contractStatus"
                        options={HeadlineStatusOptions}
                      />
                    </Grid>
                  )}
                </OnTextEditInput>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <strong>Contract Start Date</strong>
              </TableCell>
              <TableCell>
                {props.detail?.service === "Gas" ?
                  (moment(props.detail?.quoteId?.service?.gas?.contract_start_date).format('YYYY-MM-DD')) :
                  (moment(props.detail?.quoteId?.service?.electric?.contract_start_date).format('YYYY-MM-DD'))
                }
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <strong>Contract End Date</strong>
              </TableCell>
              <TableCell>
                {props.detail?.service === "Gas" ?
                  (moment(props.detail?.quoteId?.service?.gas?.contract_end_date).format('YYYY-MM-DD')) :
                  (moment(props.detail?.quoteId?.service?.electric?.contract_end_date).format('YYYY-MM-DD'))
                }
              </TableCell>
            </TableRow>

            {/* <TableRow>
              <TableCell>
                <strong>Tariff</strong>
              </TableCell>
              <TableCell>
                ??????????????????
              </TableCell>
            </TableRow> */}

            <TableRow>
              <TableCell>
                <strong>Standing Charge</strong>
              </TableCell>
              <TableCell>
                {props.detail?.service === "Gas" ?
                  (props.detail?.quoteId?.service?.gas?.dailyCharges ? props.detail?.quoteId?.service?.gas?.dailyCharges : 0)
                  :
                  (props.detail?.quoteId?.service?.electric?.dailyCharges ? props.detail?.quoteId?.service?.electric?.dailyCharges : 0)
                }
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <strong>Day Unit Rate</strong>
              </TableCell>
              <TableCell>
                {props.detail?.service === "Gas" ?
                  (props.detail?.quoteId?.service?.gas?.unitRate ? props.detail?.quoteId?.service?.gas?.unitRate : 0)
                  :
                  (props.detail?.quoteId?.service?.electric?.unitDayRate ? props.detail?.quoteId?.service?.electric?.unitDayRate : 0)
                }
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <strong>Night Unit Rate</strong>
              </TableCell>
              <TableCell>
                {
                  props.detail?.service === "Electric" ?
                    props.detail?.quoteId?.service?.electric?.unitNightRate ?
                      props.detail?.quoteId?.service?.electric?.unitNightRate : 0
                    : 0
                }
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <strong>EW Rate</strong>
              </TableCell>
              <TableCell>
                {
                  props.detail?.service === "Electric" ?
                    props.detail?.quoteId?.service?.electric?.unitWkdRate ?
                      props.detail?.quoteId?.service?.electric?.unitWkdRate : 0
                    : 0
                }
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
}
