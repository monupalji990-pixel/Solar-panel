import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import MaterialTable from "material-table";
import Avatar from "@material-ui/core/Avatar";
import { Typography } from "@material-ui/core";
import {
    SocketUserStatus,
    StatusCodeColor,
    UserRole,
    StatusFontCodeColor,
} from "../../../sharedUtils/globalHelper/status";

const useStyles = makeStyles({
    UserFieldStyle: {
        display: "flex",
        alignItems: "center",
    },
});

export default function UsersList(props) {

    const classes = useStyles();

    const columns = [
        {
            title: "User",
            field: "user",
            sorting: false,
            render: (rowData) => (
                <div className={classes.UserFieldStyle}>
                    <Avatar src={rowData.image}>
                        {rowData.image === undefined &&
                            rowData.name &&
                            rowData.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography
                        style={{ marginLeft: 10 }}
                        variant="body2"
                        display="inline"
                    >
                        {rowData.name}
                    </Typography>
                </div>
            ),
        },
        {
            title: 'Role',
            field: 'role',
            sorting: false,
            render: (rowData) => (
                <span
                    className="StatusChip"
                    style={{
                        color: StatusFontCodeColor[rowData.role],
                        backgroundColor: StatusCodeColor[rowData.role],
                    }}
                >
                    {UserRole[rowData.role]}
                </span>
            ),
        },
        {
            title: 'Status',
            field: 'status',
            sorting: false,
            render: (rowData) => (
                <>
                    <span
                        className="StatusChip"
                        style={{
                            color: StatusFontCodeColor[rowData.status],
                            backgroundColor: StatusCodeColor[rowData.status],
                        }}
                    >
                        {SocketUserStatus[rowData.status]}
                    </span>
                </>
            )
        }
    ]

    const data = props.userList && props.userList.map((x) => ({
        image: x.avatar !== "" ? x.avatar : undefined,
        name: x.name,
        role: x.role?.roleName,
        status: x.idleStatus ? x.idleStatus : 'working'
    }))

    return (
        <Grid container style={{ marginTop: 10 }} component={Paper}>
            <Grid item xs={12} className="darkTableStyle">
                <MaterialTable
                    title="Users"
                    columns={columns}
                    data={data}
                    options={{
                        sorting: false,
                        pageSize: 20,
                        paging:true,
                        pageSizeOptions:[10,25, 50, 100],
                    }}
                />
            </Grid>

        </Grid>
    );
}