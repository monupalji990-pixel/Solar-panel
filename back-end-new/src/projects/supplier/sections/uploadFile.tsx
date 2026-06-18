import { Grid } from '@material-ui/core';
import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { selectSupplierState, supplierAction } from "../redux/supplier";
import MaterialTable from 'material-table';
import moment from 'moment'
import Models from '../sections/fileViewer/index';
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import makeStyles from "@material-ui/core/styles/makeStyles";

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

export default function standardFlatFiles(props) {
    const supplierState = useSelector(selectSupplierState);

    const dispatch = useDispatch();
    const classes = useStyles();

    const _uploadStandardFile = (payload) =>
        dispatch(supplierAction.uploadStandardFile(payload));
    const _deleteFlatFile = (payload) =>
        dispatch(supplierAction.removeStandardFile(payload));


    const [startLoader, setStartLoader] = useState(false);
    const [fileUpload, setFileUpload] = useState([]);

    const initialValues: any = {
        services: ''
    };

    const currentSupplier = { ...supplierState.currentSupplier };

    const deleteConfirmation = (data) => {
        if (confirm("Are you sure you want to delete the file?")) {
            _deleteFlatFile({ supplierId: props?.supplier?._id, flatFileLocation: data.standardFlatFile });
        }
    };

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

    const columns: any = [
        {
            title: 'Date',
            field: 'addedOn',
            customSort: (a, b) => formatLot(b.addedOn).getTime() - formatLot(a.addedOn).getTime()
        },
        {
            title: 'Service',
            field: 'service',
        },
        {
            title: 'Data Inserted',
            field: 'dataInserted',
        },
        {
            title: 'File',
            field: 'standardFlatFile',
            render: (file) => <Models.ViewFile commentFor='admin' attachments={file.standardFlatFile} ></Models.ViewFile>
        },
    ];

    if (["admin"].includes(props.slug)) {
        columns.push({
            width: "2%",
            cellStyle: { width: "2%" },
            headerStyle: { width: "2%" },
            sorting: false,
            render: (rowData) =>
                <Tooltip title="Delete">
                    <IconButton
                        className={classes.DeleteActionBtn}
                        aria-label="delete"
                        onClick={() => deleteConfirmation(rowData)}
                    >
                        <DeleteIcon className={classes.IconSize} />
                    </IconButton>
                </Tooltip>
        });
    }

    const data = currentSupplier && currentSupplier?.supplierFlatFiles.map((e) => {
        return {
            _id: e._id,
            addedOn: e.addedOn ? moment(e.addedOn).format("DD/MM/YYYY") : 'N/A',
            service: e.service,
            dataInserted: e.dataInserted,
            standardFlatFile: e.standardFlatFile
        }
    })

    return (
        <div>
            <Grid container spacing={3}>
                <Grid item md={12} xs={12}>
                    <MaterialTable
                        isLoading={supplierState.loader}
                        title="Standard Flat Files"
                        columns={columns}
                        data={data}
                        options={{
                            search: false,
                        }}
                    />
                </Grid>
            </Grid>
        </div>
    );
}
