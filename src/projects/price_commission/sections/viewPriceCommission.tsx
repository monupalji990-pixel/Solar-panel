import React, { Suspense, useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import MyDrawer from "../../../sharedUtils/sharedComponents/drawerHelper";
import SoldService from "../../lead/sections/soldService";

export default function ViewLead(props) {
    const ds = "1250px";
    return (
        <MyDrawer
            drawerSize={ds}
            iconName="Sold Tariff"
            open={props.open == "manageViewPrice"}
            onClose={props.onClose.bind(this)}
        >
            <ViewPricesCommission {...props} />
        </MyDrawer>
    );
}

function ViewPricesCommission(props) {

    const singleDetail = props.singleLead || {};

    const [dummyOne, setDummyOne] = useState("hello");
    const [defaultSS, setDefaultSS] = useState([]);
    const { isDelete } = singleDetail || {};
    const [isDeleteCheck, setIsDelete] = useState(
        props.singleLead && props.singleLead.isDelete === 1
    );

    useEffect(() => {
        if (
            !props.isLoading &&
            singleDetail !== undefined &&
            singleDetail.serviceType &&
            dummyOne === "changedAgain"
        ) {
            setDefaultSS(
                singleDetail?.serviceType?.map((v) => ({
                    label: v.split(" ").join(""),
                    value: v.split(" ").join(""),
                }))
            );
            setDummyOne(Math.random().toString(36).substring(7));
        }

        if (
            !props.isLoading &&
            isDelete !== undefined &&
            dummyOne === "changedAgain"
        ) {
            setIsDelete(Number(isDelete) === 1);
            setDummyOne(Math.random().toString(36).substring(7));
        }

    }, [props.isLoading]);

    return (

        <Grid container spacing={2}>
            <>
                <Grid item md={12} xs={12} >
                    <Suspense fallback={<>Loading...</>}>
                        <SoldService
                            {...props}
                            setDefaultSSValues={(e) => setDefaultSS(e)}
                            showingFrom="priceModule"
                        />
                    </Suspense>
                </Grid>
            </>
        </Grid>

    );
}

//);
