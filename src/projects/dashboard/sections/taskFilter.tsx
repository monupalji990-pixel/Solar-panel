import React, { useEffect, useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import MaterialTable, { MTableToolbar } from "material-table";
import Select from "react-select";
import { Button } from "@material-ui/core";
import ViewFilterTasks from "../sections/viewFilterTasks"
import VisibilityIcon from "@material-ui/icons/Visibility";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
    assigneeDrop: {
        minWidth: '350px',
        margin: '0 0 0 auto',
    },
    fontStyle: {
        fontSize: '21px',
        fontWeight: 500,
        padding: '1rem 0',
        margin: 0,
    },
    btnStyle: {
        margin: 10,
        border: '1px solid #fff'
    },
    IconSize: {
        fontSize: "1rem",
    },
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
        border: '1px solid #fff',
        // boxShadow: "0 5px 15px 0 rgba(58, 122, 254, 0.2)",
    },
    darkBackground: {
        background: '#272E48'
    },
    chipStyles: {
        background: 'rgb(255 255 255 / 10%)',
        borderRadius: '5px',
        textAlign: 'center',
        padding: '4px 10px',
    }
});

export default function TaskListFilter(props) {

    const { taskStates } = props.taskState;
    const assigneeList = props.taskState.assigneeList;

    useEffect(() => {
        if (['admin'].includes(props.slug)) props._assigneeList();
    }, []);

    useEffect(() => {
        props._slugUpdate(props);
        props._taskStats();
    }, [])

    const getUserTable = useRef(null);
    const classes = useStyles();
    const [selectOption, setSelectOption] = useState(null);
    const [rowData, setRowData] = useState(null);
    const [setDrawer, setSetDrawer] = useState(null);
    const [drawerIs, setDrawerIs] = useState(null);

    const columns = [
        {
            title: 'Assignee',
            field: 'Assignee',
            sorting: false,
            render: (data) => <strong>{data.Assignee}</strong>,
            // cellStyle: {
            //     backgroundColor: '#272E48',
            //     color: '#FFF'
            // },
            // headerStyle: {
            //     backgroundColor: '#1A233A',
            //     color: '#FFF'
            // }
        },
        {
            title: 'Today',
            field: 'today',
            sorting: false,
            // cellStyle: {
            //     backgroundColor: '#272E48',
            //     color: '#FFF'
            // },
            // headerStyle: {
            //     backgroundColor: '#1A233A',
            //     color: '#FFF'
            // }
        },
        {
            title: '< 7 Days',
            field: 'one_to_seven',
            sorting: false,
            // cellStyle: {
            //     backgroundColor: '#272E48',
            //     color: '#FFF'
            // },
            // headerStyle: {
            //     backgroundColor: '#1A233A',
            //     color: '#FFF'
            // }
        },
        {
            title: '< 14 Days',
            field: 'eight_to_fourteen',
            sorting: false,
            // cellStyle: {
            //     backgroundColor: '#272E48',
            //     color: '#FFF'
            // },
            // headerStyle: {
            //     backgroundColor: '#1A233A',
            //     color: '#FFF'
            // }
        },
        {
            title: '< 30 Days',
            field: 'fifteen_to_thirty',
            sorting: false,
            // cellStyle: {
            //     backgroundColor: '#272E48',
            //     color: '#FFF'
            // },
            // headerStyle: {
            //     backgroundColor: '#1A233A',
            //     color: '#FFF'
            // }
        },
        {
            title: '< 60 Days',
            field: 'thirtyOne_to_sixty',
            sorting: false,
            // cellStyle: {
            //     backgroundColor: '#272E48',
            //     color: '#FFF'
            // },
            // headerStyle: {
            //     backgroundColor: '#1A233A',
            //     color: '#FFF'
            // }
        },
        {
            title: '< 120 Days',
            field: 'sixtyOne_to_120',
            sorting: false,
            // cellStyle: {
            //     backgroundColor: '#272E48',
            //     color: '#FFF'
            // },
            // headerStyle: {
            //     backgroundColor: '#1A233A',
            //     color: '#FFF'
            // }
        },
        {
            title: '< 240 Days',
            field: 'one_twenty_one_to_240',
            sorting: false,
            // cellStyle: {
            //     backgroundColor: '#272E48',
            //     color: '#FFF'
            // },
            // headerStyle: {
            //     backgroundColor: '#1A233A',
            //     color: '#FFF'
            // }
        },
        {
            title: '> 240 Days',
            field: 'more_than_240',
            sorting: false,
            // cellStyle: {
            //     backgroundColor: '#272E48',
            //     color: '#FFF'
            // },
            // headerStyle: {
            //     backgroundColor: '#1A233A',
            //     color: '#FFF'
            // }
        },
        {
            title: 'Total',
            field: 'total',
            render: (data) => <span className={classes.chipStyles}><strong>{data.total}</strong></span>,
            // cellStyle: {
            //     backgroundColor: '#272E48',
            //     color: '#FFF'
            // },
            // headerStyle: {
            //     backgroundColor: '#1A233A',
            //     color: '#FFF'
            // }
        },
        {
            width: "2%",
            sorting: false,
            // cellStyle: {
            //     backgroundColor: '#272E48',
            //     color: '#FFF'
            // },
            // headerStyle: {
            //     backgroundColor: '#1A233A',
            //     color: '#FFF'
            // },
            render: (rowData) => (
                <Tooltip title="View">
                    <IconButton
                        className={classes.ViewActionBtn}
                        aria-label="view"
                        onClick={() => ViewTasks(rowData)}
                    >
                        <VisibilityIcon className={classes.IconSize} />
                    </IconButton>
                </Tooltip>
            ),
        },
    ]

    const data = taskStates.map((e) => {
        return {
            _id: e._id,
            Assignee: e.Assignee ? e.Assignee : '-',
            today: e.stats ? e.stats.today : 0,
            one_to_seven: e.stats ? e.stats.one_to_seven : 0,
            eight_to_fourteen: e.stats ? e.stats.eight_to_fourteen : 0,
            fifteen_to_thirty: e.stats ? e.stats.fifteen_to_thirty : 0,
            thirtyOne_to_sixty: e.stats ? e.stats.thirtyOne_to_sixty : 0,
            sixtyOne_to_120: e.stats ? e.stats.sixtyOne_to_120 : 0,
            one_twenty_one_to_240: e.stats ? e.stats.one_twenty_one_to_240 : 0,
            more_than_240: e.stats ? e.stats.more_than_240 : 0,
            total: e.total ? e.total : 0,
        }
    })

    function closeDrawer() {
        setSetDrawer(null);
        setDrawerIs(null);
    }

    const handleChange = (e) => {
        setSelectOption({ label: e?.label, value: e?.label })
        props._AssigneeFilter({ assigneeId: e.value })
    }

    const ClearSelectValues = () => {
        setSelectOption(null);
        props._AssigneeFilter({ assigneeId: null });
    }

    let AssigneeList = []
    if (assigneeList) {
        AssigneeList = assigneeList.map(e => ({ label: e.name, value: e._id }));
    }

    const ViewTasks = (rowData) => {
        setRowData(rowData);
        setSetDrawer("manageTaskStats");
    }

    const customSorting = (a, b) => {
        return b.total - a.total;
    }

    const customStyles = {
        control: styles => ({ ...styles}),
        placeholder: styles => ({ ...styles }),
        singleValue: (styles, { data }) => ({ ...styles }),
        input: styles => ({ ...styles }),
    }

    return (
        <Grid container style={{ marginTop: 10 }} component={Paper}>
            <Grid item xs={12} className="darkTableStyle">
                <MaterialTable
                    title="Tasks"
                    isLoading={!props?.taskState?.loadingStats}
                    columns={columns}
                    data={data.sort(customSorting)}
                    options={{
                        search: false,
                        sorting: false,
                    }}
                    components={{
                        Toolbar: props => (
                            <Grid container
                                // className={classes.darkBackground}
                                style={{ padding: '0 15px', alignItems: 'center' }}
                            >
                                <Grid item>
                                    <h6 className={classes.fontStyle}>Tasks</h6>
                                </Grid>
                                <Grid item className={classes.assigneeDrop}>
                                    <Select
                                        styles={customStyles}
                                        variant="outlined"
                                        id="assignee"
                                        placeholder="Select Assignee"
                                        onChange={(e) => {
                                            handleChange(e)
                                        }}
                                        defaultValue={selectOption}
                                        margin="normal"
                                        aria-describedby="assignee-error"
                                        name="assignee"
                                        options={AssigneeList}
                                    />
                                </Grid>
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className={classes.btnStyle}
                                        onClick={ClearSelectValues}
                                        disabled={!selectOption}
                                    >
                                        Reset
                                    </Button>
                                </Grid>
                            </Grid>
                        ),
                    }}
                />
            </Grid>

            <ViewFilterTasks
                {...props}
                open={setDrawer}
                getUserTable={getUserTable}
                onClose={closeDrawer}
                showingFrom="taskFilters"
                rowData={rowData}
            />
            {drawerIs}
        </Grid>
    );
}