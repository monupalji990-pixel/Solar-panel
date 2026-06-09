import React, { } from "react";
import MaterialTable from "material-table";
import { useSelector } from "react-redux";
import Grid from "@material-ui/core/Grid";
import { selectCompanyState } from "../../company/redux/company";
import makeStyles from "@material-ui/core/styles/makeStyles";
import moment from "moment";
import { IconButton, Tooltip } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { AM } from "../../../sharedUtils/globalHelper/constantValues";

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
}));

export default function PaymentList(props) {
    const companyState = useSelector(selectCompanyState);
    const classes = useStyles();

    const deleteConfirmation = (data) => {
        if (confirm("Are you sure you want to delete?")) {
            if (data._id) {
                props._DeleteDeptPayment({
                    quoteId: props.quote._id,
                    paymentId: data._id,
                });
                props._isLoadingData(true, props.type);
                props._slugUpdate(props);
                props._viewSingleQuote({ quoteId: props.quote._id })
            }
        }
    };

    const columns = [
        {
            title: "Title",
            field: "title",
        },
        {
            title: "Amount",
            field: "amount",
            render: (data) => (
                <span>£{data.amount}</span>
            ),
        },
        {
            title: "Due Date",
            field: "paymentDueDate",
            render: (data) => (
                <span>{moment(data.paymentDueDate).format("DD/MM/YYYY")}</span>
            ),
        },
        {
            width: "2%",
            cellStyle: { width: "2%" },
            headerStyle: { width: "2%" },
            sorting: false,
            render: (rowData) =>
                AM.includes(props.slug) && (
                    <Tooltip title="Delete">
                        <IconButton
                            className={classes.DeleteActionBtn}
                            aria-label="delete"
                            onClick={() => deleteConfirmation(rowData)}
                        >
                            <DeleteIcon className={classes.IconSize} />
                        </IconButton>
                    </Tooltip>
                ),
        }
    ]

    return (
        <Grid item md={12} xs={12} style={{ marginTop: 20 }}>
            <MaterialTable
                title="Payments"
                columns={columns}
                // isLoading={props.newLoader}
                data={props.paymentData.map((e) => ({ ...e }))}
                options={{
                    search: false,
                    sorting: false,
                }}
                actions={[
                    {
                        icon: "add",
                        tooltip: "Add Payment",
                        isFreeAction: true,
                        onClick: props.setAddPaymentDrawer,
                    }
                ]}
            />
        </Grid>
    );
}
