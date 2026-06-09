import React, { useEffect } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import MyDrawer from "../../../sharedUtils/sharedComponents/drawerHelper";
import { useDispatch } from "react-redux";
import { taskAction } from "projects/task/redux/task";
import {
    TaskValueToStatus,
    StatusCodeColor,
    StatusFontCodeColor,
} from "../../../sharedUtils/globalHelper/status";
import MaterialTable from "material-table";
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import moment from "moment";

const useStyles = makeStyles(() => ({
    formControl: {
        minWidth: "100%",
    },
    Spacing: {
        padding: "12px",
    },
    MarginSpacing: {
        marginTop: "30px",
        marginBottom: "30px",
    },
}));

export default function ManageTaskStats(props) {
    return (
        <MyDrawer
            drawerSize="1100px"
            iconName="Tasks"
            open={props.open === "manageTaskStats"}
            onClose={props.onClose.bind(this)}
        >
            <ViewFilterTasks {...props} />
        </MyDrawer>
    );
}


function ViewFilterTasks(props) {

    const dispatch = useDispatch();

    const _viewTasks = (payload) => dispatch(taskAction.viewBasicTasks(payload));

    useEffect(() => {
        if (props?.rowData?._id?.Assignee) {
            _viewTasks({ assigneeTaskId: props?.rowData?._id?.Assignee })
        }
    }, [props?.rowData?._id?.Assignee])

    const { taskAssignee } = props.taskState;

    const formatLot = (value) => {
        if (value && value.trim().length > 0) {
            value = value.replace(new RegExp("/", "g"), "-");
            var stringData = value.split("_")[0];
            stringData = stringData.split("-").reverse().join("-");
            value = new Date(stringData);
            return value;
        } else if (value == null) {
            return "";
        }
        return value;
    };

    const Column: any = [
        {
            title: '#',
            field: 'tableData.id',
            sorting: false,
            render: rowData => { return (<strong>{rowData.tableData.id + 1}</strong>) }
        },
        {
            title: 'Title',
            field: 'Title',
            sorting: false,
        },
        {
            title: 'Company/Consumer',
            sorting: false,
            render: (data) => <span className="StatusChip"
                style={{
                    color: `${data.Company ? "#193562" : "#22a6b3"}`,
                    backgroundColor: `${data.Company
                        ? "rgba(25,53,98,.08)"
                        : "rgba(34, 166, 179,.08)"
                        }`,
                }}>{data.Company} {data.Consumer}</span>
        },
        {
            title: "Status",
            field: "Status",
            render: (rowData) => (
                <span
                    className="StatusChip"
                    style={{
                        color: StatusFontCodeColor[rowData.Status],
                        backgroundColor: StatusCodeColor[rowData.Status],
                    }}
                >
                    {TaskValueToStatus[rowData.Status]}
                </span>
            ),
            sorting: false,
            headerStyle: { fontWeight: "bold" },
        },
        {
            title: 'Due Date',
            field: 'DueDate',
            customSort: (a, b) => formatLot(b.DueDate).getTime() - formatLot(a.DueDate).getTime()
        },
        {
            title: 'Created Date',
            field: 'createdAt',
            sorting: false,
        },
    ]

    const data = taskAssignee && taskAssignee?.map((e) => {
        return {
            Title: e.Title,
            createdAt: moment(e.createdAt).format('DD/MM/YYYY'),
            DueDate: moment(e.DueDate).format('DD/MM/YYYY'),
            Status: e.Status,
            createdBefore: e.createdBefore,
            Company: e.Company,
            Consumer: e.Consumer,

        }
    })

    if (!props?.taskState?.loadingStats2) {
        return (
            <Grid container direction="row" justify="center" alignItems="center">
                <CircularProgress />
            </Grid>
        );
    }

    return (
        <div className="app">
            <MaterialTable
                title="Tasks"
                isLoading={!props?.taskState?.loadingStats2}
                columns={Column}
                data={data}
                options={{
                    search: false,
                }}
            />
        </div>
    );
}